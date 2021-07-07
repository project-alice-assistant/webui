<template>
<div>
	<h1>Talk Files</h1>
	Here is the place to define all the stuff Alice should be able to say with your skill.<br/>
	Further more this is the place to go to when you want to translate the output to a different language.<br/>
	<br/>
	<div v-if="freeStyle">
		<textarea>{{JSON.stringify(talkFiles[currentLang], null, 2)}}</textarea>
	</div>
	<div v-else v-for="(val,key) in talkFiles[currentLang]">
		<div class="configLine">
			<button @click="removeTalk(key)"><i class="fas fa-minus-circle size-15x"></i></button>
			<div class="likeInput clickable">{{key}} <i class="fas fa-pen"></i></div>
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
			talkFilesBackup: {}
		}
	},
	mounted() {
		this.loadFiles()
	},
	methods:{
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
						self.talkFilesBackup = response.data['talkFiles']
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
	}
}
</script>

<style scoped>

</style>
