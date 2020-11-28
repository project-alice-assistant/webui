export default {
	name: 'devmode',
	data: function() {
		return {
			activePageId: 1,
			tabs: {
				1: {
					'icon': 'fas fa-plus-circle',
					'id': 1,
					'position': 0
				},
				2: {
					'icon': 'fas fa-edit',
					'id': 2,
					'position': 1
				}
			}
		}
	},
}
