import axios from 'axios'

export default {
	name: 'devmode',
	data: function () { return {
			activeTabId: 'settings',
			tabs: {
				settings: {
					'icon': 'fas fa-cogs',
					'id': 'settings',
					'position': 0
				},
				training: {
					'icon': 'fas fa-train',
					'id': 'training',
					'position': 1
				},
				configTemplate: {
					'icon': 'fas fa-cog',
					'id': 'configTemplate',
					'position': 2
				},
				instructions: {
					'icon': 'fas fa-chalkboard-teacher',
					'id': 'instructions',
					'position': 3,
					'onChangeTo': this.loadInstruction
				},
				talk: {
					'icon': 'fas fa-comment',
					'id': 'talk',
					'position': 4
				},
				devices: {
					'icon': 'fas fa-microchip',
					'id': 'devices',
					'position': 5
				},
				widgets: {
					'icon': 'fas fa-window-maximize',
					'id': 'widgets',
					'position': 6
				},
				cloud: {
					'icon': 'fas fa-cloud',
					'id': 'cloud',
					'position': 7
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
			githubUrl: '',
			editingSkill: null,
			editingIntent: null,
			editingSlotType: null,
			createNew: false,
			currentLang: 'en',
			changedSkill: {},
			backedUpSkill: {},
			noWatch: false,
			menuItems: [
				{
					name: "close",
					icon: 'fas fa-times-circle',
					isToggle: false,
					callback: this.stopEditingSkill
				},
				{
					name: "save",
					icon: 'fas fa-save',
					isToggle: true,
					callback: this.saveSkill
				}
			],
			newSkillTile: {
				name: 'Create New Skill',
				author: 'You!',
				description: 'Start here for creating your own skill!',
				modified: true
			}
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
		this.currentLang = this.$store.state.settings['activeLanguage']
	},
	computed: {
		allValid : function () {
			return document.querySelectorAll('.invalid, .missing').length <= 0;
		},
		intentDefinition: function () {
			for(const intent of Object.values(this.changedSkill.dialogTemplate.intents)){
				console.log(intent)
				console.log("intent " + intent.name)
				if(intent.name === this.editingIntent){
					return intent
				}
			}
		},
		intentContainedSlots: function () {
			let ret = []
			for(const slot of Object.values(this.intentDefinition.slots)){
				ret.push(slot.name)
			}
			return ret
		}
	},
	watch: {
		currentLang: function (newVal, oldVal){
			if(this.activeTabId === 'instructions'){
				if(this.noWatch) return
				this.noWatch = true
				let self = this
				if(this.backedUpSkill && this.backedUpSkill.instructions && this.backedUpSkill.instructions != this.changedSkill.instructions){
					this.$dialog.confirm({
						title: "Your changes will be lost!",
						body: "Close to return to "+oldVal+" or continue to "+newVal+"?",
						okText: "Okilidoki",
						cancelText: this.$t('buttons.cancel'),
					}).then(function (dialog) {
						self.loadInstruction()
						self.noWatch = false
					}).catch(function (dialog){
						self.currentLang = oldVal
						self.$nextTick(() => {
							//delay as watch will be called at the end of THIS tick with noWatch already changed
							self.noWatch = false
						});
						}
					)
				} else {
					this.loadInstruction()
					this.noWatch = false
				}
			} else if (this.activeTabId === 'training'){
				if(this.noWatch) return
				this.noWatch = true
				let self = this
				if(this.$refs.dialogTemplateEditor.isModified()){
					this.$dialog.confirm({
						title: "Your changes will be lost!",
						body: "Close to return to "+oldVal+" or continue to "+newVal+"?",
						okText: "Okilidoki",
						cancelText: this.$t('buttons.cancel'),
					}).then(function (dialog) {
						self.$refs.dialogTemplateEditor.reload()
						self.noWatch = false
					}).catch(function (dialog){
							self.currentLang = oldVal
							self.$nextTick(() => {
								self.noWatch = false
							});
						}
					)
				} else {
					this.$nextTick(() => {
						self.$refs.dialogTemplateEditor.reload()
						self.noWatch = false
					})
				}
			}
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
		loadInstruction(){
			// load the instructions for the currently selected skill and language
			const data = {"lang": this.currentLang }
			let self = this
			this.setWaiting()
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/getInstructions/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.setSuccess()
						self.changedSkill.instructions = response.data['instruction']
						self.backedUpSkill.instructions = self.changedSkill.instructions
					}
					else {
						self.setFailed(response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function(e) {
				console.log(e)
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
		startEditingSkill(skill){
			this.editingSkill = skill
		},
		stopEditingSkill(){
			this.editingSkill = null
		},
		saveSkill(){
			if(this.changedSkill.instructions != this.backedUpSkill.instructions){
				let self = this
				let data = {
					'lang': this.currentLang,
					'instruction': this.changedSkill.instructions
				}
				axios({
					method: 'PATCH',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/setInstructions/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(function(response) {
					if ('success' in response.data) {
						if (response.data['success']) {
							self.setSuccess()
							self.changedSkill.instructions = response.data['instruction']
							self.backedUpSkill.instructions = self.changedSkill.instructions
						}
						else {
							self.setFailed(response.data['message'] || "Unknown Error")
						}
					}
				}).catch(function(e) {
					console.log(e)
					self.setFailed()
				})

			}
			this.$refs.dialogTemplateEditor.save()
		},
		utilityRequest(id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/${id}/`,
				headers: {'auth': this.$store.getters.apiToken},
			}).then(function() {
				icon.classList.add('green')
				if(id === 'setModified') {
					self.editingSkill.modified = true
				} else if( id === 'revert'){
					self.editingSkill.modified = false
				}
				setTimeout(() => {
					icon.classList.remove('fa-spin')
				}, 2000)
			}).catch(function(e) {
				console.log(e)
				icon.classList.add('red')
				setTimeout(() => {
					icon.classList.remove('fa-spin')
					self.showError(self.$t('notifications.errors.somethingWentWrong'))
				}, 2000)
			}).finally(() => {
				setTimeout(() => {
					icon.classList.remove('red')
					icon.classList.remove('green')
				}, 4000)
			})
		},
		startIcon(id) {
			const icon = document.querySelector(`#utility${id.charAt(0).toUpperCase() + id.slice(1)}`)
			icon.classList.add('fa-spin')
			return icon
		},
		intentsTemplate(){
			return { 'intents': {
						"defaultValue": [],
						"dataType"		: "userList",
						"subType"			: "string",
						"description" : "The intents this skill will be able to handle",
						"category"		: "Intents",
						"allowDouble" : false
					},
					'utterances': {
						"defaultValue": [],
						"dataType"		: "userList",
						"subType"			: "utterance",
						"description" : "A collection of utterances this skill should recognize",
						"category"		: "Intents",
						"allowDouble" : false,
						"highlights"  : [
							{ 'slot' : "city",
								'color': "#006600",
								'pattern': '{.*:=>city}'}, //IDEA: pattern as a way to generalize and enable easier editing?
							{ 'slot' :"country",
								'color':"#cc8400"},
							{ 'slot' :"continent",
								'color':"#1b4958"}]
				}
			}
		},
		configTemplate(){
			return { 'name' : {
					"defaultValue": '',
					"dataType"    : "string",
					"description" : "class=\"inputError\" @input=\"validateTextInput(5, 20, true, $event)\" :disabled=\"created\"",
					"obligatory"  : true,
					"category"		: "general",
					"min"					: 5,
					"max"					: 20,
					"noSpace"			: true
				},
			'speakableName' : {
				"defaultValue": '',
				"dataType"    : "string",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general",
				"min"					: 5,
				"max"					: 50
			},
			'description' : {
				"defaultValue": '',
				"dataType"    : "longstring",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general",
				"min"					: 20,
				"max"					: 200
			},
			'category' : {
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
				'pipreq': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'sysreq': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'conditionOnline': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "requirements"
				},
				'conditionASRArbitrary': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "",
					"category"		: "requirements"
				},
				'conditionSkill': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'conditionNotSkill': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'conditionActiveManager': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "requirements"
				},
				'widgets': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				},
				'nodes': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				},
				'devices': {
					"defaultValue": '',
					"dataType"    : "text",
					"description" : "",
					"category"		: "additionalInformation"
				}
			}
		}
	}
}
