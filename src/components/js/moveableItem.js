import Moveable from 'moveable'

export default class MoveableItem {

	constructor(controller) {
		this.controller = controller
		this.moveable = new Moveable()
		this.rotationDelta = 0
		this.altDown = false

		this.paddingBox = {
			left: 15,
			right: 15,
			top: 15,
			bottom: 15
		}

		let self = this
		document.addEventListener('keyup', function (event) {
			if (event.repeat) return

			if (event.key === 'Control') {
				try {
					self.moveable.snapThreshold = 15
				} catch {
				}
			}
			// } else if (event.key === 'Alt') {
			// 	try {
			// 		self.moveable.resizable = true
			// 		self.moveable.draggable = true
			// 		self.moveable.roundable = false
			// 		self.moveable.padding = {}
			// 		self.altDown = false
			// 	} catch {
			// 	}
		})

		document.addEventListener('keydown', function (event) {
			if (event.repeat) return

			if (event.key === 'Control') {
				try {
					self.moveable.snapThreshold = 1
				} catch {
				}
			}
		})
	}

	destroyMoveable() {
		if (this.altDown) return
		try {
			this.moveable.destroy()
		} catch {
		}
	}

	computeCustomStyle(obj, background) {
		let style = `left:${obj['settings']['x']}px;`
		style += `top:${obj['settings']['y']}px;`
		style += `width:${obj['settings']['w']}px;`
		style += `height:${obj['settings']['h']}px;`
		style += `z-index:${obj['settings']['z']};`
		style += `transform:rotate(${obj['settings']['r']}deg);`
		style += background

		if (obj['settings'].hasOwnProperty('b')) {
			style += `border-radius:${obj['settings']['b']}`
		}

		return style
	}

	setGuidelines(guidelines) {
		this.moveable.elementGuidelines = guidelines
	}

	setMoveable(target, prop) {
		this.destroyMoveable()

		let container = document.querySelector('.floorPlan')

		if (prop.data.parentLocation !== 0) {
			container = document.querySelector(`#loc_${prop.data.parentLocation}`)
		}

		this.moveable = new Moveable(container, {
			target: target,
			props: prop,
			draggable: true,
			resizable: true,
			rotatable: true,
			snappable: true,
			roundable: false,
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

			try {
				this.moveable.props.dragStart(target)
			} catch {
			} finally {
				target.classList.add('dragging')
			}
		}).on('drag', ({target, left, top, clientX, clientY}) => {
			try {
				this.moveable.props.handleDrag(target, left, top, clientX, clientY)
			} catch {
			} finally {
				target.style.left = `${left}px`
				target.style.top = `${top}px`
			}
		}).on('dragEnd', ({target}) => {
			this.setPosition(target)
			try {
				this.moveable.props.setPosition(target)
			} catch {
			} finally {
				this.save()
				this.dragging = false
				target.classList.remove('dragging')
			}
		})

		this.moveable.on('resize', ({target, width, height, delta, direction}) => {
			try {
				this.moveable.props.handleResize(target, width, height, delta, direction)
			} catch {
			} finally {
				this.handleResize(target, width, height, delta, direction)
			}
		}).on('resizeEnd', ({target}) => {
			try {
				this.moveable.props.setSize(target)
			} catch {
			} finally {
				this.setSize(target)
				this.save()
			}
		})

		this.moveable.on('rotate', ({target, dist, transform}) => {
			try {
				this.moveable.props.handleRotate(target, dist, transform)
			} catch {
			} finally {
				this.handleRotate(target, dist, transform)
			}
		}).on('rotateEnd', ({target}) => {
			try {
				this.moveable.props.setRotation(target)
			} catch {
			} finally {
				this.setRotation(target)
				this.save()
			}
		})

		this.moveable.on('round', el => {
			try {
				this.moveable.props.handleBorderRadius(el.target)
			} catch {
			} finally {
				this.handleBorderRadius(el)
			}
		}).on('roundEnd', el => {
			try {
				this.moveable.props.setBorderRadius(el)
			} catch {
			} finally {
				this.setBorderRadius(el)
				this.save()
			}
		})
	}

	setBoundaries(element, offset) {
		const parent = element.parentElement
		this.moveable.bounds = {
			left: -offset,
			right: parseInt(parent.style.width.substring(-2)) + offset,
			top: -offset,
			bottom: parseInt(parent.style.height.substring(-2)) + offset
		}
	}

	save() {
		this.moveable.props.save()
	}

	startDrag(target) {
		target.classList.add('dragging')
	}

	getItem(target) {
		const id = this.getId(target)
		if (target.classList.contains('location')) {
			return this.controller.locations[id]
		} else if (target.classList.contains('furniture')) {
			return this.controller.furnitures[id]
		} else if (target.classList.contains('construction')) {
			return this.controller.constructions[id]
		} else if (target.classList.contains('device')) {
			return this.controller.devices[target.id.substring(4)]
		}
	}

	getId(target) {
		return parseInt(target.id.substring(4))
	}

	setPosition(target) {
		const item = this.getItem(target)
		item.settings['x'] = parseInt(target.style.left.substring(-2))
		item.settings['y'] = parseInt(target.style.top.substring(-2))
		this.controller.removeDroppable()
	}

	setSize(target) {
		const item = this.getItem(target)
		item.settings['x'] = parseInt(target.style.left.substring(-2))
		item.settings['y'] = parseInt(target.style.top.substring(-2))
		item.settings['w'] = parseInt(target.style.width.substring(-2))
		item.settings['h'] = parseInt(target.style.height.substring(-2))
	}

	setRotation(target) {
		const item = this.getItem(target)
		if (item.settings['r'] === 0) {
			item.settings['r'] = this.rotationDelta
		} else {
			item.settings['r'] = item.settings['r'] + this.rotationDelta
		}
		this.rotationDelta = 0
	}

	setBorderRadius(el) {
		const item = this.getItem(el.target)
		item.settings['b'] = el.target.style['border-radius']
	}

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
	}

	handleRotate(target, dist, transform) {
		this.rotationDelta = dist
		target.style.transform = transform
	}

	handleBorderRadius(el) {
		el.target.style.borderRadius = el.borderRadius
	}
}
