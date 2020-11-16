<template>
	<div class="mainContainer" v-if="!loading && !noAlice">
		<pa-header/>
		<div id="main">
			<pa-nav/>
			<pa-content/>
		</div>
	</div>
	<div class="mainContainer centered vcentered size-2x" v-else-if="loading && !noAlice">
		loading...
	</div>
	<div class="mainContainer centered vcentered" v-else>
		<form class="fullpageForm" v-on:submit.prevent="connect">
			<p class="size-15x">
				Unfortunately Project Alice couldn't be found. If you are running this on another machine, please fill the ip
				and api port
			</p>
			<p>
				<label for="ip">Alice ip address</label>
				<input id="ip" type="text" v-model="ip">
			</p>
			<p>
				<label for="port">Alice API port</label>
				<input id="port" type="text" v-model="port">
			</p>
			<p>
				<VueToggles id="remember" width="100" checked-text="Remember" unchecked-text="Don't remember" :value="remember"
										@click="remember = !remember" uncheckedBg="var(--windowBG)" checkedBg="var(--windowBG)"/>
			</p>
			<p>
				<button>Connect</button>
			</p>
		</form>
	</div>
</template>

<style src="./ProjectAlice.css"></style>
<script src="./ProjectAlice.js"></script>

<style src="./components/css/fa/brands.css"></style>
<style src="./components/css/fa/regular.css"></style>
<style src="./components/css/fa/solid.css"></style>
<style src="./components/css/fa/fontawesome.css"></style>
