import axios from 'axios'
import Paho from 'paho-mqtt'
import * as C from '@/utils/constants'
import jsLoader from '@/utils/jsLoader'
import AudioPlayer from '@/utils/audioPlayer'

export default {
	name: 'connect',
	data() {
		return {
			connecting: false,
			port: 5001,
			ip: '',
			remember: false,
			audioPlayer: new AudioPlayer()
		}
	},
	created: function () {
		this.remember = localStorage.getItem('rememberServer') || false
		if (this.remember === 'true') this.remember = true
		if (this.remember === 'false') this.remember = false

		this.ip = localStorage.getItem('host') || window.location.hostname || '127.0.0.1'
		this.port = localStorage.getItem('apiPort') || 5001

		if (localStorage.getItem('skillsTourCompleted')) {
			this.$store.commit('setSkillTourCompleted')
		}

		this.doConnect().then(console.log('Project Alice Web Interface connected and ready'))
	},
	beforeDestroy: function () {
		axios({
			method: 'PUT',
			url: `http://${self.ip}:${self.port}/api/v1.0.1/devices/${localStorage.getItem('interfaceUid')}/bye/`,
			headers: {'auth': this.$store.getters.apiToken}
		}).then()
	},
	methods: {
		async doConnect() {
			this.connecting = true
			let self = this
			Promise.all([
				self.connect(),
				self.connectMQTT(),
				self.validateToken()
			]).then(() => {
				self.helloAlice().then().finally(() => {
					self.startHeartbeat()
					self.loadDynamicScripts()
					self.loadI18n()
					self.loadData().then(() => {
						// Start these pages so that they start logging stuff
						const lastVisitedPage = localStorage.getItem('showPage') || '/'
						self.$router.replace('/syslog').then(function () {
							self.$router.replace('/alicewatch').then(function () {
								self.$store.commit('uiConnected', true)
								self.$store.commit('setConnectVue', self)
								if (lastVisitedPage !== '/alicewatch') {
									self.$router.replace(lastVisitedPage).then()
								}
							})
						})
					}).catch(reason => {
						console.error(reason)
					})
				})
			}).catch(reason => {
				console.error('Failed connecting: ' + reason)
			}).finally(() => self.connecting = false)
		},
		startHeartbeat: function () {
			const self = this
			setInterval(function () {
				if (localStorage.getItem('interfaceUid')) {
					self.$store.state.mqtt.publish(
						C.DEVICE_HEARTBEAT_TOPIC,
						JSON.stringify({
							uid: localStorage.getItem('interfaceUid')
						})
					)
				}
			}, 5000)
		},
		helloAlice: function () {
			const self = this
			const uid = localStorage.getItem('interfaceUid')
			if (uid && uid !== '' && self.$store.state.loggedInUser) {
				return new Promise(function (resolve, reject) {
					axios({
						method: 'GET',
						url: `http://${self.ip}:${self.port}/api/v1.0.1/devices/${uid}/hello/`,
					}).then(response => {
						if ('deviceId' in response.data) {
							resolve()
						} else {
							axios({
								method: 'PUT',
								url: `http://${self.ip}:${self.port}/api/v1.0.1/devices/${uid}/`,
								data: {
									locationId: 1,
									skillName: 'AliceCore',
									deviceType: 'WebInterface'
								},
								headers: {
									'auth': self.$store.getters.apiToken,
									'content-type': 'application/json'
								}
							}).then(response => {
								if ('device' in response.data) {
									return self.helloAlice()
								} else {
									reject(new Error(`Error adding interface device ${response.data['message']}`))
								}
							}).catch(reason => {
								reject(new Error('Something went wrong adding interface device ' + reason))
							})
						}
					}).catch(reason => {
						reject(new Error('Error greeting Alice ' + reason))
					})
				})
			} else {
				return new Promise(function (resolve, _reject) {
					resolve()
				})
			}
		},
		loadDynamicScripts: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				jsLoader(`http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/utils/Widget/`).then(() => {
					jsLoader(`http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/utils/pahows/`).then(
						resolve()
					).catch((error) => {
						reject(error)
					})
				}).catch((error) => {
					reject(error)
				})
			})
		},
		storeSessionSettings: function () {
			let settings = window.sessionStorage.getItem('aliceSettings')
			let defSettings = {
				'activeCountryCode': this.$store.state.settings['activeCountryCode'],
				'activeLanguage': this.$store.state.settings['activeLanguage'],
				'apiPort': this.$store.state.settings['apiPort'],
				'aliceIp': this.$store.state.settings['aliceIp'],
				'timezone': this.$store.state.settings['timezone']
			}
			// due to asynchronity sometimes MQTT is faster and overwrites - need to combine!
			if(settings) {
				settings = JSON.parse(settings)
				settings = Object.assign({}, settings, defSettings);
			} else {
				settings = defSettings
			}
			window.sessionStorage.setItem('aliceSettings', JSON.stringify(settings))
		},
		connect() {
			let self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.ip}:${self.port}/api/v1.0.1/utils/config/`,
					headers: {'auth': self.$store.getters.apiToken}
				}).then(response => {
					self.$store.commit('setSettings', response.data['config'])
					self.$store.commit('setSettingTemplates', response.data['templates'])
					self.$store.commit('setSettingCategories', response.data['categories'])
					self.storeSessionSettings()
					if (self.remember) {
						localStorage.setItem('host', self.ip)
						localStorage.setItem('apiPort', self.port)
						localStorage.setItem('rememberServer', true)
					} else {
						localStorage.removeItem('host')
						localStorage.removeItem('apiPort')
					}
					resolve()
				}).catch(reason => {
					reject(new Error('Error connecting to Alice ' + reason))
				})
			})
		},
		connectMQTT() {
			let self = this
			return new Promise(function (resolve, reject) {
				axios.get(`http://${self.ip}:${self.port}/api/v1.0.1/utils/mqttConfig/`)
					.then(response => {
						let settings = window.sessionStorage.getItem('aliceSettings')
						if (settings) {
							settings = JSON.parse(settings)
						} else {
							settings = {}
						}
						settings['mqttHost'] = response.data.host
						settings['mqttPort'] = Number(response.data.port)
						window.sessionStorage.setItem('aliceSettings', JSON.stringify(settings))
						let randomNum = Math.floor((Math.random() * 10000000) + 1)
						// noinspection JSUnresolvedFunction
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
			return new Promise(function (resolve, _reject) {
				if (localStorage.getItem('apiToken') && localStorage.getItem('username')) {
					axios({
						method: 'POST',
						url: `http://${self.ip}:${self.port}/api/v1.0.1/login/checkToken/`,
						headers: {'auth': localStorage.getItem('apiToken')}
					}).then(response => {
						if ('success' in response.data) {
							self.$store.commit('userLogin', {
								user: localStorage.getItem('username'),
								token: localStorage.getItem('apiToken'),
								authLevel: response.data.authLevel
							})
						} else {
							localStorage.removeItem('username')
							localStorage.removeItem('apiToken')
						}
						resolve()
					}).catch(reason => {
						reject(Error('Failed validating token: ' + reason))
					})
				} else {
					resolve()
				}
			})
		},
		loadI18n() {
			let self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.ip}:${self.port}/api/v1.0.1/utils/i18n/`
				}).then(response => {
					self.$i18n.locale = self.$store.state.settings['activeLanguage']
					for (const [lang, data] of Object.entries(response.data['data'])) {
						self.$i18n.setLocaleMessage(lang, data)
					}
					resolve()
				}).catch(reason => {
					reject(Error('Failed loading i18n: ' + reason))
				})
			})
		},
		loadWidgetTemplates: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/templates/`
				}).then(response => {
					if ('widgets' in response.data) {
						self.$store.commit('setWidgetTemplates', response.data['widgets'])
						resolve()
					} else {
						reject(Error('Error fetching widget templates'))
					}
				}).catch(reason => {
					reject(Error('Failed loading widget templates: ' + reason))
				})
			})
		},
		loadWidgetInstances: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				}).then(response => {
					if ('widgets' in response.data) {
						self.$store.commit('setWidgetInstances', response.data['widgets'])
						resolve()
					} else {
						reject(Error('Error fetching widget instances'))
					}
				}).catch(reason => {
					reject(Error('Failed loading widget instances: ' + reason))
				})
			})
		},
		loadDeviceTypes: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/deviceTypes/`,
				}).then(response => {
					if ('types' in response.data) {
						self.$store.commit('setDeviceTypes', response.data['types'])
						resolve()
					} else {
						reject(Error('Error fetching device types'))
					}
				}).catch(reason => {
					reject(Error('Failed loading device types: ' + reason))
				})
			})
		},
		loadWidgetPages: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/`,
				}).then(response => {
					if ('pages' in response.data) {
						self.$store.commit('setWidgetPages', response.data['pages'])
						resolve()
					} else {
						reject(Error('Error fetching widget pages'))
					}
				}).catch(reason => {
					reject(Error('Failed loading widget pages: ' + reason))
				})
			})
		},
		loadInstalledSkills: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/`,
					headers: {'auth': self.$store.getters.apiToken}
				}).then(response => {
					if ('skills' in response.data) {
						self.$store.commit('setInstalledSkills', response.data['skills'])
						resolve()
					} else {
						reject(Error('Error fetching skills'))
					}
				}).catch(reason => {
					reject(Error('Failed loading installed skills: ' + reason))
				})
			})
		},
		loadStore: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/getStore/`
				}).then(response => {
					if ('store' in response.data) {
						self.$store.commit('setStoreSkills', response.data['store'])
						resolve()
					} else {
						reject(Error('Error fetching store skills'))
					}
				}).catch(reason => {
					reject(Error('Failed loading store: ' + reason))
				})
			})
		},
		loadFloorTiles: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/`,
				}).then(response => {
					if ('data' in response.data) {
						self.$store.commit('setFloorTiles', response.data['data'])
						resolve()
					} else {
						reject(Error('Error fetching floor tiles'))
					}
				}).catch(reason => {
					reject(Error('Failed loading floor tiles: ' + reason))
				})
			})
		},
		loadConstructionTiles: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/constructions/tiles/`,
				}).then(response => {
					if ('data' in response.data) {
						self.$store.commit('setConstructionTiles', response.data['data'])
						resolve()
					} else {
						reject(Error('Error fetching construction tiles'))
					}
				}).catch(reason => {
					reject(Error('Failed loading construction tiles: ' + reason))
				})
			})
		},
		loadFurnitureTiles: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/tiles/`,
				}).then(response => {
					if ('data' in response.data) {
						self.$store.commit('setFurnitureTiles', response.data['data'])
						resolve()
					} else {
						reject(Error('Error fetching furniture tiles'))
					}
				}).catch(reason => {
					reject(Error('Failed loading furniture tiles: ' + reason))
				})
			})
		},
		loadMyHome: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				axios({
					method: 'GET',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/`,
					headers: {'auth': self.$store.getters.apiToken}
				}).then(response => {
					if ('data' in response.data) {
						self.$store.commit('setLocations', response.data['data']['locations'])
						self.$store.commit('setConstructions', response.data['data']['constructions'])
						self.$store.commit('setFurnitures', response.data['data']['furnitures'])
						self.$store.commit('setDeviceLinks', response.data['data']['links'])
						self.$store.commit('setDevices', response.data['data']['devices'])
						resolve()
					} else {
						reject(Error('Error fetching my home data'))
					}
				}).catch(reason => {
					reject(Error('Failed loading myHome data: ' + reason))
				})
			})
		},
		loadData: function () {
			const self = this
			return new Promise(function (resolve, reject) {
				Promise.all([
					self.loadWidgetPages(),
					self.loadDeviceTypes(),
					self.loadWidgetTemplates(),
					self.loadWidgetInstances(),
					self.loadInstalledSkills(),
					self.loadStore(),
					self.loadFloorTiles(),
					self.loadConstructionTiles(),
					self.loadFurnitureTiles(),
					self.loadMyHome()
				]).then(() => {
					resolve()
				}).catch(reason => {
					reject(Error('Failed loading data: ' + reason))
				})
			})
		},
		onConnected: function () {
			console.log('Mqtt connected')
			this.$store.state.mqtt.subscribe(C.RESOURCE_USAGE_TOPIC)
			this.$store.state.mqtt.subscribe(C.CORE_HEARTBEAT_TOPIC)
			this.$store.state.mqtt.subscribe(C.DEVICE_HEARTBEAT_TOPIC)
			this.$store.state.mqtt.subscribe(C.DEVICE_UPDATED_TOPIC)
			this.$store.state.mqtt.subscribe(C.CORE_DISCONNECTION_TOPIC)
			this.$store.state.mqtt.subscribe(C.CORE_RECONNECTION_TOPIC)
			this.$store.state.mqtt.subscribe(C.ALICE_WATCH_TOPIC)
			this.$store.state.mqtt.subscribe(C.SYSLOG_TOPIC)
			this.$store.state.mqtt.subscribe(C.SESSION_ENDED_TOPIC)
			this.$store.state.mqtt.subscribe(C.NLU_QUERY_TOPIC)
			this.$store.state.mqtt.subscribe(C.SAY_TOPIC)
			this.$store.state.mqtt.subscribe(C.HOTWORD_TOPIC)
			this.$store.state.mqtt.subscribe(C.ASR_PART_TOPIC)
			this.$store.state.mqtt.subscribe(C.ASR_TOPIC)
			this.$store.state.mqtt.subscribe(C.SKILL_UPDATED_TOPIC)
			this.$store.state.mqtt.subscribe(C.SKILL_UPDATING_TOPIC)
			this.$store.state.mqtt.subscribe(C.SKILL_INSTALLED_TOPIC)
			this.$store.state.mqtt.subscribe(C.SKILL_DELETED_TOPIC)
			this.$store.state.mqtt.subscribe(C.PLAY_BYTES_TOPIC.replace('{}', localStorage.getItem('interfaceUid')))
		},
		onConnectionFailed: function (_msg) {
			console.log('Mqtt connection failed')
		},
		onConnectionLost: function () {
			console.log('Mqtt connection lost')
		},
		onMessage: function (msg) {
			if (msg.topic.includes('playBytes')) {
				this.audioPlayer.playBytes(msg.payloadBytes)
			} else {
				this.$store.commit('mqttMessage', msg)
			}
		}
	}
}
