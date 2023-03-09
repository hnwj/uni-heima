<template>
	<view>
		<view class="search-box">
			<mySearch @click="gotoSearch"></mySearch>
		</view>
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<view :class="['left-scroll-view-item',index===active?'active':'']" v-for="(item,index) in cateList"
					:key="index" @click="activeChanged(index)">
					{{item.cat_name}}
				</view>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon.replace('dev','web')"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mySearch from '../../components/my-search/my-search.vue'
	export default {
		data() {
			return {
				// 分类数据列表
				cateList: [],
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				active: 0,
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0
			};
		},
		components: {
			mySearch
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				if (res.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.message
				// 为二级商品赋值
				this.cateLevel2 = res.message[0].children
				console.log('this.cateList', this.cateList);
				console.log('this.cateLevel2', this.cateLevel2);
			},
			// 切换商品
			activeChanged(index) {
				this.active = index
				this.cateLevel2 = this.cateList[index].children
				// 让 scrollTop 的值在 0 与 1 之间切换
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 路由跳转到商品列表
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			// 跳转到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;

			.left-scroll-view-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}
		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
