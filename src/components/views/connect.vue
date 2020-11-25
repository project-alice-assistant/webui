<template>
	<div class="mainContainer centered vcentered" v-if="connecting">
		<i class="fas fa-spinner fa-spin fa-5x"/>
	</div>
	<div class="mainContainer centered vcentered" v-else>
		<form class="fullpageForm" v-on:submit.prevent="doConnect">
			<p class="size-15x">
				Unfortunately Project Alice couldn't be contacted. Please fill her ip and api port below
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
				<VueToggles
					id="remember"
					width="100"
					checked-text="Remember"
					unchecked-text="Don't remember"
					:value="remember"
					@click="remember = !remember"
					uncheckedBg="var(--windowBG)"
					checkedBg="var(--windowBG)"
				/>
			</p>
			<p>
				<button>Connect</button>
			</p>
		</form>
	</div>
</template>

<script src="../js/connect.js"/>
