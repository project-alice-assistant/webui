<template>
	<div
		:id="`loc_${data.id}`"
		:style="computeCustomStyle()"
		:class="{
			painting: myHome.paintingFloors,
			clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors
		}"
		class="location"
		@click="handleClick"
	>
		<location
			v-for="loc in locations"
			v-if="loc.parentLocation === data.id"
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
			:key="`dev_${dev.uid}`"
			:data="dev"
			:myHome="myHome"
		/>
		<span
			v-fit2box="data.name"
			:class="{clickable: myHome.locationsEditMode && !myHome.addingLocation && !myHome.paintingFloors}"
			class="locationName"
			@click="rename"
		/>
		<div v-if="myHome.settingLocations" class="widgetTool optioner" @click="openSettings">
			<i aria-hidden="true" class="fas fa-cogs clickable"/>
		</div>
		<div v-if="myHome.deletingLocations" class="widgetTool deleter" @click="deleteMe">
			<i aria-hidden="true" class="far fa-trash-alt clickable"/>
		</div>
		<div v-if="myHome.settingLocations" class="widgetTool zindexer">
			<i aria-hidden="true" class="fas fa-level-up-alt clickable" @click="moveZUp"/>
			<i aria-hidden="true" class="fas fa-level-down-alt clickable" @click="moveZDown"/>
		</div>
	</div>
</template>

<style scoped src="../css/location.css"/>
<style scoped src="../css/widgets.css"/>
<script src="../js/location.js"/>
