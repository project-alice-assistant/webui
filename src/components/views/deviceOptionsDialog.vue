<!--suppress JSUnresolvedVariable -->
<template>
	<div class="custom-view-wrapper">
		<h3>{{ parent.$t('dialogs.titles.deviceSettings') }}</h3>
		<h4>{{ parent.$t('dialogs.titles.generalSettings') }}</h4>
		<config :holder="$data.parent.$store.state.devices[parent.data['id']].deviceConfigs"
						:templates="deviceTemplates"
						:translate="(val) => parent.$t(val)"/>
		<h4 v-if="parent.myLinks.length > 0">{{ parent.$t('dialogs.titles.deviceLinksSettings') }}</h4>
		<div v-for="(link, linkId) in parent.myLinks" :key="linkId">
			<h5>{{ parent.$t('dialogs.titles.linkTo') }}: {{
					$data.parent.$store.state.locations[$data.parent.$store.state.deviceLinks[linkId].targetLocation].name
				}}</h5>
			<config :holder="$data.parent.$store.state.deviceLinks[linkId].configs"
							:templates="myLinkConfigTemplates"
							:translate="(val) => parent.$t(val)"/>
		</div>
		<button @click="handleDismiss">{{ parent.$t('buttons.cancel') }}</button>
		<button class="dg-pull-right" @click="handleConfirm">{{ parent.$t('buttons.confirm') }}</button>
	</div>
</template>

<style scoped>

</style>

<script src="../js/deviceOptionsDialog.js"/>
