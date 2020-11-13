<template>
	<div class="centered vcentered">
		<form class="fullpageForm" v-on:submit.prevent="login">
			<p>
				<label for="username">Username</label>
				<input id="username" v-model="username" type="text" placeholder="Username">
			</p>
			<p>
				<label for="pincode">Pin code</label>
				<input id="pincode" v-model="pincode" type="password">
			</p>
			<p>
				<label for="rememberMe">Remember me</label>
				<VueToggles id="rememberMe" checked-text="Yes" unchecked-text="No" :value="rememberMe" @click="rememberMe = !rememberMe" uncheckedBg="var(--windowBG)" checkedBg="var(--windowBG)"/>
			</p>
			<p>
				<button>Login</button>
			</p>
		</form>
	</div>
</template>

<style src="../css/login.css" scoped></style>
<script src="../js/login.js"></script>
