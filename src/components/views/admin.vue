<template>
	<div class="container">
		<tabs :tabs="tabs"/>
		<div v-if="activePageId === 1" class="tab_page">
			<div class="settingsContainer">
				<div class="settings">
					<div v-for="category in $store.state.settingCategories" class="settingsCategory">
						<div class="title">{{ category.toUpperCase() }}</div>
						<div class="configLayout">
							<div class="labels">
								<label
									v-for="(settingTemplate, settingName) in $store.state.settingTemplates"
									:class="settingTemplate['dataType'] === 'longstring' ? 'textAreaLabel' : ''"
									v-if="settingTemplate['category'].toLowerCase() === category.toLowerCase()"
									v-tooltip="settingTemplate['description']"
									:for="settingName"
									:id="`label_${settingName}`"
								>
									{{ settingName }}:
								</label>
							</div>
							<div class="inputs">
								<div
									v-for="(settingTemplate, settingName) in $store.state.settingTemplates"
									v-if="settingTemplate['category'].toLowerCase() === category.toLowerCase()"
									class="input"
									:id="`input_${settingName}`"
								>
									<input
										v-if="settingTemplate['dataType'] === 'string' && !settingTemplate['isSensitive']"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
										v-init="$store.state.settings[settingName]"
										:placeholder="settingTemplate['defaultValue']"
										type="text"
									/>
									<input
										v-if="settingTemplate['dataType'] === 'string' && settingTemplate['isSensitive']"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
										v-init="$store.state.settings[settingName]"
										:placeholder="settingTemplate['defaultValue']"
										type="password"
									/>
									<input
										v-if="settingTemplate['dataType'] === 'integer' && !settingTemplate['isSensitive']"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
										v-init="$store.state.settings[settingName]"
										:placeholder="settingTemplate['defaultValue']"
										type="number"
									/>
									<input
										v-if="settingTemplate['dataType'] === 'integer' && settingTemplate['isSensitive']"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
										:placeholder="settingTemplate['defaultValue']"
										type="password"
									/>
									<select
										v-if="settingTemplate['dataType'] === 'list'"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
									>
										<option
											v-if="settingTemplate['values'].constructor === Object"
											v-for="(value, text) in settingTemplate['values']" v-bind:value="value"
										>
											{{text}}
										</option>
										<option
											v-if="settingTemplate['values'].constructor === Array"
											v-for="value in settingTemplate['values']" v-bind:value="value"
										>
											{{value}}
										</option>
									</select>
									<VueToggles
										v-if="settingTemplate['dataType'] === 'boolean'"
										:id="settingName"
										:checked-text="$t('tooltips.yes')"
										:unchecked-text="$t('tooltips.no')"
										:value="$store.state.settings[settingName]"
										checkedBg="var(--windowBG)"
										uncheckedBg="var(--windowBG)"
										@click="$store.state.settings[settingName] = !$store.state.settings[settingName]"
									/>
									<div v-if="settingTemplate['dataType'] === 'range'" class="rangeInput">
										<input
											:id="settingName"
											v-model="$store.state.settings[settingName]"
											v-init="$store.state.settings[settingName]"
											:max="settingTemplate['max']"
											:min="settingTemplate['min']"
											:placeholder="settingTemplate['defaultValue']"
											:step="settingTemplate['step']"
											type="range"
										/> {{$store.state.settings[settingName]}}
									</div>
									<textarea
										v-if="settingTemplate['dataType'] === 'longstring'"
										:id="settingName"
										v-model="$store.state.settings[settingName]"
										v-init="$store.state.settings[settingName]"
										:placeholder="settingTemplate['defaultValue']"
									/>
								</div>
							</div>
						</div>
						<div>
							<i class="far fa-save clickable" aria-hidden="true" v-tooltip="$t('tooltips.save')" @click="save"/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped src="../css/admin.css"/>
<style scoped src="../css/tabs.css"/>
<script src="../js/admin.js"/>
