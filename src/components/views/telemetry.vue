<template>
	<div>
		<div v-if="advancedMode">
			<label>
				Filter:
				<input v-model="filter.input" @input="buildSelection()" @keyup.enter="addAllOrShow()" @keydown.delete="clearSelectionOrGraph()"/>
			</label>
		</div>
		<div id="filter" v-if="!advancedMode">
			<label for="service">Service:</label><select id="service" v-model="filter.service" @change="buildSelection()">
				<option selected></option>
				<option v-for="item in available.services" :value="item">{{item}}</option>
			</select>
			<label for="locations">Locations:</label><select id="locations" v-model="filter.location" @change="buildSelection()">
				<option selected></option>
				<option v-for="item in available.locations" :value="item.id">{{item.id}} - {{item.name}}</option>
			</select>
			<label for="devices">Devices:</label><select id="devices" v-model="filter.device" @change="buildSelection()">
				<option selected></option>
				<option v-for="item in available.devices" :value="item.id">{{item.id}} - {{item.name}}</option>
			</select>
			<label for="telemetryType">Telemetry Type:</label><select id="telemetryType" v-model="filter.telemetryType" @change="buildSelection()">
				<option selected></option>
				<option v-for="item in available.telemetryType" :value="item">{{item}}</option>
			</select>
		</div>
		<div class="selections">
			<div id="listPossibles" class="floaty">
				<div v-for="combs in available.combinations" class="addMe" v-on:click="addSelection(combs)">{{combs['service']}}: {{combs['location']}} - {{combs['device']}} - {{combs['type']}}</div>
			</div>
			<div id="listSelected" class="floaty">
				<div v-for="combs in selection" class="added" v-on:click="removeSelection(combs)">{{combs['service']}}: {{combs['location']}} - {{combs['device']}} - {{combs['type']}}</div>
			</div>
		</div>
		<div style="display: flex;text-align: center;align-items: center; margin-left: 1em;">
			<label>Time (dummy):
				<input v-model="new Date(new Date()-(24*3600000)).toISOString()">
				 -
				<input v-model="new Date().toISOString()"/>
			</label>
		</div>
		<button v-on:click="advancedMode = !advancedMode">A</button>
		<button v-on:click="clearFilters()">Clear Filters</button>
		<button v-on:click="clearSelection()" :class="{ 'backspace': !this.filter.input && this.selection.length > 0}">Clear
			Selection
		</button>
		<button v-on:click="clearGraph()"
						:class="{ 'backspace': !this.filter.input && this.selection.length === 0 && this.graphData.set}">Clear Graph
		</button>
		<button v-on:click="addAll()" :class="{ 'enter': this.available.combinations.length > 0}">Add all</button>
		<button v-if="!graphData.set" v-on:click="createGraph()"
						:class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}">Show Graph
		</button>
		<button v-else-if="graphData.set" v-on:click="createGraph()"
						:class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}">Add to Graph
		</button>
		<telemetryChart v-if="graphData.set" :fullSpecifiedY1="graphData.Y1" :fullSpecifiedY2="graphData.Y2" :bind="true"
										:width="1000"></telemetryChart>
	</div>
</template>

<style scoped src="../css/telemetry.css"/>
<script src="../js/telemetry.js"/>
