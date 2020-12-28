import axios from 'axios'
import * as C from '@/utils/constants';

// noinspection DuplicatedCode
export default {
	name: 'device',
	data: function () {
		return {
			rotationDelta: 0,
			targetParentLocation: 0,
			checkHeartbeat: null
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
						console.log('disconnected')
						self.data.connected = false
					}, self.data['heartbeatRate'] * 2500)
				} else if (msg.topic === C.CORE_DISCONNECTION_TOPIC) {
					self.data.connected = false
					if (self.checkHeartbeat !== null) {
						clearTimeout(self.checkHeartbeat)
					}
				} else if (msg.topic === C.DEVICE_UPDATED_TOPIC) {
					self.myHome.devices[self.data.id] = payload['device']
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
		computeCustomStyle: function () {
			return this.myHome.moveableItem.computeCustomStyle(
				this.data,
				`background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/device.png') no-repeat; background-size: 100% 100%;`
			)
		},
		save: function () {
			if (this.data.uid === -1) return

			const data = {
				parentLocation: this.data.parentLocation,
				settings: this.data.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/`,
				data: data,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'content-type': 'application/json'
				}
			}).then()
		},
		handleClick: function (event) {
			if (this.myHome.toolsState.addingDevice || this.data.uid === -1) return

			event.stopPropagation()
			this.myHome.removeDroppable()

			if (this.myHome.devicesEditMode && event.target.classList.contains('device')) {
				this.myHome.setMoveable(event.target, this)
				this.myHome.moveableItem.setBoundaries(this.$el, 0)
				const devices = Array.from(document.querySelectorAll('.device')).filter((device) => {
					const devId = device.id.substring(4)
					return !(devId === this.data.id);
				})
				this.myHome.moveableItem.setGuidelines(devices)
			} else if (!this.myHome.devicesEditMode && !this.myHome.locationsEditMode) {
				axios({
					method: 'patch',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.uid}/onClick/`,
					headers: {'auth': localStorage.getItem('apiToken')}
				}).then()
			}
		},
		handleDrag: function (target, left, top, clientX, clientY) {
			const elementsBelow = document.elementsFromPoint(clientX, clientY)
			for (const el of elementsBelow) {
				if (el.classList.contains('location')) {
					const elementId = parseInt(el.id.substring(4))
					if (el !== this.$el && elementId !== this.data.parentLocation) {
						this.myHome.removeDroppable()
						el.classList.add('droppable')
						this.targetParentLocation = elementId
						break
					}
				} else {
					this.targetParentLocation = 0
					this.myHome.removeDroppable()
				}
			}
		},
		setPosition: function (target) {
			try {
				if (this.targetParentLocation !== 0 && this.data.parentLocation !== this.targetParentLocation) {
					// noinspection DuplicatedCode
					const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
					this.myHome.devices[this.data.id].parentLocation = this.targetParentLocation
					this.myHome.devices[this.data.id].settings['x'] = parseInt(target.style.left.substring(-2)) - parseInt(droppedIn.style.left.substring(-2))
					this.myHome.devices[this.data.id].settings['y'] = parseInt(target.style.top.substring(-2)) - parseInt(droppedIn.style.top.substring(-2))
					this.targetParentLocation = 0
				}
			} catch (e) {
				console.error(e)
			}
		},
		deleteMe: function (event) {
			event.stopPropagation()
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.id}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.myHome.$delete(this.myHome.devices, this.data.id)
				}
			})
		}
	}
}
