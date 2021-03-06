/**功能点1：读取上一页面共享的Cookie数据**/
var arr=document.cookie.split('; ');//此处用;+空格拆分
var cookieData={};
for(var i=0;i<arr.length;i++){
  var kv=arr[i]; //"k=v"形式的键值对
  var pair=kv.split('='); //使用=拆分每个键值对
  cookieData[pair[0]]=pair[1];
}
var loginUid=cookieData['LoginUserId'];
var loginUname=cookieData['LoginUserName'];

/**功能点2：异步请求页头页页尾**/
$('#header').load('data/header.php',function(){
  //load的回调函数——异步请求成功完成后才执行
  $('#welcome').html("欢迎回来："+loginUname);
});
$('#footer').load('data/footer.php');
/*异步加载问题
//修改失败！！
$('#welcome').html("欢迎回来："+loginUname);
alert('JS执行完成:'+$('#welcome').length);
*/

/**功能点3：页面加载完后，异步请求当前登录用户的购物车内容**/
$(function(){
  $.ajax({
    type:'GET',
	url:'data/6_cart_detail_select.php',
	data:{uid:loginUid},
	success:function(list){
	  //遍历购物车中的每个商品，生成TR和TD
	  var html='';
	  $.each(list,function(i,p){
	    html+=`
		<tr>
			<td>
				<input type="checkbox"/>
				<input type="hidden" value="${p.did}" />
				<div><img src="${p.pic}" alt=""/></div>
			</td>
			<td><a href="">${p.pname}</a></td>
			<td>${p.price}</td>
			<td>
				<button>-</button><input type="text" value="${p.count}"/><button>+</button>
			</td>
			<td><span>${p.price*p.count}</span></td>
			<td><a href="${p.did}">删除</a></td>
		</tr>
		`;
	  });
	  $('#cart tbody').html(html);
	},
    error:function(){
	  console.log('购物车列表响应完成但有问题');
	  console.log(arguments);
	}
  });
});

/**功能点4：为+和-按钮绑定事件监听，修改同级的input的value，异步提交给服务器**/
$('#cart tbody').on('click','button',function(){
  var $btn=$(this);
  var did=$('input:hidden').val();
  var c=parseInt($btn.siblings('input').val());
  if($btn.html()=='-') $btn.siblings('input').val(c-1);
  else $btn.siblings('input').val(c+1);
  var count=$btn.siblings('input').val();
  if(count<=0) {
	$btn.parent().parent().html('');
	count=0;
  }
  $.ajax({
    type:'GET',
	url:'data/7_cart_detail_update.php',
	data:{did:did,count:count},
	success:function(output){
      console.log(output);
	  if(output.code==1) {
	    console.log('购物车数据库数据更新成功');

	  }
	},
  });
});

/**功能点5：为“删除”按钮绑定事件监听，异步提交给服务器**/
$('#cart tbody').on('click','a',function(e){
  e.preventDefault();
  var $btn=$(this);
  $btn.parent().parent().html('');
  var did=$btn.attr('href');
  $.ajax({
    type:'GET',
	url:'data/8_cart_detail_delete.php',
	data:{did:did},
	success:function(output){
      console.log(output);
	  if(output.code==1) {
	    console.log('商品删除成功');
	  }
	},
  });
});