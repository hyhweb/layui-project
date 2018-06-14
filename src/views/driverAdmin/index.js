layui.use(['element','form', 'layedit', 'laydate','table','common'], function(){
  var table = layui.table
  $ = layui.$
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
form.render()

  var tableParam =$.extend({},{
    elem: '#table'
    ,url:common.baseUrl+'/base/driver/pageList'
    ,cols: [[
      {checkbox: true, fixed: true},
      {field:'driverName', minWidth: 80, title: '姓名', sort: true}
      ,{field:'genderName', width: 80, title: '性别'}
      ,{field:'age', minWidth: 120, title: '年龄'}
      ,{field:'phone', title: '联系电话', minWidth: 150}
      ,{field:'idCard', minWidth:200, title: '身份证号码'}
      ,{field:'validName', width:100, title: '状态'}
    ]]
    ,id: 'table'
    ,page: true
  },
  common.tableConfig);
   
    
  
  table.render(tableParam);

  var $ = layui.$, active = {
    openDialog: function(handle){ //获取选中数据
    
        var title = "";
         if (handle == "1") {
            title = "新建司机"
        } else{
          var checkStatus = table.checkStatus('table'),
            data = checkStatus.data;
            layui.sessionData('dialog',{key:'detail',value:data[0]});
            
            if (handle == "2") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "编辑司机";
            } 
          
        }
        layui.sessionData('dialog',{key:'mode',value:handle});

        common.dialog({
          title:title,
          area:['800px',''],
          maxmin:true,
          url:'../driverAdmin/edit/edit.html'
        })



    }
  };

$('.layui-btn').on('click', function(){
    var type = $(this).data('type'),
    handle =  $(this).data('handle');
    active[type] ? active[type].call(this,handle) : '';
  });


   //监听提交
  form.on('submit(search)', function(data){
	  //执行重载
      table.reload('table', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where:{parameter:data.field}
        
      });
    return false;
  });

});