import axios from 'axios'
import Moveable from 'moveable'

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
			moveable: new Moveable(),
			addingLocation: false,
			paintingFloors: false,
			deletingLocations: false,
			settingLocations: false,
			placingFurniture: false,
			newLocationName: '',
			locationsEditMode: false,
			devicesEditMode: false,
			locations: {},
			constructions: {},
			furnitures: {},
			floorTiles: [],
			furnitureTiles: [],
			activeFloorTile: '',
			activeFurnitureTile: '',
			zoomLevel: 1.0,
			areaSelectorX: 0,
			areaSelectorY: 0,
			areaSelectorStartX: 0,
			areaSelectorStartY: 0,
			areaSelectorW: 0,
			areaSelectorH: 0,
			clicked: false,
			dragging: false
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
			} else if (event.key === 'Control') {
				if (self.moveable != null) {
					self.moveable.snapThreshold = 15
				}
			}
		})

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Control') {
				if (self.moveable != null) {
					self.moveable.snapThreshold = 1
				}
			}
		})

		document.addEventListener('wheel', function (event) {
			if (event.deltaY > 1) {
				self.zoomLevel = Math.max(self.zoomLevel - 0.05, 0.1)
			} else {
				self.zoomLevel = Math.min(self.zoomLevel + 0.05, 3.0)
			}
			this.removeMoveableControls()
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
			url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/tiles/`,
			headers: {'auth': localStorage.getItem('apiToken')}
		}).then(response => {
			if ('data' in response.data) {
				this.furnitureTiles = response.data.data
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
		removeMoveableControls: function () {
			this.moveable.target = null
			const controls = document.querySelector('.moveable-control-box')
			if (controls) {
				controls.outerHTML = ''
			}
		},
		removeDroppable: function () {
			document.querySelectorAll('.droppable').forEach(el => {
				el.classList.remove('droppable')
			})
		},
		newMoveable: function (target, prop) {
			this.removeMoveableControls()
			this.moveable = new Moveable(document.body, {
				target: target,
				props: prop,
				draggable: true,
				resizable: true,
				rotatable: true,
				snappable: true,
				isDisplaySnapDigit: true,
				snapCenter: true,
				snapGap: false,
				snapThreshold: 15,
				throttleDrag: 1,
				throttleResize: 1,
				throttleRotate: 5,
				scalable: false,
				keepRatio: false,
				edge: false,
				origin: false
			})

			this.moveable.on('dragStart', ({target}) => {
				this.dragging = true
				this.moveable.props.startDrag(target)
			}).on('drag', ({target, left, top, clientX, clientY}) => {
				this.moveable.props.handleDrag(target, left, top, clientX, clientY)
			}).on('dragEnd', ({target, isDrag, clientX, clientY}) => {
				this.dragging = false
				this.moveable.props.savePosition(target)
				this.$forceUpdate()
			})

			this.moveable.on('resize', ({target, width, height, delta, direction}) => {
				this.moveable.props.handleResize(target, width, height, delta, direction)
			}).on('resizeEnd', ({target}) => {
				this.moveable.props.saveSize(target)
			})

			this.moveable.on('rotate', ({target, dist, transform}) => {
				this.moveable.props.handleRotate(target, dist, transform)
			}).on('rotateEnd', ({}) => {
				this.moveable.props.saveRotation()
			})
		},
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

			this.removeMoveableControls()
			this.removeDroppable()
			this.paintingFloors = false
			this.addingLocation = false
			this.deletingLocations = false
			this.settingLocations = false
			this.placingFurniture = false
		},
		togglePaintingMode: function () {
			this.paintingFloors = !this.paintingFloors
			this.removeMoveableControls()
			this.addingLocation = false
			this.deletingLocations = false
			this.settingLocations = false
			this.placingFurniture = false
		},
		toggleLocationSettings: function () {
			this.settingLocations = !this.settingLocations
			this.removeMoveableControls()
			this.addingLocation = false
			this.deletingLocations = false
			this.placingFurniture = false
			this.paintingFloors = false
		},
		toggleFurnitureMode: function () {
			this.placingFurniture = !this.placingFurniture
			this.settingLocations = false
			this.removeMoveableControls()
			this.addingLocation = false
			this.deletingLocations = false
			this.paintingFloors = false
		},
		floorPlanClick: function () {
			this.removeMoveableControls()
		},
		deleteLocations: function () {
			this.deletingLocations = !this.deletingLocations
			this.removeMoveableControls()
			this.paintingFloors = false
			this.addingLocation = false
			this.settingLocations = false
			this.placingFurniture = false
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
			this.removeMoveableControls()
			this.paintingFloors = false
			this.deletingLocations = false
			this.settingLocations = false
			this.placingFurniture = false

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
					axios({
						method: 'get',
						url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${dialogue.data}/`,
						headers: {'auth': localStorage.getItem('apiToken')}
					}).then(response => {
						if ('location' in response.data) {
							self.$dialog.alert(self.$t('dialogs.bodies.locationNameOrSynonymAlreadyExist')).then()
						} else {
							self.addingLocation = true
							self.newLocationName = dialogue.data
						}
					})
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
				event.stopPropagation()

				const data = {
					name: this.newLocationName,
					parentLocation: 0,
					settings: {
						x: this.areaSelectorStartX,
						y: this.areaSelectorStartY,
						w: this.areaSelectorW || 150,
						h: this.areaSelectorH || 150,
						z: 0
					}
				}

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
		},
		addFurniture: function (parentId, x, y) {
			const data = {
				parentLocation: 0,
				settings: {
					'x': x,
					'y': y,
					'z': 0,
					'w': 25,
					'h': 25,
					'r': 0,
					't': this.activeFurnitureTile
				}
			}
			axios({
				method: 'put',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/`,
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
	},
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				if (to.path !== '/myhome') {
					this.removeMoveableControls()
				}
			}
		}
	}
}
