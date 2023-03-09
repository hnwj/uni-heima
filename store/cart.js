export default {
	// 为当前模块开启命名空间
	namespaced: true,

	// 模块中的state数据
	state: () => ({
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	mutations: {
		// 添加到购物车
		addToCart(state, goods) {
			// 通过goods_id遍历，查找购物车是否有该商品,1、有，增加数量。2、无，push到cart数组中
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count++
			} else {
				state.cart.push(goods)
			}
			// 调用存储数据方法
			this.commit('m_cart/saveToStorage')
		},
		// 持久化存储数据
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 修改购物车中商品的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state
				// 调用存储数据方法
				this.commit('m_cart/saveToStorage')
			}
		},
		// 修改购物车中商品数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find((x) => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				// 调用存储数据方法
				this.commit('m_cart/saveToStorage')
			}
		},
		// 根据 Id 从购物车中删除对应的商品信息
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			state.cart.forEach(x => x.goods_state = newState)
			// 持久化存储到本地
			this.commit('m_cart/saveToStorage')
		}
	},
	getters: {
		total(state) {
			let c = 0
			// 循环统计商品的数量
			state.cart.forEach(goods => c += goods.goods_count)
			return c
		},
		// 勾选的商品的总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state)
				.reduce((total, item) => total += item.goods_count * item.goods_price, 0)
				.toFixed(2)
		}
	}
}
