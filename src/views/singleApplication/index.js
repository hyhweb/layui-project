layui.use(['element','form', 'layedit', 'laydate','table','common','api','laytpl'], function(){
  var table = layui.table
  $ = layui.$
  ,element = layui.element
  ,form = layui.form
  ,layer = layui.layer
  ,laydate = layui.laydate
      ,laytpl = layui.laytpl
  ,common =  layui.common,
  api = layui.api;
  
   //日期
  laydate.render({
    elem: '#date'
  });


$.when(api.getShipCompanyList(),api.getSingleStatusList()).done(function(shipCompany,singleStatus){
               var shipCompanyList = shipCompany[0],
               singleStatusList = singleStatus[0];
               //下拉渲染
                var selectHTML = shipCompanyList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=shipCompanyId]').append(selectHTML)
                
                var selectHTML = singleStatusList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=status]').append(selectHTML)
                form.render()
                

                
        })



  var tableParam =$.extend({},{
    elem: '#table'
    ,url:common.baseUrl+'/order/apply/pageList'
    ,cols: [[
      {checkbox: true, fixed: true},
      {field:'applyNo', minWidth: 120, title: '申请单编号', sort: true},
      {field:'bookSpaceNo', minWidth: 120, title: '订舱单号', sort: true}
      ,{field:'shipCompanyName', minWidth: 120, title: '船公司'}
      ,{field:'orderTypeName', minWidth: 120, title: '业务类型'}
      ,{field:'containerTypeName', minWidth: 150, title: '箱型'}
      ,{field:'containerNumber', width:100, title: '箱量',templet:'<div>{{ (d.containerNumber==0? "":d.containerNumber) }}</div>'}
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
            title = "新建申请"
        } else{
          var checkStatus = table.checkStatus('table'),
            data = checkStatus.data;
            layui.sessionData('dialog',{key:'detail',value:data[0]});
            
            if (handle == "2") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                if(data[0].status ==1){
                  layer.msg('不能编辑已审核的数据,请重新选择');
                  return;
                }
                title = "编辑申请";
            }
          
        }
        layui.sessionData('dialog',{key:'mode',value:handle});

        common.dialog({
          title:title,
          area:['800px',''],
          maxmin:true,
          url:'../singleApplication/edit/edit.html'
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
    console.log(JSON.stringify({parameter:data.field}))
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