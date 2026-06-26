<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.meta.title} — Raquent.in</title>
</svelte:head>

<article data-pagefind-body>
	<header>
		<a href="/notes" class="back">notes</a>
		<h1 data-pagefind-meta="title">{data.meta.title}</h1>
		<p class="date">{data.meta.date}</p>
	</header>

	<div class="prose">
		{@html data.html}
	</div>
</article>

<style>
	.back {
		display: block;
		color: var(--text-muted);
		font-size: 0.85em;
		margin-bottom: 1.5rem;
	}

	.back:hover {
		color: var(--text);
	}

	h1 {
		font-size: 1.1rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.date {
		color: var(--text-muted);
		font-size: 0.85em;
		margin-bottom: 2rem;
	}

	.prose {
		margin-top: 2rem;
	}
</style>
