import TelemetryChart from '@/components/views/telemetryChart'
import axios from 'axios'

export default {
	components: {TelemetryChart},
	data: () => ({
		name: 'telemetry',
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
		filter: {
			service: '',
			location: '',
			device: '',
			telemetryType: '',
			input: ''
		}
	}),
	methods: {
		getUnique: function () {
			// initial loading of the possible combinations by calling the telemetry/overview API
			axios({
				method: 'GET',
				url: `http://${this.$store.state.settings['aliceIp']}:${this.$store.state.settings['apiPort']}/api/v1.0.1/telemetry/overview/`,
				headers: {
					'auth': this.$store.getters.apiToken,
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
			function filterLine(tt, dev, loc, ser, li, that) {
				// first the text filter:
				// get text representation of the current telemetry combination
				let liString = li['service'] + ': ' + li['location'] + ' - ' + li['device'] + ' - ' + li['type']
				// split the filter by wildcard * and check for the presence of all of them
				// is one missing, the method returns false and the line is filtered out
				let splitLine = that.filter.input.split('*')
				for (const split of splitLine) {
					if (!liString.includes(split)) {
						return false
					}
				}
				// second, the drop down filters - if set
				if (tt && li['type'] !== tt) {
					return false
				}
				if (dev && li['deviceId'] !== dev) {
					return false
				}
				if (loc && li['locationId'] !== loc) {
					return false
				}
				if (ser && li['service'] !== ser) {
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
			for (const combination of this.overview) {

				// checks for the drop down filters
				if (!this.available.telemetryType.includes(combination['type'])
					&& filterLine('', this.filter.device, this.filter.location, this.filter.service, combination, this)) {
					this.available.telemetryType.push(combination['type'])
				}

				if (!this.available.devices.some(el => el.id === combination['deviceId'])
					&& filterLine(this.filter.telemetryType, '', this.filter.location, this.filter.service, combination, this)) {
					this.available.devices.push({
						id: combination['deviceId'],
						name: combination['device']
					})
				}

				if (!this.available.locations.some(el => el.id === combination['locationId'])
					&& filterLine(this.filter.telemetryType, this.filter.device, '', this.filter.service, combination, this)) {
					this.available.locations.push({
						id: combination['locationId'],
						name: combination['location']
					})
				}

				if (!this.available.services.includes(combination['service'])
					&& filterLine(this.filter.telemetryType, this.filter.device, this.filter.location, '', combination, this)) {
					this.available.services.push(combination['service'])
				}

				// check for the list of all possible combinations
				// in addition to the filters, already selected combinations are omitted
				if (!this.selection.includes(combination)
					&& filterLine(this.filter.telemetryType, this.filter.device, this.filter.location, this.filter.service, combination, this)) {
					this.available.combinations.push(combination)
				}
			}
		},
		addSelection: function (comb) {
			// add a single value to the selection
			this.selection.push(comb)
			this.buildSelection()
		},
		removeSelection: function (comb) {
			// remove a single value from the selection
			const index = this.selection.indexOf(comb);
			if (index > -1) {
				this.selection.splice(index, 1);
			}
			this.buildSelection()
		},
		createGraph: function () {
			// fill in the data for the graph and show it
			// alternating between Y1 and Y2 axis
			if (this.graphData.toggle) {
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
		addAll: function () {
			// add all currently filtered combinations to the selections
			let that = this
			this.available.combinations.forEach(function (comb) {
				that.selection.push(comb)
			})
			this.buildSelection()
		},
		clearSelection: function () {
			// clear the selection and rebuild the possible combinations
			this.selection = []
			this.buildSelection()
		},
		addAllOrShow: function () {
			// if there is nothing to add, add the selection to the graph
			// used for filter: press enter twice to addAll and direct afterwards show the graph
			if (this.available.combinations.length === 0) {
				this.createGraph()
			} else {
				this.addAll()
			}
		},
		clearSelectionOrGraph: function () {
			// clear the selection when nothing is in the input anymore
			// if the selection is already empty, clear the graph
			if (this.filter.input) {
				// ignore
			} else if (this.selection.length > 0) {
				this.clearSelection()
			} else {
				this.clearGraph()
			}
		},
		clearGraph: function () {
			// clear the currently shown graph - graphData is bound
			this.graphData = {}
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
	created() {
		// load the initial telemetry combinations
		this.getUnique()
	}
}
