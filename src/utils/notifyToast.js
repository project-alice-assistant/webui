import VueToasted from "vue-toasted";

const notifyToast = {
	install (Vue, options) {

		Vue.use(VueToasted, { iconPack: 'fontawesome', containerClass: 'notifyContainer' })

		Vue.mixin({
			methods: {
				showError: message => Vue.toasted['error'](message, {duration: 4000, position: "top-center", keepOnHover: true, icon: 'exclamation-triangle'}),
				showSuccess: message => Vue.toasted['success'](message, {duration: 4000, position: "top-center", keepOnHover: true, icon: 'check-square'}),
				showInfo: message => Vue.toasted['info'](message, {duration: 4000, position: "top-center", keepOnHover: true, icon: 'info-circle'})
			}
		})
	}
}

export default notifyToast;
