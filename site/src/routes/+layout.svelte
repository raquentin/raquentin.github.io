<script lang="ts">
	import '../app.css';
</script>

<div class="container">
	<slot />
</div>

<style>
	.container {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 3rem 1.25rem;
	}
</style>
