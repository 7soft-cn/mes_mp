<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{orderNo}}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderNo: ""
		}
	},
	onLoad() {
		this.scan();
	},
	methods: {
		scan() {
			var that = this
			wx.scanCode({
				onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success (res) {
					that.orderNo=res.result;
				},
				fail (res) {
					wx.navigateBack({
					  delta: 2
					})
				}
			})
		}
	},
}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	head {
		display: flex;
		justify-content: center;
	}
	
	.title {
		margin-top: 5%;
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
