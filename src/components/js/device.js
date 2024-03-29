import axios from 'axios'
import * as C from '@/utils/constants'
import {v4 as uuidv4} from 'uuid'

// noinspection DuplicatedCode
export default {
	name:          'device',
	data:          function () {
		return {
			rotationDelta:        0,
			targetParentLocation: 0,
			checkHeartbeat:       null,
			myLinks:              {},
			hovered:              false,
			etag:                 uuidv4()
		}
	},
	props:         [
		'data',
		'device',
		'myHome'
	],
	created:       function () {
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

					if (self.data.deviceConfigs['heartbeatRate'] > 0) {
						self.checkHeartbeat = setTimeout(function () {
							self.data.connected = false
						}, self.data.deviceConfigs['heartbeatRate'] * 2500)
					}
				} else if (msg.topic === C.CORE_DISCONNECTION_TOPIC) {
					self.data.connected = false
					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
					}
				} else if (msg.topic === C.DEVICE_UPDATED_TOPIC) {
					self.$set(self.$store.state.devices, payload['device']['id'], payload['device'])
				} else if (msg.topic === C.DEVICE_DELETED_TOPIC) {
					self.$delete(self.$store.state.devices, payload['id'])
				}
			}
		)
	},
	beforeDestroy: function () {
		this.$store.state.mqtt.unsubscribe(C.CORE_HEARTBEAT_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.DEVICE_HEARTBEAT_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.DEVICE_UPDATED_TOPIC)
		this.$store.state.mqtt.unsubscribe(C.DEVICE_DELETED_TOPIC)
		this.unwatch()
	},
	methods:       {
		openSettings:       function () {
			let self = this
			const message = {}
			const options = {
				view:   'deviceOptionsPromptDialog',
				data:   this.data,
				parent: this
			}

			this.$dialog.prompt(message, options).then(function (_dialogue) {
				self.save()
			}).catch()
		},
		computeCustomStyle: function () {
			let self = this
			axios({
				method: 'GET',
				url:    `/myHome/devices/${this.data.id}/${this.etag}/device.png`
			}).then(response => {
				if (response.headers['x-etag'] !== self.etag) {
					self.etag = response.headers['x-etag']
					let el = document.getElementById(`dev_${self.data.id}`)
					el.style.backgroundImage = `url('http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${self.data.id}/${self.etag}/device.png')`
					el.style.backgroundPosition = 'center center'
					el.style.backgroundSize = 'contain'
					el.style.backgroundRepeat = 'no-repeat'
				}
			})
			return this.myHome.moveableItem.computeMyHomeCustomStyle(
				self.data,
				null
			)
		},
		save:               function () {
			const data = {
				parentLocation: this.data.parentLocation,
				settings:       this.data.settings,
				deviceConfigs:  this.data.deviceConfigs,
				linkConfigs:    this.myHome.getDeviceLinks(this.data.id)
			}

			const self = this
			axios({
				method:  'PATCH',
				url:     `/myHome/devices/${this.data.id}/`,
				data:    data,
				headers: {
					'auth':         this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					self.myHome.removeDeviceLinks(self.data.id)

					for (const link of Object.values(response.data.links)) {
						self.myHome.$set(self.myHome.$store.state.deviceLinks, link.id, link)
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
		handleClick:        function (event) {
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
				axios({
					method:  'GET',
					url:     `/myHome/devices/${this.data.id}/onClick/`,
					headers: {'auth': this.$store.getters.apiToken}
				}).then(response => {
					if ('success' in response.data) {
						if (!response.data.success || !'ret' in response.data) {
							this.showError(this.$t('notifications.errors.somethingWentWrong'))
							console.error(response.data.message)
						} else {
							const ret = response.data['ret']
							this.handleDeviceClickReaction(ret)
						}
					} else {
						this.showError(this.$t('notifications.errors.somethingWentWrong'))
					}
				})
			}
		},
		handleDrag:         function (target, left, top, clientX, clientY) {
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
		calcGlobalOffset:   function (locId) {
			if (locId === 0) {
				return [0, 0]
			}
			let parentLoc = this.$store.state.locations[locId]
			let recursive = this.calcGlobalOffset(parentLoc.parentLocation)
			return [parentLoc.settings.x + recursive[0], parentLoc.settings.y + recursive[1]]
		},
		setPosition:        function (target, _clientX, _clientY) {
			try {
				if (this.targetParentLocation !== 0 && this.data.parentLocation !== this.targetParentLocation) {
					// noinspection DuplicatedCode
					let parentLoc = this.calcGlobalOffset(this.data.parentLocation)
					let newParentLoc = this.calcGlobalOffset(this.targetParentLocation)

					const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
					this.myHome.moveableItem.container = droppedIn
					this.$store.state.devices[this.data.id].parentLocation = this.targetParentLocation
					this.$store.state.devices[this.data.id].settings['z'] = parseInt(droppedIn.style['z-index']) + 1

					this.$store.state.devices[this.data.id].settings['x'] = parentLoc[0] + parseInt(target.style.left.substring(-2)) - newParentLoc[0]
					this.$store.state.devices[this.data.id].settings['y'] = parentLoc[1] + parseInt(target.style.top.substring(-2)) - newParentLoc[1]
					this.targetParentLocation = 0
				} else {
					// noinspection ExceptionCaughtLocallyJS
					throw true
				}
			} catch (e) {
				throw e
			}
		},
		deleteMe:           function (event) {
			event.stopPropagation()
			axios({
				method:  'DELETE',
				url:     `/myHome/devices/${this.data.id}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.myHome.deleteDevice(this.data.id)
					this.showSuccess(this.$t('notifications.successes.deviceDeleted'))
				}
			})
		},
		onMouseEnter:       function () {
			this.hovered = true
			if (this.myHome.locationsEditMode && this.myHome.toolsState.none) {
				for (const link of Object.values(this.myLinks)) {
					link.show('draw')
				}
			}
		},
		onMouseExit:        function () {
			this.hovered = false
			if (this.myHome.locationsEditMode && this.myHome.toolsState.none) {
				for (const link of Object.values(this.myLinks)) {
					link.hide('draw')
				}
			}
		}
	}
}
