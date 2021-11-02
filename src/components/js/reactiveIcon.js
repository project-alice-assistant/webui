export default {
	name:    'reactiveIcon',
	data:    function () {
		return {
			classes:    '',
			mySettings: {
				'waitIcon':     'fa-spinner',
				'addClass':     '',
				'successClass': 'fas fa-check green',
				'failureClass': 'fas fa-times red'
			}
		}
	},
	props:   [
		'icon',
		'tooltip',
		'timing',
		'onClick',
		'settings'
	],
	mounted: function () {
		this.mySettings = {...this.mySettings, ...this.settings}
		this.classes = `${this.icon} clickable`
	},
	methods: {
		handleClick:   function (event) {
			if (this.onClick !== null) {
				this.onClick(event)
			}

			this.classes = `fas fa-spin ${this.mySettings.waitIcon} ${this.mySettings.addClass}`

			let self = this
			setTimeout(function () {
				if (self.$el.getAttribute('data-success')) {
					self.handleSuccess()
				} else {
					self.handleFailure()
				}
			}, this.timing[0] * 1000 || 1000)
		},
		handleSuccess: function () {
			this.classes = `${this.mySettings.successClass}`

			let self = this
			setTimeout(function () {
				self.reset()
			}, this.timing[1] * 1000 || 1000)
		},
		handleFailure: function () {
			this.classes = `${this.mySettings.failureClass}`

			let self = this
			setTimeout(function () {
				self.reset()
			}, this.timing[1] * 1000 || 1000)
		},
		reset:         function () {
			this.classes = `${this.icon} clickable`
		}
	}
}
