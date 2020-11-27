<template>
	<div class="container">
		<div class="syslogContainer">
			<actions-menu :menuItems="menuItems" />
			<div class="terminal" id="terminal">
				<div class="terminalLine" v-for="log in logs"><div v-html="log"/></div>
			</div>
			<div class="terminalInput">
				<form v-on:submit.prevent="sendCmd">
					<label for="input">{{$t('labels.sendCommand')}} </label>
					<input id="input" type="text" v-model="cmd"/>
					<button>{{$t('buttons.send')}}</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style src="../css/syslog.css" scoped/>
<script src="../js/syslog.js"/>
