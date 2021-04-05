<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">欢迎{{loginUser.nickName}}!</text>
		</view>
		<div class="menus">
			<div class="menu_item" :class="curSelect==menu.id?'opacity':''" v-for="(menu,index) in menus" :key="index"
				@touchstart="touchstart(index)" @touchend="touchend">
				<view class="iconfont" v-bind:class="menu.icon" />
				{{menu.name}}
			</div>
		</div>
	</view>
</template>

<script>
	import {
		apiServer
	} from "@/utils/api.js";
	export default {
		data() {
			return {
				loginUser: {},
				bindUserNickName: "",
				menus: [{
					id: 0,
					name: '报工',
					icon: 'el-icon-finished',
					path: '/pages/production/report'
				}, {
					id: 1,
					name: '报工检',
					icon: 'el-icon-thumb',
					path: '/pages/production/check'
				}, {
					id: 2,
					name: '设备维护',
					icon: 'el-icon-cpu',
					path: '/pages/device/maintain'
				}, {
					id: 3,
					name: '原料检',
					icon: 'el-icon-shopping-cart-full',
					path: '/pages/material/check'
				}, {
					id: 4,
					name: '入库',
					icon: 'el-icon-sell',
					path: '/pages/warehouse/stock_in'
				}, {
					id: 5,
					name: '出库',
					icon: 'el-icon-sold-out',
					path: '/pages/warehouse/stock_out'
				}],
				curSelect: null
			}
		},
		onLoad() {
			this.login(); //重新登录
			// uni.showModal({
			//     title: '提示',
			//     content: '这是一个模态弹窗',
			//     success: function (res) {
			//         if (res.confirm) {
			//            uni.requestSubscribeMessage({
			//              tmplIds: ['rpwCukJgLyhiZwwqwU70DxAc5GqtA3LvlbK39RCbUjw'],
			//              success (res) {
			//            	  uni.showToast({
			//            	    title: "订阅成功",
			//            	    icon: 'success',
			//            	    duration: 1000
			//            	  })
			//              },
			//              complete(res) {
			//            	  console.log(res)
			//            	  uni.showToast({
			//            	    title: "订阅提醒完成成功",
			//            	    icon: 'success',
			//            	    duration: 1000
			//            	  })
			//              },
			//            })
			//             console.log('用户点击确定');
			//         } else if (res.cancel) {
			//             console.log('用户点击取消');
			//         }
			//     }
			// });
			// let token=uni.getStorageSync('x-token')
			// console.log('x-token=>' + token);
		},
		mounted() {
			//页面加载完直接扫码
			// #ifdef  MP
			// #endif
		},
		methods: {
			//登录
			login() {
				var that = this;
				// if (uni.getStorageSync('x-token').length > 0) {
				// 	that.token = uni.getStorageSync('x-token')
				// 	that.userId = uni.getStorageSync('x-user-id')
				// 	that.loginUser = uni.getStorageSync('loginUser')
				// 	return
				// }
				// #ifdef APP-PLUS||H5
				var code = plus.device.uuid;
				console.log(code)
				that.loginApi(code);
				// #endif

				// #ifndef APP-PLUS
				that.loginMP()
				// #endif
			},
			//登录小程序
			loginMP() {
				var that = this;
				uni.login({
					success(res) {
						if (res.code) {
							that.loginApi(res.code)
						} else {
							console.log('登录失败！' + res.errMsg);
							that.bindUser();
						}
					},
					fail(res) {
						console.log('登录失败！' + res.errMsg);
						that.bindUser();
					}
				});
			},
			//登录到服务器
			loginApi(code) {
				var that = this;
				var platform = ''
				// #ifdef APP-PLUS||H5
				platform = 'APP-PLUS'
				// #endif

				// #ifdef MP-WEIXIN
				platform = 'MP-WEIXIN'
				// #endif

				if (code) {
					//发起网络请求
					uni.request({
						url: apiServer + 'base/wxLogin',
						data: {
							platform: platform,
							code: code,
							nickName: that.bindUserNickName
						},
						success(res) {
							if (res.data.code == 0) {
								uni.setStorage({
									key: "loginUser",
									data: res.data.data.user
								})
								uni.setStorage({
									key: "x-token",
									data: res.data.data.token
								})
								uni.setStorage({
									key: "x-user-id",
									data: res.data.data.user.ID
								})
								that.loginUser = uni.getStorageSync('loginUser')
							} else {
								uni.showToast({
									title: "自动登录失败",
									icon: 'error',
									duration: 1000
								})
								that.bindUser();
							}
						}
					});
				}
			},
			//绑定用户
			bindUser() {
				var that = this;
				uni.setStorage({
					key: "nickName",
					data: ''
				})
				uni.navigateTo({
					url: '/pages/index/login'
				})
				that.bindUserNickName = uni.getStorageSync('nickName')
				if (that.bindUserNickName.length == 0) {
					uni.navigateTo({
						url: '/pages/index/login'
					})
				} else {
					that.login();
				}
				// uni.showModal({
				//   title: '请输入完整姓名',
				//   content: '',
				//   editable:true,
				//   placeholderText:"例:张三",
				//   success (res) {
				//     if (res.confirm) {
				// 	  that.bindUserNickName=res.content
				//     } else if (res.cancel) {
				//       that.bindUser();
				//     }
				// 	that.login();
				//   }
				// })
			},
			touchstart: function(e) {
				var that = this;
				var list = that.menus;
				for (var i = 0, len = list.length; i < len; ++i) {
					if (list[i].id == e) {
						that.curSelect = i;
					}
				}
			},
			touchend: function() {
				var that = this;
				let path = that.menus[that.curSelect].path
				uni.navigateTo({
					url: path
				})
				that.curSelect = null;
			}
		}
	}
</script>

<style>
	.title {
		font-size: 50rpx;
		color: #0689c5;
	}
	.menus {
		margin-top: 8%;
		display: flex;
		align-items: center;
		width: 100%;
		flex-wrap: wrap;
	}

	.menu_item {
		border: #555555;
		border-radius: 5rpx;
		border-width: 2rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-left: 3%;
		width: 30%;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.opacity {
		opacity: 0.4;
		background: #e5e5e5;
	}

	.menu_item view {
		font-size: 3rem;
		/* display: block; */
	}
</style>
