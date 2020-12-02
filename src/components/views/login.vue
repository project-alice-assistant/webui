<template>
	<div class="centered vcentered">
		<form ref="form" class="fullpageForm" v-on:submit.prevent="login">
			<p>
				<label for="username">{{$t('dialogs.labels.username')}}</label>
				<input id="username" v-model="username" type="text" :placeholder="$t('dialogs.labels.username')">
			</p>
			<p>
				<label for="pincode">{{$t('dialogs.labels.pinCode')}}</label>
				<input id="pincode" v-model="pincode" type="password">
			</p>
			<p>
				<label for="rememberMe">{{$t('dialogs.labels.rememberMe')}}</label>
				<VueToggles
					id="rememberMe"
					:checked-text="$t('tooltips.yes')"
					:unchecked-text="$t('tooltips.no')"
					:value="rememberMe"
					@click="rememberMe = !rememberMe"
					uncheckedBg="var(--windowBG)"
					checkedBg="var(--windowBG)"
				/>
			</p>
			<p>
				<button>{{$t('buttons.login')}}</button>
			</p>
		</form>
	</div>
</template>

<style src="../css/login.css" scoped></style>
<script src="../js/login.js"></script>
