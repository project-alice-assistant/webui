import axios from 'axios'

export default {
	name: 'device',
	data: function () {
		return {
			rotationDelta: 0
		}
	},
	props: [
		'data',
		'device',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			return this.myHome.moveableItem.computeCustomStyle(
				this.data,
				`background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.uid}/device.png') no-repeat; background-size: 100% 100%;`
			)
		},
		save: function () {
			const data = {
				parentLocation: this.data.parentLocation,
				settings: this.data.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.uid}/`,
				data: data,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'content-type': 'application/json'
				}
			}).then()
		},
		handleClick: function (event) {
			event.stopPropagation()
			this.myHome.removeDroppable()

			if (this.myHome.devicesEditMode) {
				this.myHome.setMoveable(event.target, this)
				this.myHome.moveableItem.setBoundaries(this.$el, 0)
				const devices = Array.from(document.querySelectorAll('.device')).filter((device, index, array) => {
					const devId = parseInt(device.id.substring(4))
					return !(devId === this.data.id);
				})
				this.myHome.moveableItem.setGuidelines(devices)
			}
		},
		deleteMe: function (event) {
			event.stopPropagation()
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/${this.data.uid}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.myHome.$delete(this.myHome.devices, this.data.uid)
				}
			})
		}
	}
}
