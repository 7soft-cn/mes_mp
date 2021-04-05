<script>
	export default {
		data() {
			return {
				loginUser: {},
				token: "",
				userId: 0
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			// this.login(); //登录 暂时放在首页
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//登录
			login() {
				var that = this;
				if (uni.getStorageSync('x-token').length > 0) {
					that.token = uni.getStorageSync('x-token')
					that.userId = uni.getStorageSync('x-user-id')
					that.loginUser = uni.getStorageSync('loginUser')
					return
				}
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
		}
	}
</script>

<style>
	@import '@/static/css/icon.css';

	/*每个页面公共css */
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.head {
		margin-top: 3%;
		display: flex;
		justify-content: center;
	}

	.title {
		margin-top: 5%;
		font-size: 50rpx;
		color: #8f8f94;
	}

	.line {
		margin-top: 5%;
		width: 100%;
		height: 2rpx;
		background: #8f8f94;
	}

	.data-detail {
		/* margin-top: 5%; */
	}

	.data-select {
		margin-top: 5%;
	}

	.picker {
		/* color: #007AFF; */
	}

	.input-area {
		margin-top: 3%;
	}

	.input-border {
		box-sizing: border-box;
		border-color: #8f8f94;
		border-style: solid;
		border-width: thin;
	}

	.input-area label {
		align-self: center;
		font-size: 40rpx;
		color: #914800;
	}

	.input-number {
		white-space: nowrap;
		border: #000000;
		height: 50rpx;
		/* background-color: #8f8f94; */
	}

	.button-submit {
		margin-top: 5%;
	}
</style>
