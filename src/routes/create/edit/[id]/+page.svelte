<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { coffeeMarkdown, defaultStyles } from '$lib/md/coffeeMarkdown';
	import { user } from '$lib/stores/user';
	import type { Story, Chapter } from '$lib/db/story';
	import { fetchStoryById, fetchChaptersByStoryId, addChapter, updateStory, deleteStory } from '$lib/db/story';

	let story: Story | null = null;
	let chapters: Chapter[] = [];
	let error = '';
	let loading = true;
	let newChapterTitle = '';

	let storyId = '';
	$: storyId = $page.params.id;

	let loadingStep = 0;
	let showDeleteConfirm = false;

	onMount(async () => {
		loadingStep = 1; // Authenticating user
		let userId: string | undefined;
		if ($user?.usr?.id) {
			userId = $user.usr.id;
		} else {
			const { data: userData } = await import('$lib/supabaseClient').then(m => m.supabase.auth.getUser());
			userId = userData.user?.id;
		}
		if (!userId) {
			error = 'You must be logged in.';
			loading = false;
			return;
		}
		loadingStep = 2; // Fetching story
		try {
			story = await fetchStoryById(storyId);
			if (!story || story.user_id !== userId) throw new Error('Story not found.');
			loadingStep = 3; // Fetching chapters
			chapters = await fetchChaptersByStoryId(storyId);
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			story = null;
			chapters = [];
		} finally {
			loading = false;
		}
	});

	async function addChapterHandler() {
		if (!newChapterTitle.trim()) return;
		let userId: string | undefined;
		if ($user?.usr?.id) {
			userId = $user.usr.id;
		} else {
			const { data: userData } = await import('$lib/supabaseClient').then(m => m.supabase.auth.getUser());
			userId = userData.user?.id;
		}
		if (!userId || !story || story.user_id !== userId) {
			error = 'You do not own this story.';
			return;
		}
		try {
			const chapter = await addChapter(storyId, userId, newChapterTitle);
			chapters = [...chapters, chapter];
			newChapterTitle = '';
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	function editChapter(chapterId: string) {
		goto(`/create/edit/${storyId}/chapter/${chapterId}`);
	}

	let editingDescription = false;
	let editedDescription = '';
	let editingTitle = false;
	let editedTitle = '';
	let editingShortDescription = false;
	let editedShortDescription = '';

	function startEditDescription() {
		editedDescription = story?.description || '';
		editingDescription = true;
	}

	function startEditTitle() {
		editedTitle = story?.title || '';
		editingTitle = true;
	}

	function startEditShortDescription() {
		editedShortDescription = story?.short_description || '';
		editingShortDescription = true;
	}

	async function saveDescription() {
		if (!story) return;
		try {
			const updated = await updateStory(story.id, { description: editedDescription });
			story = { ...story, description: updated.description };
			editingDescription = false;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function saveShortDescription() {
		if (!story) return;
		try {
			const updated = await updateStory(story.id, { short_description: editedShortDescription });
			story = { ...story, short_description: updated.short_description };
			editingShortDescription = false;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function saveTitle() {
		if (!story || !editedTitle.trim()) return;
		try {
			const updated = await updateStory(story.id, { title: editedTitle });
			story = { ...story, title: updated.title };
			editingTitle = false;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	}

	async function togglePublishStatus() {
		if (!story) return;
		loading = true;
		loadingStep = 4;
		let userId: string | undefined;
		if ($user?.usr?.id) {
			userId = $user.usr.id;
		} else {
			const { data: userData } = await import('$lib/supabaseClient').then(m => m.supabase.auth.getUser());
			userId = userData.user?.id;
		}
		if (!userId || story.user_id !== userId) {
			error = 'You do not have permission to modify this story.';
			loading = false;
			return;
		}
		const newPublishStatus = !story.is_published;
		try {
			const updated = await updateStory(story.id, { is_published: newPublishStatus });
			story = { ...story, is_published: updated.is_published };
			error = '';
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}

	async function deleteStoryHandler() {
		if (!story) return;
		loading = true;
		loadingStep = 5;
		let userId: string | undefined;
		if ($user?.usr?.id) {
			userId = $user.usr.id;
		} else {
			const { data: userData } = await import('$lib/supabaseClient').then(m => m.supabase.auth.getUser());
			userId = userData.user?.id;
		}
		if (!userId || story.user_id !== userId) {
			error = 'You do not have permission to delete this story.';
			loading = false;
			return;
		}
		try {
			await deleteStory(story.id, userId);
			goto('/create');
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			loading = false;
		}
	}
</script>

{#if loading}
	<div class="loading-container">
		<div class="loader"></div>
		<div class="loading-steps">
			<p class:active={loadingStep >= 1}>1. Authenticating user...</p>
			<p class:active={loadingStep >= 2}>2. Fetching project...</p>
			<p class:active={loadingStep >= 3}>3. Fetching chapters...</p>
			{#if loadingStep === 4}
				<p class:active={loadingStep === 4}>4. Updating publish status...</p>
			{/if}
			{#if loadingStep === 5}
				<p class:active={loadingStep === 5}>5. Deleting story...</p>
			{/if}
		</div>
	</div>
{:else if error}
	<p style="color:red">{error}</p>
{:else if !story}
	<p class="error-message">Story not found.</p>
{:else}
	<div class="main-content-wrapper">
		<div class="left-panel">
			<div class="panel-section">
				<div class="project-header">
					{#if editingTitle}
						<div class="edit-title-box">
							<input type="text" bind:value={editedTitle} class="edit-title-input" />
							<div class="edit-title-actions">
								<button on:click={saveTitle}>Save</button>
								<button on:click={() => (editingTitle = false)}>Cancel</button>
							</div>
						</div>
					{:else}
						<h2>{story.title}</h2>
					{/if}
					<div class="action-buttons">
						<button class="edit-title-btn" on:click={startEditTitle}>Edit Title</button>
						<button on:click={togglePublishStatus} class="publish-toggle-btn">
							{story.is_published ? 'Unpublish' : 'Publish'}
						</button>
						<button on:click={() => (showDeleteConfirm = true)} class="delete-btn">Delete Story</button>
					</div>
				</div>
			</div>

			<div class="panel-section">
				{#if editingDescription}
					<div class="edit-description-box">
						<textarea bind:value={editedDescription} rows="4" class="edit-description-textarea"
						></textarea>
						<div class="edit-description-actions">
							<button on:click={saveDescription}>Save</button>
							<button on:click={() => (editingDescription = false)}>Cancel</button>
						</div>
					</div>
				{:else}
					<p class="story-description">
						{@html coffeeMarkdown(story.description || '', defaultStyles)}
						<button class="edit-desc-btn" on:click={startEditDescription}>Edit Description</button>
					</p>
				{/if}
			</div>

			<div class="panel-section">
				{#if editingShortDescription}
					<div class="edit-description-box">
						<textarea 
							bind:value={editedShortDescription} 
							rows="2" 
							class="edit-description-textarea"
							placeholder="Enter a short description (will be shown in story listings)"
							maxlength="300"
						></textarea>
						<div class="edit-description-actions">
							<button on:click={saveShortDescription}>Save</button>
							<button on:click={() => (editingShortDescription = false)}>Cancel</button>
						</div>
					</div>
				{:else}
					<p class="story-description">
						<strong>Short Description:</strong><br>
						{@html coffeeMarkdown(story.short_description || '', defaultStyles)}
						<button class="edit-desc-btn" on:click={startEditShortDescription}>Edit Short Description</button>
					</p>
				{/if}
			</div>
		</div>

		<div class="right-panel">
			<div class="panel-section">
				<h3>Chapters</h3>
				<ul>
					{#each chapters as chapter}
						<li>
							<strong>{chapter.title}</strong>
							<button on:click={() => editChapter(chapter.id)}>Edit Blocks</button>
						</li>
					{/each}
				</ul>
				<div class="add-chapter">
					<input type="text" bind:value={newChapterTitle} placeholder="New chapter title" />
					<button on:click={addChapterHandler}>Add Chapter</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if showDeleteConfirm}
	<div class="modal-overlay" on:click={() => (showDeleteConfirm = false)}>
		<div class="modal-content" on:click|stopPropagation>
			<h3>Delete Story</h3>
			<p>Are you sure you want to delete "{story?.title}"? This action cannot be undone.</p>
			<div class="modal-actions">
				<button class="cancel-btn" on:click={() => (showDeleteConfirm = false)}>Cancel</button>
				<button class="confirm-delete-btn" on:click={deleteStoryHandler}>Delete Story</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.main-content-wrapper {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 1.5rem;
		background-color: var(--color-card-bg);
		border-radius: 12px;
		box-shadow: 0 6px 20px var(--color-card-shadow);
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 2rem;
	}

	.left-panel,
	.right-panel {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.panel-section {
		background-color: var(--color-bg-alt);
		padding: 1.5rem;
		border-radius: 10px;
		box-shadow: 0 2px 8px var(--color-card-shadow);
	}

	h2 {
		font-size: 2.2rem;
		color: var(--color-primary);
		margin-top: 0;
		margin-bottom: 0;
		font-weight: 700;
		text-align: left;
	}

	h3 {
		font-size: 1.6rem;
		color: var(--color-link);
		margin-top: 0;
		margin-bottom: 1rem;
		font-weight: 600;
		text-align: left;
	}

	button {
		padding: 0.6rem 1.4rem;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: background-color 0.2s ease, transform 0.1s ease;
		white-space: nowrap;
		background: var(--color-accent);
		color: var(--color-primary-alt);
	}

	button:hover {
		transform: translateY(-1px);
		background: var(--color-primary);
		color: var(--color-primary-alt);
	}

	.publish-toggle-btn {
		background-color: var(--color-secondary);
		color: var(--color-primary);
	}

	.publish-toggle-btn:hover {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
	}

	.edit-desc-btn {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
		padding: 0.4rem 1rem;
		font-size: 0.9rem;
		margin-left: 1rem;
	}

	.edit-desc-btn:hover {
		background-color: var(--color-primary);
		color: var(--color-primary-alt);
	}

	.edit-description-actions button {
		background-color: var(--color-primary);
		color: var(--color-primary-alt);
	}

	.edit-description-actions button:hover {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
	}

	.add-chapter button {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
	}

	.add-chapter button:hover {
		background-color: var(--color-primary);
		color: var(--color-primary-alt);
	}

	input[type='text'],
	textarea {
		width: calc(100% - 2rem);
		padding: 0.8rem 1rem;
		border-radius: 8px;
		border: 1px solid var(--color-border);
		background-color: var(--color-bg-alt);
		font-size: 1rem;
		color: var(--color-text);
		box-shadow: inset 0 1px 3px var(--color-card-shadow);
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	input[type='text']:focus,
	textarea:focus {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px var(--color-card-shadow);
		outline: none;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.error-message {
		color: var(--color-danger);
		text-align: center;
		font-weight: 600;
		margin-top: 1rem;
	}

	.story-description {
		color: var(--color-text);
		font-size: 1.05rem;
		line-height: 1.6;
		text-align: left;
		padding: 0 0.5rem;
	}

	.project-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.edit-title-btn {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
		padding: 0.6rem 1.4rem;
		font-size: 1rem;
	}

	.edit-title-btn:hover {
		background-color: var(--color-primary);
		color: var(--color-primary-alt);
	}

	.edit-description-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
	}

	.edit-description-actions {
		display: flex;
		gap: 1rem;
	}

	.add-chapter {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.add-chapter input {
		flex-grow: 1;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0;
	}

	li {
		background-color: var(--color-bg-alt);
		border-radius: 10px;
		box-shadow: 0 2px 10px var(--color-card-shadow);
		padding: 1rem 1.5rem;
		margin-bottom: 0.8rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	li:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px var(--color-card-shadow);
	}

	strong {
		font-size: 1.15rem;
		color: var(--color-primary);
		font-weight: 600;
	}

	li button {
		background-color: var(--color-accent);
		color: var(--color-primary-alt);
	}

	li button:hover {
		background-color: var(--color-primary);
		color: var(--color-primary-alt);
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		background: none;
		box-shadow: none;
		padding: 0;
	}

	.loader {
		border: 6px solid var(--color-border);
		border-top: 6px solid var(--color-accent);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
		margin-bottom: 1.8rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.loading-steps {
		background-color: var(--color-card-bg);
		border-radius: 10px;
		box-shadow: 0 4px 15px var(--color-card-shadow);
		padding: 1.5rem 2.5rem;
		text-align: left;
		min-width: 250px;
	}

	.loading-steps p {
		color: var(--color-accent);
		margin: 0.5rem 0;
		font-weight: 500;
		transition: color 0.3s ease;
		font-size: 1.05rem;
	}

	.loading-steps p.active {
		color: var(--color-primary);
		font-weight: bold;
	}

	@media (max-width: 992px) {
		.main-content-wrapper {
			grid-template-columns: 1fr;
			gap: 1.5rem;
			padding: 1rem;
		}

		.left-panel,
		.right-panel {
			width: 100%;
			max-width: 600px;
			margin: 0 auto;
		}

		.project-header,
		.edit-description-box,
		.story-description,
		h2, h3 {
			align-items: center;
			text-align: center;
		}

		.story-description {
			padding: 0;
		}

		.add-chapter {
			justify-content: center;
		}
	}

	@media (max-width: 768px) {
		.main-content-wrapper {
			margin: 1rem auto;
			padding: 0.8rem;
		}

		h2 {
			font-size: 1.8rem;
		}

		h3 {
			font-size: 1.4rem;
		}

		li {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.7rem;
			padding: 1rem;
		}

		li button {
			margin-left: 0;
			width: 100%;
		}

		.action-buttons {
			flex-direction: column;
			width: 100%;
		}

		.action-buttons button {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.6rem;
		}

		h3 {
			font-size: 1.2rem;
		}

		input[type='text'],
		textarea {
			padding: 0.6rem 0.8rem;
			font-size: 0.95rem;
		}

		button {
			padding: 0.5rem 1rem;
			font-size: 0.9rem;
		}

		.loading-steps {
			padding: 1rem 1.5rem;
			min-width: unset;
		}
	}

	.edit-title-box {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.8rem;
		width: 100%;
	}

	.edit-title-input {
		width: 100%;
		font-size: 2.2rem;
		font-weight: 700;
		color: #4b2e19;
		padding: 0.5rem;
		border: 2px solid #d4c2b8;
		border-radius: 8px;
		background-color: #fcf8f5;
	}

	.edit-title-actions {
		display: flex;
		gap: 1rem;
	}

	.delete-btn {
		background-color: #dc2626;
		color: #fff;
	}

	.delete-btn:hover {
		background-color: #b91c1c;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: #fff;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
		max-width: 500px;
		width: 90%;
	}

	.modal-content h3 {
		color: #dc2626;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.modal-content p {
		color: #4b2e19;
		margin-bottom: 1.5rem;
		line-height: 1.5;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.cancel-btn {
		background-color: #e0d7ce;
		color: #4b2e19;
	}

	.cancel-btn:hover {
		background-color: #d4c2b8;
	}

	.confirm-delete-btn {
		background-color: #dc2626;
		color: #fff;
	}

	.confirm-delete-btn:hover {
		background-color: #b91c1c;
	}
</style>
