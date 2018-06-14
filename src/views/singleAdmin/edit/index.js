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
    var contractId = detail.contractId;
    var param = {
        url:'/order/shipCompanyContract/get/'+contractId,
        method: 'get',
        success: function(res) {
          
            if (res.success) {
              console.log(res.data,'res');
                laytpl(containerList.innerHTML).render(
                    res.data,
                 function(html) {
                    view.innerHTML = html;
                })

                laytpl(timelinetpl.innerHTML).render(res.data, function(html) {
                    timeline.innerHTML = html;
                })


                common.setFormData($('.layui-form.edit'), res.data)


            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)


    //监听提交

    form.on('submit(edit)', function(data) {

        common.closeAllLayer()
        return false;
    });

})