import axios from 'axios'

export default {
	name: 'furniture',
	data: function () {
		return {
			rotationDelta: 0,
			hovered: false
		}
	},
	props: [
		'data',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			return this.myHome.moveableItem.computeMyHomeCustomStyle(
				this.data,
				`background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${this.data.settings['t'] || 'deco-1'}.png') no-repeat; background-size: 100% 100%;`
			)
		},
		save: function () {
			const data = {
				id: this.data.id,
				parentLocation: this.data.parentLocation,
				settings: this.data.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${this.data.id}/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then()
		},
		handleClick: function (event) {
			event.stopPropagation()
			this.myHome.removeDroppable()
			this.myHome.activeFurnitureTile = ''

			if (this.myHome.toolsState.placingFurniture) {
				this.myHome.setMoveable(event.target, this)
				this.myHome.moveableItem.setBoundaries(this.$el, 0)
				const furnitures = Array.from(document.querySelectorAll('.furniture')).filter((furniture, index, array) => {
					const furId = parseInt(furniture.id.substring(4))
					return !(furId === this.data.id);
				})
				this.myHome.moveableItem.setGuidelines(furnitures)
			}
		},
		deleteMe: function (event) {
			event.stopPropagation()
			axios({
				method: 'delete',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${this.data.id}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(response => {
				if ('success' in response.data && response.data.success) {
					this.myHome.$delete(this.myHome.furnitures, this.data.id)
				}
			})
		}
	}
}
