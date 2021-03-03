<!--suppress HtmlFormInputWithoutLabel -->
<template>
	<div class="container flexcolumn">
		<tabs :activeTabId="activeTabId" :parent="this" :tabs="tabs"/>
		<div v-if="activeTabId === 1" class="tab_page">
			<div class="settingsContainer">
				<div class="settingsCategory">
					<div class="title">{{ $t('labels.searchSetting') }}</div>
					<div class="configLayout">
						<input v-model="settingSearchKeyword" :placeholder="$t('labels.keyword')" type="text"/>
					</div>
				</div>
				<div
					v-for="category in settingsCategories"
					:id="category.toLowerCase().replace(' ', '_')"
					class="settingsCategory"
				>
					<div class="title">{{ category.toUpperCase() }}</div>
					<div class="configLayout">
						<div class="labels">
							<label
								v-for="(settingTemplate, settingName) in categorySettings(category)"
								:class="settingTemplate['dataType'] === 'longstring' ? 'textAreaLabel' : ''"
								v-tooltip="settingTemplate['description']"
								:for="settingName"
								:id="`label_${settingName}`"
							>
								{{ settingName }}:
							</label>
						</div>
						<div class="inputs">
							<div
								v-for="(settingTemplate, settingName) in categorySettings(category)"
								class="input"
								:id="`input_${settingName}`"
							>
								<input
									v-if="settingTemplate['dataType'] === 'string' && !settingTemplate['isSensitive']"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									v-init="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
									type="text"
								/>
								<input
									v-if="settingTemplate['dataType'] === 'string' && settingTemplate['isSensitive']"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									v-init="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
									type="password"
								/>
								<input
									v-if="settingTemplate['dataType'] === 'email'"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									v-init="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
									type="email"
								/>
								<input
									v-if="settingTemplate['dataType'] === 'integer' && !settingTemplate['isSensitive']"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									v-init="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
									type="number"
								/>
								<input
									v-if="settingTemplate['dataType'] === 'integer' && settingTemplate['isSensitive']"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
									type="password"
								/>
								<select
									v-if="settingTemplate['dataType'] === 'list'"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									@change="checkSetters(settingName)"
								>
									<option
										v-if="settingTemplate['values'].constructor === Object"
										v-for="(value, text) in settingTemplate['values']" v-bind:value="value"
									>
										{{ text }}
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
									@change="checkSetters(settingName)"
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
										@change="checkSetters(settingName)"
									/>
								</div>
								<textarea
									v-if="settingTemplate['dataType'] === 'longstring'"
									:id="settingName"
									v-model="$store.state.settings[settingName]"
									v-init="$store.state.settings[settingName]"
									:placeholder="settingTemplate['defaultValue']"
									@change="checkSetters(settingName)"
								/>
								<span v-if="settingTemplate['dataType'] === 'range'" class="inputRangeValue">{{ $store.state.settings[settingName] }}</span>
							</div>
						</div>
					</div>
					<div>
						<reactive-icon data-success="false" icon="far fa-save" tooltip="tooltips.save" :onClick="save" :timing="[1, 2]"/>
					</div>
				</div>
			</div>
		</div>
		<div v-if="activeTabId === 2" class="tab_page">
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
						{{$t('utilities.reboot')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndCheck('train', 'projectalice.core.training')">
					<p class="utilityIcon">
						<i id="utilityTrain" class="fas fa-brain"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.train')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndCheck('update', 'projectalice.core.updating')">
					<p class="utilityIcon">
						<i id="utilityUpdate" class="fas fa-sync"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.update')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('addUser')">
					<p class="utilityIcon">
						<i id="utilityAddUser" class="fas fa-user-plus"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.addUser')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('addWakeword')">
					<p class="utilityIcon">
						<i id="utilityAddWakeword" class="fas fa-comment-medical"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.addWakeword')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilitySimpleRequest('tuneWakeword')">
					<p class="utilityIcon">
						<i id="utilityTuneWakeword" class="fas fa-volume-up"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.tuneWakeword')}}
					</p>
				</div>
				<div class="utility clickable" @click="utilityRequestAndRedirect('wipeAll')">
					<p class="utilityIcon">
						<i id="utilityWipeAll" class="fas fa-bomb"/>
					</p>
					<p class="utilityName">
						{{$t('utilities.wipe')}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped src="../css/admin.css"/>
<style scoped src="../css/tabs.css"/>
<script src="../js/admin.js"/>
