<template>
	<div class="topContainer">
		<div v-if="advancedMode">
			<label>
				Filter:
				<input v-model="filter.input" @input="buildSelection()" @keyup.enter="addAllOrShow()" @keydown.delete="clearSelectionOrGraph()"/>
			</label>
		</div>
		<div v-if="!advancedMode" id="filter">
			<label for="service">Service:</label>
			<select id="service" v-model="filter.service" @change="buildSelection()">
				<option selected/>
				<option v-for="item in available.services" :value="item">{{ item }}</option>
			</select>
			<label for="locations">Locations:</label>
			<select id="locations" v-model="filter.location" @change="buildSelection()">
				<option selected/>
				<option v-for="item in available.locations" :value="item.id">{{ item.id }} - {{ item.name }}</option>
			</select>
			<label for="devices">Devices:</label>
			<select id="devices" v-model="filter.device" @change="buildSelection()">
				<option selected/>
				<option v-for="item in available.devices" :value="item.id">{{ item.id }} - {{ item.name }}</option>
			</select>
			<label for="telemetryType">Telemetry Type:</label>
			<select id="telemetryType" v-model="filter.telemetryType" @change="buildSelection()">
				<option selected/>
				<option v-for="item in available.telemetryType" :value="item">{{ item }}</option>
			</select>
		</div>
		<div class="selections">
			<div id="listPossibles" class="floaty">
				<div v-for="combs in available.combinations" class="addMe" @click="addSelection(combs)">
					{{ combs['service'] }}: {{ combs['location'] }} - {{ combs['device'] }} - {{ combs['type'] }}
				</div>
			</div>
			<div id="listSelected" class="floaty">
				<div v-for="combs in selection" class="added" @click="removeSelection(combs)">{{ combs['service'] }}:
					{{ combs['location'] }} - {{ combs['device'] }} - {{ combs['type'] }}
				</div>
			</div>
		</div>
		<div style="display: flex;text-align: center;align-items: center; margin: 10px;">
			<label>Time (dummy):
				<input v-model="new Date(new Date()-(24*3600000)).toISOString()">
				-
				<input v-model="new Date().toISOString()"/>
			</label>
		</div>
		<button v-if="advancedMode" @click="advancedMode = false">
			Normal mode
		</button>
		<button v-if="!advancedMode" @click="advancedMode = true">
			Advanced mode
		</button>
		<button @click="clearFilters()">
			Clear Filters
		</button>
		<button :class="{ 'backspace': !this.filter.input && this.selection.length > 0}" @click="clearSelection()">Clear
			Selection
		</button>
		<button :class="{ 'backspace': !this.filter.input && this.selection.length === 0 && this.graphData.set}" @click="clearGraph()">
			Clear Graph
		</button>
		<button :class="{ 'enter': this.available.combinations.length > 0}" @click="addAll()">
			Add all
		</button>
		<button v-if="!graphData.set" :class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}" @click="createGraph()">
			Show Graph
		</button>
		<button v-else-if="graphData.set" :class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}" @click="createGraph()">
			Add to Graph
		</button>
		<telemetryChart v-if="graphData.set" :bind="true" :fullSpecifiedY1="graphData.Y1" :fullSpecifiedY2="graphData.Y2" :width="1000"/>
	</div>
</template>

<style scoped src="../css/telemetry.css"/>
<script src="../js/telemetry.js"/>
