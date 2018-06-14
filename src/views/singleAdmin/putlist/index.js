layui.use(['upload', 'form', 'table', 'api', 'laytpl'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        laytpl = layui.laytpl,
        form = layui.form,
        table = layui.table,
        api = layui.api;

    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var contractId = detail.contractId;
    
    

    
    var param = {
        url: '/order/shipCompanyContract/get/' + contractId,
        method: 'get',
        success: function(res) {

            if (res.success) {
                console.log(res.data, 'res');
                var orderType = res.data.orderType;
                laytpl(putlist.innerHTML).render(
                    res.data,
                    function(html) {
                        putlistbox.innerHTML = html;


                        var printParam = {
                            globalStyles: true,
                            mediaPrint: true,
                            stylesheet: null,
                            noPrintSelector: ".no-print",
                            iframe: true,
                            append: null,
                            prepend: null,
                            manuallyCopyFormValues: true,
                            timeout: 750,
                            title: null,
                            doctype: '<!doctype html>'
                        }
                        $('.print1').on('click', function() {
                            $("#print1").print(printParam);
                        })
                        $('.print2').on('click', function() {
                            $("#print2").print(printParam);
                        })

                        if(orderType == 0){
                            //出口
                            console.log(orderType,'orderType')
                            $('#printbox1').remove();
                        }else{
                            //进口
                           console.log(orderType,'orderType')
                            $('#printbox2').remove();
                        }


                    })




                common.setFormData($('.layui-form.edit'), res.data)


            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)




})