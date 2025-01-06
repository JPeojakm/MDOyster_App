<script>
	export let frontImgUrl = './src/routes/_img/baltimore_oyster.jpg'; // 图片地址
	export let title = 'Unloading oyster luggers'; // 标题
	export let description = 'Oyster Wars of the Chesapeake Bay'; // 描述文字
</script>

<section class="front-layout">
	<!-- image on the left -->
	<div class="front-img">
		<img src={frontImgUrl} alt="Descriptive Alt Text" />
	</div>

	<!-- words on the right -->
	<div class="front-text">
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
</section>

<style>
	.front-layout {
		display: flex;
		width: 100%;
		height: 100vh; /* 占满屏幕高度 */
		position: relative; /* 允许滑动后消失 */
	}

	.front-img {
		flex: 6; /* 左侧占一半 */
		overflow: hidden;
	}

	.front-img img {
		width: 100%;
		height: 100%;
		object-fit: cover; /* 保持图片比例 */
	}

	.front-text {
		flex: 4; /* 右侧占一半 */
		display: flex;
		flex-direction: column;
		justify-content: center; /* 垂直居中 */
		align-items: center; /* 水平居中 */
		background: #fff; /* 背景为白色 */
		text-align: center;
		padding: 50px 70px; /* 添加左右边距 */
		font-family: 'Zen Antique Soft', serif;
	}

	.front-text h1 {
		font-size: 3rem; /* 增大标题字体 */
		margin-bottom: 1.5rem; /* 增加标题和段落的间距 */
		line-height: 1.3; /* 增加标题的行高 */
		font-weight: bold; /* 加强标题的视觉效果 */
		color: #333; /* 改善标题颜色 */
	}

	.front-text p {
		font-size: 1.4rem; /* 稍微增大段落字体 */
		color: #444; /* 使段落文字颜色稍深 */
		line-height: 1.8; /* 增加段落行高，提升可读性 */
		margin-top: 0; /* 确保段落顶部没有额外间距 */
		max-width: 600px; /* 限制段落的最大宽度 */
	}

	@media (max-width: 768px) {
		/* 响应式布局：在屏幕较小时垂直排列 */
		.front-layout {
			flex-direction: column;
		}

		.front-img,
		.front-text {
			max-width: 100%; /* 两部分都占满宽度 */
		}
	}
</style>
