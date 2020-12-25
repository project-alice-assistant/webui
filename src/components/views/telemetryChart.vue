<template>
	<div>
		<chart v-if="loaded" :chartData="chartdata" :options="options" :bind="true" :width="1000"></chart>
	</div>
</template>

<script>
import Chart from "@/components/views/chart";
import axios from "axios";


export default {
	components: {Chart},
	props: ['telemetrytypeY1', 'telemetrytypeY2', 'locations', 'fullSpecifiedY1', 'fullSpecifiedY2'],
	data: () => ({
		loaded: false,
		waitingForData: 0,
		options: {
			elements: {
				point: {
					radius: 0
				}},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					type: 'time',
					time: {
						displayFormats: {
							hour: 'HH:mm',
							days: 'DD MMM'
						},
						distribution: 'linear',
						ticks: {
							autoSkip: true,
							maxTicksLimit: 20,
							maxRotation: 0,
							minRotation: 0,
						},
					},
					display: true
				}],
				yAxes:[{
					id: 'Y1',
					type: 'linear',
					position: 'left',
				}]
			}
		},
		chartdata: {datasets: []}
	}),
	async mounted () {
		this.fillData()
	},
	watch: {
		fullSpecifiedY1 () {
			this.fillData()
		},
		fullSpecifiedY2 () {
			this.fillData()
		},
		waitingForData () {
			if(this.waitingForData === 0){
				this.loaded = true
			}
		}
	},
	name: "telemetryChart",
	methods: {
		fillData: function() {
			this.loaded = false
			this.chartdata = {datasets: []}
			let that = this
			try {
				if(that.fullSpecifiedY1){
					that.fullSpecifiedY1.forEach(function (comb){
						that.addDataToGraph('Y1',comb['type'],comb['locationID'], comb['location'], comb['deviceId'], comb['device'])
					})
					if(that.fullSpecifiedY2) {
						that.fullSpecifiedY2.forEach(function (comb) {
							that.addDataToGraph('Y2',comb['type'],comb['locationID'], comb['location'], comb['deviceId'], comb['device'])
						})
						if(that.fullSpecifiedY2.length > 0 && that.options.scales.yAxes.length < 2) {
							that.options.scales.yAxes.push({
								id: 'Y2',
								position: 'right',
								type: 'linear'
							})
						}
					}
				} else {
					if (that.telemetrytypeY2 && that.telemetrytypeY2.length > 0 && that.options.scales.yAxes.length < 2) {
						that.options.scales.yAxes.push({
							id: 'Y2',
							position: 'right',
							type: 'linear'
						})
					}
					that.locations.forEach(function (locItem) {
						that.telemetrytypeY1.forEach(function (ttItem) {
							that.addDataToGraph('Y1', ttItem, locItem)
						})
						if (that.telemetrytypeY2) {
							that.telemetrytypeY2.forEach(function (ttItem) {
								that.addDataToGraph('Y2', ttItem, locItem)
							})
						}
					})
				}
			} catch (e) {
				console.error(e)
			}
		},
		addDataToGraph: function (yAxis, telemetry, locationId, location, deviceId, device){
			let that = this
			this.waitingForData += 1
				axios({
					method: 'get',
					url: `http://${that.$store.state.settings['aliceIp']}:${that.$store.state.settings['apiPort']}/api/v1.0.1/telemetry/`,
					headers: {
						'auth': localStorage.getItem('apiToken'),
						'Content-Type': 'application/json'
					},
					params: {
						'telemetryType': telemetry,
						'all': true,
						'locationId': locationId,
						'deviceId': deviceId
						//'historyFrom': that.historyFrom/1000
					}
				}).then(response => {
					let currData = []
					let text = location + " - " + telemetry
					response.data.forEach(function (item) {
						currData.push({
							x: item.timestamp * 1000,
							y: item.value
						})
					})
					let newColor = getRandomColor()
					that.chartdata.datasets.push({
						label: text,
						data: currData,
						backgroundColor: newColor,
						pointHitRadius: 100,
						lineTension: 0
//						, steppedLine: 'before'
						, yAxisID: yAxis
					})
					that.waitingForData -= 1
				})
			}
		}
}


function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
</script>

<style scoped>

</style>
