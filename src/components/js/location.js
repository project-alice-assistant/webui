import axios from 'axios'
import Moveable from 'moveable'

export default {
	name: 'location',
	data: function () {
		return {
			rotationDelta: 0,
			moveable: new Moveable(),
			targetParentLocation: 0
		}
	},
	props: [
		'location',
		'locations',
		'furnitures',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			let style = `left:${this.location['settings']['x']}px;`
			style += `top:${this.location['settings']['y']}px;`
			style += `width:${this.location['settings']['w']}px;`
			style += `height:${this.location['settings']['h']}px;`
			style += `transform:rotate(${this.location['settings']['r']}deg);`
			style += `background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${this.location.settings['t'] || 'floor-80'}.png');`
			style += `background-color: var(--windowBG)`

			return style
		},
		save: function () {
			const data = {
				id: this.location.id,
				name: this.location.name,
				parentLocation: this.location.parentLocation,
				synonyms: this.location.synonyms,
				settings: this.location.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/${this.location.id}/`,
				data: data,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'content-type': 'application/json'
				}
			}).then(response => {
			})
		},
		handleClick: function (event) {
			event.stopPropagation()
			this.myHome.removeDroppable()

			if (this.myHome.paintingFloors && this.myHome.activeFloorTile !== '') {
				this.myHome.locations[this.location.id].settings['t'] = this.myHome.activeFloorTile
				this.save()
			} else if (this.myHome.addingLocation) {

			} else if (this.myHome.placingFurniture) {
				if (this.myHome.activeFurnitureTile === '') return

				const data = {
					parentLocation: this.location.id,
					settings: {
						x: 0,
						y: 0,
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
					if ('furniture' in response.data) {
						let furniture = response.data['furniture']
						this.myHome.$set(this.myHome.furnitures, furniture.id, furniture)
					}
				})
			} else if (!this.myHome.settingLocations && !this.myHome.deletingLocations && !this.myHome.paintingFloors && this.myHome.locationsEditMode) {
				if (event.target.classList.contains('dragging')) {
					this.savePosition(event.target)
					return
				}

				this.myHome.newMoveable(event.target, this)

				// if (this.location.parentLocation !== 0) {
				// 	const parent = document.querySelector(`#loc_${this.location.parentLocation}`)
				// 	const parentXMin = parseInt(parent.style.left.substring(-2))
				// 	const parentYMin = parseInt(parent.style.left.substring(-2))
				// 	const parentXMax = parentXMin + parseInt(parent.style.width.substring(-2))
				// 	const parentYMax = parentYMin + parseInt(parent.style.height.substring(-2))
				// 	this.myHome.moveable.bounds = {
				// 		left: parentXMin,
				// 		right: parentXMax,
				// 		top: parentYMin,
				// 		bottom: parentYMax
				// 	}
				// }

				let self = this
				let locations = Array.from(document.querySelectorAll('.location'))
				locations.forEach(el => {
					if (parseInt(el.id.substring(4)) === self.location.id) {
						locations.splice(locations.indexOf(el), 1)
						return true
					}
				})
				this.myHome.moveable.elementGuidelines = locations
			}
		},
		startDrag: function (target) {
			target.classList.add('dragging')
		},
		rename: function (event) {
			if (!this.myHome.locationsEditMode || this.myHome.addingLocation || this.myHome.paintingFloors) return
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
					self.location.name = dialogue.data
					self.$set(self.myHome.locations, self.location.id, self.location)
					self.$forceUpdate()
					self.save()
				})
		},
		deleteMe: function (event) {
			event.stopPropagation()
			this.myHome.deleteLocation(this.location.id)
		},
		handleDrag: function (target, left, top, clientX, clientY) {
			const elementsBelow = document.elementsFromPoint(clientX, clientY)
			for (const el of elementsBelow) {
				if (el.classList.contains('location')) {
					const elementId = parseInt(el.id.substring(4))
					if (el !== this.$el && elementId !== this.location.parentLocation) {
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

			if (this.location.parentLocation !== 0) {
				const parent = document.querySelector(`#loc_${this.location.parentLocation}`)
				const parentXMin = parseInt(parent.style.left.substring(-2))
				const parentYMin = parseInt(parent.style.left.substring(-2))
				const parentXMax = parentXMin + parseInt(parent.style.width.substring(-2))
				const parentYMax = parentYMin + parseInt(parent.style.height.substring(-2))

				if ((left + parentXMin < parentXMin) || (left + parentXMin + parseInt(target.style.width.substring(-2)) > parentXMax) || (top + parentYMin < parentYMin) || (top + parentYMin + parseInt(target.style.height.substring(-2)) > parentYMax)) {
					return
				}
			}

			target.style.left = `${left}px`
			target.style.top = `${top}px`
		},
		checkBoundaries: function (target) {
			return true
			if (this.location.parentLocation !== 0) {
				const parent = document.querySelector(`#loc_${this.location.parentLocation}`)
				const parentXMin = parseInt(parent.style.left.substring(-2))
				const parentYMin = parseInt(parent.style.left.substring(-2))
				const parentXMax = parentXMin + parseInt(parent.style.width.substring(-2))
				const parentYMax = parentYMin + parseInt(parent.style.height.substring(-2))

				if ((left + parentXMin < parentXMin) || (left + parentXMin + parseInt(target.style.width.substring(-2)) > parentXMax) || (top + parentYMin < parentYMin) || (top + parentYMin + parseInt(target.style.height.substring(-2)) > parentYMax)) {
					return false
				}

				return true
			}
			return true
		},
		handleResize(target, width, height, delta, direction) {
			if (direction[0] === -1) {
				let posX = parseInt(target.style.left.slice(0, -2)) - delta[0]
				target.style.left = `${posX}px`
			}
			if (direction[1] === -1) {
				let posY = parseInt(target.style.top.slice(0, -2)) - delta[1]
				target.style.top = `${posY}px`
			}
			target.style.width = `${width}px`
			target.style.height = `${height}px`
		},
		handleRotate(target, dist, transform) {
			this.rotationDelta = dist
			target.style.transform = transform
		},
		savePosition: function (target) {
			if (this.targetParentLocation === 0 || this.location.parentLocation !== 0) {
				this.locations[this.location.id].settings['x'] = parseInt(target.style.left.substring(-2))
				this.locations[this.location.id].settings['y'] = parseInt(target.style.top.substring(-2))
			} else {
				const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
				this.locations[this.location.id].parentLocation = this.targetParentLocation
				this.locations[this.location.id].settings['x'] = parseInt(target.style.left.substring(-2)) - parseInt(droppedIn.style.left.substring(-2))
				this.locations[this.location.id].settings['y'] = parseInt(target.style.top.substring(-2)) - parseInt(droppedIn.style.top.substring(-2))
				this.locations[this.location.id].settings['z'] = 10
				this.targetParentLocation = 0
			}

			this.myHome.removeDroppable()
			target.classList.remove('dragging')
			this.save()
		},
		saveSize: function (target) {
			this.locations[this.location.id].settings['x'] = parseInt(target.style.left.substring(-2))
			this.locations[this.location.id].settings['y'] = parseInt(target.style.top.substring(-2))
			this.locations[this.location.id].settings['w'] = parseInt(target.style.width.substring(-2))
			this.locations[this.location.id].settings['h'] = parseInt(target.style.height.substring(-2))
			this.save()
		},
		saveRotation: function () {
			if (this.locations[this.location.id].settings['r'] === 0) {
				this.locations[this.location.id].settings['r'] = this.rotationDelta
			} else {
				this.locations[this.location.id].settings['r'] = this.locations[this.location.id].settings['r'] + this.rotationDelta
			}
			this.rotationDelta = 0
			this.save()
		}
	}
}
