<template>
	<div class="settingsContainer">
		<div class="flexrow nowrap stretched yscroll">
			<div class="leftBar">
				<label class="categoryHead">Intents</label>
				<configInputList v-if="dialogTemplate"
												 v-model="dialogTemplate.intents"
												 v-init="dialogTemplate.intents"
												 :template="{name:'intents',
																		dataType:'userList',
																		subType:'dict',
																		dictKey: 'name',
																		dictTemplate: { name: '',
																									  enabledByDefault: false,
																										utterances: [],
																										slots: [] } }"
												 :allow-double="false"
												 @item-selected="selectIntent"
												 :selectedItem="editingIntent"/>
				<label class="categoryHead">SlotTypes</label>
				<configInputList v-if="dialogTemplate"
												 v-model="dialogTemplate.slotTypes"
												 v-init="dialogTemplate.slotTypes"
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
												 :allow-double="false"
												 @item-selected="selectSlotType"
												 :selectedItem="editingSlotType"/>
			</div>
			<div class="contained" style="width: 100%;overflow: inherit;">
				<div v-if="editingIntent === null && editingSlotType === null">Please select an intent for adding slots and utterances!</div>
				<div v-else-if="editingIntent !== null">
					<div v-for="(intent, key) in dialogTemplate.intents"
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
						<div v-for="(slot, key) of intent.slots" class="lineContainer">
							<button @click="removeSlotFromIntent(intent, slot)"><i class="fas fa-minus-circle size-15x"></i></button>
							<div class="likeInput clickable" @click="renameSlot(intent, slot)">
								{{slot.name}}
								<i class="fas fa-pen"></i>
							</div>
							<input v-model="slot.type"/>
							<input v-model="slot.required" type="checkbox"/>
							<input v-model="slot.missingQuestion"/>
						</div>
						<div class="lineContainer">
							<button @click="addSlot(intent.slots)"><i class="fas fa-plus-circle size-15x"></i></button>
							<input @keypress.enter="addSlot(intent.slots)"
										 v-model="newSlotName"
										 ref="newSlotInput"
										 @input="resetValidity"/>
							<div></div>
							<div></div>
							<div></div>
						</div>
						<h4>Utterances</h4>
					<configInputList v-model="intent.utterances"
													 v-init="intent.utterances"
													 :template="{name:'intents',
																		dataType:'userList',
																		subType:'utterance',
																		highlights: getHighlights(intent)}"
													 @item-selected="selectIntent"
													 :selectedItem="editingIntent"/><br/>
					</div>
				</div>
				<div v-else class="slotDefinition">
					<div v-for="(slot, key) in dialogTemplate.slotTypes"
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
							<div v-for="(val, key) in slot.values"
								 class="slotLine">
							<div class="inputWrapper"><input v-model="val.value" :readonly="slot.technicalValue"/><span></span></div>
							<span v-if="slot.useSynonyms">
								<configInputList  v-model="val.synonyms"
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
import axios from "axios";

export default {
	name: "dialogTemplateEditor",
	props: ['editingSkill',
					'currentLang'],
	data: function () {
		return {
			dialogTemplates: {},
			backupTemplates: {},
			editingIntent: null,
			editingSlotType: null,
			newValue: "",
			newSynonymCSV: "",
			newSlotName: "",
			noWatch: false
		}
	},
	mounted() {
		this.loadDialogTemplate()
	},
	computed: {
		newSynonyms: function () {
			if(this.newSynonymCSV.trim() === "") return []
			return this.newSynonymCSV.split(",")
		},
		dialogTemplate(){
			return this.dialogTemplates[this.currentLang]
		}
	},
	methods: {
		isModified(){
			return JSON.stringify(this.backupTemplate) !== JSON.stringify(this.dialogTemplate)
		},
		reload(){
			this.loadDialogTemplate()
		},
		renameIntent(intent){
			self = this
			this.$dialog.prompt({
				title: 'What should the intent be named? The intent will be renamed for all languages.',
				body: intent.name
			}, {
				promptHelp: '',
				okText: this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			})
				.then(function (dialogue) {
					if (dialogue.data === '') {
						self.showError('The name must not be empty!')
						return
					}
					if(self.dialogTemplate.intents.filter(a => a.name === dialogue.data).length){
						self.showError('That name is already taken!')
						return
					}
					intent.name = dialogue.data
					self.editingIntent = intent.name
				})
		},
		renameSlot(intent, slot){
			self = this
			this.$dialog.prompt({
					title: 'What should the slot be named?',
					body: slot.name
				}, {
					promptHelp: '',
					okText: this.$t('buttons.ok'),
					cancelText: this.$t('buttons.cancel')
				})
				.then(function (dialogue) {
					if (dialogue.data === '') {
						self.showError('The name must not be empty!')
						return
					}
					if(intent.slots.filter(a => a.name === dialogue.data).length){
						self.showError('That name is already taken!')
						return
					}
					let old = slot.name
					slot.name = dialogue.data

					let regex = new RegExp("{([^(:=>)]*?):=>"+old+"}", "g")
					for(let ind in Object.values(intent.utterances)){
						intent.utterances[ind] = intent.utterances[ind].replace(regex,"{$1:=>"+slot.name+"}")
					}
				})
		},
		resetValidity(e){
			e.target.setCustomValidity("")
			e.target.reportValidity()
		},
		addValue(){
			for(const slotNum in this.dialogTemplate.slotTypes){
				if( this.dialogTemplate.slotTypes[slotNum].name === this.editingSlotType){
					let newVal = {
						"value": ""+this.newValue,
						"synonyms": this.newSynonyms
					}
					this.dialogTemplate.slotTypes[slotNum].values.unshift(newVal)
					this.newValue = ""
					this.newSynonymCSV = ""
					this.$refs['new-val-input'][0].focus()
					return
				}
			}
		},
		addSlot(slots){
			if(this.newSlotName === ""){
				this.$refs.newSlotInput[0].setCustomValidity("Please provide a slot name!")
				this.$refs.newSlotInput[0].reportValidity()
				return
			}
			if(slots.filter(a => a.name === this.newSlotName).length){
				this.$refs.newSlotInput[0].setCustomValidity("That slot name already exists!")
				this.$refs.newSlotInput[0].reportValidity()
				return
			}
			this.$refs.newSlotInput[0].setCustomValidity("")
			this.$refs.newSlotInput[0].reportValidity()
			slots.push({'name':this.newSlotName, 'type':'', 'required':false, 'missingQuestion':''})
			this.newSlotName = ""
		},
		removeSlotFromIntent(intent, slot){
			this.$dialog.confirm({
				title: "Mind the consequences!",
				body: "Deleting a slot will remove all occurrences in the utterances",
				okText: "Delete",
				cancelText: this.$t('buttons.cancel'),
			}).then(function (dialog) {

				let regex = new RegExp("{([^(:=>)]*?):=>"+slot.name+"}", "g")
				for(let ind in Object.values(intent.utterances)){
					intent.utterances[ind] = intent.utterances[ind].replace(regex,"$1")
				}
				intent.slots = intent.slots.filter(v => v != slot);
			}).catch(() => {})
		},
		getSlotColor(index){
			return ['#1b4958', '#005000', '#cc8400', 'yellow', 'red'][index]
		},
		getHighlights(intent){
			let ret = []
			let index = 0
			if(intent.slots) {
				for (const i of intent.slots) {

					let slot = {}
					slot.slot = i.name
					slot.color = this.getSlotColor(index++)
					ret.push(slot)
				}
			}
			return ret
		},
		selectIntent(name){
			this.editingIntent = name
			this.editingSlotType = null
		},
		selectSlotType(name) {
			this.editingSlotType = name
			this.editingIntent = null
		},
		save(){
			let self = this
			for(const lang of Object.keys(this.dialogTemplates)){
			let data = {
					'lang': lang,
					'dialogTemplate': this.dialogTemplates[lang]
			}
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/setDialogTemplate/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						// $emit('success ')self.setSuccess()
						self.dialogTemplate = JSON.parse(response.data['dialogTemplate'])
						self.backupTemplate = self.dialogTemplate
					}
					else {
						// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function(e) {
				console.log(e)
				// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
			})
			}
		},
		loadDialogTemplate(){
			const data = {}
			let self = this
			this.$emit('waiting', true)
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/getDialogTemplate/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.dialogTemplates = response.data['dialogTemplates']
						self.backupTemplates = response.data['dialogTemplates']
						self.$emit('waiting', false)
					}
					else {
						self.$emit('failed')
					}
				}
			}).catch(function(e) {
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
	clear:both;
	display:flex;
	flex-direction: row;
	width:100%;
	padding:.5em;
	align-items: center;
	flex-wrap: wrap;
}
.stretched{
	width: 100%;
	height: 100%;
}
.inputWrapper {
	display: flex;
	align-items: baseline;
}
.lineContainer {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: 3rem 1fr 1fr 5rem 1fr;
	gap:.3em;
	align-items: center;
	margin: .2em 0;
	overflow: hidden;
	padding: 0 .5em 0 0;
}
.lineContainer * {
	min-width: 14rem;
	margin: 0;
	box-sizing: border-box;
}
.lineContainer *:first-child {
	min-width: 3rem;
	margin: .1em;
}
.lineContainer *:nth-child(4) {
	min-width: 5rem;
}
* > .lineContainer{
	background-color: var(--accent);
	padding: .5em;
}
* > .lineContainer ~ .lineContainer{
	background-color: var(--mainBG);
}
@media only screen and (max-width: 1192px) {
	.lineContainer {
		grid-auto-flow: row;
		width: 15em;
		align-content: center;
		grid-auto-columns: auto;
		padding: .5em;
	}
}
</style>
