export default {
	name: 'configInput',
	props: [
		'template',
		'configName',
		'holder',
		'translate'
	],
	computed: {
		configValue: {
			get: function () {
				if(this.template['subConfig']) {
					return this.holder[this.configName][this.template['category']]
				} else {
					return this.holder[this.configName]
				}
			},
			set: function (value) {
				if(this.template['subConfig']) {
					this.$set(this.holder[this.configName], this.template['category'], value)
					return true
				} else {
					this.$set(this.holder, this.configName, value)
					return true
				}
			}
		},
		icon() {
			if( this.holder[this.configName] === "" || this.holder[this.configName] === undefined)
				return "fas fa-biohazard"
			const regex = /<i class="(.*)"><\/i>/;
			const matches = regex.exec(this.holder[this.configName])
			if (matches) {
				this.$set(this.holder, this.configName, matches[1])
				return matches[1]
			}
			return this.holder[this.configName]
		}
	},
	methods: {
		hex2rgba() {
			let hex = this.holder['background']
			let alpha = this.holder['background-opacity']
			const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
			this.holder['rgba'] = `rgba(${r}, ${g}, ${b}, ${alpha})`
			console.log('new color ' + this.holder['rgba'])
		},
		missing: function() {
			return this.template['obligatory'] && !this.configValue
		},
		valid: function (){
			if(this.template['dataType'] === "string" || this.template['dataType'] === "longstring") {
				if (this.configValue === undefined) {
					return false
				}
				let newest = this.configValue.slice(-1)
				if ('capitalize' in this.template && this.template['capitalize'] && this.configValue !== undefined && this.configValue.length === 1) {
					this.configValue = this.configValue.toUpperCase()
				}
				if ('noSpace' in this.template && this.template['noSpace'] && this.configValue !== undefined && newest === " ") {
					this.configValue = this.configValue.slice(0, -1)
				}
			}
			return true
		}
	}
}
