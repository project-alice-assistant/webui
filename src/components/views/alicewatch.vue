<template>
	<div class="container flexcolumn">
		<div class="syslogContainer">
			<actions-menu :menuItems="menuItems"/>
			<div class="logVerbosity">
				<i :class="verbosity > -1 ? 'fas yellow' : 'far'" aria-hidden="true" class="fa-circle"/>
				<i :class="verbosity > 0 ? 'fas yellow' : 'far'" aria-hidden="true" class="fa-circle"/>
				<i :class="verbosity > 1 ? 'fas yellow' : 'far'" aria-hidden="true" class="fa-circle"/>
				<i :class="verbosity > 2 ? 'fas yellow' : 'far'" aria-hidden="true" class="fa-circle"/>
				<i :class="verbosity > 3 ? 'fas yellow' : 'far'" aria-hidden="true" class="fa-circle"/>
				<i v-tooltip="$t('tooltips.decreaseVerbosity')" aria-hidden="true" class="fas fa-minus-circle clickable" @click="setVerbosity(-1)"/>
				<i v-tooltip="$t('tooltips.increaseVerbosity')" aria-hidden="true" class="fas fa-plus-circle clickable" @click="setVerbosity(1)"/>
			</div>
			<div id="terminal" class="terminal">
				<div v-for="log in logs" class="logLine">
					<span class="logTime logYellow">[{{ log.time }}]</span>
					<span class="logComponent logYellow">[{{ log.component }}]</span>
					<span class="logMsg" v-html="log.text"/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped src="../css/alicewatch.css"/>
<script src="../js/alicewatch.js"/>
