export default function (src) {
	return new Promise(function (resolve, reject) {
		let shouldAppend = false
		let el = document.querySelector(`script[src="${src}"]`)
		if (!el) {
			el = document.createElement('script')
			el.async = true
			el.src = src
			shouldAppend = true
		} else if (el.hasAttribute('data-loaded')) {
			resolve(el)
			return
		}

		el.addEventListener('error', reject)
		el.addEventListener('abort', reject)
		el.addEventListener('load', function loadScriptHandler() {
			el.setAttribute('data-loaded', true)
			resolve(el)
		})

		if (shouldAppend) document.head.appendChild(el)
	})
}
