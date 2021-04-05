<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{scanResult}}!</text>
		</view>
		<button type="default"  @click="scanLocationNo" ref='button'>相机扫码</button>
	</view>
</template>

<script>
	import { broadcastScan } from "@/utils/pda_scanner.js";
	export default {
		data() {
			return {
				scanResult:""
			}
		},
		onLoad() {
			broadcastScan.init(this.getScancode)
		},
		mounted(){
			let that = this
			// that.scanLocationNo()
		},
		methods: {
			//扫码回调函数
			getScancode(code){
				this.scanResult =code
			},
			scanLocationNo(){
				var that = this
				uni.scanCode({
					// onlyFromCamera: true,
					scanType:['barCode', 'qrCode'],
					success (res) {
						that.scanResult = res.result;
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.head {
		margin-top: 5%;
		display: flex;
		justify-content: center;
	}
	.title {
		font-size: 50rpx;
		color: #0689c5;
	}
</style>
