<template>
	<div class="tileContainer horizontal">
		<skill v-for="(skill, index) in skills" :key="skill.name" :skill="skill" :index="index" v-if="!shopOpen"/>
		<store-skill v-for="skill in storeSkills" :key="skill.name" :skill="skill" :addMethod="addSkillToDownload" v-if="shopOpen"/>
		<actions-menu :menuItems="menuItems" data-tour="10"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
	</div>
</template>

<script src="../js/skills.js"></script>
