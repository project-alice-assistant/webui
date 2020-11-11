import paHeader from './components/views/header';
import paNav from './components/views/nav';
import paContent from './components/views/content';
import axios from 'axios'
import Paho from 'paho-mqtt'

export default {
	name: 'ProjectAlice',
	components: {
		paContent,
		paHeader,
		paNav
	},
	data() {
		return {
			loading: true
		}
	},
	mounted: function() {
		this.$router.replace('home').then()
		let self = this
		axios.get('http://192.168.1.168:5001/api/v1.0.1/utils/config/')
			.then(response => {
				self.$store.commit('setSettings', response.data.config)
				self.connectMQTT()
			})
			.catch(reason => (console.log('Error connecting to Alice ' + reason)))
			.finally(self.loading = false)
	},
	methods: {
		connectMQTT: function() {
			let self = this
			axios.get('http://192.168.1.168:5001/api/v1.0.1/utils/mqttConfig/')
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
