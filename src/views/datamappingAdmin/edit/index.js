layui.use(['upload', 'form','table','api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api =  layui.api;
      //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
        
        if (mode != 1) {
            //表单赋值
            common.setFormData($('.layui-form.edit'), detail,null,(mode==0?'detail':''))
        }
        if (mode == 2) {

        } 
         if (mode == 0) {
            $('.handle-btn').remove()
        }
        var getCompany = function (id,value,name) {
            if(id==""){
                $('.edit [name=companyId]').empty();
                form.render();
                return;
            }
            var param ={
                url:'/system/user/getUserType/'+id,
                type:'get',
                success:function (res) {
                    if(res.success){
                        //下拉渲染
                        if(res.data== null){
                            res.data=[];
                        }
                        var selectHTML = res.data.map(function(item, index) {
                            return $('<option value="' + item.value + '">' + item.text + '</option>')
                        })
                        selectHTML.unshift('<option value="">请选择</option>');
                        $('.edit [name='+name+']').html(selectHTML);
                        if(value !=undefined){
                            $('.edit [name='+name+']').val(value);
                        }
                        form.render();
                        if(name =="companyIds"){
                            form.on('select('+name+')',function (data) {
                                console.log(data)
                                $('.edit [name=currentId]').val(data.value);

                                var text = "";
                                $.map(res.data,function (item,index) {
                                    if(item.value == data.value){
                                        text = item.text;
                                    }
                                })
                                $('.edit [name=currentName]').val(text)
                            })
                        }

                    }



                }
            }
            common.ajax(param);
        }
        
        form.on('select(companyType)',function (data) {
            getCompany(data.value,'','companyId');
            // $('.edit [name=currentId]').val('');
            // $('.edit [name=currentName]').val('');
        })
        form.on('select(mappingType)',function (data) {
            getCompany(data.value,'','companyIds');
            $('.edit [name=currentId]').val('');
            $('.edit [name=currentName]').val('');
        })
        if(mode ==0|| mode ==2){
            getCompany(detail.companyType,detail.companyId,'companyId');
            getCompany(detail.mappingType,detail.currentId,'companyIds');

        }
        
        
        
   
    form.render();
   
     //监听提交
    
    form.on('submit(edit)', function(data) {
            
            var url = ''
            if (mode == 1) {
                url = '/base/mapping/save'
                data.field.secretKey = ""
            }else if(mode == 2){
                url = '/base/mapping/update';
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