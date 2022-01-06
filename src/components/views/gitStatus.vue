<template>
	<div>
		<div v-if="status !== 'unknown'" class="container">
			<div v-for="st of status" class="flexrow">
				<label style="width: 5em;">{{ st.name }}</label>
				<input :value="st.url" readonly/>
				<i v-if="st.status" class="fas fa-check-circle" style="color: green"></i>
				<i v-if="!st.status" class="fas fa-times-circle" style="color: red"></i>
				<i v-if="st.commitsBehind > 0" class="fas fa-arrow-up" style="color: yellow">{{ st.commitsBehind }}</i>
				<i v-if="st.commitsAhead > 0" class="fas fa-arrow-down" style="color: yellow">{{ st.commitsAhead }}</i>
				{{ request }}
			</div>
		</div>
		<div v-else>
			<i class="fab fa-github fa-spin size-4x centered"></i>
			<span class="centered">fetching..</span>
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
		request: undefined
	}),
	mounted() {
		this.status = 'unknown'
		let self = this
		axios({
			method:  'GET',
			url:     `/skills/${self.skill}/gitStatus/`,
			headers: {'auth': this.$store.getters.apiToken}
		}).then(function (resp) {
			self.status = resp.data.result
			console.log(resp)
		}).catch(function (e) {
			self.status = {}
			self.request = e
		})
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
