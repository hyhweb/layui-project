layui.use(['upload', 'form','table','api','laytpl'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        laytpl = layui.laytpl,
        api =  layui.api;
      //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
       var contractId = detail.contractId;
    var param = {
        url:'/order/dockContract/get/'+contractId,
        method: 'get',
        success: function(res) {
          
            if (res.success) {
                
                var data = $.map(res.data.contractDetailsList,function(item,index){
                    item.goodsName =  res.data.goodsName;
                    if(item.isApply ==false){
                      return item;
                    }
                    
                })


              var tableParam =$.extend({},
              common.tableConfig,{
                elem: '#detailtable'
                ,page:false
                ,cols: [[
                  {checkbox: true},
                  {field:'contractDetailsId', minWidth: 100, title: 'ID'},
                  {field:'containerNo', minWidth: 100, title: '箱号'}
                  ,{field:'leadSealNo', minWidth: 100, title: '封号'}
                  ,{field:'goodsName', minWidth: 100, title: '货名'}
                  ,{field:'containerTypeName', minWidth: 100, title: '箱型'}
                  ,{field:'isApply', minWidth: 100, title: '状态',templet:"<div>{{ d.isApply == true ?'已申请码头办单':'未申请码头办单'}}</div>"}
                ]],
                data:data
                ,id: 'detailtable'
              });
               
                
              table.render(tableParam);
            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)
     //监听提交
    
    form.on('submit(edit)', function(data) {
            var checkStatus = table.checkStatus('detailtable'),
            data = checkStatus.data;
            if(data.length == 0){
              layer.msg('请勾选要提交码头办单的集装箱')
              return;
            }
            var containerNoArr =  $.map(data,function(item,index){
                if(item.isApply == true){
                  return item.containerNo
                }
             })
            if(containerNoArr.length != 0){
              layer.msg('箱号：'+containerNoArr.join()+'已申请码头办单，不能重复申请')
              return;
            }

            var contractDetailsIds = $.map(data,function(item,index){
              return item.contractDetailsId;
            })
          

            var url = '/order/shipCompanyContract/applyDockOrder'
            var param = {
            url:url ,
            method: 'post',
            data: {contractId:contractId,contractDetailsIds:contractDetailsIds},
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
        return false;
    });

})