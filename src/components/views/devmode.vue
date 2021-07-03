<template>
	<div class="container flexcolumn">
		<div v-if="createNew" class="settingsContainer">
				<config
					:templates="configTemplate()"
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
				<config :holder="editingSkill"
								:templates="configTemplate()"
								:translate="(val) => $t(val)"
								:validator="false"
								:byCategory="true"/>
			</div>
			<div v-else-if="activeTabId === 'training'"  class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="pl">Polish</option>
				</select>
				<dialogTemplateEditor ref="dialogTemplateEditor"
															:editingSkill="editingSkill"
															:currentLang="currentLang"/>
			</div>
			<div v-else-if="activeTabId === 'configTemplate'" class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				1. edit template file for active skill:<br/>
				2. edit instructions file in "fancy" markdown editor with preview<br/>
				3. ?? <br/>

				4. profit!
			</div>
			<div v-else-if="activeTabId === 'instructions'" class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				<select v-model="currentLang">
					<option value="en">English</option>
					<option value="de">German</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
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
			<div v-else-if="activeTabId === 'talk'">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				1. Select active Language:<br/>
				2. edit talk file. <br/>
				3. ?? <br/>
				4. profit!
			</div>
			<div v-else-if="activeTabId === 'cloud'" class="tab_page">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
					<div v-if="editingSkill.modified" class="container flexrow">
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
						#TODO: Bump Version to? Ask Min. Version?
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
				1. create new device types <br/>
				2. edit device type config template<br/>
				3. upload image for devicetype
			</div>
			<div v-else-if="activeTabId === 'widgets'">
				<actions-menu :menuItems="menuItems" :alwaysExtended="true"/>
				1. create new empty widget<br/>
				2. edit widget type config template
			</div>

		</div>
	</div>
</template>

<style src="../css/tabs.css" scoped/>
<style src="../css/devmode.css" scoped/>
<script src="../js/devmode.js"/>
