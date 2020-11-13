<template>
	<form class="fullpageForm" v-on:submit.prevent="login">
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
