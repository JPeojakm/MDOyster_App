<script>
	export let frontImgUrl = './src/routes/_img/baltimore_oyster.jpg'; // 图片地址
	export let title = 'Unloading oyster luggers'; // 标题
	export let description = 'Oyster Wars of the Chesapeake Bay'; // 描述文字
</script>

<section class="front-layout">
	<!-- 左侧图片 -->
	<div class="front-img">
		<img src={frontImgUrl} alt="Descriptive Alt Text" />
	</div>

	<!-- 右侧文字 -->
	<div class="front-text">
		<h1>{title}</h1>
		<p>{description}</p>
	</div>
</section>

<style>
	.front-layout {
		display: flex; /* 使用 flexbox 布局 */
		align-items: center; /* 垂直居中对齐 */
		justify-content: space-between; /* 左右分布 */
		padding: 20px; /* 为整体留白 */
		gap: 20px; /* 图片和文字之间的间距 */
	}

	.front-img {
		flex: 1; /* 图片部分占据 1/2 的空间 */
		max-width: 50%; /* 限制图片最大宽度 */
	}

	.front-img img {
		width: 100%; /* 图片宽度填充容器 */
		height: auto; /* 保持图片比例 */
		border-radius: 8px; /* 可选：为图片添加圆角 */
	}

	.front-text {
		flex: 1; /* 文字部分占据 1/2 的空间 */
		max-width: 50%; /* 限制文字部分的最大宽度 */
	}

	.front-text h1 {
		font-size: 2rem; /* 标题字体大小 */
		margin-bottom: 10px; /* 标题下方的间距 */
		line-height: 1.4; /* 行高 */
	}

	.front-text p {
		font-size: 1rem; /* 正文字体大小 */
		line-height: 1.6; /* 行高 */
		color: #555; /* 文本颜色 */
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
