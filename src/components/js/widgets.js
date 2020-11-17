import axios from 'axios'

export default {
	name: 'pa-widgets',
	data: function() {
		return {
			tabs: [],
			menuItems: [
				{
					name: 'edit',
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: 'close'
				},
				{
					name: 'theater mode',
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				},
				{
					name: 'settings',
					icon: 'fas fa-cog',
					click: () => {
						this.settings = true
					}
				},
				{
					name: 'upload preset',
					icon: 'fas fa-file-upload',
				},
				{
					name: 'download preset',
					icon: 'fas fa-file-download',
				},
				{
					name: 'add widget',
					icon: 'far fa-plus-square',
					click: () => {
						this.addWidgets = true
					}
				},
				{
					name: 'remove widget',
					icon: 'far fa-minus-square',
					click: () => {
						this.removeWidgets = true
					}
				},
				{
					name: 'save',
					icon: 'fas fa-save',
					callback: this.saveAndClose,
					isToggle: true,
				}
			],
			settings: false,
			addWidgets: false,
			removeWidgets: false,
			widgetTemplates: {},
			widgetInstances: {},
			activePageId: 1
		}
	},
	created: function() {
		let self = this;
		document.addEventListener('keypress', function(event) {
			if (event.key === 'Enter') {
				self.$store.commit('stopCinemaMode')
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/pages/`,
			headers: {'auth': this.$cookies.get('apiToken')}
		}).then(response => {
			if ('pages' in response.data) {
				for (const page of Object.values(response.data.pages)) {
					this.tabs.push(JSON.parse(page))
				}
				this.fetchWidgetTemplates()
				this.fetchWidgetInstances()
			}
		})
	},
	methods: {
		changePage: function(id) {
			this.activePageId = id
		},
		saveAndClose: function() {
			console.log('saved')
		},
		cinemaMode: function() {
			this.$store.commit('toggleCinemaMode')
		},
		fetchWidgetTemplates: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/templates/`
			}).then(response => {
				if ('widgets' in response.data) {
					this.widgetTemplates = response.data['widgets']
				}
			})
		},
		fetchWidgetInstances: function() {
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				headers: {'auth': this.$cookies.get('apiToken')}
			}).then(response => {
				if ('widgets' in response.data) {
					this.widgetInstances = response.data['widgets']
				}
			})
		},
		addWidget: function(skillName, widgetName) {
			axios({
				method: 'put',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/widgets/`,
				data: {
					skillName: skillName,
					widgetName: widgetName,
					pageId: this.activePageId
				},
				headers: {
					'auth': this.$cookies.get('apiToken'),
					'content-type': 'application/json'
				}
			}).then(response => {
				if ('widget' in response.data) {
					console.log(response.data['widget'])
				}
			})
		}
	}
}
