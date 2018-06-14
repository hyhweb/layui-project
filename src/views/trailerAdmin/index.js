layui.use(['element','form', 'layedit', 'laydate','table','common','api'], function(){
  var table = layui.table
  $ = layui.$
  ,element = layui.element
  ,form = layui.form
  ,layer = layui.layer
  ,laydate = layui.laydate
  ,common =  layui.common,
  api = layui.api;
  
   //日期
  laydate.render({
    elem: '#date'
  });


$.when(api.getDriverList(),api.getTrailerSpceTypeList()).done(function(harbor,trailerSpceType){
               var harborList = harbor[0],
               trailerSpceTypeList = trailerSpceType[0];
               //司机下拉渲染
                var selectHTML = harborList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=driverId]').append(selectHTML)
                //拖车规格下拉渲染
                var selectHTML = trailerSpceTypeList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=spec]').append(selectHTML)
                form.render()
                

                
        })



  var tableParam =$.extend({},{
    elem: '#table'
    ,url:common.baseUrl+'/base/trailer/pageList'
    ,cols: [[
      {checkbox: true, fixed: true},
      {field:'plateNumber', minWidth: 120, title: '车牌号', sort: true}
      ,{field:'driverName', minWidth: 120, title: '司机'}
      ,{field:'phone', minWidth: 120, title: '手机号码'}
      ,{field:'specName', title: '拖车规格', minWidth: 150}
      ,{field:'trailerPayload', width:100, title: '载重（T）'}
      ,{field:'horsePower', width:100, title: '马力（匹）'}
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
            title = "新建拖车"
        } else{
          var checkStatus = table.checkStatus('table'),
            data = checkStatus.data;
            layui.sessionData('dialog',{key:'detail',value:data[0]});
            
            if (handle == "2") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "编辑拖车";
            }
          
        }
        layui.sessionData('dialog',{key:'mode',value:handle});

        common.dialog({
          title:title,
          area:['800px',''],
          maxmin:true,
          url:'../trailerAdmin/edit/edit.html'
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