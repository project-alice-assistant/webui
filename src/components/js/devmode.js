import axios from 'axios'

export default {
	name: 'devmode',
	data: function () { return {
			activeTabId: 'settings',
			tabs: {
				settings: {
					'icon': 'fas fa-cogs',
					'id': 'settings',
					'position': 0,
					'onChangeTo': this.loadInstallFile,
					'checkAllowLeaveFrom': this.checkAllowLeaveFromSettings
				},
				training: {
					'icon': 'fas fa-train',
					'id': 'training',
					'position': 1,
					'checkAllowLeaveFrom': this.checkAllowLeaveFromTraining
				},
				talk: {
					'icon': 'fas fa-comment',
					'id': 'talk',
					'position': 2,
					'checkAllowLeaveFrom': this.checkAllowLeaveFromTalk
				},
				configTemplate: {
					'icon': 'fas fa-cog',
					'id': 'configTemplate',
					'position': 3,
					'checkAllowLeaveFrom': this.checkAllowLeaveFromConfigTemplate
				},
				instructions: {
					'icon': 'fas fa-chalkboard-teacher',
					'id': 'instructions',
					'position': 4,
					'onChangeTo': this.loadInstruction,
					'checkAllowLeaveFrom': this.checkAllowLeaveFromInstructions
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
			values: { 'conditions' : {}},
			skills: [],
			storeSkills: [],
			waiting: false,
			success: false,
			failed: false,
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
					name: "save",
					icon: 'fas fa-save',
					isToggle: false,
					callback: this.saveSkill
				},
				{
					name: "help",
					icon: 'fas fa-question-circle',
					isToggle: false,
					callback: this.showHelp
				},
				{
					name: "close",
					icon: 'fas fa-times-circle',
					isToggle: false,
					callback: this.stopEditingSkill
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
			}
		}
	},
	methods: {
		async checkAllowLeaveFromConfigTemplate() {
			if(this.$refs.configTemplateEditor?.isModified) {
				return this.askChangesLost()
			} else return true
		},
		async checkAllowLeaveFromSettings() {
			if(JSON.stringify(this.changedSkill.installFile) != JSON.stringify(this.backedUpSkill.installFile)) {
				return this.askChangesLost()
			} else return true
		},
		async checkAllowLeaveFromInstructions() {
			if(this.changedSkill.instructions != this.backedUpSkill.instructions) {
				return this.askChangesLost()
			} else return true
		},
		async checkAllowLeaveFromTraining() {
			if(this.$refs.dialogTemplateEditor?.isModified) {
				return this.askChangesLost()
			} else return true
		},
		async checkAllowLeaveFromTalk() {
			if(this.$refs.talkFileEditor?.isModified) {
				return this.askChangesLost()
			} else return true
		},
		async askChangesLost(){
			return this.$dialog.confirm({
				title: "Your changes will be lost!",
				body: "Do you want to continue and lose your changes?",
				okText: "Okilidoki",
				cancelText: this.$t('buttons.cancel'),
			})
		},
		showHelp(){
			switch(this.activeTabId) {
				case 'settings':
					window.open('https://docs.projectalice.io/skill-development/your-first-skill.html#your-first-skill')
					break;
				case 'training':
					window.open('https://docs.projectalice.io/skill-development/files-in-depth.html#dialog-templates')
					break;
				case 'configTemplate':
					window.open('https://docs.projectalice.io/skill-development/files-in-depth.html#skill-configuration-file')
					break;
				case 'instructions':
					alert("No help available")
					break;
				case 'talk':
					window.open('https://docs.projectalice.io/skill-development/files-in-depth.html#talk-files')
					break;
				case 'devices':
					window.open('https://docs.projectalice.io/skill-development/going-further.html#devices')
					break;
				case 'widgets':
					window.open('https://docs.projectalice.io/skill-development/going-further.html#widgets')
					break;
				default:
					alert('Unknown help requested')
			}
		},
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
		setWaiting: function(v = true) {
			this.waiting = v
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
			if (event) event.preventDefault()
			this.setWaiting()

			const data = new FormData()
			data.append('name', this.values['name'])
			data.append('speakableName', this.values['speakableName'])
			data.append('description', this.values['desc'])
			data.append('category', this.values['category'])
			data.append('pipRequirements', this.values['skillPipRequirements'])
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
						self.createNew = false
						self.skills.push(response.data['skill'])
						self.editingSkill = response.data['skill']
						self.$set(self.$store.state.installedSkills, response.data['skill'].name, response.data['skill'])

						self.setSuccess()
						self.loadInstallFile()
					}
					else {
						self.setFailed()
					}
				}
			}).catch(function() {
				this.setFailed()
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
						self.changedSkill.instructions = response.data['instruction']
						self.backedUpSkill.instructions = JSON.parse(JSON.stringify(response.data['instruction']))
						self.setWaiting(false)
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
		saveInstructions(){
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
		},
		loadInstallFile(){
			// load the instructions for the currently selected skill and language
			const data = {}
			let self = this
			this.setWaiting()
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/getInstallFile/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.$set(self.changedSkill, 'installFile', response.data['installFile'])
						self.backedUpSkill.installFile = JSON.parse(JSON.stringify(response.data['installFile']))
						self.setWaiting(false)
					}	else {
						self.setFailed(response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function(e) {
				console.log(e)
				self.setFailed()
			})
		},
		saveInstallFile(){
				let self = this
				let data = {
					'installFile': this.changedSkill.installFile
				}
				axios({
					method: 'PATCH',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/setInstallFile/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(function(response) {
					if ('success' in response.data) {
						if (response.data['success']) {
							self.setSuccess()
							self.changedSkill.installFile = response.data['installFile']
							self.backedUpSkill.installFile = JSON.parse(JSON.stringify(response.data['installFile']))
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
			//TODO:Get github URL and integrate into UI
			window.open("githubUrl", '_blank');
		},
		reset: function(event) {
			event.preventDefault()
			this.values = {}
			//this.$refs.data.reset()
			this.waiting = false
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
			this.loadInstallFile()
		},
		stopEditingSkill(){
			this.editingSkill = null
			this.createNew = false
		},
		createPR(){
			let gitUser = this.$store.state.settings['githubUsername']
			if(!gitUser){
				alert("please maintain a github user!")
			} else {

				self = this
				this.$dialog.prompt({
					title: 'Please name your Pull Request',
					body: 'Make sure you have Uploaded all your changes and changed the skills Version!'
						  + 'The name should be short and precisely describe your changes'
				}, {
					promptHelp: '',
					okText: this.$t('buttons.ok'),
					cancelText: this.$t('buttons.cancel')
				})
					.then(function (dialogue) {
						let prTitle = dialogue.data
						window.open('https://github.com/project-alice-assistant/skill_'
							+ self.editingSkill.name + '/compare/master...' + gitUser + ':master'
							+ '?diff=split&quick_pull=1&title=' + prTitle)
					})
			}
		},
		saveSkill(){
			if(this.createNew){
				this.createSkill()
			}
			if(this.changedSkill.instructions != this.backedUpSkill.instructions){
				this.saveInstructions()
			}
			if(this.changedSkill.installFile != this.backedUpSkill.installFile){
				this.saveInstallFile()
			}
//			if(this.$refs.installFileEditor){
//				this.$refs.installFileEditor.save()
//			}
			if(this.$refs.dialogTemplateEditor){
				this.$refs.dialogTemplateEditor.save()
			}
			if(this.$refs.talkFileEditor){
				this.$refs.talkFileEditor.save()
			}
			if(this.$refs.configTemplateEditor?.prepareSave()) {
				let self = this
				let data = {
					'lang': this.currentLang,
					'configTemplate': this.editingSkill.settingsTemplate
				}
				axios({
					method: 'PATCH',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/setConfigTemplate/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(function (response) {
					if ('success' in response.data) {
						if (response.data['success']) {
							self.setSuccess()
							self.editingSkill.settingsTemplate = response.data['configTemplate']
						} else {
							self.setFailed(response.data['message'] || "Unknown Error")
						}
					}
				}).catch(function (e) {
					console.log(e)
					self.setFailed()
				})
			}

		},
		utilityRequest(id) {
			const icon = this.startIcon(id)
			const self = this

			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/${id}/`,
				headers: {'auth': this.$store.getters.apiToken},
			}).then(function(resp) {
				if(resp['success'] != undefined && !resp['success']){
					throw resp['message'];
				} else {
					icon.classList.add('green')
					if(id === 'setModified') {
						self.$set(self.editingSkill, "modified", true)
					} else if( id === 'revert'){
						self.$set(self.editingSkill, "modified", false)
					}
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
		createWidget(){
			self = this
			this.$dialog.prompt({
				title: 'Please name your Widget',
				body: 'The name will be the technical name as well as the one shown to the user!\n Don\'t use spaces or special characters!'}, {
				promptHelp: '',
				okText: this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			}).then(function (dialogue) {
				let widgetName = dialogue.data
				axios({
					method: 'PATCH',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/${self.editingSkill.name}/createWidget/${widgetName}/`,
					headers: {
						'auth': self.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				})
			})
		},
		createDevice(){
			self = this
			this.$dialog.prompt({
				title: 'Please name your device type',
				body: 'The name will be the technical name as well as the one shown to the user!\n Don\'t use spaces or special characters!'}, {
				promptHelp: '',
				okText: this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			}).then(function (dialogue) {
				let deviceName = dialogue.data
				axios({
					method: 'PATCH',
					url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/skills/${self.editingSkill.name}/createDeviceType/${deviceName}/`,
					headers: {
						'auth': self.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				})
			})
		},
		configTemplate(){
			return { 'name' : {
					"defaultValue": '',
					"dataType"    : "string",
					"description" : "The name of this intent as it can be found written in the store and folders.",
					"obligatory"  : true,
					"category"		: "general",
					"noSpace"			: true,
					"readonly"    : true
				},
			'speakableName' : {
				"defaultValue": 'A name for the skill that is speakable for Alice - use spaces, but be careful with punctuation',
				"dataType"    : "string",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general"
			},
			'desc' : {
				"defaultValue": '',
				"dataType"    : "longstring",
				"description" : "A short description of that skill. It will be shown in the store",
				"obligatory"  : true,
				"category"		: "general"
			},
			'version' : {
				"defaultValue": '0.0.1',
				"dataType"    : "string",
				"description" : "The version of this skill. Increase this on every update.",
				"obligatory"  : true,
				"category"		: "general"
			},
			'icon' : {
				"defaultValue": 'fas fa-biohazard',
				"dataType"    : "faIcon",
				"description" : "The icon representing that skill.",
				"category"		: "general"
			},
			'category' : {
				"defaultValue": 'assistance',
				"dataType"    : "list",
				"description" : "The category your skill belongs into.",
				"values"  : ["assistance", "automation", "entertainment", "game", "health", "household", "information", "kid",
					"music", "organisation", "planning", "robotics", "security", "shopping", "weather"],
				"category"		: "general"
			},
				'conditions': {
					"subConfig": true,
					"dataType" : "userList",
					"subType"  : "toggles",
					"category" : "lang",
					"values"   : {
						'en': {
						"defaultValue": true,
						"dataType"    : "boolean",
						"description" : "English must be supported. A skill without english translation won't be accepted in the store.",
						"obligatory"  : true,
						"category"		: "language"
						},
						'de': {
							"defaultValue": false,
							"dataType"    : "boolean",
							"description" : "",
							"category"		: "language"
						},
						'fr': {
							"defaultValue": false,
							"dataType"    : "boolean",
							"description" : "",
							"category"		: "language"
						},
						'it': {
							"defaultValue": false,
							"dataType"    : "boolean",
							"description" : "",
							"category"		: "language"
						},
						'pt': {
							"defaultValue": false,
							"dataType"    : "boolean",
							"description" : "",
							"category"		: "language"
						},
						'pl': {
							"defaultValue": false,
							"dataType": "boolean",
							"description": "",
							"category": "language"
						}
					}
				},
				'aliceMinVersion': {
					"defaultValue": '1.0.0-rc1',
					"dataType"    : "string",
					"description" : "The minimum version alice needs to use that skill - if you don't know, be sure and use your current version!",
					"category"		: "requirements"
				},
				'pipRequirements': {
					"defaultValue": '',
					"dataType"    : "userList",
					"subType"     : "string",
					"description" : "The python requirements to be installed by pip",
					"category"		: "requirements"
				},
				'sysreq': {
					"defaultValue": '',
					"dataType"    : "userList",
					"subType"     : "string",
					"description" : "The system requirements to be installed by apt-get",
					"category"		: "requirements"
				},
				'conditionOnline': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "Does this skill require internet to perform its task?",
					"category"		: "requirements"
				},
				'conditionASRArbitrary': {
					"defaultValue": false,
					"dataType"    : "boolean",
					"description" : "Is an arbitrary ASR capturing required for this skill?",
					"category"		: "requirements"
				},
				'conditionSkill': {
					"defaultValue": '',
					"dataType"    : "userList",
					"subType"     : "string",
					"description" : "Are other skills required to run this skill?",
					"category"		: "requirements"
				},
				'conditionNotSkill': {
					"defaultValue": '',
					"dataType"    : "userList",
					"subType"     : "string",
					"description" : "Are there skills this skill won't be able to run with?",
					"category"		: "requirements"
				},
				'conditionActiveManager': {
					"defaultValue": '',
					"dataType"    : "userList",
					"subType"     : "string",
					"description" : "Is there a specific manager required in Alice?",
					"category"		: "requirements"
				}
			}
		},
		newSkill() {
		return { 'name' : {
				"defaultValue": '',
				"dataType"    : "string",
				"description" : "The name of this intent as it can be found written in the store and folders.",
				"obligatory"  : true,
				"category"		: "general",
				"noSpace"			: true,
				"capitalize"  : true
			},
			'speakableName' : {
				"defaultValue": 'A name for the skill that is speakable for Alice - use spaces, but be careful with punctuation',
				"dataType"    : "string",
				"description" : "",
				"obligatory"  : true,
				"category"		: "general"
			},
			'desc' : {
				"defaultValue": '',
				"dataType"    : "longstring",
				"description" : "A short description of that skill. It will be shown in the store",
				"obligatory"  : true,
				"category"		: "general"
			},
			'icon' : {
				"defaultValue": 'fas fa-biohazard',
				"dataType"    : "faIcon",
				"description" : "The icon representing that skill.",
				"category"		: "general"
			},
			'category' : {
				"defaultValue": 'assistance',
				"dataType"    : "list",
				"description" : "The category your skill belongs into.",
				"values"  : ["assistance", "automation", "entertainment", "game", "health", "household", "information", "kid",
					"music", "organisation", "planning", "robotics", "security", "shopping", "weather"],
				"category"		: "general"
			},
			'conditions': {
				"subConfig": true,
				"dataType" : "userList",
				"subType"  : "toggles",
				"category" : "lang",
				"values"   : {
					'en': {
						"defaultValue": true,
						"dataType": "boolean",
						"description": "English must be supported. A skill without english translation won't be accepted in the store.",
						"obligatory": true,
						"category": "language"
					},
					'de': {
						"defaultValue": false,
						"dataType": "boolean",
						"description": "",
						"category": "language"
					},
					'fr': {
						"defaultValue": false,
						"dataType": "boolean",
						"description": "",
						"category": "language"
					},
					'it': {
						"defaultValue": false,
						"dataType": "boolean",
						"description": "",
						"category": "language"
					},
					'pt': {
						"defaultValue": false,
						"dataType": "boolean",
						"description": "",
						"category": "language"
					},
					'pl': {
						"defaultValue": false,
						"dataType": "boolean",
						"description": "",
						"category": "language"
					}
				}
		}
		}
		}
	}
}
