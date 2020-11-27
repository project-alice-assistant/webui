<template>
	<div class="container">
		<div class="syslogContainer">
			<actions-menu :menuItems="menuItems" />
			<div class="terminal" id="terminal">
				<div class="logLine" v-for="log in logs">
					<span class="logTime logDim">[{{log.time}}]</span>
					<span class="logComponent logDim">[{{log.component}}]</span>
					<span class="logMsg" :class="`log${log.level}`" v-html="log.msg"/>
				</div>
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

<style src="../css/syslog.css"/>
<script src="../js/syslog.js"/>
