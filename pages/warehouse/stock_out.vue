<template>
	<view v-if="ActualDetails.length==0" class="scan-order">
		<button  class="button-submit" type="default"  @click="scan">扫单号</button>
	</view>
	<view v-else class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text  class="title">{{orderNo}}</text>
		</view>
		
		<view class="data-detail">
			<view class="line"></view>
			<view class="data-select">
			  <picker @change="bindPickerChange" value="currentIndex" range-key="materialName" :range="ActualDetails">
			    <view class="picker">
			      当前明细：{{ActualDetails.length>0?ActualDetails[currentIndex].materialName:''}} (点击更换)
			    </view>
			  </picker>
			</view>
			<view>
				<label>物料编码：{{ActualDetails.length>0?ActualDetails[currentIndex].materialCode:''}}</label>
				<br/>
				<label>物料名称：{{ActualDetails.length>0?ActualDetails[currentIndex].materialName:''}}</label>
				<br/>
				<label>计划数量：{{ActualDetails.length>0?ActualDetails[currentIndex].quantity:''}}</label>
				<br/>
				<label>已出数量：{{ActualDetails.length>0?ActualDetails[currentIndex].completedQuantity:''}}</label>
				<view class="line"></view>
				<view class="input-area">
					<label>本次数量：</label>
					<view class="input-border">
						<input class="input-number" type="number" v-model.number="currentActualQuantity" focus placeholder="本次数量"/>
					</view>
					<label>库位：</label>
					<view class="input-border">
						<input style="width:78%;" class="input-number" type="text" v-model.text="currentLocationNo" placeholder="库位 (必填)">
						</input>
					</view>
					<label>批次：</label>
					<view class="input-border">
						<input class="input-number" type="text" v-model.text="currentBatchNo" placeholder="批次 (可空)"/>
					</view>
					<label>唯一码：</label>
					<view class="input-border">
						<input class="input-number" type="text" v-model.text="currentSn" placeholder="唯一码 (可空)"/>
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
			currentActualQuantity:0,
			currentLocationNo:"",
			currentBatchNo:"",
			currentSn:"",
			pdfUrl:"https://mes.7soft.cn/uploads/file/20210320081328.pdf"
		}
	},
	onLoad() {
		this.token = uni.getStorageSync('x-token')
		this.userId = uni.getStorageSync('x-user-id')
		// this.scan();
	},
	mounted(){
		//页面加载完直接扫码
		// #ifdef  MP
			this.scan();
		// #endif
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
					that.currentLocationNo=res.result;
				}
			})
		},
		//获取报工明细
		getOrderActualDetails(){
			var that = this
			uni.request({
			  url: apiServer+'stockOutOrder/getWmsStockOutActualDetails', 
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
			if(that.currentActualQuantity==0){
				uni.showToast({
				  title: '数量不得为0',
				  icon:	'error',
				  duration: 1000
				})
				return;
			}
			if(that.currentLocationNo.length==0){
				uni.showToast({
				  title: '库位不得为空',
				  icon:	'error',
				  duration: 1000
				})
				return;
			}
			ActualDetail.actualQuantity= that.currentActualQuantity
			ActualDetail.locationNo= that.currentLocationNo
			ActualDetail.batchNo= that.currentBatchNo
			ActualDetail.sn= that.currentSn
			uni.request({
				url: apiServer+'stockOutOrder/createActualOutDetails',
				data: [ActualDetail],
				method:'POST',
				header: {
					'x-token': that.token,
					'x-user-id': that.userId,
				},
				success (res) {
					if(res.data.code==0){
						uni.showToast({
						  title: "本次出库["+ActualDetail.actualQuantity+"]",
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
		//打开PDF
		openPdf(pdfUrl) {
		      uni.downloadFile({//下载
		        url: pdfUrl,//服务器上的pdf地址
		        filePath: uni.env.USER_DATA_PATH + '/test.pdf',//自定义文件地址
		        success: function (res) {
		          var filePath = res.filePath
		          uni.openDocument({//打开
		            filePath: filePath,
		            success: function (res) {}
		          })
		        }
		      })
		}
	},
}
</script>

<style>
	
</style>
