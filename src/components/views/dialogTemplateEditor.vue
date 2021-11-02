<template>
	<div class="settingsContainer">
		<div class="flexrow nowrap stretched yscroll">
			<div class="leftBar">
				<label class="categoryHead">Intents</label>
				<configInputList v-if="dialogTemplates[currentLang]"
												 v-model="dialogTemplates[currentLang].intents"
												 v-init="dialogTemplates[currentLang].intents"
												 :allow-double="false"
												 :proposedItems="intentsMissingInLang"
												 :selectedItem="editingIntent"
												 :template="{name:'intents',
																		dataType:'userList',
																		subType:'dict',
																		dictKey: 'name',
																		dictTemplate: { name: '',
																									  enabledByDefault: false,
																										utterances: [],
																										slots: [] } }"
												 @item-selected="selectIntent"/>
				<label class="categoryHead">SlotTypes</label>
				<configInputList v-if="dialogTemplates[currentLang]"
												 v-model="dialogTemplates[currentLang].slotTypes"
												 v-init="dialogTemplates[currentLang].slotTypes"
												 :allow-double="false"
												 :proposedItems="slotTypesMissingInLang"
												 :selectedItem="editingSlotType"
												 :template="{name:'slotTypes',
																		dataType:'userList',
																		subType:'dict',
																		dictKey: 'name',
																		dictTemplate: { name: '',
																										matchingStrictness: null,
																										automaticallyExtensible: false,
																										useSynonyms: true,
																										technicalValue: false,
																										values: [] } }"
												 @item-selected="selectSlotType"/>
			</div>
			<div class="contained" style="width: 100%;overflow: inherit;">
				<div v-if="editingIntent === null && editingSlotType === null">
					<h1>Training Data</h1>
					<p>Here you can define the dialog templates.</p>
					<p>Start by choosing your active language, then click on one of the intents
						on the left side, or add a new one!</p>
					<p>The second part are the slot types. These define the values alice will extract from the spoken words.
						You can edit them on the left side as well!</p>
					<p>You can always find more detailed help by clicking the
						<i class="fas fa-question-circle"></i> in the top right,
						this will lead you to the corresponding page of
						<a href="https://docs.projectalice.io/skill-development/files-in-depth.html#dialog-templates">docs.ProjectAlice.io</a>
					</p>
					<div v-if="slotTypesMissingInLang.length > 0 || intentsMissingInLang.length > 0">
						<div class="red">
							There are elements missing in this language!
						</div>
						Add them by clicking the <i class="fas fa-plus-circle red"></i> in the list to the left
					</div>

				</div>
				<div v-if="!selectedExists && editingIntent">
					<h1>{{ editingIntent }}</h1>
					<p>This intent is missing for the current language, but exists for others!</p>
					<p>Add it by clicking on the plus in the list!</p>
					<p>To delete it from all languages - click here:</p>
					<button class="danger" @click="removeIntent(editingIntent)">
						<i class="fas fa-skull-crossbones size-2x"></i>
						Yes - Delete in all languages
						<i class="fas fa-skull-crossbones size-2x"></i>
					</button>
				</div>
				<div v-else-if="editingIntent">
					<div v-for="intent in dialogTemplate.intents"
							 v-if="intent.name === editingIntent">
						<h1 class="clickable" @click="renameIntent(intent)">{{ intent.name }} <i class="fas fa-pen"></i></h1>
						<h3>Settings</h3>
						<div class="configLine">
							<label>enabled By Default</label><input v-model="intent.enabledByDefault" type="checkbox"/>
						</div>
						<h3>Slots</h3>
						<div class="lineContainer">
							<label></label>
							<label>Name</label>
							<label>SlotType</label> <!-- TODO: link to inputs missing! -->
							<label>Required?</label>
							<label>Missing Question</label>
						</div>
						<div v-for="slot of intent.slots" class="lineContainer">
							<button @click="removeSlotFromIntent(intent, slot)"><i class="fas fa-minus-circle size-15x"></i></button>
							<div class="likeInput clickable" @click="renameSlot(intent, slot)">
								{{ slot.name }}
								<i class="fas fa-pen"></i>
							</div>
							<input v-model="slot.type"/>
							<input v-model="slot.required" type="checkbox"/>
							<input v-model="slot.missingQuestion"/>
						</div>
						<div class="lineContainer">
							<button @click="addSlot(intent.slots)"><i class="fas fa-plus-circle size-15x"></i></button>
							<input ref="newSlotInput"
										 v-model="newSlotName"
										 @input="resetValidity"
										 @keypress.enter="addSlot(intent.slots)"/>
							<div></div>
							<div></div>
							<div></div>
						</div>
						<h4>Utterances</h4>
						<configInputList v-model="intent.utterances"
														 v-init="intent.utterances"
														 :selectedItem="editingIntent"
														 :template="{name:'intents',
																		dataType:'userList',
																		subType:'utterance',
																		highlights: getHighlights(intent)}"
														 @item-selected="selectIntent"/>
						<br/>
					</div>
				</div>
				<div v-else class="slotDefinition">
					<div v-if="!selectedExists && editingSlotType">
						<h1>{{ editingSlotType }}</h1>
						<p>This intent is missing for the current language, but exists for others!</p>
						<p>Add it by clicking on the plus in the list!</p>
						<p>To delete it from all languages - click here:</p>
						<button class="danger" @click="removeSlotType(editingSlotType)">
							<i class="fas fa-skull-crossbones size-2x"></i>
							Yes - Delete in all languages
							<i class="fas fa-skull-crossbones size-2x"></i>
						</button>
					</div>
					<div v-for="slot in dialogTemplate.slotTypes" v-else
							 v-if="slot.name === editingSlotType">
						<h3>{{ slot.name }}</h3>
						<div class="configLine">
							<label>Matching Strictness</label><input v-model="slot.matchingStrictness" type="checkbox"/>
						</div>
						<div class="configLine">
							<label>Automatically Extensible</label><input v-model="slot.automaticallyExtensible" type="checkbox"/><br/>
						</div>
						<div class="configLine">
							<label>Use Synonyms</label><input v-model="slot.useSynonyms" type="checkbox"/><br/>
						</div>
						<div class="configLine">
							<label>Technical Value</label><input v-model="slot.technicalValue" type="checkbox"/><br/>
						</div>
						<div>
							<input ref="new-val-input" v-model="newValue" placeholder="new Value" @keyup.enter="addValue"/>
							<input v-if="slot.useSynonyms" v-model="newSynonymCSV" placeholder="a Synonym, 2 Synonym, 3..." @keyup.enter="addValue"/>
							<br/><em>
							Press enter to add the value above to the list.<br/>
							Synonyms may be entered separated by commas.<br/>
							Below entering one synonym after the other by pressing enter is possible.</em>
							<br/>
							<br/>
						</div>
						<div v-for="val in slot.values"
								 class="slotLine">
							<div class="inputWrapper"><input v-model="val.value" :readonly="slot.technicalValue"/><span></span></div>
							<span v-if="slot.useSynonyms">
								<configInputList v-model="val.synonyms"
																 v-init="val.synonyms"
																 :template="{name:'synonyms',
																		dataType:'userList',
																		subType:'string'}"/>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name:  'dialogTemplateEditor',
	props: ['editingSkill',
		'currentLang'],
	data:  function () {
		return {
			dialogTemplates: {},
			backupTemplates: {},
			editingIntent:   null,
			editingSlotType: null,
			newValue:        '',
			newSynonymCSV:   '',
			newSlotName:     '',
			noWatch:         false
		}
	},
	mounted() {
		this.loadDialogTemplate()
	},
	computed: {
		newSynonyms: function () {
			if (this.newSynonymCSV.trim() === '') return []
			return this.newSynonymCSV.split(',')
		},
		dialogTemplate() {
			this.checkLang()
			return this.dialogTemplates[this.currentLang]
		},
		isModified() {
			return JSON.stringify(this.dialogTemplates) !== JSON.stringify(this.backupTemplates)
		},
		allIntents() {
			let collect = []
			for (const lang in this.dialogTemplates) {
				if ('intents' in this.dialogTemplates[lang])
					collect = [...new Set([...collect, ...this.dialogTemplates[lang].intents.map(o => o.name)])]
			}
			return collect
		},
		allSlotTypes() {
			let collect = []
			for (const lang in this.dialogTemplates) {
				if ('slotTypes' in this.dialogTemplates[lang])
					collect = [...new Set([...collect, ...this.dialogTemplates[lang].slotTypes.map(o => o.name)])]
			}
			return collect
		},
		selectedExists() {
			return !this.intentsMissingInLang.includes(this.editingIntent) && !this.slotTypesMissingInLang.includes(this.editingSlotType)
		},
		intentsMissingInLang() {
			if (!this.dialogTemplates || !(this.currentLang in this.dialogTemplates) || !this.dialogTemplates[this.currentLang].intents)
				return this.allIntents
			return this.allIntents.filter(a => !(this.dialogTemplates[this.currentLang].intents.map(o => o.name).includes(a)))
		},
		slotTypesMissingInLang() {
			if (!this.dialogTemplates || !(this.currentLang in this.dialogTemplates) || !this.dialogTemplates[this.currentLang].slotTypes)
				return this.allSlotTypes
			return this.allSlotTypes.filter(a => !(this.dialogTemplates[this.currentLang].slotTypes.map(o => o.name).includes(a)))
		}
	},
	watch:    {
		currentLang() {
			this.checkLang()
		}
	},
	methods:  {
		reload() {
			this.loadDialogTemplate()
		},
		checkLang() {
			if (!this.dialogTemplates[this.currentLang]) {
				this.$set(this.dialogTemplates, this.currentLang, {})
			}
		},
		renameIntent(intent) {
			self = this
			this.$dialog.prompt({
				title: 'What should the intent be named? The intent will be renamed for all languages.',
				body:  intent.name
			}, {
				promptHelp: '',
				okText:     this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			})
				.then(function (dialogue) {
					if (dialogue.data === '') {
						self.showError('The name must not be empty!')
						return
					}
					if (self.allIntents.filter(a => a.name === dialogue.data).length) {
						self.showError('That name is already taken!')
						return
					}
					intent.name = dialogue.data
					self.editingIntent = intent.name
				})
		},
		renameSlot(intent, slot) {
			let self = this
			this.$dialog.prompt({
				title: 'What should the slot be named?',
				body:  slot.name
			}, {
				promptHelp: '',
				okText:     this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			})
				.then(function (dialogue) {
					if (dialogue.data === '') {
						self.showError('The name must not be empty!')
						return
					}
					if (intent.slots.filter(a => a.name === dialogue.data).length) {
						self.showError('That name is already taken!')
						return
					}
					let old = slot.name
					slot.name = dialogue.data

					let regex = new RegExp('{([^(:=>)]*?):=>' + old + '}', 'g')
					for (let ind in Object.values(intent.utterances)) {
						intent.utterances[ind] = intent.utterances[ind].replace(regex, '{$1:=>' + slot.name + '}')
					}
				})
		},
		resetValidity(e) {
			e.target.setCustomValidity('')
			e.target.reportValidity()
		},
		addValue() {
			for (const slotNum in this.dialogTemplates[this.currentLang].slotTypes) {
				if (this.dialogTemplates[this.currentLang].slotTypes[slotNum].name === this.editingSlotType) {
					let newVal = {
						'value':    '' + this.newValue,
						'synonyms': this.newSynonyms
					}
					this.dialogTemplates[this.currentLang].slotTypes[slotNum].values.unshift(newVal)
					this.newValue = ''
					this.newSynonymCSV = ''
					this.$refs['new-val-input'][0].focus()
					return
				}
			}
		},
		addSlot(slots) {
			if (this.newSlotName === '') {
				this.$refs.newSlotInput[0].setCustomValidity('Please provide a slot name!')
				this.$refs.newSlotInput[0].reportValidity()
				return
			}
			if (slots.filter(a => a.name === this.newSlotName).length) {
				this.$refs.newSlotInput[0].setCustomValidity('That slot name already exists!')
				this.$refs.newSlotInput[0].reportValidity()
				return
			}
			this.$refs.newSlotInput[0].setCustomValidity('')
			this.$refs.newSlotInput[0].reportValidity()
			slots.push({'name': this.newSlotName, 'type': '', 'required': false, 'missingQuestion': ''})
			this.newSlotName = ''
		},
		removeSlotFromIntent(intent, slot) {
			this.$dialog.confirm({
				title:      'Mind the consequences!',
				body:       'Deleting a slot will remove all occurrences in the utterances',
				okText:     'Delete',
				cancelText: this.$t('buttons.cancel'),
			}).then(() => {
				let regex = new RegExp('{([^(:=>)]*?):=>' + slot.name + '}', 'g')
				for (let ind in Object.values(intent.utterances)) {
					intent.utterances[ind] = intent.utterances[ind].replace(regex, '$1')
				}
				intent.slots = intent.slots.filter(v => v !== slot)
			})
		},
		getSlotColor(index) {
			return ['#1b4958', '#005000', '#cc8400', 'yellow', 'red'][index]
		},
		getHighlights(intent) {
			let ret = []
			let index = 0
			if (intent.slots) {
				for (const i of intent.slots) {

					let slot = {}
					slot.slot = i.name
					slot.color = this.getSlotColor(index++)
					ret.push(slot)
				}
			}
			return ret
		},
		selectIntent(name) {
			this.editingIntent = name
			this.editingSlotType = null
		},
		selectSlotType(name) {
			this.editingSlotType = name
			this.editingIntent = null
		},
		save() {
			let self = this
			for (const lang of Object.keys(this.dialogTemplates)) {
				let data = {
					'lang':           lang,
					'dialogTemplate': this.dialogTemplates[lang]
				}
				axios({
					method:  'PATCH',
					url:     `/skills/${this.editingSkill.name}/setDialogTemplate/`,
					data:    data,
					headers: {
						'auth':         this.$store.getters.apiToken,
						'content-type': 'application/json'
					}
				}).then(function (response) {
					if ('success' in response.data) {
						if (response.data['success']) {
							// $emit('success ')self.setSuccess()
							self.dialogTemplates[this.currentLang] = JSON.parse(response.data['dialogTemplate'])
							self.backupTemplates[this.currentLang] = JSON.parse(response.data['dialogTemplate'])
						} else {
							// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
						}
					}
				}).catch(function (e) {
					console.log(e)
					// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
				})
			}
		},
		removeIntent(key) {
			this.askDeletionForAllLanguages('intents', key)
		},
		removeSlotType(key) {
			this.askDeletionForAllLanguages('slotTypes', key)
		},
		askDeletionForAllLanguages(type, key) {
			let self = this
			this.$dialog.confirm({
				title:      'Delete for all languages?',
				body:       'This will delete the ' + type + ' for all languages!',
				okText:     'Delete',
				cancelText: this.$t('buttons.cancel'),
			}).then(() => {
				self.removeForAllLanguages(type, key)
			})
		},
		removeForAllLanguages(type, key) {
			for (const lang in this.dialogTemplates) {
				if (this.dialogTemplates[lang][type]) {
					let keys = Object.entries(this.dialogTemplates[lang][type]).map(([k, o]) => {
						if (o.name === key) return k
					})
					if (keys) this.$delete(this.dialogTemplates[lang][type], keys)
				}
			}
		},
		loadDialogTemplate() {
			const data = {}
			let self = this
			this.$emit('waiting', true)
			axios({
				method:  'POST',
				url:     `/skills/${this.editingSkill.name}/getDialogTemplate/`,
				data:    data,
				headers: {
					'auth':         this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function (response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.dialogTemplates = response.data['dialogTemplates']
						self.backupTemplates = JSON.parse(JSON.stringify(response.data['dialogTemplates']))
						self.checkLang()
						self.$emit('waiting', false)
					} else {
						self.$emit('failed')
					}
				}
			}).catch(function (e) {
				console.log(e)
				self.$emit('failed')
			})
		},
	}
}
</script>

<style scoped>
.slotDefinition >>> label {
	width: 16.5em;
}

.slotLine {
	display: flex;
}

.configLine {
	align-items: center;
	clear: both;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: .5em;
	width: 100%;
}

.stretched {
	height: 100%;
	width: 100%;
}

.inputWrapper {
	align-items: baseline;
	display: flex;
}

.lineContainer {
	align-items: center;
	display: grid;
	gap: .3em;
	grid-auto-columns: 3rem 1fr 1fr 5rem 1fr;
	grid-auto-flow: column;
	margin: .2em 0;
	overflow: hidden;
	padding: 0 .5em 0 0;
}

.lineContainer * {
	box-sizing: border-box;
	margin: 0;
	min-width: 14rem;
}

.lineContainer *:first-child {
	margin: .1em;
	min-width: 3rem;
}

.lineContainer *:nth-child(4) {
	min-width: 5rem;
}

* > .lineContainer {
	background-color: var(--accent);
	padding: .5em;
}

* > .lineContainer ~ .lineContainer {
	background-color: var(--mainBG);
}

@media only screen and (max-width: 1192px) {
	.lineContainer {
		align-content: center;
		grid-auto-columns: auto;
		grid-auto-flow: row;
		padding: .5em;
		width: 15em;
	}
}
</style>
