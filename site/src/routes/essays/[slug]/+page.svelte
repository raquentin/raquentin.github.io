<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.meta.title} — Raquent.in</title>
</svelte:head>

<article data-pagefind-body>
	<header>
		<h1 data-pagefind-meta="title">{data.meta.title}</h1>
		<p class="meta">
			{data.meta.date}{#if data.meta.confidence != null}; {data.meta.confidence}% conf{/if}{#if data.meta.importance != null}; {data.meta.importance}/10 importance{/if}; <a href={data.meta.commitsUrl} target="_blank" rel="noopener">{data.meta.editCount} {data.meta.editCount === 1 ? 'edit' : 'edits'}</a>
		</p>
	</header>

	<div class="prose">
		{@html data.html}
	</div>
</article>

<style>
	article {
		margin-top: 1rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 0.5rem;
		letter-spacing: -0.01em;
	}

	.meta {
		color: var(--text-dim);
		font-size: 0.85em;
		margin-bottom: 2.5rem;
	}

	.meta a {
		color: inherit;
		text-decoration: none;
	}

	.meta a:hover {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.prose {
		margin-top: 2rem;
	}
</style>
