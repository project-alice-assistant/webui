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
				<option v-for="item in available.locations" :value="item">{{item}}</option>
			</select>
			<label for="devices">Devices:</label><select id="devices" v-model="filter.device" @change="buildSelection()">
				<option selected></option>
				<option v-for="item in available.devices" :value="item">{{item}}</option>
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
		<button v-on:click="clearSelection()" :class="{ 'backspace': !this.filter.input && this.selection.length > 0}">Clear Selection</button>
		<button v-on:click="clearGraph()" :class="{ 'backspace': !this.filter.input && this.selection.length === 0 && this.graphData.set}">Clear Graph</button>
		<button v-on:click="addAll()" :class="{ 'enter': this.available.combinations.length > 0}">Add all</button>
		<button v-if="!graphData.set" v-on:click="createGraph()" :class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}">Show Graph</button>
		<button v-else-if="graphData.set" v-on:click="createGraph()" :class="{ 'enter': this.available.combinations.length === 0 && this.selection.length > 0}">Add to Graph</button>
		<telemetryChart v-if="graphData.set" :fullSpecifiedY1="graphData.Y1" :fullSpecifiedY2="graphData.Y2" :bind="true" :width="1000"></telemetryChart>
	</div>
</template>

<script>
import TelemetryChart from "@/components/views/telemetryChart";
import axios from "axios";
export default {
	components: {TelemetryChart},
	data: () => ({
		name: "telemetry",
		// holds all possible combinations
		overview: [],
		// bound structure for graph selection
		graphData: {
			set: false,
			Y1: [],
			Y2: [],
			toggle: false
		},
		// toggle between easy and advanced mode
		advancedMode: true,
		// the currently selected combinations
		selection: [],
		// holds the filtered data for dropdown and data selection
		available: {
			locations: [],
			devices: [],
			services: [],
			telemetryType: [],
			combinations: []
		},
		// the currently selected values for the filter
		filter: { service: "",
							location: "",
							device: "",
							telemetryType: "",
							input: ""
		}
	}),
	methods: {
		getUnique: function () {
			// initial loading of the possible combinations by calling the telemetry/overview API
			axios({
				method: 'get',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/telemetry/overview/`,
				headers: {
					'auth': localStorage.getItem('apiToken'),
					'Content-Type': 'application/json'
				}
			}).then(response => {
				// save data to own variable so it is saved for later
				this.overview = response.data
				this.buildSelection()
			})
			return true
		},
		buildSelection: function () {
			// build and rebuild the available combinations and filters:
			// based on the currently set filters and chosen selections

			// Helper function: Filter a given line depending on the current values of the filters
			// called with varying values depending on the relevant Filter
			function filterLine(tt, dev, loc, ser, li, that){
				// first the text filter:
				// get text representation of the current telemetry combination
				let liString = li['service']+ ": "+ li['location']+" - "+li['device']+" - "+li['type']
				// split the filter by wildcard * and check for the presence of all of them
				// is one missing, the method returns false and the line is filtered out
				let splitLine = that.filter.input.split("*")
				for( let no in splitLine){
					if( !liString.includes(splitLine[no])){
						return false
					}
				}
				// second, the drop down filters - if set
				if(tt && li['type'] !== tt){
					return false
				}
				if(dev && li['siteId'] !== dev){
					return false
				}
				if(loc && li['locationID'] !== loc){
					return false
				}
				if(ser && li['service'] !== ser){
					return false
				}
				// if no filter criteria wasn't met, return true
				return true
			}

			// init variables
			this.available.telemetryType = []
			this.available.devices = []
			this.available.locations = []
			this.available.services = []
			this.available.combinations = []

			// check all available combinations if they are relevant to be shown
			for(const combination in this.overview){

				// checks for the drop down filters
				if(!this.available.telemetryType.includes(this.overview[combination]['type'])
				&& filterLine("", this.filter.device, this.filter.location, this.filter.service, this.overview[combination], this)){
					this.available.telemetryType.push(this.overview[combination]['type'])
				}

				if(!this.available.devices.includes(this.overview[combination]['siteId'])
					&& filterLine(this.filter.telemetryType, "", this.filter.location, this.filter.service, this.overview[combination], this)){
					this.available.devices.push(this.overview[combination]['siteId'])
				}

				if(!this.available.locations.includes(this.overview[combination]['locationID'])
					&& filterLine(this.filter.telemetryType, this.filter.device, "", this.filter.service, this.overview[combination], this)){
					this.available.locations.push(this.overview[combination]['locationID'])
				}

				if(!this.available.services.includes(this.overview[combination]['service'])
					&& filterLine(this.filter.telemetryType, this.filter.device, this.filter.location, "", this.overview[combination], this)){
					this.available.services.push(this.overview[combination]['service'])
				}

				// check for the list of all possible combinations
				// in addition to the filters, already selected combinations are omitted
				if(!this.selection.includes(this.overview[combination])
					&& filterLine(this.filter.telemetryType, this.filter.device, this.filter.location, this.filter.service, this.overview[combination], this)){
					this.available.combinations.push(this.overview[combination])
				}
			}
		},
		addSelection: function (comb){
			// add a single value to the selection
			this.selection.push(comb)
			this.buildSelection()
		},
		removeSelection: function (comb){
			// remove a single value from the selection
			const index = this.selection.indexOf(comb);
			if (index > -1) {
				this.selection.splice(index, 1);
			}
			this.buildSelection()
		},
		createGraph: function (){
			// fill in the data for the graph and show it
			// alternating between Y1 and Y2 axis
			if(this.graphData.toggle) {
				this.graphData.Y2 = this.selection
			} else {
				this.graphData.Y1 = this.selection
			}
			// for next run: fill Y2/Y1 instead
			this.graphData.toggle = !this.graphData.toggle

			// trigger showing the graph
			this.graphData.set = true

			//cleanup
			this.selection = []
			this.buildSelection()
		},
		addAll: function (){
			// add all currently filtered combinations to the selections
			let that = this
			this.available.combinations.forEach(function (comb){
				that.selection.push(comb)
			})
			this.buildSelection()
		},
		clearSelection: function (){
			// clear the selection and rebuild the possible combinations
			this.selection = []
			this.buildSelection()
		},
		addAllOrShow: function (){
			// if there is nothing to add, add the selection to the graph
			// used for filter: press enter twice to addAll and direct afterwards show the graph
			if(this.available.combinations.length === 0){
				this.createGraph()
			} else {
				this.addAll()
			}
		},
		clearSelectionOrGraph: function (){
			// clear the selection when nothing is in the input anymore
			// if the selection is already empty, clear the graph
			if(this.filter.input){
				// ignore
			}	else if (this.selection.length > 0){
				this.clearSelection()
			} else {
				this.clearGraph()
			}
		},
		clearGraph: function () {
			// clear the currently shown graph - graphData is bound
			this.graphData={}
		},
		clearFilters: function () {
			// remove all filters and rebuild the available values
			this.filter.input = ''
			this.filter.service = ''
			this.filter.location = ''
			this.filter.device = ''
			this.filter.telemetryType = ''
			this.buildSelection()
		}
	},
	created (){
		// load the initial telemetry combinations
		this.getUnique()
	}
}

</script>

<style scoped>
.addMe {
	clip-path: polygon(0% 0%, calc(100% - 1em) 0%, 100% 50%, 100% 50%, calc(100% - 1em) 100%, 0% 100%);
	background: #2ba5ff;
	border-radius: 1em;
	margin: .2em auto;
	padding-left: 1em;
	padding-top: 0.1em;
	padding-bottom: 0.1em;
	width: 90%;
	height: 1em;
	overflow: hidden;
}
.added {
	background: #2ba5ff;
	border-radius: 1em;
	margin: .2em auto;
	padding-left: 1em;
	padding-top: 0.1em;
	padding-bottom: 0.1em;
	width: 90%;
	height: 1em;
	overflow: hidden;
	clip-path: polygon(100% 100%, 100% 0%, 1em 0%, 0% 50%,1em 100%);
}
.floaty {
	background: var(--secondary);
	margin: .2em;
	overflow-y: scroll;
	display: block;
	width: 100%;
}

.selections {
	width: 100%;
	height: 10em;
	overflow-y: auto;
	display: flex;
}
button {
	padding: .2em 1em;
	margin: .4em .8em;
}
.backspace {
	background: darkred;
}
.enter {
	background: #2ba5ff;
}
</style>
