// import router from '../../router'


// var wx = require('weixin-js-sdk');
import wx from 'weixin-js-sdk'

//微信内 JSApi支付
export default {
	WxConfig(data) {
		wx.config({
			debug:true,
			// debug: process.env.NODE_ENV == 'production' ? false : true,//这里一般在测试阶段先用true，等打包给后台的时候就改回false,
			appId: data.appId,
			timestamp: data.timeStamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: ['getBrandWCPayRequest']
		})
		wx.ready(function () {
			wx.checkJsApi({
				jsApiList: ['getBrandWCPayRequest'],
				success: function (res) {
					console.log(res)
				},
				fail: function (res) {
					console.log(res)
				}
			})

			wx.error(function (res) {
				console.log("errorMSG:" + res);
			});
		})
	},

	WXJSApi(data,resolve,reject) {
		function onBridgeReady() {
			// return new Promise((resolve, reject) => {
				window.WeixinJSBridge.invoke(
					"getBrandWCPayRequest",
					{
						appId: data.appId, //公众号名称，由商户传入
						timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
						nonceStr: data.nonceStr, //随机串
						package: data.package, //订单详情扩展字符串
						signType: data.signType?data.signType:'MD5', //微信签名方式：
						paySign: data.paySign, //微信签名
					},
					function (res) {
						// WeixinJSBridge.log(JSON.stringify(res) );
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							resolve()
							console.log('ok')
						} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
							console.log('用户取消支付')
							reject()
						} else if (res.err_msg === 'get_brand_wcpay_request:fail') {
							console.log('网络异常，请重试')
							reject()
						}
					}
				);
			// })
		}

		if (typeof window.WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
				document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
			}
		} else {
			onBridgeReady();
		}
	},
}


/*
export function jsSDK(params) {
	if (typeof window.WeixinJSBridge === 'undefined') {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', function () { onBridgeReady(params) }, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function () { onBridgeReady(params) })
			document.attachEvent('onWeixinJSBridgeReady', function () { onBridgeReady(params) })
		}
	} else {
		onBridgeReady(params)
	}
}

function onBridgeReady(params) {
	window.WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
		'appId': params.appId, // 公众号名称，由商户传入
		'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
		'nonceStr': params.nonceStr, // 随机串
		'package': params.package,
		'signType': params.signType, // 微信签名方式：
		'paySign': params.paySign // 微信签名
	},
		function (res) {
			console.log(JSON.stringify(res));
			if (res.err_msg === 'get_brand_wcpay_request:ok') {
				// alert('微信支付成功')
				window.history.back(-1);
			} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
				alert('用户取消支付')
			} else if (res.err_msg === 'get_brand_wcpay_request:fail') {
				alert('网络异常，请重试')
			}
		}
	)
}
//提交订单使用
export function jsSDK2(params) {
	if (typeof window.WeixinJSBridge === 'undefined') {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', function () { onBridgeReady2(params) }, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', function () { onBridgeReady2(params) })
			document.attachEvent('onWeixinJSBridgeReady', function () { onBridgeReady2(params) })
		}
	} else {
		onBridgeReady2(params)
	}
}

function onBridgeReady2(params) {
	window.WeixinJSBridge.invoke(
		'getBrandWCPayRequest', {
		'appId': params.appId, // 公众号名称，由商户传入
		'timeStamp': params.timeStamp, // 时间戳，自1970年以来的秒数
		'nonceStr': params.nonceStr, // 随机串
		'package': params.package,
		'signType': params.signType, // 微信签名方式：
		'paySign': params.paySign // 微信签名
	},
		function (res) {
			console.log(JSON.stringify(res));
			if (res.err_msg === 'get_brand_wcpay_request:ok') {
				console.log('微信支付成功')
				router.push({
					name:'success'
				})
				console.log(window.location.href)
			} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
				alert('用户取消支付')
			} else if (res.err_msg === 'get_brand_wcpay_request:fail') {
				alert('网络异常，请重试')
			}
		}
	)
}*/

