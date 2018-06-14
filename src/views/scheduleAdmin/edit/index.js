layui.use(['upload', 'form','table','api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api =  layui.api;
      //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
        $.when(api.getDriverList(),api.getTrailerSpceTypeList()).done(function(harbor,trailerSpceType){
               var harborList = harbor[0],
               trailerSpceTypeList = trailerSpceType[0];
               //司机下拉渲染
                var selectHTML = harborList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=driverId]').append(selectHTML);
                form.on('select(driverId)', function(data){
                    console.log(data.value)
                    var phone = ""
                    $.map(harborList.data,function(item,index){
                        if(item.value == data.value ){
                            phone = item.other;
                        }
                    })
                    $('[name=phone]').val(phone)
                })
                

                //拖车规格下拉渲染
                var selectHTML = trailerSpceTypeList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('[name=spec]').append(selectHTML)





                if (mode != 1) {
                    //表单赋值
                    common.setFormData($('.layui-form.edit'), detail)
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
                url = '/base/trailer/save'
                data.field.secretKey = ""
            }else if(mode == 2){
                url = '/base/trailer/update';
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