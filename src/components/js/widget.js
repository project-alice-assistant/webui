import axios from 'axios'

// noinspection DuplicatedCode
export default {
	name: 'widget',
	data: function () {
		return {
			hovered: false,
			rotationDelta: 0
		}
	},
	props: [
		'controller',
		'widget'
	],
	methods: {
		openSettings: function () {
			let self = this
			let backup = {...this.widget.settings}
			this.settings = false

			const message = {}
			const options = {
				view: 'widgetOptionsPromptDialog',
				widget: this.widget,
				parent: this
			}

			this.$dialog.prompt(message, options).then(dialogue => {
				axios({
					method: 'PATCH',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/${self.widget.id}/`,
					data: JSON.stringify(dialogue.data.settings),
					headers: {
						'auth': self.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).catch(() => {
					this.widget.settings = backup
				}).finally(() => {
					this.settings = true
				})
			}).catch(() => {
				this.widget.settings = backup
				this.settings = true
			})
		},
		computeCustomStyle: function () {
			return this.controller.moveableItem.computeWidgetCustomStyle(this.widget)
		},
		save: function () {
			this.controller.saveWidget(this.widget)
		},
		handleClick: function (event) {
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
