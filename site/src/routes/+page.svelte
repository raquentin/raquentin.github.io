<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const quotes = [
		'A program is a proof',
	];

	let quote = '';
	onMount(() => {
		quote = quotes[Math.floor(Math.random() * quotes.length)];
	});
</script>

<svelte:head>
	<title>Raquent.in</title>
</svelte:head>

<header>
	<span class="site-name">Raquent.in</span>
</header>

{#if data.intro}
	<div class="intro prose">{@html data.intro}</div>
{/if}

<main>
	{#if data.essays.length === 0}
		<p class="empty">no essays yet</p>
	{:else}
		<ul class="essay-list">
			{#each data.essays as essay}
				<li>
					<a href="/essays/{essay.slug}">{essay.title}</a>
					<span class="date">{essay.date}</span>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<footer>
	{quote}
</footer>

<style>
	header {
		margin-bottom: 3rem;
	}

	.site-name {
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.intro {
		margin-bottom: 2.5rem;
	}

	main {
		min-height: 40vh;
	}

	.essay-list {
		list-style: none;
	}

	.essay-list li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.25rem 0;
	}

	.essay-list a {
		color: var(--text);
	}

	.essay-list a:hover {
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

	footer {
		margin-top: 4rem;
		color: var(--text-dim);
		font-size: 0.85em;
	}
</style>
