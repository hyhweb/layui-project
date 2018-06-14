layui.use(['element','form', 'layedit', 'laydate','table','common'], function(){
  var table = layui.table
  ,element = layui.element
  ,form = layui.form
  ,layer = layui.layer
  ,laydate = layui.laydate
  ,common =  layui.common;
  console.log(common,'common')
   //日期
  laydate.render({
    elem: '#date'
  });


  table.render({
    elem: '#table'
    ,url:'../../source/libs/data/userlist.json'
    ,cols: [[
   	  {checkbox: true, fixed: true},
      {field:'id', minWidth: 120, title: '公司名称', sort: true}
      ,{field:'username', minWidth: 120, title: '地址'}
      ,{field:'sex', width:100, title: '联系人', sort: true}
      ,{field:'city', width:120, title: '联系电话'}
      ,{field:'sign', title: '提交认证时间', minWidth: 150}
      ,{field:'experience', width:100, title: '状态'}
    ]]
    ,id: 'table'
    ,page: true
  });

  var $ = layui.$, active = {
    getCheckData: function(){ //获取选中数据
        // layer.open({
        //   type: 2, 
        //   content: ['./audit.html','no'] //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        // });
        common.dialog({
          title:"车队审核",
          area:['1000px',''],
          maxmin:true,
          url:'./edit/edit.html'
        })


      // var checkStatus = table.checkStatus('idTest')
      // ,data = checkStatus.data;
      // layer.alert(JSON.stringify(data));

      // layer.confirm('确定通过审核？',
      // {
      //   btn:['确定','取消']
      // },
      // function(){
      //     layer.msg('确定', {icon: 1});
      // },
      // function(){
      //   layer.msg('取消', {icon: 2});
        
      // })



    }
    // ,getCheckLength: function(){ //获取选中数目
    //   var checkStatus = table.checkStatus('idTest')
    //   ,data = checkStatus.data;
    //   layer.msg('选中了：'+ data.length + ' 个');
    // }
    // ,isAll: function(){ //验证是否全选
    //   var checkStatus = table.checkStatus('idTest');
    //   layer.msg(checkStatus.isAll ? '全选': '未全选')
    // }
  };

$('.layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });


   //监听提交
  form.on('submit(search)', function(data){
    
     
	  //执行重载
      table.reload('table', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: data.field
        
      });


    layer.alert(JSON.stringify(data.field), {
      title: '提示'
    })
    return false;
  });

});