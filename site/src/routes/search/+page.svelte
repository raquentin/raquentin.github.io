<script lang="ts">
	import { onMount } from 'svelte';

	let query = '';
	let results: Array<{ url: string; meta: { title: string }; excerpt: string }> = [];
	let ready = false;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let pagefind: any;

	onMount(async () => {
		try {
			pagefind = await import('/pagefind/pagefind.js' as string);
			await pagefind.init();
			ready = true;
		} catch {
			// pagefind is only available after `npm run build`
		}
	});

	async function search() {
		if (!ready || !query.trim()) {
			results = [];
			return;
		}
		const res = await pagefind.search(query);
		results = await Promise.all(res.results.map((r: { data: () => Promise<unknown> }) => r.data()));
	}
</script>

<svelte:head>
	<title>Search — Raquent.in</title>
</svelte:head>

<div data-pagefind-ignore>
	<header>
		<a href="/" class="back">Raquent.in</a>
		<h1>search</h1>
	</header>

	<div class="search-box">
		<input
			type="search"
			bind:value={query}
			on:input={search}
			placeholder="search essays and notes…"
			autocomplete="off"
			spellcheck="false"
		/>
		{#if !ready}
			<p class="hint">search index not available in dev — run <code>npm run build</code> first</p>
		{/if}
	</div>

	{#if results.length > 0}
		<ul class="results">
			{#each results as result}
				<li>
					<a href={result.url}>{result.meta?.title ?? result.url}</a>
					{#if result.excerpt}
						<p class="excerpt">{@html result.excerpt}</p>
					{/if}
				</li>
			{/each}
		</ul>
	{:else if query && ready}
		<p class="empty">no results</p>
	{/if}
</div>

<style>
	header {
		margin-bottom: 2rem;
	}

	.back {
		display: block;
		color: var(--text-muted);
		font-size: 0.85em;
		margin-bottom: 1rem;
	}

	.back:hover {
		color: var(--text);
	}

	h1 {
		font-size: 1rem;
		font-weight: 400;
		color: var(--text-muted);
	}

	.search-box {
		margin-bottom: 2rem;
	}

	input[type='search'] {
		width: 100%;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--text-dim);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 1rem;
		padding: 0.4rem 0;
		outline: none;
		appearance: none;
	}

	input[type='search']:focus {
		border-bottom-color: var(--text-muted);
	}

	.hint {
		color: var(--text-dim);
		font-size: 0.8em;
		margin-top: 0.5rem;
	}

	.hint code {
		background: #1a1a1a;
		padding: 0.1em 0.3em;
	}

	.results {
		list-style: none;
	}

	.results li {
		margin-bottom: 1.5rem;
	}

	.results a {
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.excerpt {
		color: var(--text-muted);
		font-size: 0.85em;
		margin-top: 0.25rem;
		line-height: 1.5;
	}

	:global(.excerpt mark) {
		background: transparent;
		color: var(--text);
		font-weight: 500;
	}

	.empty {
		color: var(--text-muted);
	}
</style>
