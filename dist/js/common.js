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

// 处理一些公共方法
$(function(){	
	// 隐藏显示对应的区域
	$("[data-collapse]").on('click',function(){
		$("#"+$(this).data("collapse")).toggleClass('in');
	})
})
//表格通用方法 周祥 2019年8月26日 02:42:33

var PageTable = function (table, config) {
	var pageBind = function (self, config) {
		var pagecount = parseInt(config.totalRows / config.pageSize) + (config.totalRows % config.pageSize > 0 ? 1 : 0);
		$("#pagebind").find("[navid='page_cur']").text(config.pageNumber);
		$("#pagebind").find("[navid='page_allPage']").text(pagecount);
		$("#pagebind").find("[navid='page_allCount']").text("共" + config.totalRows + "条");
		$("#pagebind").find("[navid='page_pre']").click(function () {
			var pagenum = config.pageNumber;
			pagenum--;
			if (pagenum <= 0) {
				pagenum = 1;
			}
			self.bootstrapTable('selectPage', pagenum);
		});
		$("#pagebind").find("[navid='page_next']").click(function () {
			var pagenum = config.pageNumber;
			pagenum++;
			if (pagenum > pagecount) {
				pagenum = pagecount;
			}
			self.bootstrapTable('selectPage', pagenum);
		});
		$("#pagebind").find("[navid='page_goto']").bind('keypress', function (event) {
			if (event.keyCode == "13") {
				var pagenum = parseInt($(this).val());
				if (pagenum <= 0) {
					alert('输入页码不能小于等于0')
					return;
				}
				if (pagenum > pagecount) {
					alert('输入页码不能超出最大页码')
					return;
				}
				self.bootstrapTable('selectPage', pagenum);
			}
		})
	}
	table.bootstrapTable({
		method: config.method ? config.method : 'get',
		url: config.url,
		striped: true,
		cache: false,
		pagination: true,
		pageNumber: 1,
		pageSize: 3,
		sidePagination: "server",
		columns: config.columns,
		onLoadSuccess: function (result) {
			var _self = table.bootstrapTable("getOptions");
			pageBind(table, {
				pageSize: _self.pageSize,
				totalRows: result.total,
				pageNumber: _self.pageNumber
			})
		},
		onClickRow: function (row, $element) {
			typeof config.onClickRow == "function" && config.onClickRow(row, $element);
		}
	});
}

//公共弹出 https://www.layui.com/doc/modules/layer.html
var PageAlert = function (config) {
	layer.open({
		type: 2,
		title: config.title,
		anim: 5,
		area: [config.width, config.height],
		content: config.url,
		scrollbar: false
	});
}

/**
 * ajax的提示信息
 * @param msg key值
 * @returns
 */
function ajaxMsg(msg) {
	var str = '<div class="tc pt30" >'+msg+'</div>';
	layer.open({
		type: 1, 
		area: ["200px", "80px"],
		time:2000,
		content: str
	})
}