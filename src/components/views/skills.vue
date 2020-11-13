<template>
  <div class="tileContainer horizontal">
		<skill v-for="skill in skills" :key="skill.name" :skill="skill"/>
	</div>
</template>

<script src="../js/skills.js"></script>
