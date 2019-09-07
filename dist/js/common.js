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
$(function () {
	// 隐藏显示对应的区域
	$("[data-collapse]").on('click', function () {
		$("#" + $(this).data("collapse")).toggleClass('in');
	})
})
// 分页插件
!(function ($) {
	/**
 * 分页
 * @param config {pageNumber  当前页码 pagecount 总页数 total 总条数,callback 回调方法}
 * @returns
 */
	$.fn.extend({
			"paging": function (config) {
				var defaultConfig={ 
					pageNumber:1, 
					pagecount:0, 
					total:0,
					callback:function(){
					}
				}; 
				$.extend(defaultConfig,config); 
				this.addClass('layui-box layui-laypage layui-laypage-molv');
				var pageHtml = '<span navid="page_cur" class="c_table_list_nav_text_span">1</span>'+
				'<span class="c_table_list_nav_text_span">/</span>'+
				'<span class="c_table_list_nav_text_span" navid="page_allPage">1</span>'+
				'<span class="c_table_list_nav_text_span">&nbsp;页&nbsp;</span>'+
				'<span class="c_table_list_nav_text_span" navid="page_allCount">共0 条 </span>'+
				'<span navid="page_pre" class="layui-laypage-prev poi">上一页</span>'+
				'<span navid="page_next" class="layui-laypage-next poi">下一页</span>'+
				'<span class="layui-laypage-skip">到第<input navid="page_goto" min="1" value="1" class="layui-input" type="text">页</span>';
				this.append(pageHtml);
				var updatePageNum =  function(pageNumber){
					// 更新页码
					defaultConfig.pageNumber = pageNumber
					this.find("[navid='page_cur']").text(defaultConfig.pageNumber);
				}
				updatePageNum = updatePageNum.bind(this)
				this.find("[navid='page_cur']").text(defaultConfig.pageNumber);
				this.find("[navid='page_allPage']").text(defaultConfig.pagecount);
				this.find("[navid='page_allCount']").text("共" + defaultConfig.total + "条");
				this.find("[navid='page_pre']").on('click',function(){
					var pagenum = defaultConfig.pageNumber;
					pagenum--;
					if (pagenum <= 0) {
						pagenum = 1;
						alert('已到达第一页')
						return
					}
					defaultConfig.callback(pagenum);
					updatePageNum(pagenum);
				});
				this.find("[navid='page_next']").on('click',function(){
					var pagenum = defaultConfig.pageNumber;
					pagenum++;
					if (pagenum > defaultConfig.pagecount) {
						pagenum = defaultConfig.pagecount;
						alert('已是最后一页')
						return
					}
					defaultConfig.callback(pagenum);
					updatePageNum(pagenum);
				});
				this.find("[navid='page_goto']").on('keypress', function (event) {
					if (event.keyCode == "13") {
						var pagenum = parseInt($(this).val());
						if(isNaN(pagenum)){
							alert('请输入正确的页码')
							return;
						}
						if (pagenum <= 0) {
							alert('输入页码不能小于等于0')
							return;
						}
						if (pagenum > defaultConfig.pagecount) {
							alert('输入页码不能超出最大页码')
							return;
						}
						defaultConfig.callback(pagenum);
						updatePageNum(pagenum);
					}
				})
			}
	});
})(jQuery);
//表格通用方法 周祥 2019年8月26日 02:42:33

var PageTable = function (table, config) {
	var pageBind = function (self, config) {
		var pagecount = parseInt(config.totalRows / config.pageSize) + (config.totalRows % config.pageSize > 0 ? 1 : 0);
		$("#pagebind").find("[navid='page_cur']").text(config.pageNumber);
		$("#pagebind").find("[navid='page_allPage']").text(pagecount);
		$("#pagebind").find("[navid='page_allCount']").text("共" + config.totalRows + "条");
		$("#pagebind").find("[navid='page_pre']").off().on('click',function(){
			var pagenum = config.pageNumber;
			pagenum--;
			console.log('page_pre',pagenum)
			if (pagenum <= 0) {
				pagenum = 1;
				alert('已到达第一页')
				return
			}
			console.log('page_pre1',pagenum)
			self.bootstrapTable('selectPage', pagenum);
		});
		$("#pagebind").find("[navid='page_next']").off().on('click',function(){
			var pagenum = config.pageNumber;
			pagenum++;
			console.log('page_next',pagenum)
			if (pagenum > pagecount) {
				pagenum = pagecount;
				alert('已是最后一页')
				return
			}
			console.log('page_next1',pagenum)
			self.bootstrapTable('selectPage', pagenum);
		});
		$("#pagebind").find("[navid='page_goto']").off().on('keypress', function (event) {
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
var PageAlert = function (config, flg) {
	// 是否新开窗口
	if (flg) {
		config.width = parseInt(config.width)||0;
		config.height = parseInt(config.height)||0;
		var l = (screen.availWidth - config.width) / 2;
		var t = (screen.availHeight - config.height) / 2;
		var str = 'width=' + config.width + ',height=' + config.height + ',top=' + t + ',left=' + l + ',scrollbars=yes,toolbar=no, menubar=no, location=no, status=no'
		//window.open(config.url, '', str)
		//防拦截 zx
		var newTab = window.open('about:blank', '', str);
		newTab.location.href = config.url;
		return
	}
	// 在父页面弹框
	layer.open({
		type: 2,
		title: config.title,
		anim: 5,
		area: [config.width, config.height],
		content: config.url,
		offset: '20px',
		fixed: false,
		scrollbar: true,
		//销毁后调用
		end: function () {
			typeof config.end == "function" && config.end();
		}
	});
}
/**
 * 新开窗口选择用户
 * @param url 页面url
 * @returns
 */
function openWinSelect(url) {
	// multiple  true/false/20 是否多选 如果有最大个数，直接传递人数
	// id // 选择框id 用于回显
	// callback // 回调函数名称 该函数必须在window下面，回传选中的数组{name:'',value:''}
	PageAlert({
		width: '720',
		height: "450",
		url: url
	}, true)
}
/**
 * ajax的提示信息
 * @param msg key值
 * @returns
 */
function ajaxMsg(msg) {
	var str = '<div class="tc pt30" >' + msg + '</div>';
	parent.layer.open({
		type: 1,
		area: ["200px", "80px"],
		time: 2000,
		content: str
	})
}

var PageGo = function (url) {
	location.href = url;
	if (event.stopPropagation){
		event.stopPropagation(); 
	}else{
		event.cancelBubble=true;
	}
}