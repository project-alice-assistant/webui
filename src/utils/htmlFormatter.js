export default function(text) {
	text = text.replace(/\*\*(.*?)\*\*/gi, '<span class="logBold">$1</span>')
	text = text.replace(/--(.*?)--/gi, '<span class="logDim">$1</span>')
	text = text.replace(/__(.*?)__/gi, '<span class="logUnderlined">$1</span>')
	text = text.replace(/!\[(red|green|yellow|blue|grey)]\((.*?)\)/gi, '<span class="$1">$2</span>')
	text = text.replace(/\[=>]/gi, '<span class="logSpacer"> </span>')
	text = text.replaceAll('\n', '<br/>')
	return text
}
