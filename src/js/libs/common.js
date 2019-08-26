/**
 * url地址修改
 * @param url 待修改url
 * @param arg 修改的参数名
 * @param arg_val 修改的具体值
 * @returns {String}
 */
function changeURLArg(url, arg, arg_val) {
	var pattern = arg + '=([^&]*)';
	var replaceText = arg + '=' + arg_val;
	if (url.match(pattern)) {
		var tmp = '/(' + arg + '=)([^&]*)/gi';
		tmp = url.replace(eval(tmp), replaceText);
		return tmp;
	} else {
		if (url.match('[\?]')) {
			return url + '&' + replaceText;
		} else {
			return url + '?' + replaceText;
		}
	}
}

/**
 * 获取url里的参数
 * @param arg 参数名
 * @returns
 */
function getURLString(arg) {
	var reg = new RegExp("(^|&)" + arg + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
/**
 * 设置cookie
 * @param key key值
 * @param value value
 * @param Days 天数
 * @returns
 */
function setCookie(key, value, Days) {
	Days = Days || 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
/**
 * 获取cookie
 * @param key key值
 * @returns
 */
function getCookie(key) {
	//获取cookie字符串
	var strCookie = document.cookie;
	//将多cookie切割为多个名/值对
	var arrCookie = strCookie.split("; ");
	var value = "";
	//遍历cookie数组，处理每个cookie对
	for (var i = 0; i < arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if (key == arr[0]) {
			value = arr[1];
			break;
		}
	}
	return value;
}