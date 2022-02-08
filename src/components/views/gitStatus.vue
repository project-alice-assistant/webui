<template>
	<div>
		<div v-if="status !== 'loading'" class="container">
			<div class="flexrow"><i class="fab fa-github size-4x"></i>
				<button v-on:mouseup="reload()"><i class="fas fa-sync-alt size-2x"></i> Refresh Status</button>
				<button v-if="advanced" v-on:mouseup="advanced = !advanced"><i class="fas fa-user-secret size-2x"></i> Advanced Mode</button>
				<button v-else v-on:mouseup="advanced = !advanced"><i class="fas fa-user size-2x"></i> Standard Mode</button>
			</div>
			<br/>
			<br/>
			<br/>
			<div>Uncommitted changes: {{ Object.keys(changes).length }}</div>
			<div v-if="advanced">
				<textarea>{{ changes }}</textarea>
			</div>
			<br/>
			<div class="noRepo flexrow">
				<div v-if="initialUploadRequired">
					It looks like you never uploaded this skill!<br/>
					Use the following button to upload it to your private github repository.<br/>
					Only once uploaded there, you can release it for others to see and use!<br/>
					<button v-on:mouseup="upload()">Initial Upload</button>
				</div>
				<div v-if="gitInitRequired">
					Oh no! You never initialised this skills folder as a git repository!<br/>
					<button>Initialise Git</button>
				</div>
			</div>
			<div v-for="st of status">
				<div class="flexrow" v-bind:class="{ active: st.name == upstream.remote }">
				<label style="width: 5em;">{{ st.name }}<div>{{ st.repoType }}</div></label>
				<input :value="st.url" readonly/>
				<i v-if="st.status" class="fas fa-check-circle" style="color: green"></i>
				<i v-if="!st.status" class="fas fa-times-circle" style="color: red"></i>
				<i v-if="st.commitsBehind > 0" class="fas fa-minus" style="color: yellow"> {{ st.commitsBehind }}</i>
				<i v-if="st.commitsAhead > 0" class="fas fa-plus" style="color: yellow"> {{ st.commitsAhead }}</i>
					<i v-if="st.commitsAhead == 0 && st.commitsBehind == 0" class="fas fa-equals"></i>
					<i v-if="st.commitsAhead == -1 || st.commitsBehind == -1" class="fas fa-question" style="color: gray"></i>
				{{ request }}
				</div>
				<div>
					<select v-model="selectedBranch[st.name]">
						<option v-for="branch of Object.keys(st.lsRemote)">{{branch}}</option>
					</select>
				</div>
				<div v-if="st.name == 'Public'" class="small">
					changing tags/branches might cause unexpected results!
				</div>
				<div class="flexrow">
					<button v-on:mouseup="checkout(st.name)">Checkout</button>
					<button v-if="st.name == 'Private'" v-on:mouseup="upload()">Upload</button>
					<button v-if="!privateExists && st.name == 'Public'" v-on:mouseup="fork()">Fork</button>
					<button v-if="publicExists && st.name == 'Private'" v-on:mouseup="createPR(st.user)">Create PR</button>
					<button v-on:mouseup="open(st.url)">Web</button>
				</div>
				<br/>
				<br/>
			</div>
			<div v-if="advanced">
				<div class="flexrow">
					<label style="width: 5em;">new</label>
					<input id="newRepo" />
				</div>
				<div class="flexrow">
					<button>Add new</button>
				</div>
			</div>
		</div>
		<div v-else>
			<i class="fab fa-github fa-spin size-4x centered"></i>
			<span class="centered">{{ activeCommand }}..</span>
		</div>
	</div>

</template>

<script>
import axios from 'axios'

export default {
	name:  'gitStatus',
	props: ['skill'],
	data:  () => ({
		status:  {},
		changes: {},
		upstream: {},
		selectedBranch: {},
		request: undefined,
		privateExists: false,
		publicExists: false,
		PRpossible: false,
		initialUploadRequired: false,
		gitInitRequired: false,
		advanced: false,
		activeCommand: 'git fetch'
	}),
	mounted() {
		this.reload()
	},
	methods:  {
		checkout(remote) {
			let self = this
			this.activeCommand = 'git checkout'
			axios({
				method:  'GET',
				url:     `/skills/${this.$parent.editingSkill.name}/checkout/${remote}/${this.selectedBranch[remote]}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function (resp) {
				if(resp.data.success == true){
					self.reload()
				} else {
					console.log(resp.data)
					self.status = undefined
				}
			})
		},
		upload(remote) {
			this.activeCommand = 'git push'
			this.init()
			let self = this
			axios({
				method: 'GET',
				url: `/skills/${self.skill}/upload/${remote}/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function (resp) {
				if(resp.data.success == true){
					self.reload()
				} else {
					console.log(resp.data)
					self.status = undefined
				}
			}).catch(function (e) {
				self.status = undefined
				self.request = e
			})
		},
		fork() {
			this.activeCommand = 'Web: Creating fork'
			this.init()
			let self = this
			axios({
				method: 'GET',
				url: `/skills/${self.skill}/setModified/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function (resp) {
				if(resp.data.success == true){
					self.reload()
				} else {
					console.log(resp.data)
					self.status = undefined
				}
			}).catch(function (e) {
				self.status = undefined
				self.request = e
			})

		},
		open(url) {
			window.open(url, '_blank')
		},
		init() {
			this.status = 'loading'
			this.changes = {}
			this.privateExists = false
			this.publicExists = false
			this.PRpossible = false
			this.initialUploadRequired = false
			this.gitInitRequired = false
		},
		createPR(source) {
			self = this
			this.$dialog.prompt({
				title: 'Please name your Pull Request',
				body:  'Make sure you have Uploaded all your changes and changed the skills Version!'
					+ 'The name should be short and precisely describe your changes'
			}, {
				promptHelp: '',
				okText:     this.$t('buttons.ok'),
				cancelText: this.$t('buttons.cancel')
			})
				.then(function (dialogue) {
					let prTitle = dialogue.data
					window.open('https://github.com/project-alice-assistant/skill_'
						+ self.$parent.editingSkill.name + '/compare/master...' + source + ':master'
						+ '?diff=split&quick_pull=1&title=' + prTitle)
				})
		},
		reload() {
			/*
			* reload the git status
			*/
			this.init()
			this.activeCommand = 'git fetch'
			let self = this
			axios({
				method: 'GET',
				url: `/skills/${self.skill}/gitStatus/`,
				headers: {'auth': this.$store.getters.apiToken}
			}).then(function (resp) {
				if(resp.data.success == true){
					let tmpUpstream = resp.data.upstream.split('/')
					self.upstream.remote = tmpUpstream[0]
					self.upstream.branch = tmpUpstream[1]
					for(let st in resp.data.result) {
						//console.log(resp.data.result[st])
						if( resp.data.result[st].repoType === 'Private'){
							self.privateExists = true
						} else if ( resp.data.result[st].repoType === 'Public'){
							self.publicExists = true
						}
						if( resp.data.result[st].name == self.upstream.remote ) {
							self.selectedBranch[self.upstream.remote] = self.upstream.branch
						} else {
							self.selectedBranch[resp.data.result[st].name] = "master"
						}
					}
					self.status = resp.data.result
					self.changes = resp.data.changes
				} else {
					console.log(resp.data)
					if(resp.data.noRemote){
						self.initialUploadRequired = true
					} else if(resp.data.noGit){
						self.gitInitRequired = true
					}
					self.status = undefined
				}
			}).catch(function (e) {
				self.status = {}
				self.request = e
			})

		}
	}
}
</script>

<style scoped>
label {
	max-width: 30em;
	min-width: 6em;
}

input {
	min-width: 35em;
}

.container {
	display: flex;
	flex-flow: column;
	position: relative;
}

.flexrow {
	align-items: center;
	display: flex;
	flex-flow: row;
	gap: 1em;
}
</style>
