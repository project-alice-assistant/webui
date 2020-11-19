import axios from 'axios'

export default {
	name: 'pa-widgets',
	data: function() {
		return {
			tabs: [],
			menuItems: [
				{
					name: 'edit',
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: 'close',
					onClose: () => {
						this.removeWidgets = false
						this.settings = false
						this.dragAndResizeEnabled = true
					},
					onOpen: () => {
						this.dragAndResizeEnabled = true
					}
				},
				{
					name: 'theater mode',
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				},
				{
					name: 'settings',
					icon: 'fas fa-cog',
					onClick: () => {
						this.settings = !this.settings
					}
				},
				{
					name: 'upload preset',
					icon: 'fas fa-file-upload',
				},
				{
					name: 'download preset',
					icon: 'fas fa-file-download',
				},
				{
					name: 'add widget',
					icon: 'far fa-plus-square',
					onClick: () => {
						this.addWidgets = true
					}
				},
				{
					name: 'remove widget',
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
			activePageId: 1,
			selectedWidget: -1,
			dragAndResizeEnabled: false
		}
	},
	created: function() {
		let self = this;
		document.addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				self.$store.commit('stopCinemaMode')
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/`,
			headers: {'auth': this.$cookies.get('apiToken')}
		}).then(response => {
			if ('pages' in response.data) {
				for (const page of Object.values(response.data.pages)) {
					this.tabs.push(JSON.parse(page))
				}
				this.fetchWidgetTemplates()
				this.fetchWidgetInstances()
			}
		})
	},
	methods: {
		changePage: function(id) {
			this.activePageId = id
		},
		saveAndClose: function() {
			console.log('saved')
		},
		cinemaMode: function() {
			this.$store.commit('toggleCinemaMode')
		},
		fetchWidgetTemplates: function() {
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
				headers: {'auth': this.$cookies.get('apiToken')}
			}).then(response => {
				if ('widgets' in response.data) {
					this.widgetInstances = response.data.widgets
				}
			})
		},
		addWidget: function(skillName, widgetName) {
			axios({
				method: 'put',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				data: {
					skillName: skillName,
					widgetName: widgetName,
					pageId: this.activePageId
				},
				headers: {
					'auth': this.$cookies.get('apiToken'),
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('widget' in response.data) {
					this.widgetInstances[response.data['widget']['id']] = response.data['widget']
					this.$forceUpdate()
				}
			})
		},
		removeWidget: function(widgetId) {
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${widgetId}/`,
				headers: {
					'auth': this.$cookies.get('apiToken')
				}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					delete this.widgetInstances[widgetId]
					this.$forceUpdate()
				}
			})
		},
		savePosition: function(x, y) {
			if (this.selectedWidget <= -1) {
				return
			}

			x = Math.ceil(x / 5) * 5
			y = Math.ceil(y / 5) * 5

			let widgetId = this.selectedWidget

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${widgetId}/savePosition/`,
				data: {
					x: x,
					y: y
				},
				headers: {'auth': this.$cookies.get('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					let widget = this.widgetInstances[widgetId]
					widget.x = x
					widget.y = y
					this.widgetInstances[widgetId] = widget
				}
				this.$forceUpdate()
			})
		},
		saveSize: function(x, y, w, h) {
			if (this.selectedWidget <= -1) {
				return
			}
			x = Math.ceil(x / 5) * 5
			y = Math.ceil(y / 5) * 5
			w = Math.ceil(w / 5) * 5
			h = Math.ceil(h / 5) * 5

			let widgetId = this.selectedWidget

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${widgetId}/saveSize/`,
				data: {
					x: x,
					y: y,
					w: w,
					h: h
				},
				headers: {'auth': this.$cookies.get('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					let widget = this.widgetInstances[widgetId]
					widget.x = x
					widget.y = y
					widget.w = w
					widget.h = h
					this.widgetInstances[widgetId] = widget
				}
				this.$forceUpdate()
			})
		}
	}
}
