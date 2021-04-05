<template>
	<view v-if="deviceNo.length == 0" class="scan-order">
		<button class="button-submit" type="default"  @click="scan">扫设备</button>
	</view>
	<view v-else class="content">
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<view class="head">
			<text class="title">{{deviceNo}}</text>
		</view>
		
		<view class="data-detail">
			<view class="line"></view>
			<!-- <view class="data-select">
			  <picker @change="bindPickerChange" value="currentIndex" range-key="label" :range="deviceMaintainTypes">
			    <view class="picker">
			      维护类型：{{deviceMaintainTypes[currentIndex].label}}  (点击切换)
			    </view>
			  </picker>
			</view> -->
			<view>
				<!-- <label>设备ID：{{deviceInfo.ID}}</label>
				<br/> -->
				<label>设备名称：{{deviceInfo.deviceName}}</label>
				<br/>
				<label>投用日期：{{ deviceInfo.applyDate|formatDate }}</label>
				<br/>
				<label>设备型号：{{deviceInfo.deviceModel}}</label>
				<br/>
				<label>设备规格：{{deviceInfo.deviceSpec}}</label>
				<br/>
				<textarea class="input-border" placeholder="备注(可选)" v-model="maintainRemark"/>
				<view class="line"></view>
				<!-- <button class="button-submit" type="default"  @click="scan">扫设备</button> -->
				<!-- <button class="button-submit" type="primary"  @click="submit">提交</button> -->
				<button class="button-submit" type="default" v-for="(item,key) in deviceMaintainTypes" :key="key" :label="item.label" :value="item.value" @click="submit(item.value)">{{item.label}}</button>
				<!-- <button type="primary"  @click="openPdf(pdfUrl)">打开PDF</button>
				<web-view :src="pdfUrl" /> -->
			</view>
		</view>
	</view>
</template>

<script>
import { apiServer } from "@/utils/api.js";
import { formatTimeToStr } from "@/utils/date.js";
export default {
	data() {
		return {
			token:"",
			userId:"",
			deviceNo: "",
			deviceInfo:{},
			deviceMaintainTypes:[],
			currentIndex:0,
			maintainRemark:""
		}
	},
	filters: {
	    formatDate: function (time) {
	      if (time != null && time != "") {
	        var date = new Date(time);
	        return formatTimeToStr(date, "yyyy-MM-dd");
	      } else {
	        return "";
	      }
	    },
		formatDateTime: function (time) {
		  if (time != null && time != "") {
		    var date = new Date(time);
		    return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
		  } else {
		    return "";
		  }
		},
	    formatBoolean: function (bool) {
	      if (bool != null) {
	        return bool ? "是" : "否";
	      } else {
	        return "";
	      }
	    }
	  },
	onLoad() {
		this.token = uni.getStorageSync('x-token')
		this.userId = uni.getStorageSync('x-user-id')
		this.getDeviceMaintainTypes();
		// this.scan();
	},
	mounted(){
		//页面加载完直接扫码
		// this.scan();
	},
	methods: {
		//扫描获取
		scan() {
			var that = this
			//允许从相机和相册扫码
			uni.scanCode({
				// onlyFromCamera: true,
				scanType:['barCode', 'qrCode'],
				success: function (res) {
					that.deviceNo=res.result;
					that.getDevice()
				},
				fail: function (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//获取维护类型
		getDeviceMaintainTypes(){
			var that = this
			uni.request({
				url: apiServer+'sysDictionary/findSysDictionary', 
				data: {
					type: 'deviceMaintainType'
				},
				method:'GET',
				header: {
					'x-token': that.token,
					'x-user-id': that.userId
				},
				success (res) {
					that.deviceMaintainTypes=res.data.data.resysDictionary.sysDictionaryDetails;
				},
				fail (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//查询设备
		getDevice(){
			var that = this
			uni.request({
				url: apiServer+'device/findEamDevice', 
				data: {
					deviceNo: that.deviceNo
				},
				method:'GET',
				header: {
					'x-token': that.token,
					'x-user-id': that.userId
				},
				success (res) {
					if(res.data.code==0){
						that.deviceInfo=res.data.data.redevice;
					}else{
						uni.showToast({
							title: res.data.msg,
							icon:	'error',
							duration: 1000
						})
						uni.navigateBack({
						  delta: 2
						})
					}
				},
				fail (res) {
					uni.navigateBack({
					  delta: 2
					})
				}
			})
		},
		//改变选择工序
		bindPickerChange:function(e) {
			this.currentIndex=e.detail.value
		},
		//提交
		submit(type){
			var that = this
			uni.showModal({
			  title: '是否已经完成？',
			  success (res) {
			    if (res.confirm) {
					uni.request({
						url: apiServer+'device/createEamDeviceMaintainRecord', 
						data: {
							deviceId: that.deviceInfo.ID,
							maintainType: type,
							remark: that.maintainRemark,
						},
						method:'POST',
						header: {
							'x-token': that.token,
							'x-user-id': that.userId
						},
						success (res) {
							if(res.data.code==0){
								uni.showToast({
									title: '提交成功',
									icon:	'success',
									duration: 1000
								})
								that.maintainRemark=''
							}else{
								uni.showToast({
									title: res.date.msg,
									icon:	'error',
									duration: 1000
								})
							}
						}
					})
			    } else if (res.cancel) {
			      uni.showToast({
			        title: '已取消',
			        icon:'none',
			        duration: 1000
			      })
			    }
			  }
			})
			
		},
	}
}
</script>

<style>
	
</style>
