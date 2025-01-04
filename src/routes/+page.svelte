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
	import Scrolly from './_components/Scrolly.svelte';

	import data from './_data/FOSS_landings.json';
	import aqaculture from './_data/aqaculture_midatlantic.json';

	const xKey = 'Year'; // x-axis
	const yKey = 'Metric Tons'; // y-axis
	const zKey = 'State'; // group: state

	// prcoessed data
	data.forEach(d => {
		d.Year = +d.Year; // format is number
		d[yKey] = +d[yKey];
	});

	// group data by state
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
	const seriesColors = ['#0077BE', '#D9D9D9', '#F4D35E']; // define the color, yellow, blue and grey

	// label formatters
	const formatLabelX = (d: number): string => d.toString();
	const formatLabelY = (d: number): string => format(`~s`)(d);

	let currentStep = 0; // scrolly 的绑定值
	const textSteps = [
		'In Maryland, the estimated population of native eastern oysters hit a historic low in 2004, dropping to just 19 tons. This figure represents only 0.21% of the historical peak since 1950, according to my analysis of National Oceanic and Atmospheric Administration(NOAA) Fisheries data.',
		'In 2010, Maryland introduced the Oyster Restoration and Aquaculture Development Plan, which expanded oyster sanctuaries to help rebuild the Chesapeake Bays native oyster population.',
		'（Explain what is Sanctuaries.',
		'Under the new plan, the Maryland government designated and deployed an additional 844.24 square kilometers of oyster sanctuaries, a 369.09% increase compared to the previous area, according to my analysis. (Scroll down to find the map).'
	];
</script>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;1,400&family=Zen+Antique+Soft&display=swap"
	rel="stylesheet"
/>

<!-- Top pic and title -->
<FrontLayout
	frontImgUrl="./src/routes/_img/oyster_frontpage.jpg"
	title="The Black Oysterman Taking Half Shells From the Bar to the Block"
	description="The Brooklyn man behind the Real Mother Shuckers wants to return oysters to ubiquity in New York City and honor the legacy of Black oystermen."
/>

<div class="page-container">
	<!-- Additional Paragraphs Section -->
	<div class="text-section">
		<p>
			Oysters are not just a culinary delight; they also play a critical role in maintaining the
			health of our marine ecosystems. They filter water, provide habitats for marine life, and
			protect shorelines from erosion. In the Chesapeake Bay, oysters have been integral to the
			region's ecology and economy for centuries.
		</p>
		<p>
			However, overfishing, disease, and habitat loss have significantly reduced oyster populations.
			This has led to efforts like Maryland's Oyster Restoration and Aquaculture Development Plan,
			which aims to revive the native oyster population and ensure their sustainability for future
			generations.
		</p>
	</div>

	<div class="content-container">
		<!-- Graphic on the left -->
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
				<Svg let:xScale let:height let:xDomain>
					<!-- Gray background for 2010 onward -->
					{#if currentStep >= 1}
						<rect
							x={xScale(2010)}
							y="0"
							width={xScale(xDomain[1]) - xScale(2010)}
							{height}
							fill="rgba(128, 128, 128, 0.2)"
						/>
						<!-- Dashed vertical line for 2010 -->
						<line
							x1={xScale(2010)}
							y1="0"
							x2={xScale(2010)}
							y2={height}
							stroke="black"
							stroke-dasharray="5,5"
							stroke-width="2"
						/>
					{/if}

					<AxisX gridlines={false} ticks={fiveYearTicks} format={formatLabelX} tickMarks />
					<AxisY gridlines={true} ticks={4} format={formatLabelY} />
					<MultiLine />
				</Svg>

				<Html>
					<Labels />
				</Html>
			</LayerCake>
		</div>

		<!-- Scrolly content on the right -->
		<div class="scrolly-container">
			<Scrolly bind:value={currentStep}>
				{#each textSteps as text, i}
					<div class="step" class:active={currentStep === i}>
						<div class="step-content">
							<p>{text}</p>
						</div>
					</div>
				{/each}
			</Scrolly>
		</div>
	</div>

	<div class="text-section">
		<p>
			Oysters are not just a culinary delight; they also play a critical role in maintaining the
			health of our marine ecosystems. They filter water, provide habitats for marine life, and
			protect shorelines from erosion. In the Chesapeake Bay, oysters have been integral to the
			region's ecology and economy for centuries.
		</p>
		<p>
			In 2010, Maryland began accepting applications for commercial shellfish aquaculture projects
			in the Chesapeake Bay. These leases allow individuals and businesses to cultivate oysters and
			other shellfish in designated areas of public waters.
		</p>
		<p>
			There are two primary methods for oyster farming. Submerged land leases involve growing
			oysters directly on prepared bottoms for harvest, while water-column leases use single oysters
			placed in containerized gear, typically in cages resting on the bottom of the estuary or
			floating onat the surface.
		</p>
		<p>
			According to the Maryland Department of Natural Resources (MDNR), Maryland had issued 477
			shellfish leases by the end of 2022, which covered 7,685 acres of state waterways.
		</p>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Newsreader', serif;
		background-color: #ffffff;
		margin: 0;
		padding: 0;
		font-size: 23px;
		line-height: 1.2;
		color: #333;
	}

	.page-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 20px;
		background: #ffffff;
	}

	.content-container {
		display: flex;
		gap: 20px;
	}

	.chart-container {
		width: 65%;
		height: 80vh;
		position: sticky;
		top: 10%;
		background: #f9f9f9;
		padding: 10px;
	}

	.scrolly-container {
		width: 30%;
		padding: 1rem;
		overflow-y: auto;
		background: #ffffff;
	}

	.step {
		height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.step-content {
		background: rgba(255, 255, 255, 0.8);
		color: #333;
		padding: 1rem 2rem;
		opacity: 0.5;
		transform: translateY(20px);
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}

	.step.active .step-content {
		opacity: 1;
		transform: translateY(0);
		background: white;
	}
</style>
