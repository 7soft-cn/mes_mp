<template>
	<view class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{orderNo}}</text>
		</view>
		
		<view class="data-detail">
			<view class="line"></view>
			<view class="data-select">
			  <picker @change="bindPickerChange" value="currentIndex" range-key="materialName" :range="ActualDetails">
			    <view class="picker">
			      当前明细：{{ActualDetails[currentIndex].materialName}} (点击更换)
			    </view>
			  </picker>
			</view>
			<view>
				<label>物料编码：{{ActualDetails[currentIndex].materialCode}}</label>
				<br/>
				<label>物料名称：{{ActualDetails[currentIndex].materialName}}</label>
				<br/>
				<label>计划数量：{{ActualDetails[currentIndex].quantity}}</label>
				<br/>
				<label>已收数量：{{ActualDetails[currentIndex].completedQuantity}}</label>
				<view class="line"></view>
				<view class="input-area">
					<label>本次数量：</label>
					<view class="input-border">
						<input class="input-number" type="number" v-model.number="ActualDetails[currentIndex].actualQuantity" focus placeholder="本次数量"/>
					</view>
					<label>库位：</label>
					<view class="input-border">
						<input style="width:78%;" class="input-number" type="text" v-model.text="ActualDetails[currentIndex].locationNo" placeholder="库位 (必填)">
						</input>
					</view>
					<label>批次：</label>
					<view class="input-border">
						<input class="input-number" type="text" v-model.text="ActualDetails[currentIndex].batchNo" placeholder="批次 (可空)"/>
					</view>
					<label>唯一码：</label>
					<view class="input-border">
						<input class="input-number" type="text" v-model.text="ActualDetails[currentIndex].sn" placeholder="唯一码 (可空)"/>
					</view>
				</view>
				<button class="button-submit" type="default"  @click="scanLocationNo">扫库位</button>
				<button class="button-submit" type="primary"  @click="submit">提交</button>
				<!-- <button type="primary"  @click="openPdf(pdfUrl)">打开PDF</button>
				<web-view :src="pdfUrl" /> -->
			</view>
		</view>
	</view>
</template>

<script>
import { apiServer } from "@/utils/api.js";
export default {
	data() {
		return {
			orderNo: "",
			ActualDetails:[],
			currentIndex:0,
			pdfUrl:"https://mes.7soft.cn/uploads/file/20210320081328.pdf"
		}
	},
	onLoad() {
		this.scan();
		this.token = uni.getStorageSync('x-token')
		this.userId = uni.getStorageSync('x-user-id')
	},
	methods: {
		//扫描获取单号
		scan() {
			var that = this
			uni.scanCode({
				// onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success (res) {
					that.orderNo=res.result;
					that.getOrderActualDetails();
				},
				fail (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//扫库位
		scanLocationNo() {
			var that = this
			uni.scanCode({
				// onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success (res) {
					that.ActualDetails[that.currentIndex].locationNo=res.result;
				}
			})
		},
		//获取报工明细
		getOrderActualDetails(){
			var that = this
			uni.request({
			  url: apiServer+'stockInOrder/getWmsStockInActualDetails', 
			  data: {
			    orderNo: that.orderNo
			  },
			  method:'GET',
			  header: {
			    'x-token': that.token,
				'x-user-id': that.userId,
			  },
			  success (res) {
				that.ActualDetails=res.data.data
				// console.log(that.ActualDetails)
			  },
			  complete (res) {
				  if (that.ActualDetails==[] || that.ActualDetails ==null){
					  uni.showToast({
					    title: "请扫描有效单号",
					    icon: 'error',
					    duration: 1000
					  })
					  uni.navigateBack({
					    delta: 2
					  })
					}
				}
			})
		},
		//改变选择明细
		bindPickerChange: function(e) {
			this.currentIndex=e.detail.value
		},
		//提交
		submit(){
			var that = this
			let ActualDetail = that.ActualDetails[that.currentIndex];
			if(ActualDetail.actualQuantity==0){
				uni.showToast({
				  title: '数量不得为0',
				  icon:	'error',
				  duration: 1000
				})
				return;
			}
			uni.request({
				url: apiServer+'stockInOrder/createActualInDetails',
				data: [ActualDetail],
				method:'POST',
				header: {
					'x-token': that.token,
					'x-user-id': that.userId,
				},
				success (res) {
					if(res.data.code==0){
						uni.showToast({
						  title: "本次入库["+ActualDetail.actualQuantity+"]",
						  icon: 'success',
						  duration: 1000
						})
						that.getOrderActualDetails();
					}else{
						uni.showToast({
						  title: res.data.msg,
						  icon:	'none',
						  duration: 1000
						})
					}
					
				},
			})
		},
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
	.line{
		margin-top: 5%;
		width:100%;
		height:2rpx;
		background:#8f8f94;
	}
	.data-detail{
		/* margin-top: 5%; */
	}
	.data-select{
		margin-top: 5%;
	}
	.picker{
		/* color: #007AFF; */
	}
	.input-area{
		margin-top: 3%;
	}
	.input-border{
		box-sizing: border-box;
		border-color: #8f8f94;
		border-style: solid;
		border-width: thin;
	}
	.input-area label{
		align-self: center;
		font-size: 40rpx;
		color: #914800;
	}
	.input-number{
		white-space: nowrap;
		border: #000000;
		height: 50rpx;
		/* background-color: #8f8f94; */
	}
	.button-submit{
		margin-top: 5%;
	}
</style>
