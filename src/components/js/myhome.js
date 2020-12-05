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
			deletingLocations: false,
			settingLocations: false,
			newLocationName: '',
			locationsEditMode: false,
			devicesEditMode: false,
			locations: {},
			constructions: {},
			furnitures: {},
			floorTiles: [],
			activeFloorTile: '',
			zoomLevel: 1.0,
			areaSelectorX: 0,
			areaSelectorY: 0,
			areaSelectorStartX: 0,
			areaSelectorStartY: 0,
			areaSelectorW: 0,
			areaSelectorH: 0,
			clicked: false
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
	mounted: function () {
		this.areaSelector = this.$refs.areaSelector
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
		togglePaintingMode: function () {
			this.paintingFloors = !this.paintingFloors
			this.addingLocation = false
			this.deletingLocations = false
			this.settingLocations = false
		},
		toggleLocationSettings: function () {
			this.settingLocations = !this.settingLocations
			this.addingLocation = false
			this.deletingLocations = false
			this.paintingFloors = false
		},
		deleteLocations: function () {
			this.deletingLocations = !this.deletingLocations
			this.paintingFloors = false
			this.addingLocation = false
			this.settingLocations = false
		},
		deleteLocation: function (locId) {
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${locId}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.$delete(this.locations, locId)
				}
			})
		},
		addLocationDialog: function () {
			if (this.addingLocation) return
			this.paintingFloors = false
			this.deletingLocations = false
			this.settingLocations = false

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
				this.clicked = true
				this.areaSelectorStartX = event.offsetX
				this.areaSelectorStartY = event.offsetY
				this.drawSelectionArea(this.areaSelectorStartX, this.areaSelectorStartY)
			}
		},
		mouseMove: function (event) {
			if (this.addingLocation) {
				if (!this.clicked) return
				this.drawSelectionArea(event.offsetX, event.offsetY)
			}
		},
		drawSelectionArea: function (movedX, movedY) {
			let x = Math.min(this.areaSelectorStartX, movedX)
			let x2 = Math.max(this.areaSelectorStartX, movedX)
			let y = Math.min(this.areaSelectorStartY, movedY)
			let y2 = Math.max(this.areaSelectorStartY, movedY)

			this.areaSelectorX = x
			this.areaSelectorY = y
			this.areaSelectorW = x2 - x
			this.areaSelectorH = y2 - y
		},
		handleClick: function (event) {
			this.clicked = false
			if (this.addingLocation) {
				event.preventDefault()

				const data = {
					name: this.newLocationName,
					parentLocation: 0,
					settings: {
						x: Math.ceil(this.areaSelectorStartX / 5) * 5,
						y: Math.ceil(this.areaSelectorStartY / 5) * 5,
						w: Math.ceil(this.areaSelectorW / 5) * 5 || 150,
						h: Math.ceil(this.areaSelectorH / 5) * 5 || 150,
						z: 0
					}
				}

				// TODO parenting, fuck this shit
				// if (!event.target.className.includes('floorPlan')) {
				// 	data.parentLocation = parseInt(event.target['id'] || 0)
				// 	data.settings.x = event.target['offsetX']
				// 	data.settings.y = event.target['offsetY']
				// }

				this.areaSelectorX = 0
				this.areaSelectorY = 0
				this.areaSelectorStartX = 0
				this.areaSelectorStartY = 0
				this.areaSelectorW = 0
				this.areaSelectorH = 0
				this.newLocationName = ''

				this.addingLocation = false

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
						let loc = response.data['location']
						this.$set(this.locations, loc.id, loc)
					}
				})
			}
		}
	}
}
