<template>
	<div class="custom-view-wrapper">
		<div class="dg-content-body dg-content-body--has-title">
			<h6 class="dg-title">{{ parent.$t('dialogs.titles.newIcon') }}</h6>
			<div class="dg-content" v-html="parent.$t('dialogs.bodies.enterNewIcon')"/>
			<form autocomplete="off" class="dg-form" data-children-count="1" v-on:submit.prevent>
				<label for="dg-input-elem">{{ parent.$t('dialogs.labels.faExample') }}</label><br/><br/>
				<input type="text" autocomplete="off" id="dg-input-elem" v-model="iconInput" @input="update"/>
			</form>
		</div>
		<div class="dg-content-footer">
			<button style="background-color: var(--windowBG);" @click="handleDismiss">
				{{ parent.$t('buttons.cancel') }}
			</button>
			<button class="dg-pull-right" style="background-color: var(--windowBG);" @click="handleConfirm">
				<i :class="icon" aria-hidden="true" class="fa-2x"/>
			</button>
		</div>
	</div>
</template>


<script>
import VueDialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'

export default {
	mixins: [VueDialogMixin],
	data: function() {
		return {
			parent: this.options['parent'],
			iconInput: this.options['current'] || 'fas fa-biohazard'
		}
	},
	computed: {
		icon: function () {
			const regex = /<i class="(.*)"><\/i>/;
			const matches = regex.exec(this.iconInput)
			if(matches){
				return matches[1]
			}
			return this.iconInput
	} },
	methods: {
		handleConfirm() {
			this.proceed(this.icon)
		},
		handleDismiss() {
			this.cancel()
		},
		update() {
			this.$forceUpdate()
		}
	}
};
</script>
