<template>
	<div class="tileContainer">
		<skill v-for="(skill, index) in skills" :key="skill.name" :skill="skill" :index="index" v-if="!shopOpen"/>
		<store-skill :ref="skill.name.toLowerCase()" v-for="skill in storeSkills" :key="skill.name" :skill="skill" :addMethod="addSkillToDownload" :removeMethod="removeSkillToDownload" v-if="shopOpen"/>
		<actions-menu :menuItems="menuItems" data-tour="10"/>
		<v-tour name="skills" :steps="steps" :callbacks="tourCallbacks"/>
	</div>
</template>

<script src="../js/skills.js"/>
