<template>
	<div class="skill">
		<div class="skillTitle">
			<svg class="skillName">
				<text y="15">{{ skill.name }}</text>
			</svg>
			<div class="skillIcon"><i :class="skill.icon" aria-hidden="true"/></div>
		</div>
		<div class="skillAuthor">
			<i aria-hidden="true" class="fas fa-user"/> <span class="clickable">{{ skill.author }}</span>
		</div>
		<div class="skillDescription">
			{{ skill.desc }}
		</div>
		<div class="download" @click="handleDownloadClick">
			<i :class="{'fa-download': !isWanted && !isDownloading, 'fa-check': isWanted && !isDownloading, 'fa-spinner fa-spin': !isWanted && isDownloading}" aria-hidden="true" class="fas clickable"/>
		</div>
	</div>
</template>

<style scoped src="../css/storeSkill.css"></style>
<script src="../js/storeSkill.js"></script>
