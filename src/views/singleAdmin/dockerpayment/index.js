layui.use(['upload', 'form', 'table', 'api', 'laytpl','common'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table,
        common = layui.common,
        api = layui.api;

        var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var contractId = detail.contractId;
    var param = {
        url:'/order/dockContract/toPayDockOrderCost/'+contractId,
        method: 'get',
        success: function(res) {
          
            if (res.success) {
                var orderType = res.data.orderType;
              console.log(res.data,'res');
                laytpl(putlist.innerHTML).render(
                    res.data,
                 function(html) {
                    putlistbox.innerHTML = html;
                       


                })




                common.setFormData($('.layui-form.edit'), res.data)
                  $('.payment-btn').on('click', function(){
                    console.log('click');
                    var type = $(this).data('type');
                    active[type] ? active[type].call(this) : '';
                  });
                  if(orderType == 0){
                        //出口
                        console.log(orderType,'orderType')
                        $('#printbox1').remove();
                    }else{
                        //进口
                       console.log(orderType,'orderType')
                        $('#printbox2').remove();
                    }



            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)

    var active = {
        dockerpayment:function(){
            console.log('dddd')
            layer.confirm('确定结算？',{
                btn:['确定','取消']
            },
            function(){


                 var param = {
                        url:'/order/dockContract/payDockOrderCost/'+contractId,
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


            })
           


        }
    }





})