import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
import widget from "@/components/js/widget";

export default {
	mixins: [VueDialogMixin],
	data: function() {
		let actTab = 2
		if ( Object.keys(this.options['widget'].configs).length > 0 ){
			actTab = 1
		}
		return {
			parent: this.options['parent'],
			widget: this.options['widget'],
			activeTabId: actTab,
			tabs: {
				1: {
					'icon': 'fas fa-cogs',
					'id': 1,
					'position': 0
				},
				2: {
					'icon': 'fas fa-paint-brush',
					'id': 2,
					'position': 1
				}
			}
			}
	},
	methods: {
		designConfig: function () {
			let template = {};
			template['title'] = {
				"defaultValue": false,
				"dataType"    : "boolean",
				"isSensitive" : false,
				"description" : "Show the title of the widget"
			}
			template['borders'] = {
				"defaultValue": false,
				"dataType"    : "boolean",
				"isSensitive" : false,
				"description" : "Show a shadow drop/border"
			}
			template['background'] = {
				"defaultValue": '#000000',
				"dataType"    : "color2rgba",
				"isSensitive" : false,
				"description" : "The background color of the widget"
			}
			template['background-opacity'] = {
				"defaultValue": false,
				"dataType"    : "range2rgba",
				"isSensitive" : false,
				"description" : "The opacity of the widget",
				"min" : "0",
				"max":"1",
				"step":"0.1",
				"unit":"%"
			}
			template['font-size'] = {
				"defaultValue": 1,
				"dataType"    : "range",
				"isSensitive" : false,
				"description" : "Relative font size in this widget",
				"min" : "0.25",
				"max":"5",
				"step":"0.01",
				"unit":"em"
			}
			template['font-color'] = {
				"defaultValue": '#D1D1D1',
				"dataType"    : "color",
				"isSensitive" : false,
				"description" : "Color of the text in the widget"
			}
			return template
		},
		handleConfirm() {
			this.proceed(this.options['widget'])
		},
		handleDismiss() {
			this.cancel()
		}
	}
};
