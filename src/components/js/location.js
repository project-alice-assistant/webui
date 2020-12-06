import axios from 'axios'

export default {
	name: 'location',
	data: function () {
		return {
			rotationDelta: 0,
			selected: false
		}
	},
	props: [
		'location',
		'locations',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			let style = ''

			style += `left:${this.location['settings']['x']}px;`
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
			if (this.myHome.paintingFloors && this.myHome.activeFloorTile !== '') {
				this.myHome.locations[this.location.id].settings['t'] = this.myHome.activeFloorTile
				this.save()
			} else if (!this.myHome.paintingFloors && this.myHome.locationsEditMode) {
				this.myHome.moveable.target = event.target
				this.myHome.moveable.props = this

				let self = this
				let locations = Array.from(document.querySelectorAll('.location'))
				locations.forEach(el => {
					if (parseInt(el.id) === self.location.id) {
						locations.splice(locations.indexOf(el), 1)
						return true
					}
				})
				this.myHome.moveable.elementGuidelines = locations
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
		handleDrag: function (target, left, top) {
			target.style.left = `${left}px`
			target.style.top = `${top}px`
		},
		handleResize(target, width, height) {
			target.style.width = `${width}px`
			target.style.height = `${height}px`
		},
		handleRotate(target, dist, transform) {
			this.rotationDelta = dist
			target.style.transform = transform
		},
		savePosition: function (target) {
			this.locations[this.location.id].settings['x'] = parseInt(target.style.left)
			this.locations[this.location.id].settings['y'] = parseInt(target.style.top)
			this.save()
		},
		saveSize: function (target) {
			this.locations[this.location.id].settings['w'] = parseInt(target.style.width)
			this.locations[this.location.id].settings['h'] = parseInt(target.style.height)
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
