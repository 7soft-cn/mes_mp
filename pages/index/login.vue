<template>
	<view>
		<label>输入完整姓名</label>
		<input type="text" v-model="nickName" placeholder="如:张三"/>
		<button type="primary" @click="saveNickName">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName:""
			}
		},
		methods: {
			saveNickName(){
				if(this.nickName.length>0)
				{
					uni.setStorage({
					  key:"nickName",
					  data:this.nickName
					})
					uni.navigateBack({
					  delta: 2
					})
				}
			}
		}
	}
</script>

<style>

</style>
