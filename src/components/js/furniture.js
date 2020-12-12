import axios from 'axios'

export default {
	name: 'furniture',
	data: function () {
		return {
			rotationDelta: 0
		}
	},
	props: [
		'furniture',
		'myHome'
	],
	methods: {
		computeCustomStyle: function () {
			let style = `left:${this.furniture['settings']['x']}px;`
			style += `top:${this.furniture['settings']['y']}px;`
			style += `width:${this.furniture['settings']['w']}px;`
			style += `height:${this.furniture['settings']['h']}px;`
			style += `transform:rotate(${this.furniture['settings']['r']}deg);`
			style += `background: url('http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${this.furniture.settings['t'] || 'deco-1'}.png') no-repeat; background-size: 100% 100%;`

			return style
		},
		save: function () {
			const data = {
				id: this.furniture.id,
				parentLocation: this.furniture.parentLocation,
				settings: this.furniture.settings
			}

			axios({
				method: 'patch',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${this.furniture.id}/`,
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

			if (this.myHome.placingFurniture) {
				this.$parent.newMoveable(event.target, this)

				const parent = document.querySelector(`#loc_${this.furniture.parentLocation}`)
				this.$parent.moveable.bounds = {
					top: 0,
					left: 0,
					bottom: parseInt(parent.style.height.substring(-2)),
					right: parseInt(parent.style.width.substring(-2))
				}

				let self = this
				let furnitures = Array.from(document.querySelectorAll('.furniture'))
				furnitures.forEach(el => {
					if (parseInt(el.id.substring(4)) === self.furniture.id) {
						furnitures.splice(furnitures.indexOf(el), 1)
						return true
					}
				})
				this.$parent.moveable.elementGuidelines = furnitures
			}
		},
		startDrag: function (target) {
			target.classList.add('dragging')
		},
		deleteMe: function (event) {
			event.stopPropagation()
			this.myHome.deleteFurniture(this.furniture.id)
		},
		handleDrag: function (target, left, top) {
			target.style.left = `${left}px`
			target.style.top = `${top}px`
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
			this.$parent.furnitures[this.furniture.id].settings['x'] = parseInt(target.style.left.substring(-2))
			this.$parent.furnitures[this.furniture.id].settings['y'] = parseInt(target.style.top.substring(-2))
			target.classList.remove('dragging')
			this.save()
		},
		saveSize: function (target) {
			this.$parent.furnitures[this.furniture.id].settings['x'] = parseInt(target.style.left.substring(-2))
			this.$parent.furnitures[this.furniture.id].settings['y'] = parseInt(target.style.top.substring(-2))
			this.$parent.furnitures[this.furniture.id].settings['w'] = parseInt(target.style.width.substring(-2))
			this.$parent.furnitures[this.furniture.id].settings['h'] = parseInt(target.style.height.substring(-2))
			this.save()
		},
		saveRotation: function () {
			if (this.$parent.furnitures[this.furniture.id].settings['r'] === 0) {
				this.$parent.furnitures[this.furniture.id].settings['r'] = this.rotationDelta
			} else {
				this.$parent.furnitures[this.furniture.id].settings['r'] = this.$parent.furnitures[this.furniture.id].settings['r'] + this.rotationDelta
			}
			this.rotationDelta = 0
			this.save()
		}
	}
}
