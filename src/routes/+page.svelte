<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';
	import { format } from 'd3-format';

	import MultiLine from './_components/MultiLine.svelte';
	import AxisX from './_components/AxisX.svelte';
	import AxisY from './_components/AxisY.svelte';

	import data from './_data/FOSS_landings.json';

	/* --------------------------------------------
	 * 设置 x, y, z 键值
	 */
	const xKey = 'Year'; // 横轴
	const yKey = 'Metric Tons'; // 纵轴
	const zKey = 'State'; // 分组键值

	// 数据预处理
	data.forEach(d => {
		d.Year = +d.Year; // 确保 Year 是数字
		d[yKey] = +d[yKey]; // 确保 Metric Tons 是数字
	});

	// 按 State 分组数据
	const groupedData = [...new Set(data.map(d => d[zKey]))].map(state => ({
		State: state,
		values: data
			.filter(d => d[zKey] === state)
			.map(d => ({
				[xKey]: d[xKey],
				[yKey]: d[yKey]
			}))
	}));

	const uniqueYears = [...new Set(data.map(d => d.Year))].sort((a, b) => a - b);

	// 定义颜色映射
	const seriesColors = ['#ff0000', '#00ff00', '#0000ff']; // 三种颜色分别对应州

	// 格式化轴标签
	const formatLabelX = (d: number): string => d.toString();
	const formatLabelY = (d: number): string => format(`~s`)(d);

	console.log('groupedData:', groupedData);
</script>

<div class="chart-container">
	<LayerCake
		x="Year"
		y="Metric Tons"
		z="State"
		yDomain={[0, null]}
		zScale={scaleOrdinal()}
		zRange={['#ff0000', '#00ff00', '#0000ff']}
		data={groupedData}
	>
		<Svg>
			<AxisX gridlines={true} ticks={uniqueYears} format={d => d.toString()} tickMarks />
			<AxisY gridlines={true} ticks={4} format={d => d.toString()} />
			<MultiLine />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px; /* 调整高度适配折线图 */
	}
</style>
