<template>
	<div class="container flexcolumn">
		<tabs
					:activeTabId="activeTabId"
					:tabs="tabs"
					:store="$store"/>
		<div v-if="activeTabId === 1" class="tab_page">
				<config
					:templates="configTemplate()"
					:holder="values"
					:translate="(val) => $t(val)"
					:validator="false"
					:byCategory="true"
					:includeFilter="true"
					:waiting="waiting"
					:success="success"
					:failed="failed"
				  :actions="{'reset': { 'action': reset,
				  											'condition': !waiting
				  											},
											'create': {'text': $t('buttons.create'),
				  											 'action': createSkill,
																 'condition': !created && allValid && !waiting
				  											},
											'upload': {'text': $t('buttons.uploadToGithub'),
				  											'action': uploadSkill,
				  											'condition': created && !uploaded && !waiting
				  											},
											'checkOnGithub': {'text': $t('buttons.checkOnGithub'),
				  											'action': checkOnGithub,
				  											'condition': created && uploaded && !waiting
				  											}
				  											}"
					:text-buttons="true"
				  :conf-prefix="'skill '"/>
				<span style="margin-left: 15px;" ref="skillNameExists" class="red initialHidden">{{$t('devMode.skillAlreadyExists')}}</span>
		</div>
		<div v-if="activeTabId === 2" class="tab_page yscroll">
		</div>
	</div>
</template>

<style src="../css/tabs.css" scoped/>
<style src="../css/devmode.css" scoped/>
<script src="../js/devmode.js"/>
