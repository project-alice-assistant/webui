<template>
	<div class="container flexcolumn">
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<div v-if="locationsEditMode" class="tools">
			<i v-tooltip="$t('tooltips.addLocations')" :class="{clickable: !addingLocation, yellow: addingLocation}"
				 aria-hidden="true" class="fas fa-plus-circle fa-2x fa-fw" @click="addLocationDialog"/>
			<i v-tooltip="$t('tooltips.removeLocations')" aria-hidden="true" class="fas fa-trash-alt fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.paintFloors')" aria-hidden="true" class="fas fa-paint-roller fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.buildMode')" aria-hidden="true" class="fas fa-hard-hat fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.manageFurniture')" aria-hidden="true" class="fas fa-couch fa-2x fa-fw clickable"/>
		</div>
		<div class="myHomeEditor" :class="{fullscreen: $store.state.fullScreen}">
			<div :class="{
				locationsEditMode: locationsEditMode,
				addLocation: addingLocation
			}" class="floorPlan">
			</div>
		</div>
	</div>
</template>

<style src="../css/myhome.css" scoped/>
<script src="../js/myhome.js"/>
