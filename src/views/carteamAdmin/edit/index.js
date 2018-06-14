layui.use(['upload', 'form', 'common', 'table'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        common = layui.common;
   
    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail
    if (mode != 1) {
        common.setFormData($('.layui-form.edit'), detail,null,(mode == 0||mode==3?'detail':''))
        if (mode == 2) {

        } else if (mode == 0) {
            $('.handle-btn').remove()
        }
    }
    if(mode == 0||mode == 3){
        $('#business-license,#agreement').remove();
        $('#file-prev .layui-layer-setwin').hide();
        $('#image-prev .layui-layer-setwin').hide();
        
    }
    form.render();
    

    //上传合作协议
    upload.render({
        elem: '#agreement',
        url: common.baseUrl+'/common/fileUpload/upload',
        accept: 'file', //普通文件
     
        multiple: true,
        before: function(obj){
        },
        done: function(res){
            var imagesStr = $('[name=cooperationAgreementImages]').val();
                if(imagesStr == ""){
                 imagesStr = res.data.fullUrl
                }else{
                 imagesStr += ","+res.data.fullUrl
                }
                $('[name=cooperationAgreementImages]').val(imagesStr);
            if(res.success){
                $('#file-prev').prepend('<div style="position: relative;"><a style="padding-top:10px;display: block;" target="blank" href='+res.data.fullUrl+'>'+res.data.fullUrl.split('/').slice(-1)+'</a><span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a></span></div>')
            }
            layer.msg(res.msg)
           
        }
        
    });

    // 上传营业执照
    upload.render({
        elem: '#business-license',
        url: common.baseUrl+'/common/fileUpload/upload',
     
        multiple: true,
        before: function(obj){
              //预读本地文件示例，不支持ie8
             // obj.preview(function(index, file, result){
                
             //  });
        },
        done: function(res) {
            if(res.success){
                var imagesStr = $('[name=businessLicenseImages]').val();
                if(imagesStr == ""){
                 imagesStr = res.data.fullUrl
                }else{
                 imagesStr += ","+res.data.fullUrl
                }
                $('[name=businessLicenseImages]').val(imagesStr);
                $('#image-prev').prepend('<div class="layui-upload-img" style="position:relative;width:100px;height:100px;margin-right:20px;display: inline-block;"><img style="width:100px;height:100px;" src="'+ res.data.fullUrl +'" ><span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close2" href="javascript:;"></a></span></div>')
            }
            layer.msg(res.msg)
            
        }
    });
    //监听提交



    
    form.on('submit(edit)', function(data) {


        var url = '';
        var dataParam =  {};
        if (mode == 1) {
            dataParam = data.field;
            url = '/base/carTeam/save';
            dataParam.secretKey = "";
            dataParam.status = 0;
        }else if(mode == 2){
            dataParam = data.field;
            url = '/base/carTeam/update'
            dataParam = $.extend({},detail,data.field);
             
        } else if(mode == 3){
            url = '/base/carTeam/shipCompanyUpdateCost';
            dataParam =  {carTeamId:detail.carTeamId,pass:true}
        }

        var param = {
            url:url ,
            method: 'post',
            data: dataParam,
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


    //自定义验证规则  
  form.verify({    
        fileRequired:  [
          /[\S]+/
          ,'上传合作协议必填项不能为空'
        ]
        ,imageRequired:  [
          /[\S]+/
          ,'上传营业执照必填项不能为空'
        ] 
  });  

})