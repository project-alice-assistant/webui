<template>
	<div class="flexrow nowrap stretched yscroll">
		<div class="leftBar">
			<label class="categoryHead">Talks</label>
			<configInputList v-if="talkFiles[currentLang]"
											 v-model="talkFiles[currentLang]"
											 v-init="talkFiles[currentLang]"
											 :template="{name:'intents',
																		dataType:'userList',
																		subType:'keyForDict',
																		dictTemplate: { default: [],
																										short: [] } }"
											 :proposedItems="missingInLang"
											 :allow-double="false"
											 @item-selected="selectTalk"
											 :selectedItem="editingTalk"/>

		</div>
		<div class="contained" style="width: 100%;overflow: inherit;">
			<div v-if="!editingTalk">
				<h1>Talk Files</h1>
				Here is the place to define all the stuff Alice should be able to say with your skill.<br/>
				Furthermore this is the place to go to when you want to translate the output to a different language.<br/>
				For detailed information, have a look at <a href="https://docs.projectalice.io/skill-development/files-in-depth.html#talk-files">docs.ProjectAlice.io</a>
				or click on the <i class="fas fa-question-circle"></i> on the top right.

				<p>You may switch between the languages, without saving - but don't move to another tab!</p>
				<br/>
			<div v-if="missingInLang.length > 0">
				<div class="red">
					There are talks missing in this language!
				</div>
				Add them by clicking the <i class="fas fa-plus-circle red"></i> in the list to the left
			</div>
			<br/>
			<div v-if="showRaw">
				<a @click="showRaw=false"><i class="fas fa-caret-down"></i> Raw talk file:</a><br/>
				<textarea v-model="stringified" :class="{inputErrorImp: !this.stringValid}"></textarea>
			</div>
			<a v-else @click="showRaw=true">
				<i class="fas fa-caret-right"></i> Click here to show and edit the raw talk file
			</a>
		</div>
			<div v-else-if="editingTalk && selectedExists">
				<div v-for="(val,key) in talkFiles[currentLang]" v-if="key == editingTalk">
					<h1 class="clickable" @click="rename(key)">{{ key }} <i class="fas fa-pen"></i></h1>
					<div v-if="talkFiles[currentLang][key]['default'] === undefined">
						<div class="inputBlock"><label>Default:</label>
							<configInputList v-model="talkFiles[currentLang][key]"
															 :template="{name:'default',
																				 dataType:'userList',
																				 subType:'string'}"/>
						</div>
					</div>
					<div v-else>
						<div class="inputBlock"><label>Default:</label>
							<configInputList v-model="talkFiles[currentLang][key]['default']"
															 :template="{name:'default',
																					 dataType:'userList',
																					 subType:'string'}"/>
						</div>
						<div class="inputBlock"><label>Short:</label>
							<configInputList v-model="talkFiles[currentLang][key]['short']"
															 :template="{name:'default',
																					 dataType:'userList',
																					 subType:'string'}"/>
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<h1>{{ editingTalk }}</h1>
				<p>This talk is missing for the current language, but exists for others!</p>
				<p>Add it by clicking on the plus in the list!</p>
				<p>To delete it from all languages - click here:</p>
				<button @click="removeTalk(editingTalk)" class="danger">
					<i class="fas fa-skull-crossbones size-2x"></i>
					Yes - Delete in all languages
					<i class="fas fa-skull-crossbones size-2x"></i>
				</button>
			</div>
		</div>
</div>
</template>

<script>
import axios from "axios";

export default {
	name: "talkFileEditor",
	props: [ 'editingSkill',
		       'currentLang'],
	data() {
		return {
			talkFiles: {},
			talkFilesBackup: {},
			stringified: "",
			stringValid: true,
			noWatch: false,
			showRaw: false,
			editingTalk: ""
		}
	},
	watch: {
		stringified: function () {
			if(this.noWatch) return
			try {
				this.noWatch = true
				this.talkFiles[this.currentLang] = JSON.parse(this.stringified)
				this.stringValid = true
				this.$nextTick(() => { self.noWatch = false });
			} catch (e) {
				this.stringValid = false
				this.$nextTick(() => { self.noWatch = false });
			}
		},
		talkFiles: {
			deep: true,
			handler(talkFiles) {
				if (this.noWatch) return
				this.noWatch = true
				this.stringified = JSON.stringify(this.talkFiles[this.currentLang], null, 2)
				self = this
				this.$nextTick(() => {
					self.noWatch = false
				});
			}
		},
		currentLang: function () {
			if(!this.talkFiles.hasOwnProperty(this.currentLang)){
				this.$set(this.talkFiles, this.currentLang, {})
			}
			this.stringified = JSON.stringify(this.talkFiles[this.currentLang], null, 2)
		}
	},
	mounted() {
		this.loadFiles()
	},
	computed:{
		allSlots(){
			let collect = []
			for( const lang in this.talkFiles){
				collect = [...new Set([...collect, ...Object.keys(this.talkFiles[lang])])]
			}
			return collect
		},
		missingInLang(){
			return this.allSlots.filter(a => !this.talkFiles[this.currentLang].hasOwnProperty(a))
		},
		selectedExists(){
			return !this.missingInLang.includes(this.editingTalk)
		}
	},
	methods:{
		selectTalk(talk){
			this.editingTalk = talk
		},
		addTalk(talk){
			this.$set(this.talkFiles[this.currentLang], talk, { 'default': [], 'short': [] })
		},
		rename(talk){
			self = this
			this.$dialog.prompt({
				title: 'What should be the new name for this talk? Changes will be applied to all languages!',
				body: talk
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
					if(self.allSlots.includes(dialogue.data)){
						self.showError('That name is already taken!')
						return
					}
					let renameProp = (
						oldProp,
						newProp,
						{ [oldProp]: old, ...others }
						) => {
						return {
							[newProp]: old,
							...others
						}
					}
					for(const lang in self.talkFiles){
						self.talkFiles[lang] = renameProp(talk, dialogue.data, self.talkFiles[lang])
					}
				})
		},
		removeTalk(key){
			let self = this
			this.$dialog.confirm({
				title: "Delete for all languages?",
				body: "This will delete the talk for all languages!",
				okText: "Delete",
				cancelText: this.$t('buttons.cancel'),
			}).then(function (dialog) {
				for(const lang in self.talkFiles) {
					self.$delete(self.talkFiles[lang], [key])
				}
			}).catch(() => {})

		},
		loadFiles(){
			const data = {}
			let self = this
			self.$emit('waiting', true)
			axios({
				method: 'POST',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/getTalkFiles/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.talkFiles = response.data['talkFiles']
						self.talkFilesBackup = JSON.parse(JSON.stringify(response.data['talkFiles']))
						self.$emit('waiting', false)
					}
					else {
						self.$emit('failed')
						// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function(e) {
				console.log(e)
				self.$emit('failed')
				// $emit('failed')self.setFailed(response.data['message'] || "Unknown Error")
			})
		},
		save(){
			for(const lang in this.talkFiles){
				if(JSON.stringify(this.talkFiles[lang]) != JSON.stringify(this.talkFilesBackup[lang])) {
					this.saveLang(lang)
				}
			}
		},
		saveLang(language){
			let self = this
			self.$emit('waiting')
			let data = {
				'lang': language,
				'talkFile': this.talkFiles[language]
			}
			axios({
				method: 'PATCH',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/skills/${this.editingSkill.name}/setTalkFile/`,
				data: data,
				headers: {
					'auth': this.$store.getters.apiToken,
					'content-type': 'application/json'
				}
			}).then(function(response) {
				if ('success' in response.data) {
					if (response.data['success']) {
						self.$emit('success')
						self.talkFiles[language] = JSON.parse(response.data['talkFile'])
						self.talkFilesBackup[language] = JSON.parse(response.data['talkFile'])
					}
					else {
						self.$emit('failed', response.data['message'] || "Unknown Error")
					}
				}
			}).catch(function(e) {
				console.log(e)
				self.$emit('failed', "Unknown Error")
			})
		},
	}
}
</script>

<style scoped>
.inputBlock {
	margin: 1em;
}
</style>
