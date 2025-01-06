<script>
	import { getContext } from 'svelte';

	// 从 LayerCake 获取上下文
	const { data, z, zScale } = getContext('LayerCake');
</script>

<div class="legend">
	{#each $data as group}
		<div class="legend-item">
			<span class="color-box" style="background-color: {$zScale($z(group))};"></span>
			<span class="label">{$z(group)}</span>
		</div>
	{/each}
</div>

<style>
	.legend {
		position: absolute;
		top: 10px;
		right: 10px;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 10px;
		font-size: 13px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}

	.legend-item:last-child {
		margin-bottom: 0;
	}

	.color-box {
		width: 12px;
		height: 12px;
		margin-right: 8px;
		border-radius: 2px;
	}

	.label {
		color: #333;
	}
</style>
