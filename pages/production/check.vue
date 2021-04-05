<template>
	<view v-if="orderNo.length==0" class="scan-order">
		<button  class="button-submit" type="default"  @click="scan">扫单号</button>
	</view>
	<view v-else class="content">
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
		// this.scan();
	},
	mounted(){
		//页面加载完直接扫码
		// #ifdef  MP
			this.scan();
		// #endif
	},
	methods: {
		scan() {
			var that = this
			uni.scanCode({
				onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success (res) {
					that.orderNo=res.result;
				},
				fail (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		}
	},
}
</script>

<style>
	
</style>
