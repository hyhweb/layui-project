layui.use(['upload', 'form','table','api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api =  layui.api;
      //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
        $.when(api.getShipCompanyList(),api.getTrailerSpceTypeList()).done(function(shipCompany,trailerSpceType){
               var shipCompanyList = shipCompany[0],
               trailerSpceTypeList = trailerSpceType[0];
               //下拉渲染
                var selectHTML = shipCompanyList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('.edit [name=shipCompanyId]').append(selectHTML);
                

                var selectHTML = trailerSpceTypeList.data.map(function(item, index) {
                    return $('<option value="' + item.value + '">' + item.text + '</option>')
                })
                $('.edit [name=spec]').append(selectHTML)





                if (mode != 1) {
                    //表单赋值
                    common.setFormData($('.layui-form.edit'), detail,null,(mode == 0?'detail':''))
                }
                form.on('select(orderType)',function(data){
                    var containerNumber = $('.containerNumber');
                    if(data.value ==1){
                        containerNumber.hide();
                        $('[name=containerNumber]').removeAttr('lay-verify');
                        
                        
                    }else{
                        containerNumber.show();
                        $('[name=containerNumber]').attr('lay-verify','required');
                    }
                    console.log(data,'data')
                })
                form.render()
                

                
        })
      

        
        

        if (mode == 2) {
            if(detail.orderType ==1){
                $('.containerNumber').hide()
            }else{
                $('.containerNumber').show()
            }
            
        } 
         if (mode == 0) {
            $('.handle-btn').remove()
        }
   
    form.render();
   
     //监听提交
    
    form.on('submit(edit)', function(data) {
            var param = data.field
            var url = ''
            if (mode == 1) {
                url = '/order/apply/save'
                param.secretKey = ""
            }else if(mode == 2){
                url = '/order/apply/update';
                param = $.extend({},detail,data.field);
            }
            if(param.orderType ==1){
                param.containerNumber="0";
            }
            
            var param = {
            url:url ,
            method: 'post',
            data: param,
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