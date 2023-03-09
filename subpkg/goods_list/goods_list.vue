<template>
	<view>
		goods_list
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				}
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			console.log(options);
		}
	}
</script>

<style lang="scss">

</style>
