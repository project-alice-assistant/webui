<template>
	<component :is="subConfig ? 'div' : 'form'" class="settingsContainer" ref="data" @keypress.enter.prevent>
		<div v-if="!subConfig" :class="{ 'waiting' : waiting || success || failed, 'waitHidden' : !waiting && !success && !failed }">
			<div class="centered">
				<i v-if="waiting" ref="animatedIcon" class="fas fa-spinner fa-pulse fa-4x" aria-hidden="true"/>
				<i v-else-if="success" ref="animatedIcon" class="fas fa-check fa-4x green" aria-hidden="true"/>
				<i v-else-if="failed" ref="animatedIcon" class="fas fa-exclamation-triangle fa-4x red" aria-hidden="true"/>
			</div>
		</div>
		<div v-if="!waiting" class="settingsArea" :class="{noOverflow: subConfig}">
				<div v-if="includeFilter" class="settingsCategory">
					<div class="title">{{ $t('labels.searchSetting') }}</div>
					<div class="configLayout">
						<input v-model="searchKeyword" :placeholder="$t('labels.keyword')" type="text"/>
					</div>
				</div>
				<div v-if="byCategory">
					<div v-for="category in categories"
							:id="category.toLowerCase().replace(' ', '_')"
							class="settingsCategory">
						<div class="title">{{ category.replace(/([A-Z])/g, ' $1').trim().toUpperCase() }}</div>
						<div class="configLayout">
							<configLine v-for="(template, configName) in templatesForCategory(category)"
													:configName="configName"
													:holder="holder"
													:translate="(val) => $t(val)"
													:template="template"
													:confPrefix="confPrefix"/>
						</div>
					</div>
				</div>
				<div v-else>
					<configLine v-for="(template, configName) in filteredTemplates()"
											:configName="configName"
											:holder="holder"
											:translate="translate"
											:template="template"/>
				</div>
		</div>
		<div class="configActions">
			<div v-for="(action, name) in actions">
				<div v-if="!('condition' in action) || action['condition']">
					<div v-if="textButtons">
						<div v-if="name === 'save'" class="button" >
							<button data-success="false" tooltip="tooltips.save" @click="action['action']" :timing="[1, 2]">Save</button>
						</div>
						<div v-else-if="name === 'cancel'" class="button" >
							<button data-success="false" tooltip="tooltips.cancel" @click="action['action']" :timing="[1, 2]">Cancel</button>
						</div>
						<div v-else-if="name === 'reset'" class="button" >
							<button data-success="false" tooltip="tooltips.reset" @click="action['action']" :timing="[1, 2]">Reset</button>
						</div>
						<div v-else>
							<button @click="action['action']">{{ action['text'] }}</button>
						</div>
					</div>
					<div v-else>
						<div v-if="name === 'save'" class="icon dg-pull-right" >
							<reactive-icon  data-success="false" icon="far fa-save" tooltip="tooltips.save" :onClick="action['action']" :timing="[1, 2]"/>
						</div>
						<div v-else-if="name === 'cancel'" class="icon" >
							<reactive-icon  data-success="false" icon="fas fa-reply" tooltip="tooltips.cancel" :onClick="action['action']" :timing="[1, 2]"/>
						</div>
						<div v-else-if="name === 'reset'" class="icon" >
							<reactive-icon  data-success="false" icon="fas fa-undo" tooltip="tooltips.reset" :onClick="action['action']" :timing="[1, 2]"/>
						</div>
						<div v-else>
							<button @click="action['action']">{{ action['text'] }}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</component>
</template>

<script>
export default {
	name: "config",
	props: [
		'templates',
		'holder',
		'translate',
		'validator',
		'byCategory',
		'includeFilter',
		'actions',
		'waiting',
		'success',
		'failed',
		'textButtons', //should the action bar have text or icons?
		'confPrefix', //prefix that should be removed from the config values
		'subConfig' //this config is only part of a bigger config - don't include the framework
	],
	data: function() {
		return {searchKeyword : ''}
	},
		computed: {
		filteredTemplates() {
			return () => {
				let configs = {}
				for (const [configName, configTemplate] of Object.entries(this.templates)) {
					if (configTemplate['display'] !== 'hidden' && this.checkConfigVisibility(configName)) {
						configs[configName] = configTemplate
					}
				}
				return configs
			}
		},
		templatesForCategory() {
			return (categoryName) => {
				let configs = {}
				for (const [configName, configTemplate] of Object.entries(this.templates)) {
					if (configTemplate['display'] !== 'hidden' && configTemplate['category'].toLowerCase() === categoryName.toLowerCase() && this.checkConfigVisibility(configName)) {
						configs[configName] = configTemplate
					}
				}
				return configs
			}
		},
		allCategories() {
			let cats = []
			for (const [configName, configTemplate] of Object.entries(this.templates)) {
				if(!cats.includes(configTemplate['category'])){
					cats.push(configTemplate['category'])
				}
			}
			return cats
		},
		categories() {
			if (this.searchKeyword === '') {
				return this.allCategories
			} else {
				let self = this
				return Object.values(this.allCategories).filter(categoryName => {
					return self.checkCategoryVisibility(categoryName)
				})
			}
		}
	},
	methods: {
		checkCategoryVisibility: function (categoryName) {
			return Object.keys(this.templatesForCategory(categoryName)).length > 0;
		},
		checkConfigVisibility: function (configName) {
			let visible = true
			if (this.templates[configName].constructor === Object && 'parent' in this.templates[configName]) {
				const parentTemplate = this.templates[configName]['parent']
				const parentConfig = parentTemplate['config']
				const reqCondition = parentTemplate['condition']
				const reqValue = parentTemplate['value']
				let parentValue = this.holder[parentConfig]

				if (Array.isArray(parentConfig)) {
					const type = parentTemplate['checkType'] || 'and'
					for (const parent of parentConfig) {
						parentValue = this.holder[parent]
						visible = (reqCondition === 'is' && parentValue === reqValue) || (reqCondition === 'isnot' && parentValue !== reqValue) || (reqCondition === 'isgreater' && parentValue > reqValue) || (reqCondition === 'islower' && parentValue < reqValue)
						if (type === 'or' && visible) {
							break
						} else if (type === 'and' && !visible) {
							break
						}
					}
				} else {
					visible = (reqCondition === 'is' && parentValue === reqValue) || (reqCondition === 'isnot' && parentValue !== reqValue) || (reqCondition === 'isgreater' && parentValue > reqValue) || (reqCondition === 'islower' && parentValue < reqValue)
				}

				if (visible && this.searchKeyword !== '') {
					visible = configName.toLowerCase().includes(this.searchKeyword.toLowerCase());
				}
			} else {
				if (this.searchKeyword !== '') {
					visible = configName.toLowerCase().includes(this.searchKeyword.toLowerCase());
				}
			}
			return visible
		},
	}
}
</script>

<style scoped>
.settingsContainer {
	display: flex;
	flex-flow: column;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	overflow: hidden;
}

.settingsArea {
	flex-shrink: 1;
	overflow-y: auto;
}
.settings {
	display: flex;
	flex-flow: column;
	flex: 1;

}

.settingsCategory {
	display: flex;
	flex: 1;
	background-color: var(--windowBG);
	margin: 15px;
	flex-direction: column;
}

.settingsCategory i {
	font-size: 2.5em;
	margin-left: 15px;
	margin-bottom: 15px;
}

.settingsCategory .title {
	font-size: 1.15em;
	height: 2em;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	box-sizing: border-box;
	padding-left: 15px;
	background-color: var(--secondary);
	margin-bottom: 15px;
}

.settingsCategory .labels {
	margin-left: 15px;
	min-width: 15em;
}
button {
	padding: 0 1em;
}
.configActions {
	margin: .3em 0 0 1em;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.configActions .icon {
	font-size: 2em;
}
.waiting {
	transition: 1s;
	z-index: 998;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(64,64,64,0.75);
	padding-top: 20%;
	padding-bottom: 25%;
}
.waitHidden {
	pointer-events: none;
	transition: 1s;
	z-index: 998;
	position: absolute;
	top: -100px;
	left: 0;
	width: 100%;
	height: 100%;
	padding-bottom: 25%;
	background-color: rgba(64,64,64,0.0);
}
.noOverflow {
	overflow: hidden;
}
</style>
