<template>
	<div class="container flexcolumn">
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<div v-if="locationsEditMode" class="tools manageLocations">
			<i v-tooltip="$t('tooltips.addLocations')" :class="{clickable: !addingLocation, yellow: addingLocation}"
				 aria-hidden="true" class="fas fa-plus-circle fa-2x fa-fw" @click="addLocationDialog"/>
			<i v-tooltip="$t('tooltips.removeLocations')" :class="{clickable: !deletingLocations, yellow: deletingLocations}"
				 aria-hidden="true" class="fas fa-trash-alt fa-2x fa-fw" @click="deleteLocations"/>
			<i v-tooltip="$t('tooltips.settings')" :class="{clickable: !settingLocations, yellow: settingLocations}"
				 aria-hidden="true" class="fas fa-cogs fa-2x fa-fw" @click="toggleLocationSettings"/>
			<i v-tooltip="$t('tooltips.paintFloors')" aria-hidden="true" class="fas fa-paint-roller fa-2x fa-fw clickable"
				 @click="togglePaintingMode"/>
			<i v-tooltip="$t('tooltips.buildMode')" aria-hidden="true" class="fas fa-hard-hat fa-2x fa-fw clickable"/>
			<i v-tooltip="$t('tooltips.manageFurniture')" aria-hidden="true" class="fas fa-couch fa-2x fa-fw clickable"/>
		</div>
		<div v-if="locationsEditMode && paintingFloors" class="tools paintFloors">
			<img
				alt="unknown"
				v-for="imageId in floorTiles"
				:key="imageId"
				:class="{selected: imageId === activeFloorTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${imageId}.png`"
				class="clickable"
				@click="activeFloorTile === imageId ? activeFloorTile = '' : activeFloorTile = imageId"
			/>
		</div>
		<div :class="{fullscreen: $store.state.fullScreen, editMode: locationsEditMode}" class="myHomeEditor">
			<div
				:style="`transform: scale(${zoomLevel})`"
				:class="{
					locationsEditMode: locationsEditMode,
					addLocation: addingLocation
				}"
				class="floorPlan"
			>
				<div
					v-if="addingLocation"
					class="reactiveLayer"
					@mousedown="mouseDown"
					@mousemove="mouseMove"
					@mouseup="handleClick"
				>
					<div
						v-if="addingLocation && clicked"
						ref="areaSelector"
						:style="`top: ${areaSelectorY}px; left: ${areaSelectorX}px; width: ${areaSelectorW}px; height: ${areaSelectorH}px`"
						class="areaSelector"
					/>
				</div>
				<location
					v-for="location in locations"
					v-if="location.parentLocation === 0"
					:key="location.id"
					:location="location"
					:locations="locations"
					:myHome="me"
				/>
			</div>
		</div>
	</div>
</template>

<style src="../css/myhome.css" scoped/>
<script src="../js/myhome.js"/>
