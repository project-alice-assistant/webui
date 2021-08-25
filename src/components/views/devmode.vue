<template>
	<div class="container flexcolumn">
		<div :class="{ 'waiting' : waiting || success || failed, 'waitHidden' : !waiting && !success && !failed }">
			<div class="centered">
				<i v-if="waiting" ref="animatedIcon" class="fas fa-spinner fa-pulse fa-4x" aria-hidden="true"/>
				<i v-else-if="success" ref="animatedIcon" class="fas fa-check fa-4x green" aria-hidden="true"/>
				<i v-else-if="failed" ref="animatedIcon" class="fas fa-exclamation-triangle fa-4x red" aria-hidden="true"/>
			</div>
		</div>
		<div v-if="createNew" class="settingsContainer">
			<actions-menu :menuItems="menuItems" :alwaysExtended="false"/>
			<div class="size-2x WIP"><i class="fas fa-hard-hat red"></i> Work In Progress - highly experimental! <i class="fas fa-hard-hat red"></i><br/></div>
				<config
					:templates="newSkill()"
					:holder="values"
					:translate="(val) => $t(val)"
					:validator="false"
					:byCategory="true"
					:includeFilter="true"
					:waiting="waiting"
					:success="success"
					:failed="failed"
				  :actions="{'reset': { 'action': reset,
				  											'condition': !waiting
				  											},
											'create': {'text': $t('buttons.create'),
				  											 'action': createSkill,
																 'condition': !created && allValid && !waiting
				  											},
											'upload': {'text': $t('buttons.uploadToGithub'),
				  											'action': uploadSkill,
				  											'condition': created && !uploaded && !waiting
				  											},
											'checkOnGithub': {'text': $t('buttons.checkOnGithub'),
				  											'action': checkOnGithub,
				  											'condition': created && uploaded && !waiting
				  											}
				  											}"
					:text-buttons="true"
				  :conf-prefix="'skill '"/>
				<span style="margin-left: 15px;" ref="skillNameExists" class="red initialHidden">{{$t('devMode.skillAlreadyExists')}}</span>
		</div>
		<div v-else-if="editingSkill === null">
			<div class="container flexrow yscroll">
				<editSkillTile :key="'newSkill'" :ref="'newSkill'" v-on:skill-selected="() => { this.createNew = true }" :skill="newSkillTile"/>
				<editSkillTile v-for="skill in this.$store.state.installedSkills" :key="skill.name" :ref="skill.name.toLowerCase()" v-on:skill-selected="startEditingSkill" :skill="skill"/>
			</div>
		</div>
		<div v-else class="container flexcolumn">
			<tabs
				:activeTabId="activeTabId"
				:parent="this"
				:tabs="tabs"
				:store="$store"
			/>
			<div v-if="activeTabId === 'settings' || activeTabId === undefined"  class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<div class="size-2x WIP"><i class="fas fa-hard-hat yellow"></i> Work In Progress - use carefully! <i class="fas fa-hard-hat yellow"></i><br/></div>
				<config v-if="changedSkill.installFile"
								:holder="changedSkill.installFile"
								:templates="configTemplate()"
								:translate="(val) => $t(val)"
								:validator="false"
								:byCategory="true"
								:waiting="waiting"/>
			</div>
			<div v-else-if="activeTabId === 'training'"  class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care! <i class="fab fa-hotjar yellow"></i><br/></div>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
					<option value="pl">Polish</option>
				</select>
				<dialogTemplateEditor ref="dialogTemplateEditor"
															:editingSkill="editingSkill"
															:currentLang="currentLang"
															v-on:waiting="function(v) { waiting = v }"/>
			</div>
			<div v-else-if="activeTabId === 'configTemplate'" class="tab_page">
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care! <i class="fab fa-hotjar yellow"></i><br/></div>
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<h1>Custom Config</h1>
				Add custom config settings for your skill and configure their required information.<br/>
				Until this dialog will be smart enough to support you in the creation, see the definition here:
				<a href="https://docs.projectalice.io/skill-development/files-in-depth.html#skill-configuration-file">docs.ProjectAlice.io</a><br/>
				<simple-json-editor v-model="editingSkill.settingsTemplate"
														:configTemplate="{}"
													  ref="configTemplateEditor"/>
			</div>
			<div v-else-if="activeTabId === 'instructions'" class="tab_page">
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care! <i class="fab fa-hotjar yellow"></i><br/></div>
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
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
						<configInput :configName="'instructions'"
												 :holder="changedSkill"
												 v-model="changedSkill"
												 :translate="(val) => $t(val)"
												 :template="{name:'instructions',
																		 dataType:'longstring'}"
												 class="stretched"/>
					</div>
					<div class="centered flexHalf stretched">
						<vue-simple-markdown :source="changedSkill.instructions" class="contained stretched"/>
					</div>
				</div>
			</div>
			<div v-else-if="activeTabId === 'talk'" class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<div class="WIP"><i class="fab fa-hotjar yellow"></i> new feature - handle with care! <i class="fab fa-hotjar yellow"></i><br/></div>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pt">Portuguese</option>
					<option value="pl">Polish</option>
				</select>
				<talkFileEditor  ref="talkFileEditor"
													 :editingSkill="editingSkill"
													 :currentLang="currentLang"
												   v-on:waiting="function(v) { waiting = v }"/>
			</div>
			<div v-else-if="activeTabId === 'cloud'" class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
					<div v-if="editingSkill.modified" class="container flexrow">
						<div style="width: 100%; padding: 1em;">
							<div class="size-2x WIP"> <i class="fas fa-hard-hat red"></i> <i class="fas fa-bomb red"></i> Work In Progress - handle with care! <i class="fas fa-bomb red"></i> <i class="fas fa-hard-hat red"></i><br/></div>
						</div>
							<div class="utility clickable" @click="utilityRequest('revert')">
							<p class="utilityIcon">
								<i id="utilityRevert" class="fas fa-undo-alt"/>
							</p>
							<p class="utilityName">
								{{ $t('skill.utilities.revert') }}
							</p>
						</div>
						<div class="utility clickable" @click="utilityRequest('upload')">
							<p class="utilityIcon">
								<i id="utilityUpload" class="fas fa-cloud-upload-alt"/>
							</p>
							<p class="utilityName">
								{{ $t('skill.utilities.upload') }}
							</p>
						</div>
						<div class="utility clickable" @click="createPR()">
							<p class="utilityIcon">
								<i id="utilityCreatePR" class="fas fa-share-alt"/>
							</p>
							<p class="utilityName">
								{{ $t('skill.utilities.createPR') }}
							</p>
						</div>
					</div>
					<div v-else class="container flexrow">
						<div class="utility clickable" @click="utilityRequest('setModified')">
							<p class="utilityIcon">
								<i id="utilitySetModified" class="fas fa-pen-alt"/>
							</p>
							<p class="utilityName">
								{{ $t('skill.utilities.modify') }}
							</p>
						</div>
					</div>
				</div>
			<div v-else-if="activeTabId === 'devices'">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<div class="size-2x WIP"><i class="fas fa-hard-hat red"></i> Work In Progress - not yet available! <i class="fas fa-hard-hat red"></i><br/></div>
				Creation of own device types via the web interface is not yet possible!<br/>
				To add device types please create the files manually.<br/>
				You can find help on <a href="https://docs.projectalice.io/skill-development/going-further.html#devices">docs.ProjectAlice.io</a>
			</div>
			<div v-else-if="activeTabId === 'widgets'">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<div class="size-2x WIP"><i class="fas fa-hard-hat red"></i> Work In Progress - not yet available! <i class="fas fa-hard-hat red"></i><br/></div>
				Creation of own widgets via the web interface is not yet possible!<br/>
				To add widgets please create the files manually.<br/>
				You can find help on <a href="https://docs.projectalice.io/skill-development/going-further.html#widgets">docs.ProjectAlice.io</a>
			</div>

		</div>
	</div>
</template>

<style src="../css/tabs.css" scoped/>
<style src="../css/devmode.css" scoped/>
<script src="../js/devmode.js"/>
