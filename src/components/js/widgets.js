import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import MoveableItem from './moveableItem'

export default {
	name: 'pa-widgets',
	data: function() {
		return {
			uid: uuidv4(),
			controller: this,
			moveableItem: new MoveableItem(this),
			tabs: {},
			menuItems: [
				{
					name: this.$t('tooltips.edit'),
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: this.$t('tooltips.close'),
					onClose: () => {
						this.removeWidgets = false
						this.settings = false
						this.dragAndResizeEnabled = false
						this.moveableItem.destroyMoveable()
					},
					onOpen: () => {
						this.dragAndResizeEnabled = true
					}
				},
				{
					name: this.$t('tooltips.theaterMode'),
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				},
				{
					name: this.$t('tooltips.settings'),
					icon: 'fas fa-cog',
					onClick: () => {
						this.settings = !this.settings
					}
				},
				{
					name: this.$t('tooltips.addWidgets'),
					icon: 'far fa-plus-square',
					onClick: () => {
						this.addWidgets = true
					}
				},
				{
					name: this.$t('tooltips.removeWidgets'),
					icon: 'far fa-minus-square',
					onClick: () => {
						this.removeWidgets = !this.removeWidgets
					}
				}
			],
			settings: false,
			addWidgets: false,
			removeWidgets: false,
			widgetTemplates: {},
			widgetInstances: {},
			activeTabId: 1,
			selectedWidget: -1,
			dragAndResizeEnabled: false,
			hasTitle: true,
			jsImports: ''
		}
	},
	computed: {
		'activePageWidgets': function() {
			return Object.values(this.widgetInstances).filter(widget => {
				return widget['page'] === this.activeTabId
			})
		}
	},
	created: function() {
		let self = this
		document.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				if (self.$store.state.fullScreen) {
					self.$store.commit('stopCinemaMode')
				}
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/`,
			headers: {'auth': this.$store.getters.apiToken}
		}).then(response => {
			if ('pages' in response.data) {
				this.tabs = response.data.pages
				this.fetchWidgetTemplates()
				this.fetchWidgetInstances()
				this.activeTabId = parseInt(localStorage.getItem('widgetsActiveTabId')) || 1
			}
		})
	},
	activated: function () {
		this.uid = uuidv4()
		this.removeWidgets = false
		this.settings = false
		this.dragAndResizeEnabled = false
		this.startWidgetsOnPage(this.activeTabId)
	},
	methods: {
		setMoveable: function (target, prop) {
			this.moveableItem.setMoveable(target, prop)
		},
		startWidgetsOnPage: function (pageId) {
			for (const widget of Object.values(this.widgetInstances)) {
				if (widget['page'] === pageId) {
					this.startWidgetScript(widget)
				}
			}
		},
		startWidgetScript: function (widget) {
			const uuid = uuidv4()
			widget.taggedHtml = widget.html.replace(/data-ref="(.*?)"/gi, `data-ref="$1_${uuid}"`)

			const src = `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/resources/${widget.skill}/${widget.name}`
			this.$loadScript(`${src}.js`).then(() => {
				// noinspection JSUnresolvedVariable
				let cls = eval(`${widget.skill}_${widget.name}`)
				new cls(uuid)
			})
		},
		changePage: function (id) {
			this.moveableItem.destroyMoveable()
			this.activeTabId = id
			this.$forceUpdate()
			this.startWidgetsOnPage(this.activeTabId)
			localStorage.setItem('widgetsActiveTabId', this.activeTabId)
		},
		cinemaMode: function () {
			this.$store.commit('toggleCinemaMode')
		},
		fetchWidgetTemplates: function () {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/templates/`
			}).then(response => {
				if ('widgets' in response.data) {
					this.widgetTemplates = response.data['widgets']
				}
			})
		},
		fetchWidgetInstances: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('widgets' in response.data) {
					this.widgetInstances = response.data.widgets
				}
				this.startWidgetsOnPage(this.activeTabId)
			})
		},
		addWidget: function(skillName, widgetName) {
			axios({
				method: 'put',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				data: {
					skillName: skillName,
					widgetName: widgetName,
					pageId: this.activeTabId
				},
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('widget' in response.data) {
					this.$set(this.widgetInstances, response.data['widget']['id'], response.data.widget)
					this.startWidgetScript(response.data.widget)
				}
			})
		},
		removeWidget: function(widgetId) {
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${widgetId}/`,
				headers: {
					'auth': this.$store.getters.apiToken
				}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					const listing = this.listOfWidgetOnPage(this.widgetInstances[widgetId]['page'])
					const hisZIndex = this.widgetInstances[widgetId]['settings']['z']
					this.$delete(this.widgetInstances, widgetId)

					for (const w of listing) {
						if (w.settings['z'] > hisZIndex) {
							w.settings['z'] -= 1
							this.saveWidget(w)
						}
					}
				}
			})
		},
		saveWidget(widget) {
			const self = this
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${widget.id}/`,
				data: JSON.stringify(widget.settings),
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					self.showSuccess(self.$t('notifications.successes.widgetSaved'))
				} else {
					self.showError(self.$t('notifications.errors.widgetSavingFailed'))
				}
			})
		},
		moveZUp(widget) {
			const myIndex = widget.settings['z']
			const myNewIndex = myIndex + 1
			const listing = this.listOfWidgetOnPage(widget['page'])

			console.log(myIndex, myNewIndex, listing)

			if (myNewIndex > listing.length) {
				return
			}

			for (const w of listing) {
				if (w.settings['z'] === myNewIndex) {
					w.settings['z'] -= 1
					widget.settings['z'] = myNewIndex
					this.saveWidget(w)
					this.saveWidget(widget)
					return
				}
			}
		},
		moveZDown(widget) {
			const myIndex = widget.settings['z']
			const myNewIndex = myIndex - 1
			const listing = this.listOfWidgetOnPage(widget['page'])

			if (myNewIndex <= 0) {
				return
			}

			for (const w of listing) {
				if (w.settings['z'] === myNewIndex) {
					w.settings['z'] += 1
					widget.settings['z'] = myNewIndex
					this.saveWidget(w)
					this.saveWidget(widget)
					return
				}
			}
		},
		listOfWidgetOnPage(pageId) {
			let listing = []
			for (const w of Object.values(this.widgetInstances)) {
				if (w['page'] === pageId) {
					listing.push(w)
				}
			}
			return listing
		},
		removeTab: function(id) {
			if (!this.$store.state.loggedInUser) {
				return
			}
			let self = this
			if (id <= 1) {
				this.$dialog.alert(this.$t('dialogs.bodies.cannotDeleteDefaultPage')).then()
			} else {
				this.$dialog.confirm(this.$t('dialogs.bodies.confirmPageDelete'))
					.then(function () {
						axios({
							method: 'DELETE',
							url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/${id}/`,
							headers: {'auth': self.$store.getters.apiToken}
						}).then(response => {
							if ('pages' in response.data) {
								self.$delete(self.tabs, id)
								self.showSuccess(self.$t('notifications.successes.pageDeleted'))
								self.activeTabId = 1
								localStorage.setItem('widgetsActiveTabId', 1)
							}
						})
					}).catch(() => {})
			}
		},
		renameTab: function(id) {
			if (!this.$store.state.loggedInUser) {
				return
			}

			let self = this

			const message = {}
			const options = {
				view: 'fontawesomePromptDialog',
				parent: this
			}

			this.$dialog.prompt(message, options).then(dialogue => {
				let icon = dialogue.data || 'fas fa-biohazard'
				axios({
					method: 'PATCH',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/${id}/`,
					data: {newIcon: icon},
					headers: {
						'auth': self.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(response => {
					if ('success' in response.data && response.data.success) {
						this.tabs[id].icon = icon
					}
				})
			}).catch(() =>{})
		},
		addTab: function() {
			axios({
				method: 'PUT',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/addPage/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('newpage' in response.data) {
					let page = response.data.newpage
					this.$set(this.tabs, page.id, page)
				}
			})
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				this.moveableItem.destroyMoveable()
			}
		}
	}
}
