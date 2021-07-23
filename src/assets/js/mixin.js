export const communication = {
	//混合开发传参数
	data() {
		return {};
	},
	created() {
		window.appResponse = this.appResponse;
	},
	methods: {
		appRequest(data, types) {
			try {
				var u = navigator.userAgent;
				var todata = { types: types, data: data };
				if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
					JsBridge.appRequest(JSON.stringify(todata));
				}
				if (u.indexOf('iPhone') > -1 || u.indexOf('iOS') > -1) {
					window.webkit.messageHandlers.appRequest.postMessage(
						JSON.stringify(todata)
					);
				}
			} catch (error) {
				// this.$router.go(-1)
			}
		},
		appResponse(str) {
			this.hasAppData(str);
		},
	},
};
export const backForAndroid = {
	//处理安卓返回键
	created() {
		window.backForAndroid = this.backAndroid;
	},
	methods: {
		backAndroid() {
			var u = navigator.userAgent;
			if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
				JsBridge.backForAndroid();
			}
		},
	},
};
