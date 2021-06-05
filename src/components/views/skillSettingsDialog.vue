<!--suppress HtmlFormInputWithoutLabel, HtmlUnknownAttribute -->
<template>
	<div class="custom-view-wrapper">
		<h3>{{parent.$t('dialogs.titles.skillSettings')}}</h3>
		<div class="configLayout">
				<configLine v-for="(template, configName) in options['skill']['settingsTemplate']"
										:configName="configName"
										:holder="options['skill']['settings']"
										:translate="(val) => parent.$t(val)"
										:template="template"/>
		</div>
		<div>
			<button @click="handleDismiss">{{parent.$t('buttons.cancel')}}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{parent.$t('buttons.confirm')}}</button>
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
			skill: this.options['skill']
		}
	},
	methods: {
		handleConfirm() {
			this.proceed(this.options['skill']['settings'])
		},
		handleDismiss() {
			this.cancel()
		}
	}
};
</script>
