import axios from 'axios'

export default {
	name: 'devmode',
	data: () => { return {
			activeTabId: 1,
			tabs: {
				1: {
					'icon': 'fas fa-plus-circle',
					'id': 1,
					'position': 0
				},
				2: {
					'icon': 'fas fa-edit',
					'id': 2,
					'position': 1
				}
			},
			values: {},
			skills: [],
			storeSkills: [],
			waiting: false,
			success: false,
			failed: false,
			created: false,
			uploaded: false,
			githubUrl: ''
		}
	},
	mounted: function() {
		axios({
			method: 'GET',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/getStore/`
		}).then(response => {
			if ('store' in response.data) {
				for (const skill of Object.keys(response.data['store'])) {
					this.storeSkills.push(skill.toLowerCase())
				}
			}
		})
		this.fetchSkills()
	},
	computed: {
		allValid : function () {
			return document.querySelectorAll('.invalid, .missing').length <= 0;
		}
	},
	methods: {
		startCapture: function() {
			console.log('start')
			navigator.mediaDevices.getUserMedia({video: true, audio: true, width: { min: 1280 }, height: { min: 720 }}).then((stream) => {
				this.$refs.video.srcObject = stream;
			})
		},
		validateTextInput: function(minLength, maxLength, noSpace, event) {
			const value = event.target.value
			if (event.target.id === 'skillName') {
				if (this.storeSkills.includes(value.toLowerCase())) {
					this.$refs.skillNameExists.classList.remove('initialHidden')
					event.target.classList.remove('inputValid')
					event.target.classList.add('inputError')
				} else {
					this.$refs.skillNameExists.classList.add('initialHidden')
				}
			}
		},
		setWaiting: function() {
			this.waiting = true
		},
		setSuccess: function() {
			this.waiting = false
			this.success = true
			let self = this
			setTimeout(function() {
				self.success = false
			}, 2000)
		},
		setFailed: function() {
			this.waiting = false
			this.failed = true
			let self = this
			setTimeout(function() {
				self.failed = false
			}, 2000)
		},
		createSkill: function(event) {
			event.preventDefault()
			this.setWaiting()

			const data = new FormData()
			data.append('skillName', this.values['skillName'])
			data.append('skillSpeakableName', this.values['skillSpeakableName'])
			data.append('skillDescription', this.values['skillDescription'])
			data.append('skillCategory', this.values['skillCategory'])
			data.append('skillPipRequirements', this.values['skillPipRequirements'])
			data.append('skillSystemRequirements', this.values['.skillSystemRequirements'])
			data.append('skillRequiredSkills', this.values['.skillRequiredSkills'])
			data.append('skillConflictingSkills', this.values['.skillConflictingSkills.'])
			data.append('skillRequiredManagers', this.values['.skillRequiredManagers'])
			data.append('skillWidgets', this.values['.skillWidgets'])
			data.append('skillScenarioNodes', this.values['.skillScenarioNodes'])
			data.append('skillDevices', this.values['.skillDevices'])
			data.append('fr', this.values['french'])
			data.append('de', this.values['german'])
			data.append('it', this.values['italian'])
			data.append('pl', this.values['polish'])
			data.append('skillOnline', this.values['internet'])
			data.append('skillInstructions', this.values['instructions'])
			data.append('skillArbitrary', this.values['arbitrary'])

			let self = this
			axios({
				method: 'PUT',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/createSkill/`,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'multipart/form-data'
				},
				data: data
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.created = true
						self.setSuccess()
					}
					else {
						self.setFailed()
					}
				}
			}).catch(function() {
				this.setFailed()
			})
		},
		uploadSkill: function(event) {
			event.preventDefault()
			this.setWaiting()
			const data = new FormData()
			data.append('skillName', this.values['skillName'])
			data.append('skillDesc', this.values['skillDescription'])

			let self = this
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/uploadSkill/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'multipart/form-data'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.setSuccess()
						self.githubUrl = response.data['url']
						self.uploaded = true
					}
					else {
						self.setFailed(response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function() {
				self.setFailed()
			})
		},
		checkOnGithub: function(event) {
			event.preventDefault()
			if (!this.uploaded || !this.githubUrl) {
				return
			}
			window.open(this.githubUrl, '_blank');
		},
		reset: function(event) {
			event.preventDefault()
			this.values = {}
			//this.$refs.data.reset()
			this.waiting = false
			this.created = false
			this.uploaded = false
			this.githubUrl = ''
			//this.setWaiting()
			//let self = this
			//setTimeout(function() { self.setFailed() }, 5000)
		},
		fetchSkills: function () {
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('data' in response.data) {
					this.skills = response.data.data
				}
			})
		},
		configTemplate: function () {
			return { 'skillName' : {
					"defaultValue": '',
					"dataType"    : "string",
					"description" : "class=\"inputError\" @input=\"validateTextInput(5, 20, true, $event)\" :disabled=\"created\"",
					"obligatory"  : true,
					"category"		: "general",
					"min"					: 5,
					"max"					: 20,
					"noSpace"			: true
				},
			'skillSpeakableName' : {
				"defaultValue": '',
				"dataType"    : "string",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general",
				"min"					: 5,
				"max"					: 50
			},
			'skillDescription' : {
				"defaultValue": '',
				"dataType"    : "longstring",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general",
				"min"					: 20,
				"max"					: 200
			},
			'skillCategory' : {
				"defaultValue": 'assistance',
				"dataType"    : "list",
				"description" : "",
				"values"  : ["weather", "information", "entertainment", "music", "game", "kid", "automation", "assistance",
					"security", "planning", "shopping", "organisation", "household", "health"],
				"category"		: "general"
			},
				'english': {
					"defaultValue": true,
					"dataType"    : "boolean",
					"description" : "",
					"obligatory"  : true,
					"category"		: "language"
				},
				'german': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "language"
				},
				'french': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "language"
				},
				'italian': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "language"
				},
				'polish': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "language"
				},
				'skillPipRequirements': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'skillSystemRequirements': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'skillOnline': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "requirements"
				},
				'skillArbitrary': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "requirements"
				},
				'skillRequiredSkills': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'skillConflictingSkills': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'skillRequiredManagers': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'skillInstructions': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "additionalInformation"
				},
				'skillWidgets': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				},
				'skillScenarioNodes': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				},
				'skillDevices': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				}
			}
		}
	}
}
