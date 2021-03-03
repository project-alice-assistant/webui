import axios from 'axios'
import * as C from '@/utils/constants'
import {v4 as uuidv4} from 'uuid'

// noinspection DuplicatedCode
export default {
	name: 'device',
	data: function () {
		return {
			rotationDelta: 0,
			targetParentLocation: 0,
			checkHeartbeat: null,
			myLinks: {},
			hovered: false
		}
	},
	props: [
		'data',
		'device',
		'myHome'
	],
	created: function () {
		let self = this
		this.unwatch = this.$store.watch(
			function (state) {
				return state.mqttMessage
			},
			function (msg) {
				let payload
				try {
					payload = JSON.parse(msg.payloadString)
				} catch {
					return
				}

				if (payload['uid'] !== self.data.uid) return

				if (msg.topic === C.CORE_HEARTBEAT_TOPIC || msg.topic === C.DEVICE_HEARTBEAT_TOPIC || msg.topic === C.CORE_RECONNECTION_TOPIC) {
					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
					}

					self.data.connected = true

					self.checkHeartbeat = setTimeout(function () {
						self.data.connected = false
					}, self.data.deviceConfigs['heartbeatRate'] * 2500)
				} else if (msg.topic === C.CORE_DISCONNECTION_TOPIC) {
					self.data.connected = false
					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
					}
				} else if (msg.topic === C.DEVICE_UPDATED_TOPIC) {
					self.$set(self.$store.state.devices, payload['device']['id'], payload['device'])
				}
			}
		)
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.CORE_HEARTBEAT_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.DEVICE_HEARTBEAT_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.DEVICE_UPDATED_TOPIC)
		this.unwatch()
	},
	methods: {
		openSettings: function () {
			let self = this
			const message = {}
			const options = {
				view: 'deviceOptionsPromptDialog',
				data: this.data,
				parent: this
			}

			this.$dialog.prompt(message, options).then(function (_dialogue) {
				self.save()
			}).catch()
		},
		computeCustomStyle: function () {
			return this.myHome.moveableItem.computeMyHomeCustomStyle(
				this.data,
				`background-image: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/${uuidv4()}/device.png'); background-position: center center; background-size: contain; background-repeat: no-repeat;`
			)
		},
		save: function () {
			const data = {
				parentLocation: this.data.parentLocation,
				settings: this.data.settings,
				deviceConfigs: this.data.deviceConfigs,
				linksConfigs: this.myHome.getDeviceLinks(this.data.id)
			}

			const self = this
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					self.myHome.removeDeviceLinks(self.data.id)

					for (const link of Object.values(response.data.links)) {
						this.myHome.$set(this.myHome.deviceLinks, link.id, link)
					}

					self.showSuccess(self.$t('notifications.successes.deviceSaved'))
					setTimeout(function () {
						self.myHome.drawDeviceLinks({specificDeviceId: self.data.id})
					}, 250)
				} else {
					self.showError(self.$t('notifications.errors.deviceSavingFailed'))
				}
			})
		},
		handleClick: function (event) {
			if (this.myHome.toolsState.addingDevice) return

			event.stopPropagation()
			this.myHome.removeDroppable()

			if (this.myHome.devicesEditMode && this.myHome.toolsState.linkingDevices && this.myHome.newConnectionLink === null && this.data.parentLocation !== 0) {
				if (!this.myHome.getDeviceType(this).allowLocationLinks) {
					this.showError(this.$t('notifications.errors.cannotLinkDevice'))
					return
				}
				this.myHome.newConnectionLine(this)
			} else if (this.myHome.devicesEditMode && this.myHome.toolsState.unlinkingDevices && this.myHome.newConnectionLink === null) {
				if (!this.myHome.getDeviceType(this).allowLocationLinks) {
					this.showError(this.$t('notifications.errors.cannotLinkDevice'))
					return
				}
				this.myHome.newDisconnectionLine(this)
			} else if (this.myHome.toolsState.unlinkingDevices && this.myHome.newConnectionLink !== null) {

			} else if (this.myHome.toolsState.linkingDevices && this.myHome.newConnectionLink !== null) {
				this.showError(this.$t('notifications.errors.noDeviceToDeviceLink'))
			} else if (this.myHome.devicesEditMode && event.target.classList.contains('device') && this.myHome.toolsState['none']) {
				this.myHome.setMoveable(event.target, this)
				this.myHome.moveableItem.setBoundaries(this.myHome.$refs.floorPlan)
				this.myHome.moveableItem.setGuidelines([])
			} else if (!this.myHome.devicesEditMode && !this.myHome.locationsEditMode) {
				const self = this
				axios({
					method: 'GET',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/onClick/`,
					headers: {'auth': this.$store.getters.apiToken}
				}).then(response => {
					if ('success' in response.data) {
						if (!response.data.success || !'ret' in response.data) {
							this.showError(this.$t('notifications.errors.somethingWentWrong'))
							console.error(response.data.message)
						} else {
							const ret = response.data['ret']
							if (ret['action'] === 'info_notification') {
								this.showInfo(this.$t(ret['data']))
							} else if (ret['action'] === 'success_notification') {
								this.showSuccess(this.$t(ret['data']))
							} else if (ret['action'] === 'error_notification') {
								this.showError(this.$t(ret['data']))
							} else if (ret['action'] === 'navigate') {
								window.open(ret['data'], '_blank');
							} else if (ret['action'] === 'answer_string') {
								this.$dialog.prompt({
									title: this.$t(ret['data']['title']),
									body: this.$t(ret['data']['body']),
									okText: this.$t('buttons.ok'),
									cancelText: this.$t('buttons.cancel'),
								}).then(function (dialog) {
									axios({
										method: 'POST',
										url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${self.data.id}/reply/`,
										data: {
											secret: ret['reply']['secret'],
											concerns: ret['reply']['concerns'],
											answer: dialog.data
										},
										headers: {
											'auth': self.$store.getters.apiToken,
											'content-type': 'application/json'
										}
									})
								}).catch()
							} else if (ret['action'] === 'list_select') {
								const options = {
									view: 'deviceReplyListSelect',
									data: ret['data'],
									parent: this
								}

								this.$dialog.prompt({}, options).then(function (dialog) {
									axios({
										method: 'POST',
										url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${self.data.id}/reply/`,
										data: {
											secret: ret['reply']['secret'],
											concerns: ret['reply']['concerns'],
											answer: dialog.data
										},
										headers: {
											'auth': self.$store.getters.apiToken,
											'content-type': 'application/json'
										}
									})
								}).catch()
							}
						}
					} else {
						this.showError(this.$t('notifications.errors.somethingWentWrong'))
					}
				})
			}
		},
		handleDrag: function (target, left, top, clientX, clientY) {
			const elementsBelow = document.elementsFromPoint(clientX, clientY)
			for (const el of elementsBelow) {
				if (el.classList.contains('location')) {
					const elementId = parseInt(el.id.substring(4))
					if (this.myHome.checkDevicePerLocationLimit(this.myHome.getDeviceType(this), elementId)) {
						if (this.data.parentLocation !== elementId) {
							this.myHome.removeDroppable()
							el.classList.add('droppable')
							this.targetParentLocation = elementId
							break
						}
					} else {
						if (this.data.parentLocation !== elementId) {
							this.myHome.removeDroppable()
							el.classList.add('notDroppable')
						}
					}
				} else {
					this.targetParentLocation = 0
					this.myHome.removeDroppable()
				}
			}
			this.myHome.refreshDeviceLinks()
			throw true
		},
		setPosition: function (target, _clientX, _clientY) {
			try {
				if (this.targetParentLocation !== 0 && this.data.parentLocation !== this.targetParentLocation) {
					// noinspection DuplicatedCode
					const parentLocation = document.querySelector(`#loc_${this.data.parentLocation}`)
					const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
					this.myHome.moveableItem.container = droppedIn
					this.$store.state.devices[this.data.id].parentLocation = this.targetParentLocation
					this.$store.state.devices[this.data.id].settings['z'] = parseInt(droppedIn.style['z-index']) + 1
					this.$store.state.devices[this.data.id].settings['x'] = parentLocation.offsetLeft + parseInt(target.style.left.substring(-2)) - droppedIn.offsetLeft
					this.$store.state.devices[this.data.id].settings['y'] = parentLocation.offsetTop + parseInt(target.style.top.substring(-2)) - droppedIn.offsetTop
					this.targetParentLocation = 0
				} else {
					// noinspection ExceptionCaughtLocallyJS
					throw true
				}
			} catch (e) {
				throw e
			}
		},
		deleteMe: function (event) {
			event.stopPropagation()
			axios({
				method: 'DELETE',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.myHome.deleteDevice(this.data.id)
					this.showSuccess(this.$t('notifications.successes.deviceDeleted'))
				}
			})
		},
		onMouseEnter: function () {
			this.hovered = true
			if (this.myHome.locationsEditMode && this.myHome.toolsState.none) {
				for (const link of Object.values(this.myLinks)) {
					link.show('draw')
				}
			}
		},
		onMouseExit: function () {
			this.hovered = false
			if (this.myHome.locationsEditMode && this.myHome.toolsState.none) {
				for (const link of Object.values(this.myLinks)) {
					link.hide('draw')
				}
			}
		}
	}
}
