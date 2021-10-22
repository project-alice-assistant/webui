import Moveable from 'moveable'

export default class MoveableItem {

	constructor(controller) {
		this.controller = controller
		this.moveable = new Moveable()
		this.rotationDelta = 0
		this.altDown = false
		this.timeout = 0

		let self = this
		document.addEventListener('keyup', function (event) {
			if (event.repeat) return

			if (event.key === 'Control') {
				try {
					self.moveable.snapThreshold = 15
				} catch {
				}
			}
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

	computeWidgetCustomStyle(widget) {
		let style = `color: ${widget.settings['font-color']};`
		style += `background-color: ${widget.settings['rgba']};`
		style += `font-size: ${widget.settings['font-size']}em;`
		style += `top: ${widget.settings['y']}px;`
		style += `left: ${widget.settings['x']}px;`
		style += `width: ${widget.settings['w']}px;`
		style += `height: ${widget.settings['h']}px;`
		style += `z-index: ${widget.settings['z']};`
		style += 'min-width: 50px;'
		style += 'min-height: 50px;'

		if (!widget.settings['borders']) {
			style += 'box-shadow:none;'
		}

		if (widget.settings['r'] && widget.settings['r'] !== 0) {
			style += `transform:rotate(${widget.settings['r']}deg);`
		}

		return style
	}


	computeMyHomeCustomStyle(obj, background) {
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
		if (container) {
			if (prop.data.parentLocation !== 0) {
				container = document.querySelector(`#loc_${prop.data.parentLocation}`)
			}
		} else {
			container = document.querySelector('.tab_page')
		}

		this.moveable = new Moveable(container, {
			target:             target,
			props:              prop,
			draggable:          true,
			resizable:          true,
			rotatable:          true,
			snappable:          true,
			roundable:          false,
			isDisplaySnapDigit: true,
			snapCenter:         true,
			snapGap:            false,
			snapThreshold:      15,
			throttleDrag:       1,
			throttleResize:     1,
			throttleRotate:     5,
			scalable:           false,
			keepRatio:          false,
			edge:               false,
			origin:             false
		})

		this.moveable.on('dragStart', ({target}) => {
			try {
				this.moveable.props.dragStart(target)
			} catch {
				this.startDrag(target)
			} finally {
				this.dragging = true
				this.timeout = Math.floor(new Date().getTime() / 250)
			}
		}).on('drag', ({target, left, top, clientX, clientY}) => {
			try {
				this.moveable.props.handleDrag(target, left, top, clientX, clientY)
			} catch {
				this.handleDrag(target, left, top)
			}
		}).on('dragEnd', ({target, clientX, clientY}) => {
			try {
				this.moveable.props.setPosition(target, clientX, clientY)
			} catch {
				this.setPosition(target)
			} finally {
				this.save()
				this.dragging = false
				let newTimeout = Math.floor(new Date().getTime() / 250)
				if (this.timeout !== newTimeout) {
					this.timeout = newTimeout
				} else {
					this.timeout = 0
				}
				target.classList.remove('dragging')
			}
		})

		this.moveable.on('resize', ({target, width, height, delta, direction}) => {
			try {
				this.moveable.props.handleResize(target, width, height, delta, direction)
			} catch {
				this.handleResize(target, width, height, delta, direction)
			}
		}).on('resizeEnd', ({target}) => {
			try {
				this.moveable.props.setSize(target)
			} catch {
				this.setSize(target)
			} finally {
				this.save()
			}
		})

		this.moveable.on('rotate', ({target, dist, transform}) => {
			try {
				this.moveable.props.handleRotate(target, dist, transform)
			} catch {
				this.handleRotate(target, dist, transform)
			}
		}).on('rotateEnd', ({target}) => {
			try {
				this.moveable.props.setRotation(target)
			} catch {
				this.setRotation(target)
			} finally {
				this.save()
			}
		})

		this.moveable.on('round', el => {
			try {
				this.moveable.props.handleBorderRadius(el.target)
			} catch {
				this.handleBorderRadius(el)
			}
		}).on('roundEnd', el => {
			try {
				this.moveable.props.setBorderRadius(el)
			} catch {
				this.setBorderRadius(el)
			} finally {
				this.save()
			}
		})
	}

	setBoundaries(element, offset) {
		const parent = element.parentElement
		this.moveable.bounds = {
			left:   -offset,
			right:  parseInt(parent.style.width.substring(-2)) + offset,
			top:    -offset,
			bottom: parseInt(parent.style.height.substring(-2)) + offset
		}
	}

	save() {
		this.moveable.props.save()
	}

	startDrag(target) {
		target.classList.add('dragging')
		target.style['z-index'] = 1000
	}

	getItem(target) {
		const id = this.getId(target)
		if (target.classList.contains('location')) {
			return this.controller.$store.state.locations[id]
		} else if (target.classList.contains('furniture')) {
			return this.controller.$store.state.furnitures[id]
		} else if (target.classList.contains('construction')) {
			return this.controller.$store.state.constructions[id]
		} else if (target.classList.contains('device')) {
			return this.controller.$store.state.devices[id]
		} else if (target.classList.contains('widget')) {
			return this.controller.$store.state.widgetInstances[id]
		}
	}

	getId(target) {
		return parseInt(target.id.substring(4))
	}

	setPosition(target) {
		const item = this.getItem(target)
		item.settings['x'] = parseInt(target.style.left.substring(-2))
		item.settings['y'] = parseInt(target.style.top.substring(-2))

		try {
			this.controller.removeDroppable()
		} catch {
		}
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

		if (target.classList.contains('widget')) {
			// get widget with id
			try {
				this.controller.$store.state.widgetInstances[target.id.substr(4)].instance.onResize(target, width, height, delta, direction)
			} catch (e) {
			}
		}
	}

	handleRotate(target, dist, transform) {
		this.rotationDelta = dist
		target.style.transform = transform
	}

	handleBorderRadius(el) {
		el.target.style.borderRadius = el.borderRadius
	}

	handleDrag(target, left, top) {
		target.style.left = `${left}px`
		target.style.top = `${top}px`
	}
}
