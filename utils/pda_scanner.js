let main, IntentFilter, receiver;
/*
 * 
 * 定义广播
 * that：传this；
 */
const init = (callbackFunc) => {
	/* #ifdef APP-PLUS */
	var self = this;
	main = plus.android.runtimeMainActivity(),
	IntentFilter = plus.android.importClass('android.content.IntentFilter');
	//注册广播并监听回调
	var filter = new IntentFilter(),
	receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
		onReceive: onReceiveFn
	});
	filter.addAction("android.senraise.scan");
	main.registerReceiver(receiver, filter); //注册监听事件
	//监听回调函数
	function onReceiveFn(context, intent) {
		plus.android.importClass(intent); 
		var data = intent.getStringExtra("result")
		console.log('result=>'+data)
		callbackFunc(data)
		// main.unregisterReceiver(receiver);//停止广播监听扫码
		self.stop()
	}
	console.log("扫码头=>开启");
	/* #endif */
	
}

export const broadcastScan = {
	init
};