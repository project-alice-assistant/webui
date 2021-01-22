<template>
	<div class="custom-view-wrapper">
		<h3>{{parent.$t('dialogs.titles.widgetOptions')}}</h3>
		<div class="configLayout">
			<div class="labels">
				<label for="title">{{parent.$t('dialogs.labels.displayTitle')}}: </label>
				<label for="borders">{{parent.$t('dialogs.labels.displayBorders')}}: </label>
				<label for="background">{{parent.$t('dialogs.labels.backgroundColor')}}: </label>
				<label for="opacity">{{parent.$t('dialogs.labels.backgroundOpacity')}}: </label>
				<label for="font-size">{{parent.$t('dialogs.labels.fontSize')}}: </label>
				<label for="font-color">{{parent.$t('dialogs.labels.fontColor')}}: </label>
			</div>
			<div class="inputs">
				<div class="input">
					<VueToggles
						id="title"
						:checked-text="parent.$t('tooltips.yes')"
						:unchecked-text="parent.$t('tooltips.no')"
						:value="options['widget']['settings']['title']"
						@click="options['widget']['settings']['title'] = !options['widget']['settings']['title']"
						uncheckedBg="var(--windowBG)"
						checkedBg="var(--windowBG)"
					/>
				</div>
				<div class="input">
					<VueToggles
						id="borders"
						:checked-text="parent.$t('tooltips.yes')"
						:unchecked-text="parent.$t('tooltips.no')"
						:value="options['widget']['settings']['borders']"
						@click="options['widget']['settings']['borders'] = !options['widget']['settings']['borders']"
						uncheckedBg="var(--windowBG)"
						checkedBg="var(--windowBG)"
					/>
				</div>
				<div class="input">
					<input
						id="background"
						type="color"
						v-model="options['widget'].settings['background']"
						v-init="options['widget'].settings['background']"
						@input="hex2rgba"
					/>
				</div>
				<div class="input">
					<input
						id="opacity"
						type="range"
						min="0"
						max="1"
						step="0.1"
						v-model="options['widget'].settings['background-opacity']"
						v-init="options['widget'].settings['background-opacity']"
						@input="hex2rgba"
					/><span class="inputRangeValue">{{ parseFloat(options['widget'].settings['background-opacity']) * 100 }}%</span>
				</div>
				<div class="input">
					<input
						id="font-size"
						type="range"
						min="0.25"
						max="5"
						step="0.01"
						v-model="options['widget'].settings['font-size']"
						v-init="options['widget'].settings['font-size']"
					/><span class="inputRangeValue">{{ options['widget'].settings['font-size'] }}em</span>
				</div>
				<div class="input">
					<input
						id="font-color"
						type="color"
						v-model="options['widget'].settings['color']"
						v-init="options['widget'].settings['font-size']"
					/>
				</div>
			</div>
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
			parent: this.options['parent']
		}
	},
	methods: {
		handleConfirm() {
			this.proceed(this.options['widget'])
		},
		handleDismiss() {
			this.cancel()
		},
		hex2rgba() {
			let hex = this.options['widget'].settings['background']
			let alpha = this.options['widget'].settings['background-opacity']
			const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
			this.options['widget'].settings['rgba'] = `rgba(${r}, ${g}, ${b}, ${alpha})`
		}
	}
};
</script>
