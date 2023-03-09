<template>
	<view>
		<uni-search-bar @input="input" v-model="kw" :radius="100" cancelButton="none"></uni-search-bar>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				// 搜索结果
				searchResults: [],
				historyList: ['a', 'app', 'apple']
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			input(e) {
				// 清除对应的延时器
				clearTimeout(this.timer)
				// 重启一个延时器
				this.timer = setTimeout(() => {
					this.kw = e
					console.log(this.kw);
					this.getSearchList(this.kw)
				}, 500)
			},
			// 搜索功能
			async getSearchList() {
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				console.log('this.searchResults', this.searchResults);
				this.saveHistory()
			},
			// 路由跳转到详情页
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 保存搜索关键词
			saveHistory() {
				this.historyList.unshift(this.kw)
				// 对数组进行去重处理
				this.historyList = new Set(this.historyList)
				// 将集合转为数组
				this.historyList = Array.from(this.historyList)
				// 持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清空历史记录
			cleanHistory() {
				this.historyList = []
				uni.clearStorageSync('kw')
				// uni.setStorageSync('kw', '[]')
			},
			// 点击跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + item
				})
			}
		}
	}
</script>

<style lang="scss">
	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
