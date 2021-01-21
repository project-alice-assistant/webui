<template>
	<div class="skill" :style="skill.name === 'ProjectAliceDemo' ? 'margin-left: 200px;' : ''" data-tour="0">
		<div class="skillTitle">
			<div class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<overlay :header="`${$t('skill.info')} - ${skill.name}`" :opened="viewInfos" :visible="viewInfos" animate="zoom-in" @closed="viewInfos = false">
			<ul class="fa-ul">
				<li><span class="fa-li"><i class="fas fa-code-branch" aria-hidden="true"></i></span>{{ skill.version }}</li>
				<li>
					<span class="fa-li"><i class="fas fa-compress-arrows-alt" aria-hidden="true"></i></span>{{ skill.aliceMinVersion }}
				</li>
				<li><span class="fa-li"><i class="fas fa-user" aria-hidden="true"></i></span>{{ skill.author }}</li>
				<li v-if="skill.maintainers">
					<span class="fa-li"><i class="fas fa-users" aria-hidden="true"></i></span>{{ skill.maintainers.join(', ') }}
				</li>
				<li><span class="fa-li"><i class="fas fa-folder-open" aria-hidden="true"></i></span>{{ skill.category }}</li>
				<li><span class="fa-li"><i class="fas fa-quote-right" aria-hidden="true"></i></span>{{ skill.description }}</li>
			</ul>
		</overlay>
		<overlay :header="`${$t('skill.intents')} - ${skill.name}`" :opened="viewIntents" :visible="viewIntents" animate="zoom-in" @closed="viewIntents = false">
			<p v-for="(utterances, intent) in skill['intents']" v-if="intent.startsWith('hermes/intent/') && utterances.length > 0">
				<strong>{{ intent.split('hermes/intent/')[1] }}: «</strong>
				<i>{{ utterances[Math.floor(Math.random() * utterances.length)] }}</i> <strong>»</strong>
			</p>
		</overlay>
		<overlay :header="`${$t('skill.instructions')} - ${skill.name}`" :opened="viewInstructions" :visible="viewInstructions" animate="zoom-in" @closed="viewInstructions = false">
			<vue-simple-markdown :source="skill.instructions"/>
		</overlay>
		<div class="skillBody" v-if="viewSkill">
			<div class="clickable" @click="$tours['skills'].currentStep !== -1 ? '' : viewIntents = true" data-tour="7">{{ $t('skill.intents') }}</div>
			<div class="clickable" @click="$tours['skills'].currentStep !== -1 ? '' : viewInfos = true" data-tour="8">{{ $t('skill.info') }}</div>
			<div class="clickable" @click="$tours['skills'].currentStep !== -1 ? '' : viewInstructions = true" data-tour="9" v-if="skill.instructions && skill.instructions.length > 0">{{ $t('skill.instructions') }}</div>
			<div class="skillActions">
				<i class="fas fa-cog clickable" aria-hidden="true" v-if="skill.settings && Object.keys(skill.settings).length" @click="showSettings" data-tour="1" v-tooltip="$t('tooltips.settings')"/>
				<i class="fas fa-power-off clickable" aria-hidden="true" v-if="!skill.required" @click="toggle" data-tour="2" v-tooltip="skill.active ? $t('tooltips.stop') : $t('tooltips.start')"/>
				<i class="fas fa-sync clickable" aria-hidden="true" v-if="skill.active" @click="reloadSkill" data-tour="3" v-tooltip="$t('tooltips.reload')"/>
				<i class="fas fa-arrow-alt-circle-up clickable" aria-hidden="true" v-if="skill.updateAvailable" @click="update" data-tour="4" v-tooltip="$t('tooltips.update')"/>
				<i class="far fa-times-circle clickable" aria-hidden="true" v-if="!skill.required" @click="remove" data-tour="5" v-tooltip="$t('tooltips.remove')"/>
			</div>
			<div class="skillStatusAround" />
			<div class="skillStatus" :class="skill.active ? 'active' : 'disabled'" data-tour="6"/>
		</div>
	</div>
</template>

<style src="../css/skill.css" scoped/>
<style src="../css/tour.css" scoped/>

<script src="../js/skill.js"/>
