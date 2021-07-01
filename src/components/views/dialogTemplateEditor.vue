<template>
	<div>
		<div class="flexrow">
			<div>
				<label>Intents</label>
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
				<label>SlotTypes</label>
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
																										values: [] } }"
												 :allow-double="false"
												 @item-selected="selectSlotType"
												 :selectedItem="editingSlotType"/>
			</div>
			<div class="contained">
				<div v-if="editingIntent === null && editingSlotType === null">Please select an intent for adding slots and utterances!</div>
				<div v-else-if="editingIntent !== null">
					<div v-for="intent of Object.values(dialogTemplate.intents)"
							 v-if="intent.name === editingIntent">
						<h3>{{ intent.name }}</h3>
						<div class="configLine">
							<label>enabled By Default</label><input v-model="intent.enabledByDefault" type="checkbox"/>
						</div>
<!--						<div class="configLine">
							<label>add Slot</label><input v-model="addSlotType" type="text"/>
						</div>-->
					<configInputList v-model="intent.utterances"
													 v-init="intent.utterances"
													 :template="{name:'intents',
																		dataType:'userList',
																		subType:'utterance',
																		highlights: getHighlights(intent)}"
													 @item-selected="selectIntent"
													 :selectedItem="editingIntent"/><br/>
					4. trigger training?
					</div>
				</div>
				<div v-else>
					<div v-for="slot of Object.values(dialogTemplate.slotTypes)"
						v-if="slot.name === editingSlotType">
						<h3>{{ slot.name }}</h3>
						<div class="configLine">
						<label>matching Strictness</label><input v-model="slot.matchingStrictness" type="checkbox"/>
						</div>
						<div class="configLine">
						<label>Automatically Extensible</label><input v-model="slot.automaticallyExtensible" type="checkbox"/><br/>
						</div>
						<div class="configLine">
						<label>Use Synonyms</label><input v-model="slot.useSynonyms" type="checkbox"/><br/>
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
							<div v-for="val of Object.values(slot.values)"
								 class="slotLine">
							<input v-model="val.value"/>
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
	props: ['editingSkill'],
	data: function () {
		return {
			dialogTemplate: {},
			backupTemplate: {},
			editingIntent: null,
			editingSlotType: null,
			currentLang: 'en',
			newValue: "",
			newSynonymCSV: ""
		}
	},
	mounted() {
		this.loadDialogTemplate()
	},
	computed: {
		newSynonyms: function () {
			if(this.newSynonymCSV.trim() === "") return []
			return this.newSynonymCSV.split(",")
		}
	},
	methods: {
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
		getSlotColor(index){
			return ['#1b4958', '#005000', 'orange', 'yellow', 'red'][index]
		},
		getHighlights(intent){
			let ret = []
			console.log(intent)
			let index = 0
			for(const i of Object.values(intent.slots)){
				let slot = {}
				slot.slot = i.name
				slot.color = this.getSlotColor(index++)
				ret.push(slot)
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
			let data = {
				'lang': this.currentLang,
				'dialogTemplate': this.dialogTemplate
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
		},
		loadDialogTemplate(){
			const data = {"lang": this.currentLang }
			let self = this
			// $emit('wating') instead of this.setWaiting()
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
		},
	}
}
</script>

<style scoped>
.slotLine {
	display: flex;
}
>>> input {
	margin: .3em;
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
</style>
