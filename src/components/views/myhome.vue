<template>
	<div :key="uid" class="container flexcolumn">
		<v-tour :callbacks="tourCallbacks" :steps="steps" name="myHome"/>
		<actions-menu :menuItems="menuItems" v-if="$store.state.loggedInUser"/>
		<div v-if="locationsEditMode" class="tools rightSideTools">
			<i v-tooltip="$t('tooltips.addLocations')" :class="{yellow: toolsState.addingLocation}"
				 aria-hidden="true" class="fas fa-plus-circle fa-2x fa-fw clickable" @click="addLocationDialog"/>
			<i v-tooltip="$t('tooltips.removeLocations')" :class="{yellow: toolsState.deletingLocations}"
				 aria-hidden="true" class="fas fa-trash-alt fa-2x fa-fw clickable" @click="setActiveTool('deletingLocations', true)"/>
			<i v-tooltip="$t('tooltips.settings')" :class="{yellow: toolsState.settingLocations}"
				 aria-hidden="true" class="fas fa-cogs fa-2x fa-fw clickable" @click="setActiveTool('settingLocations', true)"/>
			<i v-tooltip="$t('tooltips.paintFloors')" :class="{yellow: toolsState.paintingFloors}"
				 aria-hidden="true" class="fas fa-paint-roller fa-2x fa-fw clickable"
				 @click="setActiveTool('paintingFloors', true)"/>
			<i v-tooltip="$t('tooltips.buildMode')" :class="{yellow: toolsState.placingConstructions}"
				 aria-hidden="true" class="fas fa-hard-hat fa-2x fa-fw clickable"
				 @click="setActiveTool('placingConstructions', true)"/>
			<i v-tooltip="$t('tooltips.manageFurniture')" :class="{yellow: toolsState.placingFurniture}"
				 aria-hidden="true" class="fas fa-couch fa-2x fa-fw clickable"
				 @click="setActiveTool('placingFurniture', true)"/>
		</div>
		<div v-if="devicesEditMode" class="tools rightSideTools">
			<i v-tooltip="$t('tooltips.addDevice')" :class="{yellow: toolsState.addingDevice}"
				 aria-hidden="true" class="fas fa-plus-circle fa-2x fa-fw clickable" @click="addDeviceDialog"/>
			<i v-tooltip="$t('tooltips.removeDevice')" :class="{yellow: toolsState.deletingDevices}"
				 aria-hidden="true" class="fas fa-trash-alt fa-2x fa-fw clickable" @click="setActiveTool('deletingDevices', true)"/>
			<i v-tooltip="$t('tooltips.settings')" :class="{yellow: toolsState.settingDevices}"
				 aria-hidden="true" class="fas fa-cogs fa-2x fa-fw clickable" @click="setActiveTool('settingDevices', true)"/>
			<i v-tooltip="$t('tooltips.linkDevice')" :class="{yellow: toolsState.linkingDevices}"
				 aria-hidden="true" class="fas fa-link fa-2x fa-fw clickable" @click="setActiveTool('linkingDevices', true)"/>
			<i v-tooltip="$t('tooltips.unlinkDevice')" :class="{yellow: toolsState.unlinkingDevices}"
				 aria-hidden="true" class="fas fa-unlink fa-2x fa-fw clickable" @click="setActiveTool('unlinkingDevices', true)"/>
		</div>
		<div v-if="locationsEditMode && toolsState.paintingFloors" class="tools sideTools paintFloors">
			<img
				alt="unknown"
				v-for="imageId in $store.state.floorTiles"
				:key="imageId"
				:class="{selected: imageId === activeFloorTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/locations/floors/${imageId}.png`"
				class="clickable"
				@click="activeFloorTile === imageId ? activeFloorTile = '' : activeFloorTile = imageId"
			/>
		</div>
		<div v-if="locationsEditMode && toolsState.placingFurniture" class="tools sideTools placeFurniture">
			<img
				v-for="furnitureId in $store.state.furnitureTiles"
				:key="furnitureId"
				:class="{selected: furnitureId === activeFurnitureTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/furniture/${furnitureId}.png`"
				alt="unknown"
				class="clickable"
				@click="activeFurnitureTile === furnitureId ? activeFurnitureTile = '' : activeFurnitureTile = furnitureId"
			/>
		</div>
		<div v-if="locationsEditMode && toolsState.placingConstructions" class="tools sideTools placeConstructions">
			<img
				v-for="conId in $store.state.constructionTiles"
				:key="conId"
				:class="{selected: conId === activeConstructionTile}"
				:src="`http://${$store.state.settings['aliceIp']}:${$store.state.settings['apiPort']}/api/v1.0.1/myHome/constructions/${conId}.png`"
				alt="unknown"
				class="clickable"
				@click="activeConstructionTile === conId ? activeConstructionTile = '' : activeConstructionTile = conId"
			/>
		</div>
		<div ref="myHomeEditor" :class="{fullscreen: $store.state.fullScreen, editMode: locationsEditMode}" class="myHomeEditor" data-tour="0">
			<div class="compass" data-tour="1">
				<div class="cardinalPoint n">N</div>
				<div class="cardinalPoint e">E</div>
				<div class="cardinalPoint s">S</div>
				<div class="cardinalPoint w">W</div>
				<i id="centerPointer" ref="centerPointer" aria-hidden="true" class="fas fa-location-arrow clickable" data-tour="2" @click="recenter"/>
			</div>
			<div ref="ghost" :class="{hidden: !activeFloorTile && !activeFurnitureTile && !activeConstructionTile}" :style="ghostBackground" class="ghost"/>
			<div
				:style="`
					transform: scale(${zoomLevel});
					left:${floorPlanX}px;
					top:${floorPlanY}px;
				`"
				:class="{
					locationsEditMode: locationsEditMode,
					addLocation: toolsState.addingLocation
				}"
				id="floorPlan"
				ref="floorPlan"
				class="floorPlan"
				@click="floorPlanClick"
				@mousedown="mouseDown"
				@mousemove="mouseMove"
				@mouseup="handleClick"
				@touchstart="mouseDown"
				@touchmove="mouseMove"
				@touchend="handleClick"
			>
				<div id="center" ref="center"/>
				<div
					v-if="toolsState.addingLocation"
					class="reactiveLayer"
					@mousedown="mouseDown"
					@mousemove="mouseMove"
					@mouseup="handleClick"
				>
					<div
						v-if="toolsState.addingLocation && clicked"
						ref="areaSelector"
						:style="`pointer-events: none; top: ${areaSelectorY}px; left: ${areaSelectorX}px; width: ${areaSelectorW}px; height: ${areaSelectorH}px`"
						class="areaSelector"
					/>
				</div>
				<location
					v-for="location in locations"
					:key="location.id"
					:data="location"
					:myHome="me"
				/>
			</div>
		</div>
	</div>
</template>

<style src="../css/myhome.css" scoped/>
<script src="../js/myhome.js"/>
