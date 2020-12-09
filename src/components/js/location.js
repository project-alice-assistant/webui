import axios from 'axios'
import Moveable from 'moveable'

export default {
	name: 'location',
	data: function () {
		return {
			rotationDelta: 0,
			moveable: new Moveable()
		}
	},
	props: [
		'location',
		'locations',
		'furnitures',
		'myHome'
	],
	methods: {
		newMoveable: function (target, prop) {
			this.moveable = new Moveable(document.body, {
				target: target,
				props: prop,
				container: this.$el,
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

			this.moveable.destroy()

			this.moveable.on('dragStart', ({target}) => {
				this.dragging = true
				this.moveable.props.startDrag(target)
			}).on('drag', ({target, left, top}) => {
				this.moveable.props.handleDrag(target, left, top)
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
			document.querySelectorAll('.droppable').forEach(el => {
				el.classList.remove('droppable')
			})
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
			} else if (!this.myHome.paintingFloors && this.myHome.locationsEditMode) {
				this.myHome.newMoveable(event.target, this)

				if (this.location.parentLocation !== 0) {
					const parent = document.querySelector(`#loc_${this.location.parentLocation}`)
					this.myHome.moveable.bounds = {
						top: parent.style.top,
						left: parent.style.left,
						bottom: parent.style.bottom,
						right: parent.style.right
					}
				}

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
						document.querySelectorAll('.droppable').forEach(el2 => {
							el2.classList.remove('droppable')
						})
						el.classList.add('droppable')
						break
					}
				} else {
					document.querySelectorAll('.droppable').forEach(el2 => {
						el2.classList.remove('droppable')
					})
				}
			}

			if (this.location.parentLocation === 0) {
				target.style.left = `${left}px`
				target.style.top = `${top}px`
			} else {
				target.style.left = `${left}px`
				target.style.top = `${top}px`
			}
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
			const droppedIn = document.querySelector('.droppable')

			if (!droppedIn) {
				this.locations[this.location.id].settings['x'] = parseInt(target.style.left.substring(-2))
				this.locations[this.location.id].settings['y'] = parseInt(target.style.top.substring(-2))
			} else {
				this.locations[this.location.id].parentLocation = parseInt(droppedIn.id.substring(4))
				this.locations[this.location.id].settings['x'] = parseInt(target.style.left.substring(-2)) - parseInt(droppedIn.style.left.substring(-2))
				this.locations[this.location.id].settings['y'] = parseInt(target.style.top.substring(-2)) - parseInt(droppedIn.style.top.substring(-2))
				this.locations[this.location.id].settings['z'] = 1
			}

			document.querySelectorAll('.droppable').forEach(el2 => {
				el2.classList.remove('droppable')
			})

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
