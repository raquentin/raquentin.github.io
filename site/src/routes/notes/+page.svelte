<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Notes — Raquent.in</title>
</svelte:head>

<header>
	<a href="/" class="back">Raquent.in</a>
</header>

<main>
	{#if data.notes.length === 0}
		<p class="empty">no notes yet</p>
	{:else}
		<ul class="note-list">
			{#each data.notes as note}
				<li>
					<a href="/notes/{note.slug}">{note.title}</a>
					<span class="date">{note.date}</span>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	header {
		margin-bottom: 2.5rem;
	}

	.back {
		color: var(--text-muted);
		font-size: 0.9em;
	}

	.back:hover {
		color: var(--text);
	}

	main {
		min-height: 40vh;
	}

	.note-list {
		list-style: none;
	}

	.note-list li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.25rem 0;
	}

	.note-list a {
		color: var(--text);
	}

	.note-list a:hover {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.date {
		color: var(--text-muted);
		font-size: 0.85em;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.empty {
		color: var(--text-muted);
	}
</style>
