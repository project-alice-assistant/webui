import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import MoveableItem from './moveableItem'
import LeaderLine from 'leader-line-new'

export default {
	name: 'myhome',
	data: function () {
		return {
			uid: uuidv4(),
			me: '',
			menuItems: [
				{
					name: this.$t('tooltips.edit'),
					icon: 'fas fa-pen-square',
					isToggle: true,
					extendedIcon: 'fas fa-times-circle',
					extendedName: this.$t('tooltips.close'),
					onClose: this.closeEditor,
					onOpen: this.openEditor
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
			moveableItem: new MoveableItem(this),
			locationsEditMode: false,
			devicesEditMode: false,
			toolsState: {
				none: true,
				addingLocation: false,
				paintingFloors: false,
				deletingLocations: false,
				addingDevice: false,
				deletingDevices: false,
				settingDevices: false,
				linkingDevices: false,
				unlinkingDevices: false,
				settingLocations: false,
				placingFurniture: false,
				placingConstructions: false
			},
			newLocationName: '',
			activeFloorTile: '',
			activeFurnitureTile: '',
			activeConstructionTile: '',
			activeDeviceTile: '',
			areaSelectorX: 0,
			areaSelectorY: 0,
			areaSelectorStartX: 0,
			areaSelectorStartY: 0,
			areaSelectorW: 0,
			areaSelectorH: 0,
			clicked: false,
			dragging: false,
			draggingPlan: false,
			draggingPlanStartX: 0,
			draggingPlanStartY: 0,
			floorPlanX: 0,
			floorPlanY: 0,
			zoomLevel: 1.0,
			deviceLinkParent: null,
			newConnectionLink: null,
			connectionLinks: {},
			tourCallbacks: {
				onSkip: this.finishTour,
				onFinish: this.finishTour
			},
			steps: [
				{
					target: '[data-tour="0"]',
					header: {
						title: this.$t('tours.myHome.myHome')
					},
					content: this.$t('tours.myHome.data0'),
					params: {
						highlight: true,
						placement: 'bottom'
					},
					before: _type => new Promise((resolve) => {
						// Just wait for the default device to be shown at least
						setTimeout(resolve, 500)
					}),
				},
				{
					target: '[data-tour="1"]',
					content: this.$t('tours.myHome.data1'),
					params: {
						highlight: true
					}
				},
				{
					target: '[data-tour="2"]',
					content: this.$t('tours.myHome.data2'),
					params: {
						highlight: true
					}
				}
			]
		}
	},
	computed: {
		locations: function () {
			return Object.values(this.$store.state.locations).filter(location => {
				return location.parentLocation === 0
			})
		},
		ghostBackground: function () {
			let end = 'locations/floors/floor-80.png'
			if (this.activeFloorTile) {
				end = `locations/floors/${this.activeFloorTile}.png`
			} else if (this.activeFurnitureTile) {
				end = `furniture/${this.activeFurnitureTile}.png`
			} else if (this.activeConstructionTile) {
				end = `constructions/${this.activeConstructionTile}.png`
			} else if (this.activeDeviceTile) {
				end = `deviceTypes/${this.activeDeviceTile.skillName.toLowerCase()}/${this.activeDeviceTile.deviceTypeName.toLowerCase()}.png`
			}
			return `background-image: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/${end}');`
		},
		shownDeviceTypes: function () {
			let shownList = {}
			for (const [skill, types] of Object.entries(this.$store.state.deviceTypes)) {
				let possibles = []
				for (const typ of types) {
					if (this.canAddDevice(typ) && typ.deviceTypeName.toLowerCase() !== 'webinterface') {
						possibles.push(typ)
					}
				}
				if (possibles.length > 0) {
					shownList[skill] = possibles
				}
			}
			return shownList
		}
	},
	created: function () {
		this.me = this
		let self = this
		this.setActiveTool('none')

		document.addEventListener('keyup', function (event) {
			if (self.$route.path.toLowerCase() !== '/myhome') return
			if (event.key === 'Escape') {
				if (self.activeConstructionTile !== '' || self.activeFurnitureTile !== '' || self.activeFloorTile !== '' || self.activeDeviceTile !== '' || self.newConnectionLink) {
					self.activeConstructionTile = ''
					self.activeFurnitureTile = ''
					self.activeFloorTile = ''
					self.activeDeviceTile = ''
					if (self.newConnectionLink) {
						self.newConnectionLink.remove()
					}
					self.newConnectionLink = null
				} else if (!self.toolsState.none) {
					self.setActiveTool('none')
				} else {
					self.closeEditor()
				}
			}
		})

		document.addEventListener('wheel', function (event) {
			if (self.$route.path.toLowerCase() !== '/myhome') return
			if (event.deltaY > 1) {
				self.zoomLevel = Math.max(self.zoomLevel - 0.05, 0.1)
			} else {
				self.zoomLevel = Math.min(self.zoomLevel + 0.05, 3.0)
			}
			localStorage.setItem('zoomLevel', self.zoomLevel)
			self.moveableItem.destroyMoveable()
			self.refreshDeviceLinks()
		})


		document.addEventListener('contextmenu', function () {
			if (self.$route.path.toLowerCase() !== '/myhome') return

			if (self.activeDeviceTile) {
				self.activeDeviceTile = ''
			} else if (self.activeConstructionTile) {
				self.activeConstructionTile = ''
			} else if (self.activeFurnitureTile) {
				self.activeFurnitureTile = ''
			} else if (self.activeFloorTile) {
				self.activeFloorTile = ''
			} else if (self.newConnectionLink) {
				self.newConnectionLink.remove()
				self.newConnectionLink = null
			} else if (!self.toolsState.none) {
				self.setActiveTool('none')
			} else {
				self.closeEditor()
			}
		})

		this.floorPlanX = parseInt(localStorage.getItem('floorPlanX')) || 0
		this.floorPlanY = parseInt(localStorage.getItem('floorPlanY')) || 0
		this.zoomLevel = parseFloat(localStorage.getItem('zoomLevel')) || 1.0
	},
	mounted: function () {
		if (!localStorage.getItem('myHomeTourCompleted')) {
			this.$tours['myHome'].start()
		}

		this.areaSelector = this.$refs.areaSelector
		this.positionCenterPointer()

		let self = this
		this.$watch(
			() => {
				return this.devicesEditMode
			},
			(newVal, _oldVal) => {
				if (newVal) {
					for (const link of Object.values(self.connectionLinks)) {
						link.show('draw')
					}
				} else {
					for (const link of Object.values(self.connectionLinks)) {
						link.hide('fade')
					}
				}
			},
			{
				deep: true
			}
		)
	},
	activated: function () {
		//this.uid = uuidv4()
	},
	methods: {
		finishTour: function () {
			localStorage.setItem('myHomeTourCompleted', true)
		},
		recenter: function () {
			this.floorPlanX = 0
			this.floorPlanY = 0
			this.zoomLevel = 1.0
			localStorage.setItem('floorPlanX', 0)
			localStorage.setItem('floorPlanY', 0)
			localStorage.setItem('zoomLevel', self.zoomLevel)
			this.refreshDeviceLinks()
		},
		checkDevicePerLocationLimit(deviceType, locationId) {
			const perLocationLimit = deviceType.perLocationLimit

			if (perLocationLimit === 0) {
				return true
			} else {
				let count = 0
				for (const device of Object.values(this.$store.state.devices)) {
					if (device.skillName === deviceType.skillName && device.deviceType === deviceType.deviceTypeName && device.parentLocation === locationId) {
						count++
					}
				}
				return count < perLocationLimit
			}
		},
		canAddDevice:
			function (deviceType) {
				if (deviceType.totalDeviceLimit > 0) {
					let count = 0
					for (const device of Object.values(this.$store.state.devices)) {
						if (deviceType.skillName === device.skillName && deviceType.deviceTypeName === device.typeName) {
							count++
						}
					}
					return count < deviceType.totalDeviceLimit
				}
				return true
		},
		getDeviceType: function (device) {
			const skillName = device.data.skillName.toLowerCase()
			const deviceTypeName = device.data.typeName.toLowerCase()
			if (!skillName in this.$store.state.deviceTypes) {
				return null
			}

			for (const deviceType of this.$store.state.deviceTypes[skillName]) {
				if (deviceType.deviceTypeName.toLowerCase() === deviceTypeName) {
					return deviceType
				}
			}

			return null
		},
		drawDeviceLinks: function ({specificLinkId, specificDeviceId, specificLocationId} = {}) {
			for (const link of Object.values(this.$store.state.deviceLinks)) {
				if ((specificLinkId !== undefined && link.id !== specificLinkId) ||
					(specificDeviceId !== undefined && link.deviceId !== specificDeviceId) ||
					(specificLocationId !== undefined && link.targetLocation !== specificLocationId)) continue

				let device = null
				for (const location of this.$children.filter(loc => loc.$options.name === 'location')) {
					device = location.$children.find(dev => dev.$options.name === 'device' && dev.data.id === link.deviceId)
					if (device) break
				}

				if (!device) continue

				this.newDeviceLink(link, device)
			}
		},
		newDeviceLink(link, device) {
			const label = LeaderLine.captionLabel(this.$store.state.locations[link.targetLocation].name)
			const targetLocation = document.querySelector(`#loc_${link.targetLocation}`)
			const line = new LeaderLine(
				device.$el,
				LeaderLine.pointAnchor(targetLocation, {
					x: targetLocation.style.width / 2,
					y: targetLocation.style.height / 2
				}),
				{
					color: '#343434',
					size: 3,
					dash: {
						animation: {
							duration: 250,
							timing: 'linear'
						}
					},
					dropShadow: true,
					endPlug: 'disc',
					endPlugSize: 3,
					hide: true,
					middleLabel: label
				}
			)
			device.myLinks[link.id] = line
			if(device.data['parentLocation'] !== link.targetLocation) {
				this.connectionLinks[link.id] = line
			}

			if (this.devicesEditMode && device.data['parentLocation'] !== link.targetLocation) {
				line.show('draw')
			}
		},
		refreshDeviceLinks: function () {
			for (const link of Object.values(this.connectionLinks)) {
				link.position()
			}
		},
		setActiveTool: function (tool, isToggle) {
			const self = this
			Object.keys(this.toolsState).forEach(function (key, _value) {
				if (key === tool) {
					if (isToggle) {
						return self.toolsState[key] = !self.toolsState[key]
					} else {
						return self.toolsState[key] = true
					}
				} else {
					return self.toolsState[key] = false
				}
			})

			let result = false
			for (let i in this.toolsState)
				if (this.toolsState[i] === true) {
					result = true
				}

			if (!result) {
				self.toolsState['none'] = true
			}

			if (this.newConnectionLink) {
				this.newConnectionLink.remove()
				this.newConnectionLink = null
			}
			this.moveableItem.destroyMoveable()
			this.removeDroppable()
			this.activeFloorTile = ''
			this.activeFurnitureTile = ''
			this.activeConstructionTile = ''
			this.activeDeviceTile = ''
		},
		removeDroppable: function () {
			document.querySelectorAll('.droppable').forEach(el => {
				el.classList.remove('droppable')
			})
			document.querySelectorAll('.notDroppable').forEach(el => {
				el.classList.remove('notDroppable')
			})
		},
		setMoveable: function (target, prop) {
			this.moveableItem.setMoveable(target, prop)
		},
		cinemaMode: function () {
			this.$store.commit('toggleCinemaMode')
			if (this.$store.state.fullScreen) {
				this.showInfo(this.$t('notifications.info.theaterModeExplain'))
			}
		},
		setLocationsEditMode: function () {
			this.locationsEditMode = true
			this.devicesEditMode = false
			this.setActiveTool('none')
		},
		setDevicesEditMode: function () {
			this.locationsEditMode = false
			this.devicesEditMode = true
			this.setActiveTool('none')
		},
		openEditor: function () {
			if (Object.keys(this.connectionLinks).length === 0) {
				this.drawDeviceLinks()
			}
		},
		closeEditor: function () {
			this.setActiveTool('none')
			this.locationsEditMode = false
			this.devicesEditMode = false
			this.moveableItem.destroyMoveable()
			this.removeDroppable()
		},
		removeConnectionLinks: function () {
			for (const link of Object.values(this.connectionLinks)) {
				link.remove()
			}
			this.connectionLinks = {}
		},
		floorPlanClick: function () {
			this.moveableItem.destroyMoveable()
		},
		addLocationDialog: function () {
			this.setActiveTool('none')

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
						method: 'GET',
						url: `http://${self.$store.state.settings['aliceIp']}:${self.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${dialogue.data}/`,
						headers: {'auth': self.$store.getters.apiToken}
					}).then(response => {
						if ('location' in response.data) {
							self.$dialog.alert(self.$t('dialogs.bodies.locationNameOrSynonymAlreadyExist')).then()
						} else {
							self.setActiveTool('addingLocation')
							self.newLocationName = dialogue.data
						}
					})
				})
				.catch(function () {
					self.setActiveTool('locationsEditMode')
					self.newLocationName = ''
				})
		},
		addDeviceDialog: function () {
			this.setActiveTool('none')

			let self = this
			const message = {}
			const options = {
				view: 'addDevicePromptDialog',
				parent: this
			}

			this.$dialog.prompt(message, options).then(dialogue => {
				if (!dialogue.data) return
				self.setActiveTool('addingDevice')
				self.activeDeviceTile = dialogue.data
			}).catch()
		},
		positionCenterPointer: function () {
			const center = this.$refs['center'].getBoundingClientRect()
			const centerPointer = this.$refs['centerPointer'].getBoundingClientRect()
			const angle = Math.atan2(centerPointer.top + 17 - center.top, centerPointer.left + 17 - center.left) - (135 * Math.PI / 180)
			this.$refs['centerPointer'].style.transform = `rotate(${angle}rad)`
		},
		mouseDown: function (event) {
			if (this.toolsState.addingLocation) {
				this.clicked = true
				this.areaSelectorStartX = event.offsetX
				this.areaSelectorStartY = event.offsetY
				this.drawSelectionArea(this.areaSelectorStartX, this.areaSelectorStartY)
			} else if (event.target.classList.contains('floorPlan') && this.toolsState.none) {
				event.target.classList.add('grabbed')
				this.draggingPlan = true
				this.draggingPlanStartX = event.clientX
				this.draggingPlanStartY = event.clientY
			}
		},
		mouseMove: function (event) {
			if (this.toolsState.addingLocation) {
				if (!this.clicked) return
				this.drawSelectionArea(event.offsetX, event.offsetY)
			} else if (this.draggingPlan) {
				this.floorPlanX += event.clientX - this.draggingPlanStartX
				this.floorPlanY += event.clientY - this.draggingPlanStartY

				this.draggingPlanStartX = event.clientX
				this.draggingPlanStartY = event.clientY
				this.refreshDeviceLinks()
				this.positionCenterPointer()
			} else if ((this.toolsState.paintingFloors && this.activeFloorTile !== '')
				|| (this.toolsState.placingFurniture && this.activeFurnitureTile !== '')
				|| (this.toolsState.placingConstructions && this.activeConstructionTile !== '')
				|| (this.toolsState.addingDevice && this.activeDeviceTile !== '')
				|| (this.toolsState.linkingDevices)
				|| (this.toolsState.unlinkingDevices)) {
				const rect = this.$refs['myHomeEditor'].getBoundingClientRect()
				this.$refs['ghost'].style.top = `${event.clientY - 25 - rect.top}px`
				this.$refs['ghost'].style.left = `${event.clientX - 25 - rect.left}px`
				if (this.newConnectionLink !== null) {
					this.newConnectionLink.position()
				}
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
		newConnectionLine: function (device) {
			this.deviceLinkParent = device
			this.newConnectionLink = new LeaderLine(
				document.querySelector(`#dev_${device.data.id}`),
				this.$refs.ghost,
				{
					color: 'blue',
					size: 4,
					dash: {
						animation: {
							duration: 250,
							timing: 'linear'
						}
					},
					dropShadow: true
				}
			)
		},
		newDisconnectionLine: function (device) {
			this.deviceLinkParent = device
			this.newConnectionLink = new LeaderLine(
				document.querySelector(`#dev_${device.data.id}`),
				this.$refs.ghost,
				{
					color: 'red',
					size: 4,
					dash: {
						animation: {
							duration: 100,
							timing: 'linear'
						}
					},
					dropShadow: true
				}
			)
		},
		handleClick: function (event) {
			this.clicked = false
			if (this.toolsState.addingLocation) {
				event.preventDefault()
				event.stopPropagation()

				const data = {
					name: this.newLocationName,
					parentLocation: 0,
					settings: {
						x: this.areaSelectorStartX,
						y: this.areaSelectorStartY,
						w: Math.max(this.areaSelectorW || 150, 50),
						h: Math.max(this.areaSelectorH || 150, 50)
					}
				}

				this.areaSelectorX = 0
				this.areaSelectorY = 0
				this.areaSelectorStartX = 0
				this.areaSelectorStartY = 0
				this.areaSelectorW = 0
				this.areaSelectorH = 0
				this.newLocationName = ''

				this.setActiveTool('locationsEditMode')

				axios({
					method: 'PUT',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/`,
					data: data,
					headers: {
						'auth': this.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(response => {
					if ('location' in response.data) {
						let loc = response.data['location']
						this.$set(this.$store.state.locations, loc.id, loc)
					}
				})
			} else if (this.draggingPlan) {
				event.target.classList.remove('grabbed')
				localStorage.setItem('floorPlanX', this.floorPlanX)
				localStorage.setItem('floorPlanY', this.floorPlanY)
				this.draggingPlan = false
			}
		},
		moveZUp(location) {
			const data = location.data
			const myIndex = data.settings['z']
			const myNewIndex = myIndex + 1;

			if (myNewIndex > this.$store.state.locations.length) {
				return
			}

			for (const loc of Object.values(this.$store.state.locations)) {
				if (loc.settings['z'] === myNewIndex) {
					loc.settings['z'] -= 1
					data.settings['z'] = myNewIndex
					this.saveLocationSettings(loc)
					this.saveLocationSettings(location)
					return
				}
			}
		},
		moveZDown(location) {
			const data = location.data
			const myIndex = data.settings['z']
			const myNewIndex = myIndex - 1;

			if (data.parentLocation > 0) {
				const parent = document.querySelector(`#loc_${data.parentLocation}`)
				if (myNewIndex <= parseInt(parent.style['z-index'])) {
					return
				}
			}

			if (myNewIndex < 0) {
				return
			}

			for (const loc of Object.values(this.$store.state.locations)) {
				if (loc.settings['z'] === myNewIndex) {
					loc.settings['z'] += 1
					data.settings['z'] = myNewIndex
					this.saveLocationSettings(loc)
					this.saveLocationSettings(data)
					return
				}
			}
		},
		saveLocationSettings(location) {
			const data = {
				id: location.id,
				settings: location.settings
			}

			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${data.id}/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then()
		},
		checkIfSynonymIsFree(synonym) {
			for (const location of Object.values(this.$store.state.locations)) {
				if (location.name.toLowerCase() === synonym.toLowerCase()) return false

				for (const locationSynonym of location.synonyms) {
					if (locationSynonym.toLowerCase() === synonym.toLowerCase()) return false
				}
			}
			return true
		},
		removeDeviceLink(deviceId, locationId) {
			for (const link of Object.values(this.$store.state.deviceLinks)) {
				if (link.deviceId === deviceId && link.targetLocation === locationId) {
					this.connectionLinks[link.id].remove()
					delete this.connectionLinks[link.id]
					this.$delete(this.$store.state.deviceLinks, link.id)
					return link.id
				}
			}
		},
		removeDeviceLinks(deviceId) {
			for (const link of Object.values(this.$store.state.deviceLinks)) {
				if (link.deviceId === deviceId) {
					this.connectionLinks[link.id].remove()
					delete this.connectionLinks[link.id]
					this.$delete(this.$store.state.deviceLinks, link.id)
				}
			}
			this.refreshDeviceLinks()
		},
		deleteDevice(deviceId) {
			this.$delete(this.$store.state.devices, deviceId)
			this.removeDeviceLinks(deviceId)
		},
		getDeviceLinks(deviceId) {
			let ret = {}
			for (const link of Object.values(this.$store.state.deviceLinks)) {
				if (link.deviceId === deviceId) {
					ret[link.id] = link
				}
			}
			return ret
		}
	},
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				if (to.path !== '/myhome') {
					this.closeEditor()
					this.removeConnectionLinks()
				}
			}
		}
	}
}
