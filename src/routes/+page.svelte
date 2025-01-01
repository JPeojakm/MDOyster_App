<script lang="ts">
	import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';

	import { scaleOrdinal } from 'd3-scale';
	import { format } from 'd3-format';

	import MultiLine from './_components/MultiLine.svelte';
	import AxisX from './_components/AxisX.svelte';
	import AxisY from './_components/AxisY.svelte';
	import Labels from './_components/GroupLabels.html.svelte';
	import SharedTooltip from './_components/SharedTooltip.html.svelte';
	import FrontLayout from './_components/FrontLayout.svelte';

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

	const marylandYears = data
		.filter(d => d.State === 'MARYLAND') // get data of Maryland
		.map(d => d.Year)
		.sort((a, b) => a - b); // order by year

	const fiveYearTicks = marylandYears.filter(year => year % 5 === 0); // x axis ticks

	// define the color
	const seriesColors = ['#ff0000', '#00ff00', '#0000ff']; // define the color

	// label
	const formatLabelX = (d: number): string => d.toString();
	const formatLabelY = (d: number): string => format(`~s`)(d);
</script>

<div class="page-container">
	<!-- top pic and title -->
	<FrontLayout
		frontImgUrl="./src/routes/_img/baltimore_oyster.jpg"
		title="The Black Oysterman Taking Half Shells From the Bar to the Block"
		description="The Brooklyn man behind the Real Mother Shuckers wants to return oysters to ubiquity in New York City and honor the legacy of Black oystermen."
	/>

	<!-- graphic -->
	<div class="chart-container">
		<LayerCake
			x="Year"
			y="Metric Tons"
			z="State"
			xDomain={[Math.min(...marylandYears), Math.max(...marylandYears)]}
			yDomain={[0, Math.max(...data.map(d => d['Metric Tons']))]}
			zScale={scaleOrdinal()}
			zRange={seriesColors}
			data={groupedData}
			padding={{ top: 20, right: 30, bottom: 40, left: 50 }}
		>
			<Svg>
				<AxisX gridlines={false} ticks={fiveYearTicks} format={formatLabelX} tickMarks />
				<AxisY gridlines={true} ticks={4} format={formatLabelY} />
				<MultiLine />
			</Svg>

			<Html>
				<Labels />
				<SharedTooltip formatTitle={formatLabelX} dataset={data} />
			</Html>
		</LayerCake>
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 400px; /* adjust the height */
	}
</style>
