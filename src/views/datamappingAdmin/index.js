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
    ,url:common.baseUrl+'/base/mapping/pageList'
    ,cols: [[
      {checkbox: true, fixed: false},
      {field:'currentName', minWidth: 120, title: '当前系统名称'}
      ,{field:'originalName', minWidth: 120, title: '原系统名称'}
      ,{field:'currentId', minWidth: 120, title: '当前系统名称ID'}
      ,{field:'originalId', minWidth: 120, title: '原系统名称ID'}
      ,{field:'mappingTypeName', minWidth: 120, title: '数据类型'}
      ,{field:'companyTypeName', title: '公司类型', minWidth: 150}
      // ,{field:'createrName', width:100, title: '创建人'}
      // ,{field:'createTimeText', width:100, title: '创建时间'}
      // ,{field:'updaterName', width:100, title: '更新人'}
      // ,{field:'updateTimeText', width:100, title: '更新时间'}
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
            title = "新建第三方数据映射"
        } else{
          var checkStatus = table.checkStatus('table'),
            data = checkStatus.data;
            layui.sessionData('dialog',{key:'detail',value:data[0]});
            
            if (handle == "2") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "编辑第三方数据映射";
            }

            if (handle == "0") {
                if(data.length !=1){
                  layer.msg('请选择一条数据进行操作');
                  return;
                }
                title = "第三方数据映射详情";
            }
          
        }
        layui.sessionData('dialog',{key:'mode',value:handle});
        if(handle == 0 || handle == 1 ||handle == 2 ){
            common.dialog({
              title:title,
              area:['800px',''],
              maxmin:true,
              url:'../datamappingAdmin/edit/edit.html'
            })
      }

      /*if(handle ==3){

                    layer.confirm('确定要删除此数据吗?',{
                        btn:['确定','取消']
                    },
                    function(){
                        var ids = $.map(data,function(item,index){
                            return item.currentId
                        })
                            var param = {
                                url: '/base/mapping/delByIds',
                                method: 'post',
                                data: ids,
                                success: function(res) {
                                    layer.msg(res.msg)
                                    if (res.success) {
                                        common.closeAllLayer()
                                        //执行重载table
                                        table.reload('table', {
                                            page: {
                                                curr: 1 //重新从第 1 页开始
                                            },
                                            where: {}
                                        });
                                    }
                                }
                            }
                            common.ajax(param)
                    })
                    
                 }*/





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