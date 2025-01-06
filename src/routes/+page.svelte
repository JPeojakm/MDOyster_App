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

	let currentStep = 0; // scrolly fixed value
	const textSteps = [
		'In Maryland, the estimated population of native eastern oysters hit a historic low in 2004, dropping to just 19 tons. This figure represents only 0.21% of the historical peak since 1950, according to my analysis of National Oceanic and Atmospheric Administration(NOAA) Fisheries data.',
		'Maryland introduced the Oyster Restoration and Aquaculture Development Plan in 2010, which expanded oyster sanctuaries to help rebuild the Chesapeake Bays native oyster population.',
		'Under the new plan, as of 2022, the Maryland government designated and deployed an additional 844.24 square kilometers of oyster sanctuaries—a 369.09% increase compared to the area before 2010, based on my analysis of the sanctuaries map published by MDNR. (Scroll down to see the map.)'
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
	frontImgUrl="./_img/oyster_frontpage.jpg"
	title="Maryland Is Bringing Back Once-Extinct Oysters; Will Global Warming Ruin a Decade of Work?"
	description="77 oyster restoration areas in the Chesapeake Bay are threatened by abnormal sea surface temperatures, according to my analysis."
/>

<!-- Caption of photo -->
<div class="image-credit">Photograph by Mandy Henry, courtesy of Unsplash</div>

<div class="page-container">
	<!-- Credit Section -->
	<div class="metadata">
		<div class="credit-line">
			<strong
				>By <a href="https://jinpengli.com" class="link" target="_blank" rel="noopener noreferrer">
					Jinpeng Li</a
				></strong
			>
		</div>
		<div class="publish-date">Jan 2025</div>
	</div>

	<!-- Full Story Section -->
	<div class="text-section">
		<p>
			The first night I was in Baltimore for the National Institute for Computer-Assisted Reporting
			(NICAR), Krystal and I wandered into a local restaurant to try the crab cake and oysters.
			“Texas might have oysters from the Gulf of Mexico,” she said, “but East Coast oysters are
			meaty, sweet, and unlike anything you’ve ever tasted. Try them, and I promise you’ll never
			look at oysters the same way again.”
		</p>
		<p>
			People often associate oysters with the city’s upscale raw bars or elaborate seafood towers,
			but oysters were once abundant throughout the Chesapeake Bay. In the 1880s, the Bay supplied
			nearly half of the world’s annual oyster demand, with scholars comparing the harvesting frenzy
			to the California Gold Rush.
		</p>
		<p>
			Unfortunately, like the Gold Rush, this wealth was also fleeting. By the turn of the 20th
			century, natural oyster habitats had been greatly diminished thanks to overharvesting,
			pollution, and disease, and they have since continued to deplete. The native oyster population
			has dropped to a shocking 1% of its historical levels over the past decades in Maryland.
		</p>
		<p>
			But losing oysters translates to more than just the rising prices of a delicacy on the dinner
			table. It also signifies a loss of a natural filter that is critical to the health of our
			seawater. According to Marine conservationists, each adult oyster can filter up to 50 gallons
			of water a day, and an oyster bed can reduce the force of waves on wetlands, which protects
			coastlines from erosion.
		</p>
		<p>
			To counteract this decline, Maryland Department of Natural Resources (DNR) began building
			sanctuaries and seeding Chesapeake Bay with young oysters. Thanks to their efforts, the
			oysters are making a comeback.
		</p>
		<h2>Pushed Hard</h2>
		<p>
			MDNR has made two key efforts, one of which was expanding the restoration sanctuaries in 2010.
		</p>
		<p>
			Sanctuaries permanently close oyster beds to harvesting except in specific aquaculture lease
			sites, allowing oysters to grow undisturbed. The goal of this preservation is to build a
			strong breeding population of oysters that will build the reefs which provide crucial habitats
			for other bay species.
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
			In 2014, Maryland partnered with NOAA and other nonprofit organization to launch the  <a href="https://www.chesapeakeprogress.com/abundant-life/oysters" target="_blank" rel="noopener noreferrer">
        Oyster Restoration Plan
    </a>. This initiative targeted 10 Chesapeake Bay tributaries and was committed to
			rebuilding oyster reefs by creating a substrate base and planting hatchery-produced juvenile
			oysters or seeding remnant reefs.
		</p>
		<p>
			Data from MDNR shows that Maryland's oyster planting efforts date back to 1953. Various
			methods are used to restore oyster beds, including planting oyster seeds and placing shells.
		</p>
	</div>

	<div class="content-container">
		<!-- Left: Image changes based on step -->
			<div class="image-container">
				<img src="./_img/map-0.png" alt="Map step 1" class:active={currentStep === 0} />
				<img src="./_img/map-1.png" alt="Map step 1" class:active={currentStep === 1} />
				<img src="./_img/map-2.png" alt="Map step 2" class:active={currentStep === 2} />
				<img src="./_img/map-3.png" alt="Map step 3" class:active={currentStep === 3} />
			</div>

		<!-- Right: Scrolly content -->
		<div class="scrolly-container">
				<Scrolly bind:value={currentStep}>
				{#each [
					[
						'This is the Chesapeake Bay.'
					],
					[
						'The first method typically includes the addition of oyster seed, such as <span style="background-color: #db4c81;">hatchery seed</span> or <span style="background-color: #db4c81;">wild seed planting</span> to increase the likelihood of restoration success.',
						'The second effort involves using substrate materials to build oyster reefs in the bay, ideally through <span style="background-color: #897bd3;">fresh shell planting</span>. Oyster crews and aquaculturists <a href="https://www.oysterrecovery.org/get-involved/shell-recycling" target="_blank" rel="noopener noreferrer">recycle oyster shells from business</a>, but there aren’t enough to meet the state’s projected restoration needs. As a result, <span style="background-color: #897bd3;">dredged shells</span>, <span style="background-color: #897bd3;">mixed shells</span>, or <span style="background-color: #897bd3;">alternative materials</span> such as stones, concrete, porcelain, or steel slag are commonly used instead.'
					],
					[
						'<span style="font-size: 11px;line-height: 0.5;">If the map for the second box is not activating, try scrolling down and then back up. You should see the map with only the pink and purple planting areas. Debugging...</span>',
						'Before 2010, Maryland primarily relied on wild seed planting, dredged shell addition, and limited fresh shell planting to repair oyster beds. However, since 2010, <span style="background-color: #f5deb3; font-weight: bold;">hatchery seed</span> has become the dominant method.',
						'Once abundant throughout Chesapeake Bay, oysters historically covered a total area of 215350 acres. New restoration areas overlap with <span style="background-color: #f5deb3; font-weight: bold;">72.76%</span> of <span style="background-color: #DBE1DF; font-weight: bold;">historic oyster beds</span>.'
					],
					[
						'By 2010, 43% of the historic oyster bed area was legally protected and designated for <span style="background-color: #8ED7F3; font-weight: bold;">restoration</span>, increasing to <span style="background-color: #f5deb3; font-weight: bold;">46%</span> by 2022.'
					]
				] as stepText, i}
					<div class="step" class:active={currentStep === i}>
						<div class="step-content">
							{#each stepText as paragraph}
								<p>{@html paragraph}</p>
							{/each}
						</div>
					</div>
				{/each}
			</Scrolly>
		</div>
	</div>

	<div class="text-section">
		<p>
			“We’re making significant progress,” the NOAA announced in <a href="https://www.fisheries.noaa.gov/chesapeake-bay/oyster-reef-restoration-chesapeake-bay-were-making-significant-progress#progress-in-maryland" target="_blank" rel="noopener noreferrer">
        a press release on their website
    </a> .
			“Through the end of 2023, our team has planted 6.85 billion oyster seeds in Maryland as part
			of the effort.”
		</p>
		<p>
			In the 2022-23 season, Maryland watermen harvested about <a href="https://dnr.maryland.gov/fisheries/Documents/OysterHistoricHarvest.pdf" target="_blank" rel="noopener noreferrer">
        720,000 
    </a> bushels of oysters from
			public fishing areas — the largest-recorded harvest since the late '80s. It marks the <a href="https://www.chesapeakebaymagazine.com/md-oyster-harvest-reaches-35-year-high/" target="_blank" rel="noopener noreferrer">
        second
    </a>
			record-high year for a wild harvest in Maryland.
		</p>
		<h2>Is Rising Sea Temperature a New Threat?</h2>
		<p>
			With native oyster populations nearly depleted, aquaculture has become a vital source for
			hatching more oysters to support the industry.
		</p>
		<p>
			Winter is a critical season for those oyster hatcheries. During this time, adult shellfish are
			placed in warm, algae-rich water to induce spawning. Hatcheries collect the eggs, then hatch
			and grow the oysters, which are then sold to farmers for further cultivation.
		</p>
	</div>
	<div class="text-section">
		<p>
			But warmer winters are not favorable for wild oysters. The slowly increasing temperatures are creating new challenges for restoration efforts in nature.
		</p>
		<img src="./_img/warm.png" alt="Chesapeake Bay temperature map">
		<p>
			The Chesapeake Bay in particular is experiencing a worrisome trend in rising temperatures. In 2023, the average sea surface temperature increased by 1.09°C in summer and 0.43°C in winter compared to the 2007–2022 average. While fluctuations of up to 2°C are within the normal range, these numbers only represent the average.

		</p>
		<p>
			When comparing restoration areas with sea surface anomalies, <span style="background-color: #f5deb3; font-weight: bold;">my analysis of NOAA satellite data found that 71 sanctuary areas experienced abnormal winter temperatures exceeding 2°C.</span> All of these sites cluster near Annapolis and Baltimore—as if they’ve got front-row seats to the quirks of Maryland's warming waters.

		</p>
		<p>
			Rising sea temperatures disrupt oysters' natural cycles, potentially causing premature or delayed spawning and reducing their reproductive success.
		</p>
		<p>
			(To Be Continued...)
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

	.image-credit {
		text-align: left;
		font-size: 15px;
		color: gray;
		margin: 8px;
	}

	.page-container {
		max-width: 1100px;
		margin: 0 auto;
		padding: 20px;
		background: #ffffff;
	}

	.metadata {
		max-width: 800px; /* 与 .text-section 保持相同的宽度 */
		margin: 0 auto; /* 居中对齐 */
		margin-top: 40px; /* 保持充足的顶部间距 */
		margin-bottom: 40px; /* 与正文间距 */
		text-align: left; /* 左对齐内容 */
	}

	.credit-line {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.publish-date {
		font-size: 12px;
		color: gray;
	}

	.text-section {
		max-width: 800px;
		margin: 0 auto; /* 居中对齐 */
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
		background: #ffffff;
		padding: 10px;
	}

	.scrolly-container {
		width: 40%;
		padding: 1rem;
		overflow-y: auto;
		background: #ffffff;
	}

	.step {
		height: 100vh;
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

	.image-container {
		width: 65%;
		height: 80vh;
		position: sticky;
		top: 10%;
		background: #ffffff;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.image-container img {
		display: none;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.image-container img.active {
		display: block;
	}
</style>
