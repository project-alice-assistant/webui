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
			<i v-tooltip="$t('tooltips.paintFloors')" :class="{yellow: paintingFloors}"
				 aria-hidden="true" class="fas fa-paint-roller fa-2x fa-fw clickable" @click="togglePaintingMode"/>
			<i v-tooltip="$t('tooltips.buildMode')" :class="{clickable: !placingConstructions, yellow: placingConstructions}"
				 aria-hidden="true" class="fas fa-hard-hat fa-2x fa-fw clickable" @click="toggleConstructionsMode"/>
			<i v-tooltip="$t('tooltips.manageFurniture')" :class="{yellow: placingFurniture}"
				 aria-hidden="true" class="fas fa-couch fa-2x fa-fw clickable" @click="toggleFurnitureMode"/>
		</div>
		<div v-if="locationsEditMode && paintingFloors" class="tools sideTools paintFloors">
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
		<div v-if="locationsEditMode && placingFurniture" class="tools sideTools placeFurniture">
			<img
				v-for="furnitureId in furnitureTiles"
				:key="furnitureId"
				:class="{selected: furnitureId === activeFurnitureTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${furnitureId}.png`"
				alt="unknown"
				class="clickable"
				@click="activeFurnitureTile === furnitureId ? activeFurnitureTile = '' : activeFurnitureTile = furnitureId"
			/>
		</div>
		<div v-if="locationsEditMode && placingConstructions" class="tools sideTools placeConstructions">
			<img
				v-for="conId in constructionTiles"
				:key="conId"
				:class="{selected: conId === activeConstructionTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/constructions/${conId}.png`"
				alt="unknown"
				class="clickable"
				@click="activeConstructionTile === conId ? activeConstructionTile = '' : activeConstructionTile = conId"
			/>
		</div>
		<div :class="{fullscreen: $store.state.fullScreen, editMode: locationsEditMode}" class="myHomeEditor">
			<div
				:style="`
					transform: scale(${zoomLevel});
					left:${floorPlanX}px;
					top:${floorPlanY}px;
				`"
				:class="{
					locationsEditMode: locationsEditMode,
					addLocation: addingLocation
				}"
				ref="floorPlan"
				class="floorPlan"
				@click="floorPlanClick"
				@mousedown="mouseDown"
				@mousemove="mouseMove"
				@mouseup="handleClick"
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
					:data="location"
					:locations="locations"
					:furnitures="furnitures"
					:constructions="constructions"
					:devices="devices"
					:myHome="me"
				/>
				<device
					v-for="dev in devices"
					v-if="dev.parentLocation === 0"
					:key="`dev_${dev.uid}`"
					:data="dev"
					:myHome="me"
				/>
			</div>
		</div>
	</div>
</template>

<style src="../css/myhome.css" scoped/>
<script src="../js/myhome.js"/>
