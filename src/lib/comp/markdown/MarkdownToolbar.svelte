<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ImageToolbar from './ImageToolbar.svelte';

	const dispatch = createEventDispatcher();

	export let useMarkdown = true;

	function insert(before: string, after: string = '', placeholder: string = '') {
		dispatch('insert', { before, after, placeholder });
	}
</script>

<div class="markdown-toolbar">
	<!-- Text Formatting -->
	<div class="toolbar-group">
		<button type="button" title="Bold" on:click={() => insert('**', '**', 'bold')}><b>B</b></button>
		<button type="button" title="Italic" on:click={() => insert('*', '*', 'italic')}
			><i>I</i></button
		>
		<button type="button" title="Underline" on:click={() => insert('<u>', '</u>', 'underline')}
			><u>U</u></button
		>
		<button type="button" title="Code" on:click={() => insert('`', '`', 'code')}>` `</button>
	</div>

	<!-- Headings -->
	<div class="toolbar-group">
		<button type="button" title="Heading 1" on:click={() => insert('# ', '', 'Heading 1')}
			>H1</button
		>
		<button type="button" title="Heading 2" on:click={() => insert('## ', '', 'Heading 2')}
			>H2</button
		>
		<button type="button" title="Heading 3" on:click={() => insert('### ', '', 'Heading 3')}
			>H3</button
		>
	</div>

	<!-- Lists -->
	<div class="toolbar-group">
		<button type="button" title="Unordered List" on:click={() => insert('- ', '', 'list item')}
			>•</button
		>
		<button type="button" title="Ordered List" on:click={() => insert('1. ', '', 'ordered item')}
			>1.</button
		>
	</div>

	<!-- Alignment -->
	<div class="toolbar-group">
		<button
			type="button"
			title="Align Left"
			on:click={() => insert('<align left>\n', '\n</align>', 'left-aligned text')}>⇤</button
		>
		<button
			type="button"
			title="Align Center"
			on:click={() => insert('<align center>\n', '\n</align>', 'centered text')}>⇔</button
		>
		<button
			type="button"
			title="Align Right"
			on:click={() => insert('<align right>\n', '\n</align>', 'right-aligned text')}>⇥</button
		>
		<button
			type="button"
			title="Justify"
			on:click={() => insert('<align justify>\n', '\n</align>', 'justified text')}>⇿</button
		>
	</div>

	<!-- Media & Links -->
	<div class="toolbar-group">
		<button type="button" title="Link" on:click={() => insert('[', '](https://)', 'link text')}
			>🔗</button
		>
		<ImageToolbar
			{useMarkdown}
			on:insert={(e: CustomEvent<{ before: string; after: string; placeholder: string }>) =>
				insert(e.detail.before, e.detail.after, e.detail.placeholder)}
		/>
	</div>

	<!-- Blocks -->
	<div class="toolbar-group">
		<button type="button" title="Blockquote" on:click={() => insert('> ', '', 'quote')}>&gt;</button
		>
		<button type="button" title="Code Block" on:click={() => insert('```\n', '\n```', 'code block')}
			>```</button
		>
		<button
			type="button"
			title="Poetry Block"
			on:click={() => insert('<poetry>\n', '\n</poetry>', 'Your poem here')}>✒️</button
		>
	</div>

	<!-- Layout Sections -->
	<div class="toolbar-group">
		<button
			type="button"
			title="Content Section (Float Left by Default)"
			on:click={() =>
				insert(
					'<columns float="left" width="40%">\n<!-- Floated content (e.g., image, short text, list) -->\n',
					'---\n\n<!-- Main content (e.g., long paragraph) -->\n</columns>',
					''
				)}
		>
			<span style="font-size: 0.9em; line-height: 1;">◧</span>
		</button>
	</div>

	<!-- Custom Styling -->
	<div class="toolbar-group">
		<button
			type="button"
			title="Custom Styled Block"
			on:click={() =>
				insert(
					'<custom style="padding:0.7em 1em;border-radius:8px;margin:1em 0;">\n',
					'\n</custom>',
					'/* Custom Styled Block */'
				)}>CSS</button
		>
		<button
			type="button"
			title="Background Color Section"
			on:click={() => insert('<bgc bg:white text:#222>\n', '\n</bgc>', 'background section')}
			>BG</button
		>
	</div>
</div>

<!--
USAGE DOCUMENTATION:

The MarkdownToolbar component emits an `insert` event when a toolbar button is clicked.

- The event detail is an object: { before: string, after: string, placeholder: string }
- The parent component should listen for the `insert` event and call a function that inserts the markdown at the current cursor position in the target input or textarea.

Example usage in a parent Svelte component:

<script lang="ts">
	let textareaEl: HTMLTextAreaElement | null = null;
	let content = "";

	function insertAtCursor(before: string, after: string = '', placeholder: string = '') {
		if (!textareaEl) return;
		const el = textareaEl;
		const start = el.selectionStart;
		const end = el.selectionEnd;
		const selected = content.slice(start, end) || placeholder;
		const newText = content.slice(0, start) + before + selected + after + content.slice(end);
		content = newText;
		// Optionally, restore cursor/selection position:
		setTimeout(() => {
			el.focus();
			const cursorStart = start + before.length;
			const cursorEnd = cursorStart + selected.length;
			el.setSelectionRange(cursorStart, cursorEnd);
		}, 0);
	}
</script>

<MarkdownToolbar on:insert={e => insertAtCursor(e.detail.before, e.detail.after, e.detail.placeholder)} />
<textarea bind:this={textareaEl} bind:value={content}></textarea>

-->

<style>
	.markdown-toolbar {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.7rem;
		flex-wrap: wrap;
		padding: 0.3rem;
		background: var(--color-toolbar-bg);
		border-radius: 8px;
		border: 1px solid var(--color-toolbar-border);
	}

	.toolbar-group {
		display: flex;
		gap: 0.3rem;
		padding: 0.15rem;
		background: var(--color-toolbar-group-bg);
		border-radius: 6px;
	}

	.markdown-toolbar button {
		background: var(--color-toolbar-btn-bg);
		border: 1px solid var(--color-toolbar-btn-border);
		border-radius: 4px;
		padding: 0.2rem 0.5rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.15s ease;
		min-width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		color: var(--color-toolbar-btn-text);
	}

	.markdown-toolbar button:hover {
		background: var(--color-toolbar-btn-hover);
		border-color: var(--color-toolbar-btn-active);
		transform: translateY(-1px);
	}

	.markdown-toolbar button:active {
		background: var(--color-toolbar-btn-active);
		transform: translateY(0);
	}

	.markdown-toolbar button span {
		display: inline-block;
		vertical-align: middle;
	}
</style>
