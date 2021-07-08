<template>
<div>
	<h1>Talk Files</h1>
	Here is the place to define all the stuff Alice should be able to say with your skill.<br/>
	Further more this is the place to go to when you want to translate the output to a different language.<br/>
	<br/>
	<div v-if="missingInLang.length > 0">
		<div class="red">
		There are talks missing in this language!
		</div>
		Click to add them: <br/>
		<span class="clickable" v-for="miss in missingInLang" @click="addTalk(miss)"><i class="fas fa-plus-circle"/>{{miss}} </span>
	</div>
	<div v-if="showRaw">
		<div class="clickable" @click="showRaw=false"><i class="fas fa-caret-down"></i> Raw talk file:</div>
		<textarea v-model="stringified" :class="{inputErrorImp: !this.stringValid}"></textarea>
	</div>
	<div v-else class="clickable" @click="showRaw=true">
		<i class="fas fa-caret-right"></i> Click here to show the raw talk file
	</div>
	<div v-for="(val,key) in talkFiles[currentLang]">
		<div class="configLine">
			<button @click="removeTalk(key)"><i class="fas fa-minus-circle size-15x"></i></button>
			<div class="likeInput clickable" @click="rename(key)">{{key}} <i class="fas fa-pen"></i></div>
		</div>
		<div v-for="(v2,k2) in val">{{k2}}:
			<configInputList v-model="talkFiles[currentLang][key][k2]"
											 :template="{name:k2,
																	 dataType:'userList',
																	 subType:'string'}"/>
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
			showRaw: false
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
		}
	},
	methods:{
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
				body: "When you are sure there is no use for this talk, you should delete it for all languages!",
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
			// $emit('waiting') instead of this.setWaiting()
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
						// $emit('success ')self.setSuccess()

						self.talkFiles = response.data['talkFiles']
						self.talkFilesBackup = JSON.parse(JSON.stringify(response.data['talkFiles']))
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
		save(){
			for(const lang in this.talkFiles){
				if(JSON.stringify(this.talkFiles[lang]) != JSON.stringify(this.talkFilesBackup[lang])) {
					this.saveLang(lang)
				}
			}
		},
		saveLang(language){
			let self = this
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
						// $emit('success ')self.setSuccess()
						self.talkFiles[language] = JSON.parse(response.data['talkFile'])
						self.talkFilesBackup[language] = JSON.parse(response.data['talkFile'])
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

</style>
