layui.use(['upload', 'form', 'common', 'table', 'api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        common = layui.common,
        api = layui.api;

        //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
        $.when(api.getHarborList(),api.getShipCompanyList()).done(function(harbor,shipCompany){
               console.log(harborList,shipCompanyList)
               var harborList = harbor[0],
               shipCompanyList = shipCompany[0];
               //所属港区下拉渲染
                var selectHTML = harborList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('.edit [name=harborId]').append(selectHTML)

                //所属港区下拉渲染
                var selectHTML = shipCompanyList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('.edit [name=parentId]').append(selectHTML)


                if (mode != 1) {
                    //表单赋值
                    common.setFormData($('.layui-form.edit'), detail,null,(mode == 0?'detail':''))
                }
                form.render()
                

                
        })
      

        
        

        if (mode == 2) {

        } 
         if (mode == 0) {
            $('.handle-btn').remove()
        }
   
    form.render();

    //监听提交

    form.on('submit(edit)', function(data) {
        var url = ''
        if (mode == 1) {
            url = '/base/shipCompany/save'
            data.field.secretKey = "111"
        } else if (mode == 2) {
            url = '/base/shipCompany/update';
            data.field = $.extend({},detail,data.field);
        }

        var param = {
            url: url,
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