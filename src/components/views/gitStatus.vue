<template>
	<span>
		<div v-if="status != 'unknown'" class="container">
			<div v-for="st of status" class="flexrow">
				<label>{{st.name}}</label>
				<input readonly :value="st.url"/>
				<i v-if="st.status" class="fas fa-check-circle" style="color: green"></i>
				<i v-if="!st.status" class="fas fa-times-circle" style="color: red"></i>
				{{request}}
			</div>
		</div>
		<div v-else>
			<i class="fab fa-github fa-spin size-4x centered"></i>
		</div>
	</span>

</template>

<script>
import axios from "axios";

export default {
	name: 'gitStatus',
	props: ['skill'],
	data: () => ({status : {},
								request: undefined}),
	mounted() {
		this.status = 'unknown'
		let self = this
		axios({
			method: 'GET',
			url: `/skills/${self.skill}/gitStatus/`,
			headers: {'auth': this.$store.getters.apiToken}
		}).then(function(resp) {
			self.status = resp.data.result
			console.log(resp)
		}).catch(function(e) {
			self.status = {}
			self.request = e
		})
	}
}
</script>

<style scoped>
label {
	min-width: 6em;
	max-width: 30em;
}
input {
	min-width: 35em;
}
.container{
	position: relative;
	display: flex;
	flex-flow: column;
}
.flexrow{
	gap: 1em;
	display: flex;
	flex-flow: row;
	align-items: center;
}
</style>
