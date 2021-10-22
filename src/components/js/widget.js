import axios from 'axios'

// noinspection DuplicatedCode
export default {
	name:    'widget',
	data:    function () {
		return {
			hovered:       false,
			rotationDelta: 0
		}
	},
	props:   [
		'controller',
		'widget'
	],
	methods: {
		openSettings: function () {
			let self = this
			let backupsettings = {...this.widget.settings}
			let backupconfigs = {...this.widget.configs}
			this.settings = false

			const message = {}
			const options = {
				view:   'widgetOptionsPromptDialog',
				widget: this.widget,
				parent: this
			}

			this.$dialog.prompt(message, options).then(dialogue => {
				let dataJson = {}
				dataJson['settings'] = dialogue.data.settings
				dataJson['configs'] = dialogue.data.configs
				axios({
					method:  'PATCH',
					url:     `/widgets/${self.widget.id}/`,
					data:    JSON.stringify(dataJson),
					headers: {
						'auth':         self.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).catch(() => {
					this.widget.settings = backupsettings
					this.widget.configs = backupconfigs
				}).finally(() => {
					this.settings = true
					//
					try {
						self.widget.instance.refresh()
					} catch (e) {
					}
				})
			}).catch(() => {
				this.widget.settings = backupsettings
				this.widget.configs = backupconfigs
				this.settings = true
			})
		},
		computeCustomStyle: function () {
			return this.controller.moveableItem.computeWidgetCustomStyle(this.widget)
		},
		save:         function () {
			this.controller.saveWidget(this.widget)
		},
		handleClick:  function (event) {
			event.stopPropagation()

			if (!this.controller.dragAndResizeEnabled || !event.target.classList.contains('widget')) return

			this.controller.setMoveable(event.target, this)
			this.controller.moveableItem.setBoundaries(this.$el, 10)
			const widgets = Array.from(document.querySelectorAll('.widget')).filter((widget) => {
				return !(parseInt(widget.id.substring(4)) === this.widget.id)
			})
			this.controller.moveableItem.setGuidelines(widgets)
		}
	}
}
