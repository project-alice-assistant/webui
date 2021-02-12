import axios from 'axios'

export default {
	name: 'devmode',
	data: function() {
		return {
			activeTab: 0,
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
			skills: [],
			storeSkills: [],
			allValid: false,
			waiting: false,
			created: false,
			uploaded: false,
			githubUrl: '',
			english: true,
			german: false,
			french: false,
			italian: false,
			polish: false,
			instructions: false,
			internet: false,
			arbitrary: false,
			skillName: '',
			skillSpeakableName: '',
			skillDescription: '',
			skillCategory: 'assistance',
			skillPipRequirements: '',
			skillSystemRequirements: '',
			skillRequiredSkills: '',
			skillConflictingSkills: '',
			skillRequiredManagers: '',
			skillWidgets: '',
			skillScenarioNodes: '',
			skillDevices: ''
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
	methods: {
		startCapture: function() {
			console.log('start')
			navigator.mediaDevices.getUserMedia({video: true, audio: true, width: { min: 1280 }, height: { min: 720 }}).then((stream) => {
				this.$refs.video.srcObject = stream;
			})
		},
		validateTextInput: function(minLength, maxLength, noSpace, event) {
			const value = event.target.value
			if (value.length === 1) {
				event.target.value = value.toUpperCase()
			} else if ((noSpace && value.slice(-1) === ' ') || (value.length > maxLength)) {
				event.target.value = value.slice(0, -1)
			}

			if (value.length >= minLength) {
				event.target.classList.add('inputValid')
				event.target.classList.remove('inputError')
			} else {
				event.target.classList.add('inputError')
				event.target.classList.remove('inputValid')
			}

			if (event.target.id === 'skillName') {
				if (this.storeSkills.includes(value.toLowerCase())) {
					this.$refs.skillNameExists.classList.remove('initialHidden')
					event.target.classList.remove('inputValid')
					event.target.classList.add('inputError')
				} else {
					this.$refs.skillNameExists.classList.add('initialHidden')
				}
			}

			this.allValid = document.querySelectorAll('.inputError').length <= 0;
		},
		setWaiting: function() {
			this.waiting = true
			this.$refs.animatedIcon.classList = 'fas fa-spinner fa-pulse fa-2x'
		},
		setSuccess: function() {
			this.waiting = false
			let self = this
			setTimeout(function() {
				self.$refs.animatedIcon.classList = 'fas fa-check fa-2x green'
				setTimeout(function() {
					self.$refs.animatedIcon.classList.add('initialHidden')
				}, 5000)
			}, 100)
		},
		setFailed: function() {
			this.waiting = false
			let self = this
			setTimeout(function() {
				self.$refs.animatedIcon.classList = 'fas fa-exclamation-triangle fa-2x red'
				setTimeout(function() {
					self.$refs.animatedIcon.classList.add('initialHidden')
				}, 5000)
			}, 1000)
		},
		createSkill: function(event) {
			event.preventDefault()
			this.setWaiting()

			const data = new FormData()
			data.append('skillName', this.$refs.skillName.value)
			data.append('skillSpeakableName', this.$refs.skillSpeakableName.value)
			data.append('skillDescription', this.$refs.skillDescription.value)
			data.append('skillCategory', this.$refs.skillCategory.value)
			data.append('skillPipRequirements', this.$refs.skillPipRequirements.value)
			data.append('skillSystemRequirements', this.$refs.skillSystemRequirements.value)
			data.append('skillRequiredSkills', this.$refs.skillRequiredSkills.value)
			data.append('skillConflictingSkills', this.$refs.skillConflictingSkills.value)
			data.append('skillRequiredManagers', this.$refs.skillRequiredManagers.value)
			data.append('skillWidgets', this.$refs.skillWidgets.value)
			data.append('skillScenarioNodes', this.$refs.skillScenarioNodes.value)
			data.append('skillDevices', this.$refs.skillDevices.value)
			data.append('fr', this.french)
			data.append('de', this.german)
			data.append('it', this.italian)
			data.append('pl', this.polish)
			data.append('skillOnline', this.internet)
			data.append('skillInstructions', this.instructions)
			data.append('skillArbitrary', this.arbitrary)

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
			data.append('skillName', this.$refs.skillName.value)
			data.append('skillDesc', this.$refs.skillDescription.value)

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
						self.setFailed()
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
			this.$refs.data.reset()
			this.waiting = false
			this.created = false
			this.uploaded = false
			this.githubUrl = ''
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
	}
}
