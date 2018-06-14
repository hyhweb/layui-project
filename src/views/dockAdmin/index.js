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


  var tableParam =$.extend({},{
    elem: '#table'
    ,url:common.baseUrl+'/base/dock/pageList'
    ,cols: [[
      {checkbox: true, fixed: true},
      {field:'dockName', minWidth: 120, title: '码头名称', sort: true}
      ,{field:'address', minWidth: 120, title: '地址'}
      ,{field:'harborName', minWidth: 120, title: '所属港区'}
      ,{field:'contacts', title: '联系人', minWidth: 150}
      ,{field:'phone', minWidth:120, title: '联系电话'}
      ,{field:'createTimeText', minWidth:150, title: '入驻时间'}
      ,{field:'statusName', width:100, title: '状态'}
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
            title = "新建码头"
        } else{
          var checkStatus = table.checkStatus('table'),
            data = checkStatus.data;
            layui.sessionData('dialog',{key:'detail',value:data[0]});
            
            if (handle == "2") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "编辑码头";
            } else if (handle == "0") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "码头信息";
            } 
          
        }
        layui.sessionData('dialog',{key:'mode',value:handle});

        common.dialog({
          title:title,
          area:['800px',''],
          maxmin:true,
          url:'../dockAdmin/edit/edit.html'
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