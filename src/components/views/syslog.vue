<template>
	<div class="container flexcolumn">
		<div class="syslogContainer">
			<actions-menu :menuItems="menuItems"/>
			<div id="terminal" class="terminal">
				<div v-for="log in logs" class="logLine">
					<span class="logTime logDim">[{{ log.time }}]</span>
					<span class="logComponent logDim">[{{ log.component }}]</span>
					<span :class="`log${log.level}`" class="logMsg" v-html="log.msg"/>
				</div>
			</div>
			<div class="terminalInput">
				<form v-on:submit.prevent="sendCmd">
					<label for="input">{{ $t('labels.sendCommand') }} </label>
					<input id="input" v-model="cmd" type="text"/>
					<button>{{ $t('buttons.send') }}</button>
				</form>
			</div>
		</div>
	</div>
</template>

<style src="../css/syslog.css"/>
<script src="../js/syslog.js"/>
