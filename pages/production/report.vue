<template>
	<view v-if="reportDetails.length==0" class="scan-order">
		<button  class="button-submit" type="default"  @click="scan">扫单号</button>
	</view>
	<view v-else class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{orderNo}}</text>
		</view>
		
		<view class="data-detail">
			<view class="line"></view>
			<view class="data-select">
			  <picker @change="bindPickerChange" value="currentIndex" range-key="processName" :range="reportDetails">
			    <view class="picker">
			      工序名称：{{reportDetails[currentIndex].processName}}  (点击切换)
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
				<view class="line"></view>
				<view class="input-area">
					<label>本次数量：</label>
					<view class="input-border">
						<input class="input-number" type="number" v-model.number="reportDetails[currentIndex].actualQuantity" focus placeholder="本次数量"/>
					</view>
				</view>
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
			reportDetails:[],
			currentIndex:0,
			pdfUrl:"https://mes.7soft.cn/uploads/file/20210320081328.pdf"
		}
	},
	onLoad() {
		
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
					that.getOrderReportDetail();
				},
				fail (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//获取报工明细
		getOrderReportDetail(){
			var that = this
			let token = uni.getStorageSync('x-token')
			let userId = uni.getStorageSync('x-user-id')
			uni.request({
			  url: apiServer+'productionOrder/getWisReportDetails', 
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
		//改变选择工序
		bindPickerChange: function(e) {
			this.currentIndex=e.detail.value
		},
		//提交
		submit(){
			var that = this
			let token = uni.getStorageSync('x-token')
			let userId = uni.getStorageSync('x-user-id')
			let reportDetail = that.reportDetails[that.currentIndex];
			if(reportDetail.actualQuantity==0){
				uni.showToast({
				  title: '数量不得为0',
				  icon:	'error',
				  duration: 1000
				})
				return;
			}
			uni.request({
				url: apiServer+'productionOrder/createWisReportDetails',
				data: [reportDetail],
				method:'POST',
				header: {
					'x-token': token,
					'x-user-id': userId,
				},
				success (res) {
					if(res.data.code==0){
						uni.showToast({
						  title: "本次报工["+reportDetail.actualQuantity+"]",
						  icon: 'success',
						  duration: 1000
						})
						that.getOrderReportDetail();
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
