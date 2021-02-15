<template>
	<div
		:id="`loc_${data.id}`"
		:style="computeCustomStyle()"
		:class="{
			painting: myHome.toolsState.paintingFloors,
			clickable: myHome.locationsEditMode && !myHome.toolsState.addingLocation && !myHome.toolsState.paintingFloors
		}"
		class="location"
		@click="handleClick"
		@mouseenter="onMouseEnter"
		@mouseleave="onMouseLeave"
	>
		<location
			v-for="loc in locations"
			:key="`loc_${loc.id}`"
			:data="loc"
			:myHome="myHome"
		/>
		<furniture
			v-for="fur in furnitures"
			v-if="fur.parentLocation === data.id"
			:key="`fur_${fur.id}`"
			:data="fur"
			:myHome="myHome"
		/>
		<construction
			v-for="con in constructions"
			v-if="con.parentLocation === data.id"
			:key="`con_${con.id}`"
			:data="con"
			:myHome="myHome"
		/>
		<device
			v-for="dev in devices"
			v-if="dev.parentLocation === data.id"
			:key="`dev_${dev.id}`"
			:data="dev"
			:myHome="myHome"
		/>
		<svg class="locationName" viewBox="0 0 100 100">
			<text
				v-if="myHome.locationsEditMode && !myHome.toolsState.placingFurniture && !myHome.toolsState.placingConstructions"
				:class="{clickable: myHome.locationsEditMode && !myHome.toolsState.addingLocation && !myHome.toolsState.paintingFloors}"
				text-anchor="middle"
				x="50"
				y="50"
				@click="rename"
			>
				{{ data.name }}
			</text>
		</svg>
		<div v-if="myHome.toolsState.settingLocations && hovered" class="widgetTool optioner" @click="openSettings">
			<i aria-hidden="true" class="fas fa-cogs clickable"/>
		</div>
		<div v-if="myHome.toolsState.deletingLocations" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.toolsState.settingLocations && hovered" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable" @click="moveZUp"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable" @click="moveZDown"/>
		</div>
	</div>
</template>

<style scoped src="../css/location.css"/>
<style scoped src="../css/widgets.css"/>
<script src="../js/location.js"/>
