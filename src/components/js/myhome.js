import axios from 'axios'

export default {
	name: 'myhome',
	data: function () {
		return {
			menuItems: [
				{
					name: this.$t('tooltips.edit'),
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: this.$t('tooltips.close'),
					onClose: this.closeEditor
				},
				{
					name: this.$t('tooltips.theaterMode'),
					icon: 'fas fa-person-booth',
					isToggle: true,
					callback: this.cinemaMode
				},
				{
					name: this.$t('tooltips.manageLocations'),
					icon: 'fas fa-map-marked-alt',
					callback: this.setLocationsEditMode
				},
				{
					name: this.$t('tooltips.manageDevices'),
					icon: 'fas fa-plug',
					callback: this.setDevicesEditMode
				}
			],
			addingLocation: false,
			newLocationName: '',
			locationsEditMode: false,
			devicesEditMode: false
		}
	},
	created: function() {
		let self = this;
		document.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				if (self.$store.state.fullScreen) {
					self.$store.commit('stopCinemaMode')
				}
			} else if (event.key === 'Escape') {
				self.addingLocation = false
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/`,
			headers: {'auth': localStorage.getItem('apiToken')}
		}).then(response => {
			if ('pages' in response.data) {
				this.tabs = response.data.pages
				this.fetchWidgetTemplates()
				this.fetchWidgetInstances()
			}
		})
	},
	methods: {
		cinemaMode: function () {
			this.$store.commit('toggleCinemaMode')
		},
		setLocationsEditMode: function () {
			this.locationsEditMode = true
			this.devicesEditMode = false
		},
		setDevicesEditMode: function () {
			this.devicesEditMode = true
			this.locationsEditMode = false
		},
		closeEditor: function () {
			this.devicesEditMode = false
			this.locationsEditMode = false
		},
		addLocationDialog: function () {
			if (this.addingLocation) return

			let self = this
			this.$dialog
				.prompt({
					title: this.$t('dialogs.titles.enterLocationName'),
					body: this.$t('dialogs.bodies.clickToAddLocation')
				}, {
					promptHelp: '',
					okText: this.$t('buttons.ok'),
					cancelText: this.$t('buttons.cancel')
				})
				.then(function (dialogue) {
					self.addingLocation = true
					self.newLocationName = dialogue.data
				})
				.catch(function () {
					self.addingLocation = false
					self.newLocationName = ''
				})
		}
	}
}
