<template>
	<div>
		<div v-if="template['subType'] === 'dict'">
			<div class="inputIconContainer">
				<i class="fas fa-plus-circle clickable" @click="addItem"></i>
				<input
					ref="newListItem"
					v-model="newItem"
					:placeholder="template['placeholder']"
					name="newListItem"
					type="text"
					@keyup="handleInput"
					@keyup.enter="addItem"
				>
			</div>
			<div
				v-for="item in value"
				:key="`itm_${item[template.dictKey]}`"
				:class="{'selected':selectedItem === item[template.dictKey]}"
				class="listItem"
				@click="$emit('item-selected', item[template.dictKey])"
			>
				<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
					 @click="removeItem(item)"/>{{ item[template.dictKey] }}
			</div>
			<div
				v-for="item in proposedItems"
				:key="`itmprop_${item}`"
				:class="{'selected':selectedItem === item}"
				class="listItem"
				@click="$emit('item-selected', item)"
			>
				<i aria-hidden="true" class="fas fa-plus-circle fa-pull-left clickable red"
					 @click="addItemVal(item)"/>{{ item }}
			</div>
		</div>
		<div v-else-if="template['subType'] === 'toggles'">
			<config :holder="togglesHolder"
							:subConfig="true"
							:templates="template['values']"
							:translate="$t"></config>
		</div>
		<div v-else-if="template['subType'] === 'string'">
			<div class="inputIconContainer">
				<i class="fas fa-plus-circle clickable" @click="addItem"></i>
				<input
					ref="newListItem"
					v-model="newItem"
					:placeholder="template['placeholder']"
					name="newListItem"
					type="text"
					@keyup="handleInput"
					@keyup.enter="addItem"
				>
			</div>
			<div class="list">
				<div
					v-for="item in value"
					:key="`itm_${item}`"
					:class="{'selected':selectedItem === item}"
					class="listItem"
					@click="$emit('item-selected', item)"
				>
					<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
						 @click="removeItem(item)"/>{{ item }}
				</div>
			</div>
		</div>
		<div v-else-if="template['subType'] === 'keyForDict'">
			<div class="inputIconContainer">
				<i class="fas fa-plus-circle clickable" @click="addItem"></i>
				<input
					ref="newListItem"
					v-model="newItem"
					:placeholder="template['placeholder']"
					name="newListItem"
					type="text"
					@keyup="handleInput"
					@keyup.enter="addItem"
				>
			</div>
			<div class="list">
				<div
					v-for="item in proposedItems"
					:key="`itm_${item}`"
					:class="{'selected':selectedItem === item}"
					class="listItem"
					@click="$emit('item-selected', item)"
				>
					<i aria-hidden="true" class="fas fa-plus-circle fa-pull-left clickable red"
						 @click="addItemVal(item)"/>{{ item }}
				</div>
				<div
					v-for="(item, key) in value"
					:key="`itm_${key}`"
					:class="{'selected':selectedItem === key}"
					class="listItem"
					@click="$emit('item-selected', key)"
				>
					<i aria-hidden="true" class="fas fa-minus-circle fa-pull-left clickable"
						 @click="removeItem(key)"/>{{ key }}
				</div>
			</div>
		</div>
		<div v-else>
			<div>
				<button v-for="(high, index) in template.highlights"
								v-if="high.slot !== ''"
								:style="'background-color: '+ high.color +';'"
								@click.prevent="makeSlot(high)">
					<span v-if="index<9" class="slotNumber">alt+{{ index + 1 }}:</span>
					{{ high.slot }}
				</button>
				<button @click.prevent="clearSlot()">
					<span class="slotNumber">alt+0:</span>
					None
				</button>
				<div class="backdrop inputIconContainer">
					<i class="fas fa-plus-circle clickable" @click="addItem"></i>
					<div class="highlights" v-html="highlightText"></div>
					<input
						ref="newListItem"
						v-model="newItem"
						:placeholder="template.placeholder"
						class="longInput"
						name="newListItem"
						type="text"
						@input="handleInput"
						@keyup="handleInput"
						@scroll="handleScroll"
						@keyup.enter="addItem"
					/>
				</div>
			</div>
			<div class="list">
				<div
					v-for="item of Object.values(value)"
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
	name:  'configInputList',
	props: {
		'template':      {},
		'value':         {
			default: () => {
				return []
			}
		},
		'allowDouble':   {},
		'selectedItem':  {},
		'proposedItems': {}
	},
	data:  function () {
		return {
			newItem:       '',
			newItemSlots:  {},
			togglesHolder: {}
		}
	},
	mounted() {
		if (this.template['subType'] === 'toggles' && this.value !== undefined) {
			if (!this.$t) {
				alert('list of toggles are not allowed when there is no $t')
			}
			this.togglesHolder = {}
			for (const key of this.value) {
				this.$set(this.togglesHolder, key, true)
			}
		}
	},
	watch:    {
		togglesHolder: {
			deep: true,
			handler() {
				this.$emit('input', Object.keys(this.togglesHolder).filter(k => this.togglesHolder[k]))
			}
		}
	},
	computed: {
		highlightText() {
			/*
			* compute the highlights for the underlay of the textarea input
			* */
			let temp = this.newItem.replace(/\n$/g, '\n\n')
			for (let [key, slot] of Object.entries(this.newItemSlots)) {
				let regex = new RegExp('(^(?:.*<.*>)*?[^<]*?)(.?' + key + '.?)')
				if (regex.test(temp)) {
					temp = temp.replace(regex, '$1<mark style=\'background-color:' + slot['color'] + ';\'>$2</mark>')
				} else {
					this.$delete(this.newItemSlots, slot['value'])
				}
			}
			return temp
		},
		valNN() {
			if (!this.value)
				return []
			else
				return this.value
		}
	},
	methods:  {
		makeSlot(slot) {
			/*
			 * a button or shortcut was pressed to make either the current selection
			 * or the word around or right before the cursor to a slot value
			 */
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
		moveCursorToSelectionEnd() {
			//move selection to the end of the current word and focus the input
			this.$refs.newListItem.selectionStart = this.$refs.newListItem.selectionEnd
			this.$refs.newListItem.focus()
		},
		moveSelectionToFullWord() {
			/*
			* mark a full word if there is currently no selection
			* move the start of the selection to the last space in front of the current cursor position
			* move the end of the selection to the first space after the current cursor position
			*/
			if (this.$refs.newListItem.selectionStart === this.$refs.newListItem.selectionEnd) {
				// no matter if no result was found (-1) or if we found a result, we have to add 1 to the starting position
				// -> we start AFTER the space!
				this.$refs.newListItem.selectionStart = 1 + this.$refs.newListItem.value.slice(0, this.$refs.newListItem.selectionStart).lastIndexOf(' ')
				let end = this.$refs.newListItem.value.slice(this.$refs.newListItem.selectionEnd).indexOf(' ')
				// if we don't find any more space after: use the last character
				// if we found one we have to take into account that we didn't start at 0 but selectionEnd
				if (end === -1) {
					end = this.$refs.newListItem.value.length
				} else {
					end += this.$refs.newListItem.selectionEnd
				}
				this.$refs.newListItem.selectionEnd = end
			}
		},
		makeSlotFullMarked(slot) {
			/*
			* assumes the slot is currently selected.
			* This can be caused by the user manually selecting it, or by calling moveSelectionToFullWord before this func.
			*/
			let word = this.$refs.newListItem.value.slice(this.$refs.newListItem.selectionStart, this.$refs.newListItem.selectionEnd)
			if (word === '') return
			let val = {}
			val['value'] = word
			val['slot'] = slot['slot']
			val['color'] = slot['color']
			this.$set(this.newItemSlots, word, val)
		},
		addItemVal: function (v) {
			this.newItem = v
			this.addItem()
		},
		addItem: function (e) {
			/*
			* The user pressed enter -> the current input should be added to the list
			* This is used for the default (string) list as well as for the utterances list!
			*/
			//ignore empty inputs
			if (this.newItem.length <= 0) {
				this.$refs.newListItem.focus()
				return
			}
			//make sure the result list is initialized
			//if (this.value === undefined){
			//	this.value = []
			//}
			//make sure the input item is valid
			if (!this.handleInput(e)) return

			if (this.template.subType === 'dict') {
				let newVal = this.template.dictTemplate
				newVal[this.template.dictKey] = this.newItem

				this.$emit('input', [newVal, ...this.valNN])
			} else if (this.template.subType === 'keyForDict') {
				this.$set(this.value, this.newItem, this.template.dictTemplate)
			} else {
				//transform to the final form and  add the new item to the front of the list
				this.$emit('input', [this.prepareForStore(this.newItem), ...this.valNN])
			}
			//clear the input
			this.newItem = ''
			this.$refs.newListItem.focus()
			this.$forceUpdate()
		},
		prepareForStore(input) {
			/*
			* prepare the input for storing - called for both generic and utterances list
			* currently only used for utterances, as newItemSlots is always empty for generic input
			*/
			let output = input
			for (let [key, slot] of Object.entries(this.newItemSlots)) {
				//REGEX: find the FIRST occurrence of key that is NOT inside <> brackets
				//capturing everything before key as $1 and the key itself as $2
				let regex = new RegExp('(^(?:.*<.*>)*?[^<]*?)(' + key + ')')
				//Test if the slot still exists, replace with the correct utterance form if it does
				//delete it from the list if it couldn't be found anymore.
				if (regex.test(output)) {
					output = output.replace(regex, '$1{$2:=>' + slot['slot'] + '}')
				} else {
					this.$delete(this.newItemSlots, slot['value'])
				}
			}
			return output
		},
		handleInput(e) {
			/*
			* handle shortcuts (when alt+number is pressed)
			* check if the current input is valid
			* called after ever key push, explicitly called after pressing enter
			* */
			if (e && e['altKey'] && e['code'].slice(0, 5) === 'Digit') {
				if (e['key'] === '0') {
					this.clearSlot()
				} else {
					let slot = this.template['highlights'][e['key'] - 1]
					this.makeSlot(slot)
				}
			}
			//check if that value already exists in the list
			if (this.template.subType === 'dict') {
				if (!this.allowDouble && this.value && this.value.some(e => e[this.template.dictKey] === this.newItem)) {
					this.$refs.newListItem.setCustomValidity('This value already exists')
					this.$refs.newListItem.reportValidity()
					return false
				}
			} else {
				if (!this.allowDouble && Array.isArray(this.value) && this.value.includes(this.newItem)) {
					this.$refs.newListItem.setCustomValidity('This value already exists')
					this.$refs.newListItem.reportValidity()
					return false
				}
			}
			this.$refs.newListItem.setCustomValidity('')
			this.$refs.newListItem.reportValidity()
			return true
		},
		removeItem(item) {
			/*
			* Remove one line of the final list
			* called on button press (-) next to the list item
			*/
			if (this.template.subType === 'keyForDict') {
				this.$delete(this.value, item)
			} else {
				this.$emit('input', this.value.filter(it => it !== item))
			}
		},
		formatUtterance(item) {
			/*
			* Format a list item containing {key:=>slot}
			*/
			let temp = item.replace(/\n$/g, '\n\n')
			for (let mark of this.template['highlights']) {
				//REGEX: find and capture ALL occurrences of {$1:=>slot}
				// making sure no other :=> is allowed inside $1 to prevent capturing two slots as one
				let regex = new RegExp('{([^(:=>)]*?):=>' + mark['slot'] + '}', 'g')
				temp = temp.replace(regex, '<mark style=\'background-color:' + mark['color'] + ';\'>$1</mark>')
			}
			return temp
		},
		handleScroll(e) {
			//TODO! scroll both the highlights and the rest synchronously
		}
	}
}
</script>

<style scoped>
.stretched > textarea {
	background: red;
	width: 100%;
}

.list {
	background: var(--mainBG);
	overflow: auto;
}

.listItem {
	border-block: 1px dotted var(--accent);
	padding: 0.4em;
}

.longInput {
	position: absolute;
	top: 0;
}

.longInput,
.highlights {
	background-color: transparent;
	border-radius: 0;
	box-sizing: content-box;
	font: 400 13.3333px Arial;
	height: 2em;
	letter-spacing: normal;
	margin: auto;
	max-height: 2em;
	min-height: 2em;
	outline: none;
	padding: 5px;
	text-align: start;
	text-indent: 0;
	text-rendering: auto;
	text-shadow: none;
	text-transform: none;
	white-space: pre-wrap;
	width: calc(100% - 12px); /* why 12 px??? it fits in chrome, but why? */
	word-spacing: normal;
	word-wrap: break-word;
}

.inputIconContainer > .highlights {
	color: red;
	left: 0;
	padding-left: 2.1em;
	position: absolute;
}

.highlights {
	color: transparent;
	margin-top: .5em;
	overflow: hidden;
	white-space: nowrap;
}

.backdrop {
	background: var(--mainBG);
	min-height: 2.4em;
	overflow: hidden;
	position: relative;
	width: 412px;
}

.intentInput {
	border: 1px dotted yellow;
	height: 200px;
	overflow-y: auto;
	width: 400px;
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

.slotNumber {
	font-size: 0.5em;
	left: 0.5em;
	position: relative;
	text-align-last: left;
	top: -1em;
}

.selected {
	background: var(--windowBG);
}

.inputIconContainer {
	position: relative;
	width: 100%;
}

.inputIconContainer > input {
	box-sizing: border-box;
	left: 0;
	min-height: 3em;
	padding-left: 2em;
	position: relative;
	width: 100%;
}

.inputIconContainer i {
	margin: .75em .4em;
	position: absolute;
	z-index: 1;
}
</style>
