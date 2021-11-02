<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.locationSetting') }}</h3>
		<div class="synonyms">
			<div
				v-for="synonym in data.synonyms"
				:key="`syn_${synonym}`"
				class="synonym"
			>
				<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
					 @click="removeSynonym(synonym)"/>{{ synonym }}
			</div>
		</div>
		<p>
			<label for="newSynonym">{{ parent.$t('dialogs.labels.addLocationSynonym') }}</label>:
			<input
				id="newSynonym"
				v-model="newSynonym"
				:class="{error: error}"
				:placeholder="parent.$t('dialogs.placeholders.typeAndPressEnter')"
				name="newSynonym"
				type="text"
				@keyup="checkSynonym"
				@keyup.enter="addSynonym"
			>
		</p>
		<div>
			<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
		</div>
	</div>
</template>

<style scoped>
.synonyms {
	background: var(--mainBG);
	display: flex;
	flex-flow: row;
	flex-wrap: wrap;
	margin: auto auto 25px;
	min-height: 100px;
	padding: 10px;
	width: 95%;
}

.synonym {
	align-items: center;
	background-color: var(--windowBG);
	border: 1px solid var(--secondary);
	border-bottom-right-radius: 15px;
	border-top-right-radius: 15px;
	box-sizing: border-box;
	display: flex;
	font-family: var(--italic);
	font-size: 1em;
	height: 2em;
	margin-bottom: 10px;
	margin-right: 10px;
	padding: 3px 15px 3px 6px;
}

.error {
	border: 1px dotted red;
	color: red;
}
</style>

<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins:  [VueDialogMixin],
	data:    function () {
		return {
			parent:     this.options['parent'],
			data:       this.options['data'],
			newSynonym: '',
			error:      false
		}
	},
	methods: {
		checkSynonym() {
			this.error = !this.parent.myHome.checkIfSynonymIsFree(this.newSynonym)
		},
		addSynonym() {
			if (this.newSynonym.length <= 0 || !this.parent.myHome.checkIfSynonymIsFree(this.newSynonym)) return
			this.parent.data.synonyms.push(this.newSynonym)
			this.newSynonym = ''
		},
		removeSynonym(synonym) {
			this.parent.data.synonyms = this.parent.data.synonyms.filter(syn => syn !== synonym)
		},
		handleConfirm() {
			this.proceed()
		},
		handleDismiss() {
			this.cancel()
		}
	}
}
</script>
