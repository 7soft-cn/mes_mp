<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{orderNo}}</text>
		</view>
		<view>
			<view >
			  <picker @change="bindPickerChange" value="currentIndex" range-key="processName" :range="reportDetails">
			    <view class="picker">
			      工序名称：{{reportDetails[currentIndex].processName}}
			    </view>
			  </picker>
			</view>
			<view>
				<label>物料编码：{{reportDetails[currentIndex].materialCode}}</label>
				<br/>
				<label>物料名称：{{reportDetails[currentIndex].materialName}}</label>
				<br/>
				<label>计划数量：{{reportDetails[currentIndex].quantity}}</label>
				<br/>
				<label>已报数量：{{reportDetails[currentIndex].completedQuantity}}</label>
				<br/>
				<label>本次数量：</label>
				<input type="number" v-model="reportDetails[currentIndex].actualQuantity" focus placeholder="本次数量"/>
				<button type="primary"  @click="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderNo: "",
			reportDetails:[],
			currentIndex:0,
		}
	},
	onLoad() {
		let token=wx.getStorageSync('x-token')
		console.log('x-token=>' + token);
		this.scan();
	},
	methods: {
		//扫描获取单号
		scan() {
			var that = this
			wx.scanCode({
				onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success (res) {
					that.orderNo=res.result;
					that.getOrderReportDetail();
				},
				fail (res) {
					wx.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//获取报工明细
		getOrderReportDetail(){
			var that = this
			let token = wx.getStorageSync('x-token')
			let userId = wx.getStorageSync('x-user-id')
			wx.request({
			  url: 'http://10.10.1.9:8001/productionOrder/getWisReportDetails', 
			  data: {
			    orderNo: that.orderNo
			  },
			  method:'GET',
			  header: {
			    'x-token': token,
				'x-user-id': userId,
			  },
			  success (res) {
				that.reportDetails=res.data.data
				// console.log(that.reportDetails)
			  },
			  complete (res) {
				  if (that.reportDetails==[] || that.reportDetails ==null){
					  wx.showToast({
					    title: "请扫描有效单号",
					    icon: 'error',
					    duration: 1000
					  })
					  wx.navigateBack({
					    delta: 2
					  })
					}
				}
			})
		},
		//改变选择工序
		bindPickerChange: function(e) {
			this.currentIndex=e.detail.value
		},
		//提交
		submit(){
			// console.log(this.reportDetails[this.currentIndex].actualQuantity);
			wx.showToast({
			  title: "本次报工["+this.reportDetails[this.currentIndex].actualQuantity+"]",
			  icon: 'success',
			  duration: 1000
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
