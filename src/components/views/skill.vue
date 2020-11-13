<template>
	<div class="skill vertical">
		<div class="skillTitle">
			<div class="skillName">{{ skill.name }}</div>
			<div class="skillIcon"><i :class="skill.icon"></i></div>
		</div>
		<div class="skillBody">
			<div class="status">
				<span class="fa-stack" v-if="skill.active">
					<i class="fas fa-circle fa-stack-2x black"></i>
					<i class="fas fa-circle fa-stack-1x green"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<style src="../css/skill.css" scoped></style>
<script src="../js/skill.js"></script>
