import axios from 'axios'

export default {
	name: 'myhome',
	data: function () {
		return {
			me: '',
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
			paintingFloors: false,
			newLocationName: '',
			locationsEditMode: false,
			devicesEditMode: false,
			locations: {},
			constructions: {},
			furnitures: {},
			floorTiles: [],
			activeFloorTile: '',
			zoomLevel: 1.0,
			newLocation: {}
		}
	},
	created: function() {
		this.me = this

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

		document.addEventListener('wheel', function (event) {
			if (event.deltaY > 1) {
				self.zoomLevel = Math.max(self.zoomLevel - 0.05, 0.1)
			} else {
				self.zoomLevel = Math.min(self.zoomLevel + 0.05, 3.0)
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/`,
			headers: {'auth': localStorage.getItem('apiToken')}
		}).then(response => {
			if ('data' in response.data) {
				this.floorTiles = response.data.data
			}
		})

		axios({
			method: 'get',
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/`,
			headers: {'auth': localStorage.getItem('apiToken')}
		}).then(response => {
			if ('data' in response.data) {
				this.locations = response.data.data.locations
				this.constructions = response.data.data.constructions
				this.furnitures = response.data.data.furnitures
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
			this.paintingFloors = false

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
		},
		mouseDown: function (event) {
			if (this.addingLocation) {
				event.preventDefault()
				this.newLocation.tx = event.offsetX
				this.newLocation.ty = event.offsetY
			}
		},
		handleClick: function (event) {
			if (this.addingLocation) {
				event.preventDefault()

				const data = {
					name: this.newLocationName,
					parentLocation: 0,
					settings: {
						x: event['layerX'],
						y: event['layerY'],
						z: 0
					}
				}

				if (this.newLocation.hasOwnProperty('tx')) {

					if (this.newLocation.tx < event['layerX']) {
						data.settings.x = this.newLocation.tx
						data.settings.w = event['layerX'] - data.settings.x
					} else {
						data.settings.x = event['layerX']
						data.settings.w = this.newLocation.tx - data.settings.x
					}
					if (this.newLocation.ty < event['layerY']) {
						data.settings.y = this.newLocation.ty
						data.settings.h = event['layerY'] - data.settings.y
					} else {
						data.settings.y = event['layerY']
						data.settings.h = this.newLocation.tx - data.settings.y
					}
				}

				this.newLocation = {}

				if (!event.target.className.includes('floorPlan')) {
					data.parentLocation = parseInt(event.target['id'])
					data.settings.x = event.target['offsetX']
					data.settings.y = event.target['offsetY']
				}

				this.addingLocation = false
				this.newLocationName = ''

				console.log(data)
				axios({
					method: 'put',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/`,
					data: data,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'content-type': 'application/json'
					}
				}).then(response => {
					if ('location' in response.data) {
						console.log(response.data)
						let loc = response.data['location']
						this.$set(this.locations, loc.id, loc)
					}
				})
			}
		}
	}
}
