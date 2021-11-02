<template>
	<component :is="subConfig ? 'div' : 'form'" ref="data" class="settingsContainer" @keypress.enter.prevent>
		<div v-if="!subConfig" :class="{ 'waiting' : waiting || success || failed, 'waitHidden' : !waiting && !success && !failed }">
			<div class="centered">
				<i v-if="waiting" ref="animatedIcon" aria-hidden="true" class="fas fa-spinner fa-pulse fa-4x"/>
				<i v-else-if="success" ref="animatedIcon" aria-hidden="true" class="fas fa-check fa-4x green"/>
				<i v-else-if="failed" ref="animatedIcon" aria-hidden="true" class="fas fa-exclamation-triangle fa-4x red"/>
			</div>
		</div>
		<div v-if="!waiting" :class="{noOverflow: subConfig}" class="settingsArea">
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
												:confPrefix="confPrefix"
												:configName="configName"
												:holder="holder"
												:template="template"
												:translate="(val) => $t(val)"/>
					</div>
				</div>
			</div>
			<div v-else>
				<configLine v-for="(template, configName) in filteredTemplates()"
										:configName="configName"
										:holder="holder"
										:template="template"
										:translate="translate"/>
			</div>
		</div>
		<div class="configActions">
			<div v-for="(action, name) in actions">
				<div v-if="!('condition' in action) || action['condition']">
					<div v-if="textButtons">
						<div v-if="name === 'save'" class="button">
							<button :timing="[1, 2]" data-success="false" tooltip="tooltips.save" @click="action['action']">Save</button>
						</div>
						<div v-else-if="name === 'cancel'" class="button">
							<button :timing="[1, 2]" data-success="false" tooltip="tooltips.cancel" @click="action['action']">Cancel</button>
						</div>
						<div v-else-if="name === 'reset'" class="button">
							<button :timing="[1, 2]" data-success="false" tooltip="tooltips.reset" @click="action['action']">Reset</button>
						</div>
						<div v-else>
							<button @click="action['action']">{{ action['text'] }}</button>
						</div>
					</div>
					<div v-else>
						<div v-if="name === 'save'" class="icon dg-pull-right">
							<reactive-icon :onClick="action['action']" :timing="[1, 2]" data-success="false" icon="far fa-save" tooltip="tooltips.save"/>
						</div>
						<div v-else-if="name === 'cancel'" class="icon">
							<reactive-icon :onClick="action['action']" :timing="[1, 2]" data-success="false" icon="fas fa-reply" tooltip="tooltips.cancel"/>
						</div>
						<div v-else-if="name === 'reset'" class="icon">
							<reactive-icon :onClick="action['action']" :timing="[1, 2]" data-success="false" icon="fas fa-undo" tooltip="tooltips.reset"/>
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
	name:     'config',
	props:    [
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
	data:     function () {
		return {searchKeyword: ''}
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
			for (const configTemplate of Object.values(this.templates)) {
				if (!cats.includes(configTemplate['category'])) {
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
	methods:  {
		checkCategoryVisibility: function (categoryName) {
			return Object.keys(this.templatesForCategory(categoryName)).length > 0
		},
		checkConfigVisibility:   function (configName) {
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
					visible = configName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				}
			} else {
				if (this.searchKeyword !== '') {
					visible = configName.toLowerCase().includes(this.searchKeyword.toLowerCase())
				}
			}
			return visible
		}
	}
}
</script>

<style scoped>
.settingsContainer {
	bottom: 0;
	display: flex;
	flex-flow: column;
	left: 0;
	overflow: hidden;
	right: 0;
	top: 0;
}

.settingsArea {
	flex-shrink: 1;
	overflow-y: auto;
}

.settings {
	display: flex;
	flex: 1;
	flex-flow: column;

}

.settingsCategory {
	background-color: var(--windowBG);
	display: flex;
	flex: 1;
	flex-direction: column;
	margin: 15px;
}

.settingsCategory i {
	font-size: 2.5em;
	margin-bottom: 15px;
	margin-left: 15px;
}

.settingsCategory .title {
	align-items: center;
	background-color: var(--secondary);
	box-sizing: border-box;
	display: flex;
	font-size: 1.15em;
	height: 2em;
	justify-content: flex-start;
	margin-bottom: 15px;
	padding-left: 15px;
}

.settingsCategory .labels {
	margin-left: 15px;
	min-width: 15em;
}

button {
	padding: 0 1em;
}

.configActions {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin: .3em 0 0 1em;
}

.configActions .icon {
	font-size: 2em;
}

.waiting {
	background-color: rgba(64, 64, 64, 0.75);
	height: 100%;
	left: 0;
	padding-bottom: 25%;
	padding-top: 20%;
	position: absolute;
	top: 0;
	transition: 1s;
	width: 100%;
	z-index: 998;
}

.waitHidden {
	background-color: rgba(64, 64, 64, 0.0);
	height: 100%;
	left: 0;
	padding-bottom: 25%;
	pointer-events: none;
	position: absolute;
	top: -100px;
	transition: 1s;
	width: 100%;
	z-index: 998;
}

.noOverflow {
	overflow: hidden;
}
</style>
