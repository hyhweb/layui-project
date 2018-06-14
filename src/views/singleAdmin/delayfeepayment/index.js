layui.use(['upload', 'form', 'table', 'api', 'laytpl'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table,
        api = layui.api;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
   var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var contractId = detail.contractId,orderStatus = detail.orderStatus;
    var url = ""
    if(orderStatus ==4 ){
        url = '/order/dockContract/toPayShipCompanyDelayCost/';
    }else if(orderStatus == 6){
        url = '/order/dockContract/toPayDockDelayCost/';
    }

    var param = {
        url:url+contractId,
        method: 'get',
        success: function(res) {
          
            if (res.success) {
                laytpl(containerList.innerHTML).render(
                    res.data.contract,
                 function(html) {
                    view.innerHTML = html;
                })
                res.data.delayCost.orderStatus = res.data.contract.orderStatus
                laytpl(feetpl.innerHTML).render(res.data.delayCost, function(html) {
                    fee.innerHTML = html;
                })


                common.setFormData($('.layui-form.edit'), res.data.contract)


            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)


    //监听提交

    form.on('submit(edit)', function(data) {
        layer.confirm('确定结算？', {
                btn: ['确定', '取消']
            },
            function() {
                var url = "";
                if(orderStatus ==4 ){
                    url = '/order/dockContract/payShipCompanyDelayCost/';
                }else if(orderStatus == 6){
                    url = '/order/dockContract/payDockDelayCost/';
                }
                 
                var param = {
                    url: url + contractId,
                    method: 'get',
                    success: function(res) {

                        if (res.success) {
                            common.closeAllLayer();
                            //执行重载table
                            table.reload('dockertable', {
                                page: {
                                    curr: 1 //重新从第 1 页开始
                                },
                                where: {}
                            });
                        }
                        layer.msg(res.msg);
                    }
                }
                common.ajax(param)


            }
        )




        return false;
    });

})