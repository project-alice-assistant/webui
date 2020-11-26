<template>
	<div class="container">
		<actions-menu :menuItems="menuItems" />
		<div class="terminal" id="terminal">
			<div class="terminalLine" v-for="log in logs"><div v-html="log"/></div>
		</div>
		<div class="terminalInput">
			<label for="input">{{$t('labels.sendCommand')}} </label>
			<input id="input" type="text"/>
			<button>{{$t('buttons.send')}}</button>
		</div>
	</div>
</template>

<style src="../css/syslog.css" scoped/>
<script src="../js/syslog.js"/>
