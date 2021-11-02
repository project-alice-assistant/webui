<template>
	<div v-if="connecting" class="mainContainer centered vcentered">
		<i class="fas fa-spinner fa-spin fa-5x"/>
	</div>
	<div v-else class="mainContainer centered vcentered">
		<form class="fullpageForm" v-on:submit.prevent="doConnect">
			<p class="size-15x">
				Unfortunately Project Alice couldn't be contacted. Please fill her ip and api port below
			</p>
			<p>
				<label for="ip">Alice ip address</label>
				<input id="ip" v-model="ip" type="text">
			</p>
			<p>
				<label for="port">Alice API port</label>
				<input id="port" v-model="port" type="text">
			</p>
			<p>
				<VueToggles
					id="remember"
					:value="remember"
					checked-text="Remember"
					checkedBg="var(--windowBG)"
					unchecked-text=""
					uncheckedBg="var(--windowBG)"
					width="100"
					@click="remember = !remember"
				/>
			</p>
			<p>
				<button>Connect</button>
			</p>
		</form>
	</div>
</template>

<script src="../js/connect.js"/>
