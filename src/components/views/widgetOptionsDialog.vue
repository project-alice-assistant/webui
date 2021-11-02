<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.widgetOptions') }}</h3>
		<tabs
			:activeTabId="activeTabId"
			:parent="this"
			:store="parent.$store"
			:tabs="tabs"/>
		<div v-if="activeTabId === 1" class="tab_page">
			<div class="configLayout">
				<div v-if="Object.keys(widget.configs).length === 0" class="spacedText">No widget specific configuration</div>
				<config :holder="widget.configs"
								:templates="widget['configTemplate']"
								:translate="(val) => parent.$t(val)"/>
			</div>
		</div>
		<div v-if="activeTabId === 2" class="tab_page">
			<div class="configLayout">
				<config :holder="widget.settings"
								:templates="designConfig()"
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
<style scoped src="../css/tabs.css"/>
