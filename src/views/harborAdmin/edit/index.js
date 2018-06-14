layui.use(['upload', 'form', 'common', 'table'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        common = layui.common;
   
    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail
    if (mode != 1) {
        common.setFormData($('.layui-form.edit'),detail,null,(mode == 0?'detail':''))
        if (mode == 2) {

        } else if (mode == 0) {
            $('.handle-btn').remove()
        }
    }
    form.render();
    
    //监听提交
    
    form.on('submit(edit)', function(data) {
        var url = ''
        if (mode == 1) {
            url = '/base/harbor/save'
            data.field.secretKey = "111"
        }else if(mode == 2){
            url = '/base/harbor/update';
            data.field = $.extend({},detail,data.field);
        }

        var param = {
            url:url ,
            method: 'post',
            data: data.field,
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