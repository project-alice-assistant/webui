import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		connectVue: null,
		settings: {},
		settingTemplates: {},
		settingCategories: {},
		mqtt: null,
		loggedInUser: false,
		fullScreen: false,
		magicMirrorMode: false,
		minimized: false,
		uiConnected: false,
		mqttMessage: {},
		widgetPages: {},
		widgetTemplates: {},
		widgetInstances: {},
		installedSkills: {},
		storeSkills: {},
		skillTourCompleted: false,
		furnitureTiles: [],
		floorTiles: [],
		constructionTiles: [],
		deviceTypes: {},
		devices: {},
		deviceLinks: {},
		furnitures: {},
		constructions: {},
		locations: {},
		interfaceUid: ''
	},
	mutations: {
		setInterfaceUid(state, data) {
			state.interfaceUid = data
			localStorage.setItem('interfaceUid', data)
		},
		setConnectVue(state, data) {
			state.connectVue = data
		},
		setFurnitureTiles(state, data) {
			state.furnitureTiles = data
		},
		setFloorTiles(state, data) {
			state.floorTiles = data
		},
		setConstructionTiles(state, data) {
			state.constructionTiles = data
		},
		setDeviceTypes(state, data) {
			state.deviceTypes = data
		},
		setDevices(state, data) {
			state.devices = data
		},
		setDeviceLinks(state, data) {
			state.deviceLinks = data
		},
		setFurnitures(state, data) {
			state.furnitures = data
		},
		setConstructions(state, data) {
			state.constructions = data
		},
		setLocations(state, data) {
			state.locations = data
		},
		setSkillTourCompleted(state) {
			state.skillTourCompleted = true
			localStorage.setItem('skillsTourCompleted', true)
		},
		setStoreSkills(state, data) {
			state.storeSkills = data
		},
		setInstalledSkills(state, data) {
			state.installedSkills = data
		},
		setWidgetInstances(state, data) {
			state.widgetInstances = data
		},
		setWidgetTemplates(state, data) {
			state.widgetTemplates = data
		},
		setWidgetPages(state, data) {
			state.widgetPages = data
		},
		setSettings(state, settings) {
			state.settings = settings
		},
		setSettingTemplates(state, templates) {
			state.settingTemplates = templates
		},
		setSettingCategories(state, categories) {
			state.settingCategories = categories
		},
		setMqtt(state, client) {
			state.mqtt = client
		},
		mqttMessage(state, msg) {
			state.mqttMessage = msg
		},
		userLogin(state, user) {
			state.loggedInUser = user
		},
		userLogout(state) {
			state.loggedInUser = {}
			localStorage.removeItem('username')
			localStorage.removeItem('apiToken')
		},
		startCinemaMode(state) {
			state.fullScreen = true
			localStorage.setItem('fullscreen', state.fullScreen)
		},
		stopCinemaMode(state) {
			state.fullScreen = false
			localStorage.setItem('fullscreen', state.fullScreen)
		},
		startMagicMirrorMode(state) {
			state.fullScreen = true
			localStorage.setItem('fullscreen', state.fullScreen)
			state.magicMirrorMode = true
			localStorage.setItem('magicMirrorMode', state.magicMirrorMode)
		},
		stopMagicMirrorMode(state) {
			state.fullScreen = false
			localStorage.setItem('fullscreen', state.fullScreen)
			state.magicMirrorMode = false
			localStorage.setItem('magicMirrorMode', state.magicMirrorMode)
		},
		toggleCinemaMode(state) {
			state.fullScreen = !state.fullScreen
			localStorage.setItem('fullscreen', state.fullScreen)
		},
		toggleMagicMirrorMode(state) {
			state.fullScreen = !state.fullScreen
			localStorage.setItem('fullscreen', state.fullScreen)
			state.magicMirrorMode = !state.magicMirrorMode
			localStorage.setItem('magicMirrorMode', state.magicMirrorMode)
		},
		startMinimized(state) {
			state.minimized = true
			localStorage.setItem('minimized', state.minimized)
		},
		stopMinimized(state) {
			state.minimized = false
			localStorage.setItem('minimized', state.minimized)
		},
		toggleMinimized(state) {
			state.minimized = !state.minimized
			localStorage.setItem('minimized', state.minimized)
		},
		uiConnected(state, connected) {
			state.uiConnected = connected
		}
	},
	getters: {
		apiToken: function (state, _getters) {
			if (typeof state.loggedInUser === 'object') {
				return state.loggedInUser.token
			} else {
				return ''
			}
		}
	}
})
