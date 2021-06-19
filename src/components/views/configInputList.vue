<template>
<div>
	<div v-if="template['subType'] === 'string'">
		<div>
			<label for="newItem">{{ template['name'] }}</label>
			<input
				id="newListItem"
				v-model="newItem"
				:placeholder="template['placeholder']"
				name="newListItem"
				type="text"
				@keyup="validateItem"
				@keyup.enter="addItem"
			>
		</div>
		<div class="list">
			<div
				v-for="item in holder"
				:key="`itm_${item}`"
				class="listItem"
			>
				<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
					 @click="removeItem(item)"/>{{ item }}
			</div>
		</div>
	</div>
	<div v-else>
		<div>
			<label for="newItem">{{ template['name'] }}</label>
			<button v-for="(high, index) in template['highlights']"
							:style="'background-color: '+ high['color'] +';'"
							@click.prevent="makeSlot(high)">
				<div v-if="index<9" class="slotNumber">alt+{{index+1}}:</div>{{ high['slot'] }}
			</button>
			<button @click.prevent="clearSlot()"><div class="slotNumber">alt+0:</div>None</button>
			<div class="backdrop">
				<div class="highlights" v-html="highlightText"></div>
			<input
				id="newListItem"
				ref="newListItem"
				v-model="newItem"
				:placeholder="template['placeholder']"
				name="newListItem"
				type="text"
				@keyup="validateItem"
				@keyup.enter="addItem"
				class="longInput"
				@scroll="handleScroll"
				@input="handleInput"
			/></div>
		</div>
		<div class="list">
			<div
				v-for="item in holder"
				:key="`itm_${item}`"
				class="listItem"
			>
				<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
					 @click="removeItem(item)"/>
				<div v-html="formatUtterance(item)"></div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: "configInputList",
	props: [
		'template',
		'holder',
		'value',
		'allowDouble'
	],
	data: function () {
		return { newItem : "",
						 items : [],
						 newItemSlots: {}
		}
	},
	computed: {
		highlightText: function (){
			let temp = this.newItem.replace(/\n$/g, '\n\n')
			for(let [key, slot] of Object.entries(this.newItemSlots)){
				let regex = new RegExp("(^(?:.*<.*>)*?[^<]*?)(.?"+key+".?)")
				if(regex.test(temp)) {
					temp = temp.replace(regex, "$1<mark style='background-color:" + slot['color'] + ";'>$2</mark>")
				} else {
					this.$delete(this.newItemSlots, slot['value'])
				}
			}
			return temp
		}
	},
	methods: {
		makeSlot(slot) {
			this.moveSelectionToFullWord()
			this.makeSlotFullMarked(slot)
			this.moveCursorToSelectionEnd()
		},
		clearSlot() {
			this.moveSelectionToFullWord()
			let word = this.$refs.newListItem.value.slice(this.$refs.newListItem.selectionStart, this.$refs.newListItem.selectionEnd)
			this.$delete(this.newItemSlots, word)
			this.moveCursorToSelectionEnd()
		},
		moveCursorToSelectionEnd(){
			//move selection to the end of the current word and focus the input
			this.$refs.newListItem.selectionStart = this.$refs.newListItem.selectionEnd
			this.$refs.newListItem.focus()
		},
		moveSelectionToFullWord() {
			if( this.$refs.newListItem.selectionStart === this.$refs.newListItem.selectionEnd ){
				let start = this.$refs.newListItem.value.slice(0, this.$refs.newListItem.selectionStart).lastIndexOf(" ")
				if(start === -1){
					start = 0
				} else {
					start += 1
				}
				this.$refs.newListItem.selectionStart = start
				let end = this.$refs.newListItem.value.slice(this.$refs.newListItem.selectionEnd).indexOf(" ")
				if(end === -1){
					end = this.$refs.newListItem.value.length
				} else {
					end += this.$refs.newListItem.selectionEnd
				}
				this.$refs.newListItem.selectionEnd = end
			}
		},
		makeSlotFullMarked(slot) {
			let word = this.$refs.newListItem.value.slice(this.$refs.newListItem.selectionStart, this.$refs.newListItem.selectionEnd)
			if(word === '') return
			let val = {}
			val['value'] = word
			val['slot'] = slot['slot']
			val['color'] = slot['color']
			this.$set(this.newItemSlots, word, val)
		},
		addItem: function (e) {
			if (this.newItem.length <= 0 || this.newItem === undefined) return
			if (this.items === undefined){
				this.items = []
			}
			if (!this.validateItem(e)) {
				return
			}
			e.target.setCustomValidity("")
			this.items.unshift(this.prepareForStore(this.newItem))
			this.newItem = ''
			this.$emit('input', this.items)

		},
		prepareForStore(input){
			let output = input
			for(let [key, slot] of Object.entries(this.newItemSlots)){
				let regex = new RegExp("(^(?:.*<.*>)*?[^<]*?)("+key+")")
				if(regex.test(output)) {
					output = output.replace(regex, "$1{$2:=>"+slot['slot']+"}")
				} else {
					this.$delete(this.newItemSlots, slot['value'])
				}
			}
			return output
		},
		validateItem: function (e) {
			if (e['altKey'] && e['code'].slice(0,5) === 'Digit') {
				if(e['key'] === "0"){
					this.clearSlot()
				} else {
					let slot = this.template['highlights'][e['key'] - 1]
					this.makeSlot(slot)
				}
			}
			if (!this.allowDouble && this.items.includes(this.newItem)){
				e.target.setCustomValidity("This value already exists")
				e.target.reportValidity()
				return false
			}
			e.target.setCustomValidity("")
			e.target.reportValidity()
			return true
		},
		removeItem(item) {
			this.items = this.items.filter(it => it !== item)
			this.$emit('input', this.items)
		},
		formatUtterance(item) {
			let temp = item.replace(/\n$/g, '\n\n')
			for(let mark of this.template['highlights']){
				let regex = new RegExp("{([^(:=>)]*?):=>"+mark['slot']+"}", "g")
				temp = temp.replace(regex,"<mark style='background-color:"+mark['color']+";'>$1</mark>")
			}
			return temp
		},
		handleInput(e) {
		},
		handleScroll(e) {
			e
		}
	}
}
</script>

<style scoped>
.list {
	background: var(--mainBG);
	overflow: auto;
}
.listItem {
	padding: 0.4em;
}
.longInput{
	position: absolute;
	top: 0px;
}
.longInput,
.highlights{
	background-color: transparent;
	width: calc(100% - 12px); /* why 12 px??? it fits in chrome, but why? */
	min-height: 2em;
	max-height: 2em;
	white-space: pre-wrap;
	word-wrap: break-word;
	border-radius: 0;
	box-sizing: content-box;
	outline: none;
	padding: 5px;
	height: 2em;
	font: 400 13.3333px Arial;
	text-rendering: auto;
	letter-spacing: normal;
	word-spacing: normal;
	text-transform: none;
	text-indent: 0px;
	text-shadow: none;
	text-align: start;
	margin:auto;
}
.highlights {
	color: transparent;
	margin-top: .5em;
	overflow: hidden;
	white-space: nowrap;
}
.backdrop{
	position: relative;
	min-height: 2.4em;
	width: 412px;
	overflow: hidden;
	background: var(--mainBG);
}
.intentInput {
	border: 1px dotted yellow;
	width: 400px;
	height: 200px;
	overflow-y: auto;
}
.highlights >>> mark {
	color: transparent;
}
>>> mark {
	border-radius: 2px;
	box-shadow: 0 0 0 1px var(--accent);
	margin: .3em 0;
	padding: .3em 0;
}
.slotNumber{
	font-size: 0.5em;
	top: -1em;
	left: 0.5em;
	position: relative;
	text-align-last: left;
}
</style>
