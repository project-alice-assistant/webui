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
		'furnitures',
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
			}).then()
		},
		handleClick: function (event) {
			event.stopPropagation()
			this.myHome.removeDroppable()

			if (this.myHome.paintingFloors && this.myHome.activeFloorTile !== '') {
				this.myHome.locations[this.data.id].settings['t'] = this.myHome.activeFloorTile
				this.save()
			} else if (this.myHome.addingLocation) {

			} else if (this.myHome.placingFurniture) {
				if (this.myHome.activeFurnitureTile === '') return

				const data = {
					parentLocation: this.data.id,
					settings: {
						x: event.layerX,
						y: event.layerY,
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
				if (event.target.classList.contains('dragging')) return

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
					self.data.name = dialogue.data
					self.$set(self.myHome.locations, self.data.id, self.data)
					self.$forceUpdate()
					self.save()
				})
		},
		deleteMe: function (event) {
			event.stopPropagation()
			this.myHome.deleteLocation(this.data.id)
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
		},
		setPosition: function (target) {
			if (this.targetParentLocation !== 0 && this.data.parentLocation === 0) {
				const droppedIn = document.querySelector(`#loc_${this.targetParentLocation}`)
				this.datas[this.data.id].parentLocation = this.targetParentLocation
				this.datas[this.data.id].settings['x'] = parseInt(target.style.left.substring(-2)) - parseInt(droppedIn.style.left.substring(-2))
				this.datas[this.data.id].settings['y'] = parseInt(target.style.top.substring(-2)) - parseInt(droppedIn.style.top.substring(-2))
				this.targetParentLocation = 0
			}
		}
	}
}
