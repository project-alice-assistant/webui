import paHeader from './components/views/header';
import paNav from './components/views/nav';
import paContent from './components/views/content';
import axios from 'axios'
import Paho from 'paho-mqtt'

// noinspection JSUnusedGlobalSymbols
export default {
	name: 'ProjectAlice',
	components: {
		paContent,
		paHeader,
		paNav
	},
	data() {
		return {
			loading: true,
			noAlice: false,
			port: 5001,
			ip: '',
			remember: false
		}
	},
	mounted: function() {
		this.$router.replace('home').then()
		this.ip = this.$cookies.isKey('host') ? this.$cookies.get('host') : '127.0.0.1'
		this.port = this.$cookies.isKey('apiPort') ? this.$cookies.get('apiPort') : 5001
		this.connect()
	},
	methods: {
		connect: function() {
			this.$modal.hide('no-alice')
			this.$modal.show('loading')
			axios.get(`http://${this.ip}:${this.port}/api/v1.0.1/utils/config/`)
				.then(response => {
					this.$store.commit('setSettings', response.data.config)
					this.noAlice = false
					this.connectMQTT()

					if (this.remember) {
						this.$cookies.set('host', this.ip)
						this.$cookies.set('apiPort', this.port)
					}
				})
				.catch(reason => {
					console.log('Error connecting to Alice ' + reason)
					this.ip = ''
					this.noAlice = true
					this.$modal.show('no-alice')
				})
				.finally(() => {
					this.$modal.hide('loading')
					this.loading = false
				})
		},
		connectMQTT: function() {
			let self = this
			axios.get(`http://${this.ip}:${this.port}/api/v1.0.1/utils/mqttConfig/`)
				.then(response => {
					let randomNum = Math.floor((Math.random() * 10000000) + 1);
					let client = new Paho.Client(response.data.host, Number(response.data.port), 'ProjectAliceInterface' + randomNum)
					client.onMessageArrived = self.onMessage
					client.onConnectionLost = self.onConnectionLost
					client.onConnectionFailed = self.onConnectionFailed
					client.connect({
						onSuccess: self.onConnected,
						onFailure: self.onConnectionFailed,
						timeout: 5
					})
					self.$store.commit('setMqtt', client)
				})
				.catch(reason => {
					console.log('Error getting MQTT info: ' + reason)
					setTimeout(self.connectMQTT, 5000)
				})
		},
		onMessage: function(msg) {
			if (msg.topic === 'projectalice/devices/resourceUsage') {
				this.$store.commit('setResourceUsage', JSON.parse(msg.payloadString))
			}
		},
		onConnected: function() {
			console.log('Mqtt connected')
			this.$store.state.mqtt.subscribe('projectalice/devices/resourceUsage')
		},
		onConnectionFailed: function(_msg) {
			console.log('Mqtt connection failed')
		},
		onConnectionLost: function() {
			console.log('Mqtt connection lost')
		}
	}
}
