import VueToasted from 'vue-toasted'
import axios from 'axios'

const notifyToast = {
	install(Vue, _options) {

		Vue.use(VueToasted, {iconPack: 'fontawesome', containerClass: 'notifyContainer'})

		Vue.mixin({
			methods: {
				showError(message) {
					Vue.toasted['error'](message, {
						duration:    4000,
						position:    'top-center',
						keepOnHover: true,
						icon:        'exclamation-triangle'
					})
				},
				showSuccess(message) {
					Vue.toasted['success'](message, {
						duration:    4000,
						position:    'top-center',
						keepOnHover: true,
						icon:        'check-square'
					})
				},
				showInfo(message) {
					Vue.toasted['info'](message, {duration: 4000, position: 'top-center', keepOnHover: true, icon: 'info-circle'})
				},
				checkResponse(response) {
					if ('success' in response.data && response.data.success) {
						if ('message' in response.data) {
							this.showSuccess(response.data['message'])
						}
						return true
					} else {
						if ('message' in response.data) {
							this.showError(response.data['message'])
						}
						return false
					}
				},
				handleDeviceClickReaction(ret) {
					if (ret['action'] === 'info_notification') {
						this.showInfo(ret['data']['body'] || this.$t(ret['data']))
					} else if (ret['action'] === 'success_notification') {
						this.showSuccess(ret['data']['body'] || this.$t(ret['data']))
					} else if (ret['action'] === 'error_notification') {
						this.showError(ret['data']['body'] || this.$t(ret['data']))
					} else if (ret['action'] === 'navigate') {
						window.open(ret['data'], '_blank')
					} else if (ret['action'] === 'answer_string') {
						this.$dialog.prompt({
							title:      this.$t(ret['data']['title']),
							body:       this.$t(ret['data']['body']),
							okText:     this.$t('buttons.ok'),
							cancelText: this.$t('buttons.cancel')
						}).then(function (dialog) {
							axios({
								method:  'POST',
								url:     `/myHome/devices/${self.data.id}/reply/`,
								data:    {
									secret:   ret['reply']['secret'],
									concerns: ret['reply']['concerns'],
									answer:   dialog.data
								},
								headers: {
									'auth':         self.$store.getters.apiToken,
									'content-type': 'application/json'
								}
							})
						}).catch()
					} else if (ret['action'] === 'list_select') {
						const options = {
							view:   'deviceReplyListSelect',
							data:   ret['data'],
							parent: this
						}

						this.$dialog.prompt({}, options).then(function (dialog) {
							axios({
								method:  'POST',
								url:     `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${self.data.id}/reply/`,
								data:    {
									secret:   ret['reply']['secret'],
									concerns: ret['reply']['concerns'],
									answer:   dialog.data
								},
								headers: {
									'auth':         self.$store.getters.apiToken,
									'content-type': 'application/json'
								}
							})
						}).catch()
					}
				}
			}
		})
	}
}

export default notifyToast
