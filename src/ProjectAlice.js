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
	created: function () {
		this.$router.replace('home').then()
		this.ip = this.$cookies.isKey('host') ? this.$cookies.get('host') : '127.0.0.1'
		this.port = this.$cookies.isKey('apiPort') ? this.$cookies.get('apiPort') : 5001
		this.connect()
	},
	methods: {
		async connect() {
			this.$modal.hide('no-alice')
			this.$modal.show('loading')
			axios.get(`http://${this.ip}:${this.port}/api/v1.0.1/utils/config/`)
				.then(response => {
					this.$store.commit('setSettings', response.data.config)
					this.noAlice = false
					if (this.remember) {
						this.$cookies.set('host', this.ip)
						this.$cookies.set('apiPort', this.port)
					}
					this.loadI18n()
					this.connectMQTT()
					this.validateToken()
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
		connectMQTT: function () {
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
		validateToken: function () {
			if (this.$cookies.isKey('username') && this.$cookies.isKey('apiToken')) {
				axios({
					method: 'post',
					url: `http://${this.ip}:${this.port}/api/v1.0.1/login/checkToken/`,
					headers: {'auth': this.$cookies.get('apiToken')}
				}).then(response => {
					if ('success' in response.data) {
						this.$store.commit('userLogin', {
							user: this.$cookies.get('username'),
							token: this.$cookies.get('apiToken')
						})
						return true
					} else {
						console.log('API Token validity check failed')
						this.$cookies.remove('username')
						this.$cookies.remove('apiToken')
					}
				})
			}
		},
		loadI18n: function() {
			axios.get(`http://${this.ip}:${this.port}/api/v1.0.1/utils/i18n/`)
				.then(response => {
					const i18n = this.$store.state.i18n
					for (const [lang, data] of Object.entries(response.data['data'])) {
						i18n.setLocaleMessage(lang, data)
					}
					this.$store.commit('setI18n', i18n)
				})
				.catch(reason => {
					console.log('Failed loading i18n: ' + reason)
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
