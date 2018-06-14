layui.use(['element','form', 'layedit', 'laydate','table','common'], function(){
  var
  $ = layui.$,
   table = layui.table
  ,element = layui.element
  ,form = layui.form
  ,layer = layui.layer
  ,laydate = layui.laydate
  ,common =  layui.common;
//日期

  var startDate = laydate.render({
    elem: '#startCreateTime',
    done: function(value, date){
         /*endDate.config.min ={  
                         year:date.year,   
                         month:date.month-1, //关键  
                         date: date.date,   
                         hours: 0,   
                         minutes: 0,   
                         seconds : 0  
                };*/
    }
  });

 var endDate = laydate.render({
    elem: '#endCreateTime',
    done: function(value, date){
      /*startDate.config.max={  
                         year:date.year,   
                         month:date.month-1, //关键  
                         date: date.date,   
                         hours: 0,   
                         minutes: 0,   
                         seconds : 0  
                };*/
    }
  });

 var tableParam = $.extend({}, common.tableConfig, {
  elem: '#table'
    ,method:'post'
    ,contentType:'application/json'
    ,where:{parameter:{}}
    ,url:common.baseUrl+'/base/carTeam/pageList'
    ,cols: [[
      {checkbox: true, fixed: true},
      {field:'carTeamName', minWidth: 120, title: '公司名称', sort: true}
      ,{field:'address', minWidth: 120, title: '地址'}
      ,{field:'contacts', width:100, title: '联系人', sort: true}
      ,{field:'phone', width:120, title: '联系电话'}
      ,{field:'createTimeText', title: '提交认证时间', minWidth: 150}
      ,{field:'statusName', width:100, title: '状态'}
    ]]
    ,id: 'table'
 })
  table.render(tableParam);

  var $ = layui.$, active = {
    openDialog: function(handle) { //获取选中数据
                var title = "";

                 if (handle == "1") {
                    title = "新建车队"
                } else{
                  var checkStatus = table.checkStatus('table'),
                    data = checkStatus.data;
                    layui.sessionData('dialog',{key:'detail',value:data[0]});
                    
                    if (handle == "2") {
                        if(data.length !=1){
                          layer.msg('请选择一条数据进行操作');
                          return;
                        }
                        title = "编辑车队";
                    } else if (handle == "0") {
                        if(data.length !=1){
                          layer.msg('请选择一条数据进行操作');
                          return;
                        }
                        title = "车队信息";
                    } else if(handle == "3"){
                      if(data.length !=1){
                          layer.msg('请选择一条数据进行操作');
                          return;
                        }
                        title = "车队审核";
                      
                    }
                  
                }
                layui.sessionData('dialog',{key:'mode',value:handle});
                 

                common.dialog({
                    title: title,
                    area: ['800px',''],
                    maxmin: true,
                    url: '../carteamAdmin/edit/edit.html'
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
      data.field.startCreateTime =(data.field.startCreateTime=="")?null:data.field.startCreateTime+" 00:00:00";
      data.field.endCreateTime = (data.field.endCreateTime=="")?null:data.field.endCreateTime+" 24:00:00";
    //执行重载
      table.reload('table', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: {parameter:data.field}
        
      });
    return false;
  });

});