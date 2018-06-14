layui.use(['upload', 'form', 'table', 'api', 'laytpl', 'common'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table,
        common = layui.common,
        api = layui.api;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var contractId = detail.contractId;
    var param = {
        url: '/order/shipCompanyContract/toPayShipCompanyOrderCost/' + contractId,
        method: 'get',
        success: function(res) {

            if (res.success) {
                console.log(res.data, 'res');
                laytpl(containerList.innerHTML).render(
                    res.data,
                    function(html) {
                        view.innerHTML = html;
                    })
                common.setFormData($('.layui-form.edit'), res.data.contract)
                  $('.feeDetail').on('click',function(){
                        var index = $(this).data('index');
                        var costDetailsList =  res.data.contract.contractDetailsList[index].costDetailsList;
                        layui.sessionData('dialog',{key:'feedetail',value:costDetailsList});
                        common.dialog({
                            title: '费用明细',
                            area: ['600px', '400px'],
                            maxmin: true,
                            url: '../singleAdmin/feedetail/index.html'
                        })
                        console.log(costDetailsList,'costDetailsList')
                    })

            } else {
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

                var param = {
                    url: '/order/shipCompanyContract/payShipCompanyOrderCost/' + contractId,
                    method: 'get',
                    success: function(res) {

                        if (res.success) {
                            common.closeAllLayer();
                            //执行重载table
                            table.reload('table', {
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