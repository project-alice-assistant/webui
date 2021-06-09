<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.widgetOptions') }}</h3>
		<tabs
			:activeTabId="activeTabId"
			:parent="this"
			:tabs="tabs"
			:store="parent.$store"/>
		<div v-if="activeTabId === 1" class="tab_page">
			<div class="configLayout">
				<div v-if="Object.keys(widget.configs).length === 0" class="spacedText">No widget specific configuration</div>
				<config :templates="widget['configTemplate']"
								:holder="widget.configs"
								:translate="(val) => parent.$t(val)"/>
			</div>
		</div>
		<div v-if="activeTabId === 2" class="tab_page">
			<div class="configLayout">
				<config :templates="designConfig()"
								:holder="widget.settings"
								:translate="(val) => parent.$t(val)"/>
			</div>
		</div>
		<div class="dg-actions">
			<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
			<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
		</div>
	</div>
</template>

<script src="../js/widgetOptionsDialog.js"/>
<style src="../css/tabs.css" scoped/>
