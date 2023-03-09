// 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart.js'
import moduleUser from './user.js'

// 将Vuex安装为Vue插件
Vue.use(Vuex)

// 创建store实例对象
const store = new Vuex.Store({
	modules: {
		m_cart: moduleCart,
		m_user: moduleUser
	}
})

// 导出store实例对象
export default store
