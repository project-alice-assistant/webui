import axios from 'axios';
import Paho from 'paho-mqtt';

export default {
	name: 'connect',
	data() {
		return {
			connecting: false,
			port: 5001,
			ip: '',
			remember: false
		}
	},
	created: function () {
		this.ip = this.$cookies.isKey('host') ? this.$cookies.get('host') : '127.0.0.1'
		this.port = this.$cookies.isKey('apiPort') ? this.$cookies.get('apiPort') : 5001
		this.doConnect()
	},
	methods: {
		doConnect() {
			this.connecting = true
			let self = this
			this.connect().then(() => {
				this.connectMQTT().then(() => {
					this.loadI18n().then(() => {
						this.validateToken().then(() => {
							self.$router.replace('/').then()
							self.$store.commit('uiConnected', true)
							self.connecting = false
						})
					}).catch(reason => {
						console.error(reason)
						self.connecting = false
					})
				}).catch(reason => {
					console.error(reason)
					self.connecting = false
				})
			}).catch(reason => {
				console.error(reason)
				self.connecting = false
			})
		},
		connect() {
			let self = this
			return new Promise(function(resolve, reject) {
				axios.get(`http://${self.ip}:${self.port}/api/v1.0.1/utils/config/`)
					.then(response => {
						self.$store.commit('setSettings', response.data.config)
						if (self.remember) {
							self.$cookies.set('host', self.ip)
							self.$cookies.set('apiPort', self.port)
						}
						resolve()
					})
					.catch(reason => {
						self.ip = ''
						reject(new Error('Error connecting to Alice ' + reason))
					})
			})
		},
		connectMQTT() {
			let self = this
			return new Promise(function(resolve, reject) {
				axios.get(`http://${self.ip}:${self.port}/api/v1.0.1/utils/mqttConfig/`)
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
						resolve()
					})
					.catch(reason => {
						reject(new Error('Error getting MQTT info: ' + reason))
					})
			})
		},
		validateToken() {
			let self = this
			return new Promise(function(resolve, reject) {
				if (self.$cookies.isKey('username') && self.$cookies.isKey('apiToken')) {
					axios({
						method: 'post',
						url: `http://${self.ip}:${self.port}/api/v1.0.1/login/checkToken/`,
						headers: {'auth': self.$cookies.get('apiToken')}
					}).then(response => {
						if ('success' in response.data) {
							self.$store.commit('userLogin', {
								user: self.$cookies.get('username'),
								token: self.$cookies.get('apiToken')
							})
						} else {
							self.$cookies.remove('username')
							self.$cookies.remove('apiToken')
						}
					}).finally(() => resolve())
				} else {
					resolve()
				}
			})
		},
		loadI18n() {
			let self = this
			return new Promise(function(resolve, reject) {
				axios.get(`http://${self.ip}:${self.port}/api/v1.0.1/utils/i18n/`)
					.then(response => {
						const i18n = self.$store.state.i18n
						for (const [lang, data] of Object.entries(response.data['data'])) {
							i18n.setLocaleMessage(lang, data)
						}
						self.$store.commit('setI18n', i18n)
						resolve()
					})
					.catch(reason => {
						reject(Error('Failed loading i18n: ' + reason))
					})
			})
		},
		onMessage: function (msg) {
			if (msg.topic === 'projectalice/devices/resourceUsage') {
				this.$store.commit('setResourceUsage', JSON.parse(msg.payloadString))
			}
		},
		onConnected: function () {
			console.log('Mqtt connected')
			this.$store.state.mqtt.subscribe('projectalice/devices/resourceUsage')
		},
		onConnectionFailed: function (_msg) {
			console.log('Mqtt connection failed')
		},
		onConnectionLost: function () {
			console.log('Mqtt connection lost')
		}
	}
}
