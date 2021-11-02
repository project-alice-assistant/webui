<!--suppress HtmlFormInputWithoutLabel -->
<template>
	<div class="container flexcolumn">
		<tabs
			:activeTabId="activeTabId"
			:parent="this"
			:store="$store"
			:tabs="tabs"
		/>
		<div v-if="activeTabId === 1" class="tab_page">
			<config
				:actions="actions"
				:byCategory="true"
				:holder="$store.state.settings"
				:includeFilter="true"
				:templates="$store.state.settingTemplates"
				:translate="(val) => $t(val)"
				:validator="false"/>
		</div>
		<div v-else-if="activeTabId === 2" class="tab_page">
			<div class="container flexrow">
				<div class="utility clickable" @click="utilityRequestAndRedirect('restart')">
					<p class="utilityIcon">
						<i id="utilityRestart" class="fas fa-redo-alt"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.restart') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndRedirect('reboot')">
					<p class="utilityIcon">
						<i id="utilityReboot" class="fas fa-power-off"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.reboot') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndCheck('train', 'projectalice.core.training')">
					<p class="utilityIcon">
						<i id="utilityTrain" class="fas fa-brain"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.train') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndCheck('update', 'projectalice.core.updating')">
					<p class="utilityIcon">
						<i id="utilityUpdate" class="fas fa-sync"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.update') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('addUser')">
					<p class="utilityIcon">
						<i id="utilityAddUser" class="fas fa-user-plus"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.addUser') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('addWakeword')">
					<p class="utilityIcon">
						<i id="utilityAddWakeword" class="fas fa-comment-medical"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.addWakeword') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('tuneWakeword')">
					<p class="utilityIcon">
						<i id="utilityTuneWakeword" class="fas fa-volume-up"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.tuneWakeword') }}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndRedirect('wipeAll')">
					<p class="utilityIcon">
						<i id="utilityWipeAll" class="fas fa-bomb"/>
					</p>
					<p class="utilityName">
						{{ $t('utilities.wipe') }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped src="../css/admin.css"/>
<style scoped src="../css/tabs.css"/>
<script src="../js/admin.js"/>
