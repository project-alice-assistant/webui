<template>
	<div class="settingsContainer">
		<textarea v-model="stringified" class="stretched"></textarea>
		<!--<div class="configLayout">
			<div v-for="(slot, skey) of value" class="configLine">
				<button @click="removeSlotFromIntent(intent, slot)"><i class="fas fa-minus-circle size-15x"></i></button>
				<div class="likeInput clickable" @click="renameSlot(intent, slot)">
					{{skey}}
					<i class="fas fa-pen"></i>
				</div>
				<div v-for="(val, vkey) in slot">
					<label>{{vkey}}</label><input v-model="value[skey][vkey]"/>
				</div>
			</div>
			<div class="configLine">
				<button @click="addSlot(intent.slots)"><i class="fas fa-plus-circle size-15x"></i></button>
				<input @keypress.enter="addSlot(intent.slots)"
							 v-model="newSlotName"
							 ref="newSlotInput"
							 @input="resetValidity"/>
			</div>
		</div>-->
	</div>
</template>

<script>
export default {
	name: "simpleJsonEditor",
	props: [ 'value',
					 'configTemplate'
				 ],
	data: function (){
		return {
			stringified: ""
		}
	},
	mounted() {
		this.json2string()
	},
	methods: {
		json2string(){
			console.log("go")
			this.stringified = JSON.stringify(this.value, null, 2)
		},
		string2json(){
			this.$emit('input', JSON.parse(this.stringified))
		},
		prepareSave(){
			if(JSON.stringify(this.value, null, 2) != this.stringified){
				this.string2json()
				return true
			} else {
				return false
			}
		}
	}
}
</script>

<style scoped>
.stretched{
	width: 100%;
	height: 100%;
}

</style>
