<template>
	<div class="container flexrow yscroll">
		<actions-menu :menuItems="menuItems" data-tour="10"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
		<skill v-for="skill in skills" :key="skill.name" :skill="skill" v-if="!shopOpen"/>
		<store-skill v-for="skill in storeSkills" v-if="shopOpen && !skill.installed" :key="skill.name" :ref="skill.name.toLowerCase()" :addMethod="addSkillToDownload" :removeMethod="removeSkillToDownload" :skill="skill"/>
	</div>
</template>

<script src="../js/skills.js"/>
