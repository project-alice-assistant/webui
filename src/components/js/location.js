import axios from 'axios'

export default {
	name: 'location',
	data: function () {
		return {
			rotationDelta: 0,
			targetParentLocation: 0
		}
	},
	props: [
		'data',
		'locations',
		'constructions',
		'furnitures',
		'devices',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			return this.myHome.moveableItem.computeCustomStyle(
				this.data,
				`background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${this.data.settings['t'] || 'floor-80'}.png');background-color: var(--windowBG);`
			)
		},
		save: function () {
			const data = {
				id: this.data.id,
				name: this.data.name,
				parentLocation: this.data.parentLocation,
				synonyms: this.data.synonyms,
				settings: this.data.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${this.data.id}/`,
				data: data,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'content-type': 'application/json'
				}
			}).then(response => {
					this.checkResponse(response)
				}
			)
		},
		handleClick: function (event) {
			event.stopPropagation()
			this.myHome.removeDroppable()
			const self = this

			if (this.myHome.toolsState.paintingFloors && this.myHome.activeFloorTile !== '') {
				this.myHome.locations[this.data.id].settings['t'] = this.myHome.activeFloorTile
				this.save()
			} else if (this.myHome.toolsState.addingDevice && this.myHome.activeDeviceTile !== '') {
				if (!this.myHome.checkDevicePerLocationLimit(this.myHome.activeDeviceTile, this.data.id)) return

				const data = {
					deviceType: this.myHome.activeDeviceTile.deviceTypeName,
					skillName: this.myHome.activeDeviceTile.skillName,
					parentLocation: this.data.id,
					settings: {
						x: event.layerX - 25,
						y: event.layerY - 25
					}
				}

				axios({
					method: 'put',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/devices/`,
					data: data,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'content-type': 'application/json'
					}
				}).then(response => {
					if (this.checkResponse(response)) {
						if ('device' in response.data) {
							let device = response.data['device']
							this.myHome.$set(this.myHome.devices, device.id, device)

							for (const link of Object.values(response.data.link)) {
								this.myHome.$set(this.myHome.deviceLinks, link.id, link)
								setTimeout(function () {
									self.myHome.drawDeviceLinks({specificLinkId: link.id})
								}, 1000)
							}
						}
					}
					this.myHome.setActiveTool('none')
				})
			} else if (this.myHome.toolsState.placingFurniture) {
				if (this.myHome.activeFurnitureTile === '') return

				const data = {
					parentLocation: this.data.id,
					settings: {
						x: event.layerX - 25,
						y: event.layerY - 25,
						w: 50,
						h: 50,
						z: 0,
						r: 0,
						t: this.myHome.activeFurnitureTile
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
					if(this.checkResponse(response)){
						if ('furniture' in response.data) {
							let furniture = response.data['furniture']
							this.myHome.$set(this.myHome.furnitures, furniture.id, furniture)
						}
					}
				})
			} else if (this.myHome.toolsState.placingConstructions) {
				if (this.myHome.activeConstructionTile === '') return
				const data = {
					parentLocation: this.data.id,
					settings: {
						x: event.layerX - 25,
						y: event.layerY - 25,
						w: 50,
						h: 50,
						r: 0,
						t: this.myHome.activeConstructionTile,
						b: ''
					}
				}

				axios({
					method: 'put',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/constructions/`,
					data: data,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'content-type': 'application/json'
					}
				}).then(response => {
					if(this.checkResponse(response)) {
						if ('construction' in response.data) {
							let construction = response.data['construction']
							this.myHome.$set(this.myHome.constructions, construction.id, construction)
						}
					}
				})
			} else if (this.myHome.toolsState.linkingDevices && this.myHome.newConnectionLink !== null) {
				if (!this.checkDeviceLinkPossible(true)) {
					return
				}

				const data = {
					targetLocation: this.data.id,
					deviceId: parseInt(this.myHome.newConnectionLink.start.id.substring(4))
				}

				axios({
					method: 'put',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/deviceLinks/`,
					data: data,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'content-type': 'application/json'
					}
				}).then(response => {
					if(this.checkResponse(response)){
						if ('link' in response.data) {
							let link = response.data['link']
							this.myHome.$set(this.myHome.deviceLinks, link.id, link)
							this.myHome.drawDeviceLinks({specificLinkId: link.id})
							this.showSuccess(this.$t('notifications.success.deviceLinked'))
						}
					} else {
						this.myHome.setActiveTool('none')
						this.showError(this.$t('notifications.error.deviceLinked'))
					}
				})
			} else if (this.myHome.toolsState.unlinkingDevices && this.myHome.newConnectionLink !== null) {
				if (!this.isDeviceLinkedToMe(parseInt(this.myHome.newConnectionLink.start.id.substring(4)))) {
					this.showInfo(this.$t('notifications.info.deviceNotLinkedToLocation'))
					return
				}

				const data = {
					targetLocation: this.data.id,
					deviceId: parseInt(this.myHome.newConnectionLink.start.id.substring(4))
				}

				axios({
					method: 'delete',
					url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/deviceLinks/`,
					data: data,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'content-type': 'application/json'
					}
				}).then(response => {
					if (this.checkResponse(response)) {
						this.showSuccess(this.$t('notifications.successes.deviceUnlinked'))
						const linkId = this.myHome.removeDeviceLink(parseInt(this.myHome.newConnectionLink.start.id.substring(4)), this.data.id)
						delete this.myHome.deviceLinkParent.myLinks[linkId]
					} else {
						this.showError(this.$t('notifications.errors.deviceUnlinkFailed'))
					}
				})
			} else if (!this.myHome.toolsState.settingLocations && !this.myHome.toolsState.deletingLocations && !this.myHome.toolsState.paintingFloors && this.myHome.locationsEditMode) {
				if (event.target.classList.contains('dragging') || !event.target.classList.contains('location')) return

				this.myHome.setMoveable(event.target, this)
				this.myHome.moveableItem.setBoundaries(this.$el, 10)
				const locations = Array.from(document.querySelectorAll('.location')).filter((location, index, array) => {
					const locId = parseInt(location.id.substring(4))
					return !(locId === this.data.id || this.myHome.locations[locId].parentLocation === this.data.id);
				})
				this.myHome.moveableItem.setGuidelines(locations)
			}
		},
		rename: function (event) {
			if (this.myHome.moveableItem.timeout === Math.floor(new Date().getTime()/250) || !this.myHome.locationsEditMode || this.myHome.toolsState.addingLocation || this.myHome.toolsState.paintingFloors) return
			event.stopPropagation()

			let self = this
			this.$dialog
				.prompt({
					title: this.$t('dialogs.titles.enterNewLocationName'),
					body: ''
				}, {
					promptHelp: '',
					okText: this.$t('buttons.ok'),
					cancelText: this.$t('buttons.cancel')
				})
				.then(function (dialogue) {
					if(dialogue.data === ''){
						self.showError('The name can\'t be empty')
						return
					}
					self.data.name = dialogue.data
					self.$set(self.myHome.locations, self.data.id, self.data)
					self.$forceUpdate()
					self.save()
				})
		},
		deleteMe: function (event) {
			event.stopPropagation()
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${this.data.id}/`,
				headers: {'auth': localStorage.getItem('apiToken')}
			}).then(response => {
				if (this.checkResponse(response)) {
					this.myHome.$delete(this.locations, this.data.id)
					this.showSuccess(this.$t('notifications.successes.locationDeleted'))
				} else {
					this.showError(this.$t('notifications.errors.locationDeleted'))
				}
			})
		},
		handleDrag: function (target, left, top, clientX, clientY) {
			const elementsBelow = document.elementsFromPoint(clientX, clientY)
			for (const el of elementsBelow) {
				if (el.classList.contains('location')) {
					const elementId = parseInt(el.id.substring(4))
					if (el !== this.$el && elementId !== this.data.parentLocation) {
						this.myHome.removeDroppable()
						el.classList.add('droppable')
						this.targetParentLocation = elementId
						break
					}
				} else {
					this.targetParentLocation = 0
					this.myHome.removeDroppable()
				}
			}
			this.myHome.refreshDeviceLinks()
			throw true
		},
		setPosition: function (target) {
			try {
				if (this.targetParentLocation !== 0 && this.data.parentLocation !== this.targetParentLocation) {
					for (const location of Object.entries(this.myHome.locations)) {
						// Prevent cyclic nesting, parent in child
						if (location.parentLocation === this.data.id) return
					}

					const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
					this.myHome.locations[this.data.id].parentLocation = this.targetParentLocation
					this.myHome.locations[this.data.id].settings['x'] = parseInt(target.style.left.substring(-2)) - parseInt(droppedIn.style.left.substring(-2))
					this.myHome.locations[this.data.id].settings['y'] = parseInt(target.style.top.substring(-2)) - parseInt(droppedIn.style.top.substring(-2))
					this.targetParentLocation = 0
				} else {
					this.myHome.locations[this.data.id].settings['x'] = parseInt(target.style.left.substring(-2))
					this.myHome.locations[this.data.id].settings['y'] = parseInt(target.style.top.substring(-2))
					return true
				}
			} catch (e) {
				this.showError(this.$t('notifications.successes.uiError'))
				console.log(e)
				throw e
			}
		},
		moveZUp() {
			this.myHome.moveZUp(this)
		},
		moveZDown() {
			this.myHome.moveZDown(this)
		},
		openSettings() {
			let self = this
			this.settings = false

			const message = {}
			const options = {
				view: 'locationSettingsPromptDialog',
				data: this.data,
				parent: this
			}

			this.$dialog.prompt(message, options).then(() => {
				self.save()
			}).catch()
		},
		checkDeviceLinkPossible(showError = false) {
			try {
				const device = this.myHome.deviceLinkParent
				const deviceType = this.myHome.getDeviceType(device)

				if (!deviceType.allowLocationLinks) {
					if (showError) this.showError(this.$t('notifications.successes.cannotLinkDevice'))
					return false
				}

				for (const link of Object.values(this.myHome.deviceLinks)) {
					if (link.deviceId === device.data.id && link.targetLocation === this.data.id) {
						if (showError) this.showError(this.$t('notifications.successes.deviceAlreadyLinkedToLocation'))
						return false
					}
				}
			} catch {
				if (showError) this.showError(this.$t('notifications.successes.unexpectedServerError'))
				return false
			}
			return true
		},
		isDeviceLinkedToMe(deviceId) {
			for (const link of Object.values(this.myHome.deviceLinks)) {
				if (link.deviceId === deviceId && link.targetLocation === this.data.id) {
					return true
				}
			}
			return false
		},
		onMouseEnter() {
			if (this.myHome.toolsState.addingDevice) {
				if (this.myHome.checkDevicePerLocationLimit(this.myHome.activeDeviceTile, this.data.id)) {
					this.$el.classList.add('droppable')
				} else {
					this.$el.classList.add('notDroppable')
				}
			} else if (this.myHome.toolsState.linkingDevices && this.myHome.newConnectionLink) {
				if (!this.checkDeviceLinkPossible()) {
					this.$el.classList.add('notDroppable')
				} else {
					this.$el.classList.add('droppable')
				}
			}
		},
		onMouseLeave() {
			this.$el.classList.remove('droppable')
			this.$el.classList.remove('notDroppable')
		}
	}
}
