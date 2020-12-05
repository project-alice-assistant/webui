import axios from 'axios'

export default {
	name: 'location',
	props: [
		'location',
		'locations',
		'myHome'
	],
	methods: {
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
		stopPropagation: function (event) {
			event.stopPropagation()
		},
		handleClick: function (event) {
			if (!this.myHome.paintingFloors || this.myHome.activeFloorTile === '') return
			this.myHome.locations[this.location.id].settings['t'] = this.myHome.activeFloorTile
			this.save()
		},
		savePosition: function (x, y) {
			x = Math.ceil(x / 5) * 5
			y = Math.ceil(y / 5) * 5

			this.myHome.locations[this.location.id].settings['x'] = x
			this.myHome.locations[this.location.id].settings['y'] = y
			this.save()
		},
		saveSize: function (x, y, w, h) {
			x = Math.ceil(x / 5) * 5
			y = Math.ceil(y / 5) * 5
			w = Math.ceil(w / 5) * 5
			h = Math.ceil(h / 5) * 5

			this.myHome.locations[this.location.id].settings['x'] = x
			this.myHome.locations[this.location.id].settings['y'] = y
			this.myHome.locations[this.location.id].settings['w'] = w
			this.myHome.locations[this.location.id].settings['h'] = h
			this.save()
		},
		rename: function () {
			if (!this.myHome.locationsEditMode || this.myHome.addingLocation || this.myHome.paintingFloors) return

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
		deleteMe: function () {
			this.myHome.deleteLocation(this.location.id)
		}
	}
}
