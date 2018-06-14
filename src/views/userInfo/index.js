layui.use(['upload', 'form','api','common'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        common = layui.common,
        api =  layui.api;
           //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var id = layui.sessionData('user').info.userId;
    var detail ={};
    var param = {
        url:'/system/user/get/'+id ,
        method: 'get',
        success: function(res) {
            if (res.success) {
                detail = res.data;
                common.setFormData($('.layui-form.edit'), res.data)
                form.render()

            }
        }
    }
    common.ajax(param)



    //监听提交

    form.on('submit(edit)', function(data) {
        var paramData = $.extend({},detail,data.field)
        var param = {
            url:'/system/user/update' ,
            method: 'post',
            data: paramData,
            success: function(res) {
                layer.msg(res.msg)
                if (res.success) {
                    common.closeAllLayer()

                }
            }
        }
        common.ajax(param)
        return false;
    });

})