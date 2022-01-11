<template>
	<div class="container flexcolumn">
		<div :class="{ 'waiting' : waiting || success || failed, 'waitHidden' : !waiting && !success && !failed }">
			<div class="centered">
				<i v-if="waiting" ref="animatedIcon" aria-hidden="true" class="fas fa-spinner fa-pulse fa-4x"/>
				<i v-else-if="success" ref="animatedIcon" aria-hidden="true" class="fas fa-check fa-4x green"/>
				<i v-else-if="failed" ref="animatedIcon" aria-hidden="true" class="fas fa-exclamation-triangle fa-4x red"/>
			</div>
		</div>
		<div v-if="createNew" class="settingsContainer">
			<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
				<i class="fab fa-hotjar yellow"></i><br/></div>
			<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
			<config
				:actions="{'create': {'text': $t('buttons.create'),
				  											 'action': createSkill,
																 'condition': allValid && !waiting
				  											}}"
				:byCategory="true"
				:conf-prefix="'skill '"
				:failed="failed"
				:holder="values"
				:includeFilter="true"
				:success="success"
				:templates="newSkill()"
				:text-buttons="true"
				:translate="(val) => $t(val)"
				:validator="false"
				:waiting="waiting"/>
			<span ref="skillNameExists" class="red initialHidden" style="margin-left: 15px;">{{ $t('devMode.skillAlreadyExists') }}</span>
		</div>
		<div v-else-if="editingSkill === null">
			<div class="container flexrow yscroll">
				<editSkillTile :key="'newSkill'" :ref="'newSkill'" :skill="newSkillTile" v-on:skill-selected="() => { this.createNew = true }"/>
				<editSkillTile v-for="skill in this.$store.state.installedSkills" :key="skill.name" :ref="skill.name.toLowerCase()" :skill="skill" v-on:skill-selected="startEditingSkill"/>
			</div>
		</div>
		<div v-else class="container flexcolumn">
			<tabs
				:activeTabId="activeTabId"
				:parent="this"
				:store="$store"
				:tabs="tabs"
			/>
			<div v-if="activeTabId === 'settings' || activeTabId === undefined" class="tab_page">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
					<i class="fab fa-hotjar yellow"></i><br/></div>
				<config v-if="changedSkill.installFile"
								:byCategory="true"
								:holder="changedSkill.installFile"
								:templates="configTemplate()"
								:translate="(val) => $t(val)"
								:validator="false"
								:waiting="waiting"/>
			</div>
			<div v-else-if="activeTabId === 'training'" class="tab_page">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
					<i class="fab fa-hotjar yellow"></i><br/></div>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
					<option value="pl">Polish</option>
				</select>
				<dialogTemplateEditor ref="dialogTemplateEditor"
															:currentLang="currentLang"
															:editingSkill="editingSkill"
															v-on:waiting="function(v) { waiting = v }"
				/>
			</div>
			<div v-else-if="activeTabId === 'configTemplate'" class="tab_page">
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
					<i class="fab fa-hotjar yellow"></i><br/></div>
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<h1>Custom Config</h1>
				Add custom config settings for your skill and configure their required information.<br/>
				Until this dialog will be smart enough to support you in the creation, see the definition here:
				<a href="https://docs.projectalice.io/skill-development/files-in-depth.html#skill-configuration-file">docs.ProjectAlice.io</a><br/>
				<simple-json-editor ref="configTemplateEditor"
														v-model="editingSkill.settingsTemplate"
														:configTemplate="{}"/>
			</div>
			<div v-else-if="activeTabId === 'instructions'" class="tab_page">
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
					<i class="fab fa-hotjar yellow"></i><br/></div>
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
					<option value="pl">Polish</option>
				</select>
				<div class="flexrow vcentered yscroll">
					<div class="centered flexHalf stretched">
						<configInput v-model="changedSkill"
												 :configName="'instructions'"
												 :holder="changedSkill"
												 :template="{name:'instructions',
																		 dataType:'longstring'}"
												 :translate="(val) => $t(val)"
												 class="stretched"/>
					</div>
					<div class="centered flexHalf stretched">
						<vue-simple-markdown :source="changedSkill.instructions" class="contained stretched"/>
					</div>
				</div>
			</div>
			<div v-else-if="activeTabId === 'talk'" class="tab_page">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care!
					<i class="fab fa-hotjar yellow"></i><br/></div>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
					<option value="pl">Polish</option>
				</select>
				<talkFileEditor ref="talkFileEditor"
												:currentLang="currentLang"
												:editingSkill="editingSkill"
												v-on:waiting="function(v) { waiting = v }"
				/>
			</div>
			<div v-else-if="activeTabId === 'cloud'" class="tab_page">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
					<git-status :skill="editingSkill.name" style="width: 100%"></git-status>
				</div>
			</div>
			<div v-else-if="activeTabId === 'devices'">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<div class="size-2x WIP"><i class="fas fa-hard-hat red"></i> Work In Progress - not yet available!
					<i class="fas fa-hard-hat red"></i><br/></div>
				Creation of own device types via the web interface is not yet possible!<br/>
				To add device types please create the files manually.<br/>
				You can find help on
				<a href="https://docs.projectalice.io/skill-development/going-further.html#devices">docs.ProjectAlice.io</a><br/>
				<button @click="createDevice">Click here to create a new Device Type</button>
			</div>
			<div v-else-if="activeTabId === 'widgets'">
				<actions-menu :alwaysExtended="true" :menuItems="menuItems"/>
				<div class="size-2x WIP"><i class="fas fa-hard-hat red"></i> Work In Progress - take care!
					<i class="fas fa-hard-hat red"></i><br/></div>
				Editing of widgets via the web interface is not yet possible!<br/>
				You can find help on
				<a href="https://docs.projectalice.io/skill-development/going-further.html#widgets">docs.ProjectAlice.io</a><br/>
				<button @click="createWidget">Click here to create a new Widget</button>
			</div>

		</div>
	</div>
</template>

<style scoped src="../css/tabs.css"/>
<style scoped src="../css/devmode.css"/>
<script src="../js/devmode.js"/>
