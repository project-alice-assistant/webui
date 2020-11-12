<template>
	<form class="fullpageForm" v-on:submit.prevent="login">
		<p>
			<label for="host">Alice address</label><br/>
			<input id="host" v-model="host" type="text" placeholder="localhost">
		</p>
		<p>
			<label for="port">Api port</label><br/>
			<input id="port" v-model="port" type="text" placeholder="5001">
		</p>
		<p>
			<label for="username">Username</label><br/>
			<input id="username" v-model="username" type="text" placeholder="Username">
		</p>
		<p>
			<label for="pincode">Pin code</label><br/>
			<input id="pincode" v-model="pincode" type="password">
		</p>
		<p>
			<label for="rememberMe">Remember me</label><br/>
			<VueToggles id="rememberMe" checked-text="Yes" unchecked-text="No" :value="rememberMe" @click="rememberMe = !rememberMe" uncheckedBg="var(--windowBG)" checkedBg="var(--windowBG)"/>
		</p>
		<p>
			<button>Login</button>
		</p>
	</form>
</template>

<style src="../css/login.css" scoped></style>
<script src="../js/login.js"></script>
