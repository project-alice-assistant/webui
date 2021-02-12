<template>
	<div class="container flexcolumn">
		<tabs :tabs="tabs"/>
		<div v-if="activeTab === 0" class="tab_page yscroll">
			<form ref="data" @keypress.enter.prevent>
				<div class="configLayout">
					<div class="labels">
						<label for="skillName">{{ $t('labels.skillName') }}</label>
						<label for="skillSpeakableName">{{ $t('labels.skillSpeakableName') }}</label>
						<label for="skillDescription">{{ $t('labels.skillDescription') }}</label>
						<label for="skillCategory">{{ $t('labels.skillCategory') }}</label>
						<label for="skillLanguages" style="height: 200px; align-items: flex-start">{{
								$t('labels.skillLanguages')
							}}</label>
						<label for="skillInstructions">{{ $t('labels.skillInstructions') }}</label>
						<label for="skillPipRequirements">{{ $t('labels.skillPipRequirements') }}</label>
						<label for="skillSystemRequirements">{{ $t('labels.skillSystemRequirements') }}</label>
						<label for="skillOnline">{{ $t('labels.skillOnline') }}</label>
						<label for="skillArbitrary">{{ $t('labels.skillArbitrary') }}</label>
						<label for="skillRequiredSkills">{{ $t('labels.skillRequiredSkills') }}</label>
						<label for="skillConflictingSkills">{{ $t('labels.skillConflictingSkills') }}</label>
						<label for="skillRequiredManagers">{{ $t('labels.skillRequiredManagers') }}</label>
						<label for="skillWidgets">{{ $t('labels.skillWidgets') }}</label>
						<label for="skillScenarioNodes">{{ $t('labels.skillScenarioNodes') }}</label>
						<label for="skillDevices">{{ $t('labels.skillDevices') }}</label>
						<label style="justify-content: flex-end;"><i ref="animatedIcon" class="fas fa-spinner fa-pulse fa-2x initialHidden" aria-hidden="true"/></label>
					</div>
					<div class="inputs longInputs">
						<div class="input">
							<input type="text" id="skillName" ref="skillName" class="inputError" @input="validateTextInput(5, 20, true, $event)" :disabled="created">
							<span style="margin-left: 15px;" ref="skillNameExists" class="red initialHidden">{{$t('devMode.skillAlreadyExists')}}</span>
						</div>
						<div class="input">
							<input type="text" id="skillSpeakableName" ref="skillSpeakableName" class="inputError" @input="validateTextInput(5, 50, false, $event)" :disabled="created">
						</div>
						<div class="input">
							<input type="text" id="skillDescription" ref="skillDescription" class="inputError" @input="validateTextInput(20, 200, false, $event)" :disabled="created">
						</div>
						<div class="input">
							<select id="skillCategory" ref="skillCategory" class="inputValid" :disabled="created">
								<option value="weather">weather</option>
								<option value="information">information</option>
								<option value="entertainment">entertainment</option>
								<option value="music">music</option>
								<option value="game">game</option>
								<option value="kid">kid</option>
								<option value="automation">automation</option>
								<option value="assistance" selected>assistance</option>
								<option value="security">security</option>
								<option value="planning">planning</option>
								<option value="shopping">shopping</option>
								<option value="organisation">organisation</option>
								<option value="household">household</option>
								<option value="health">health</option>
							</select>
						</div>
						<div class="inputMultiline" style="min-height: 200px;" id="skillLanguages">
							<div class="line">
								<VueToggles
									:checked-text="$t('tooltips.yes')"
									:unchecked-text="$t('tooltips.no')"
									:value="english"
									checkedBg="var(--windowBG)"
									uncheckedBg="var(--windowBG)"
									:disabled="created"
								/>
								<span style="margin-left: 15px;">{{$t('misc.english')}}</span>
							</div>
							<div class="line">
								<VueToggles
									:checked-text="$t('tooltips.yes')"
									:unchecked-text="$t('tooltips.no')"
									:value="german"
									checkedBg="var(--windowBG)"
									uncheckedBg="var(--windowBG)"
									@click="german = !german"
									:disabled="created"
								/>
								<span style="margin-left: 15px;">{{$t('misc.german')}}</span>
							</div>
							<div class="line">
								<VueToggles
									:checked-text="$t('tooltips.yes')"
									:unchecked-text="$t('tooltips.no')"
									:value="french"
									checkedBg="var(--windowBG)"
									uncheckedBg="var(--windowBG)"
									@click="french = !french"
									:disabled="created"
								/>
								<span style="margin-left: 15px;">{{$t('misc.french')}}</span>
							</div>
							<div class="line">
								<VueToggles
									:checked-text="$t('tooltips.yes')"
									:unchecked-text="$t('tooltips.no')"
									:value="italian"
									checkedBg="var(--windowBG)"
									uncheckedBg="var(--windowBG)"
									@click="italian = !italian"
									:disabled="created"
								/>
								<span style="margin-left: 15px;">{{$t('misc.italian')}}</span>
							</div>
							<div class="line">
								<VueToggles
									:checked-text="$t('tooltips.yes')"
									:unchecked-text="$t('tooltips.no')"
									:value="polish"
									checkedBg="var(--windowBG)"
									uncheckedBg="var(--windowBG)"
									@click="polish = !polish"
									:disabled="created"
								/>
								<span style="margin-left: 15px;">{{$t('misc.polish')}}</span>
							</div>
						</div>
						<div class="input">
							<VueToggles
								id="skillInstructions"
								:checked-text="$t('tooltips.yes')"
								:unchecked-text="$t('tooltips.no')"
								:value="instructions"
								checkedBg="var(--windowBG)"
								uncheckedBg="var(--windowBG)"
								@click="instructions = !instructions"
								:disabled="created"
							/>
						</div>
						<div class="input">
							<input type="text" ref="skillPipRequirements" id="skillPipRequirements" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input type="text" ref="skillSystemRequirements" id="skillSystemRequirements" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<VueToggles
								id="skillOnline"
								:checked-text="$t('tooltips.yes')"
								:unchecked-text="$t('tooltips.no')"
								:value="internet"
								checkedBg="var(--windowBG)"
								uncheckedBg="var(--windowBG)"
								@click="internet = !internet"
								:disabled="created"
							/>
						</div>
						<div class="input">
							<VueToggles
								id="skillArbitrary"
								:checked-text="$t('tooltips.yes')"
								:unchecked-text="$t('tooltips.no')"
								:value="arbitrary"
								checkedBg="var(--windowBG)"
								uncheckedBg="var(--windowBG)"
								@click="arbitrary = !arbitrary"
								:disabled="created"
							/>
						</div>
						<div class="input">
							<input type="text" id="skillRequiredSkills" ref="skillRequiredSkills" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input type="text" id="skillConflictingSkills" ref="skillConflictingSkills" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input type="text" id="skillRequiredManagers" ref="skillRequiredManagers" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input type="text" id="skillWidgets" ref="skillWidgets" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input type="text" id="skillScenarioNodes" ref="skillScenarioNodes" class="inputValid" :placeholder="$t('devMode.listExplain')" :disabled="created">
						</div>
						<div class="input">
							<input id="skillDevices" ref="skillDevices" :disabled="created" :placeholder="$t('devMode.listExplain')" class="inputValid" type="text">
						</div>
						<div class="input">
							<button v-if="!created && allValid && !waiting" @click="createSkill">{{ $t('buttons.create') }}</button>
							<button v-if="!waiting" @click="reset">{{ $t('buttons.reset') }}</button>
							<button v-if="created && !uploaded && !waiting" @click="uploadSkill">{{ $t('buttons.uploadToGithub') }}</button>
							<button v-if="created && uploaded && !waiting" @click="checkOnGithub">{{ $t('buttons.checkOnGithub') }}</button>
						</div>
					</div>
				</div>
			</form>
		</div>
		<div v-if="activeTab === 1" class="tab_page yscroll">
		</div>
	</div>
</template>

<style src="../css/devmode.css" scoped/>
<script src="../js/devmode.js"/>
