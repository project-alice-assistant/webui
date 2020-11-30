<template>
	<div class="container flexcolumn">
		<div class="syslogContainer">
			<actions-menu :menuItems="menuItems" />
			<div class="logVerbosity">
				<i class="fa-circle" :class="verbosity > -1 ? 'fas yellow' : 'far'" aria-hidden="true"/>
				<i class="fa-circle" :class="verbosity > 0 ? 'fas yellow' : 'far'" aria-hidden="true"/>
				<i class="fa-circle" :class="verbosity > 1 ? 'fas yellow' : 'far'" aria-hidden="true"/>
				<i class="fa-circle" :class="verbosity > 2 ? 'fas yellow' : 'far'" aria-hidden="true"/>
				<i class="fa-circle" :class="verbosity > 3 ? 'fas yellow' : 'far'" aria-hidden="true"/>
				<i class="fas fa-minus-circle clickable" aria-hidden="true" v-tooltip="$t('tooltips.decreaseVerbosity')" @click="setVerbosity(-1)"/>
				<i class="fas fa-plus-circle clickable" aria-hidden="true" v-tooltip="$t('tooltips.increaseVerbosity')" @click="setVerbosity(1)"/>
			</div>
			<div class="terminal" id="terminal">
				<div class="logLine" v-for="log in logs">
					<span class="logTime logYellow">[{{log.time}}]</span>
					<span class="logComponent logYellow">[{{log.component}}]</span>
					<span class="logMsg" v-html="log.text"/>
				</div>
			</div>
		</div>
	</div>
</template>

<style src="../css/alicewatch.css" scoped/>
<script src="../js/alicewatch.js"/>
