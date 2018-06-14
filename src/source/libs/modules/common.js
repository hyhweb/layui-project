layui.define(function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  var $ = layui.$,
  layer = layui.layer;
  var common = {
    baseUrl: 'http://10.1.0.93:8080/yunbandan/admin',
    // baseUrl: 'http://localhost:8080/yunbandan/admin',
    // baseUrl: 'http://47.106.203.151:60080/yunbandan/admin',
    loginType:sessionStorage.getItem('loginType'),
    tableConfig:{
      method:'post'
    ,contentType:'application/json'
    ,where:{parameter:{}}
    ,page: true
    ,request:{
       pageName: 'page' //页码的参数名称，默认：page
       ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
    }, response: {
      statusName: 'code' //数据状态的字段名称，默认：code
      , statusCode: 0 //成功的状态码，默认：0
      , msgName: 'msg' //状态信息的字段名称，默认：msg
      , countName: 'count' //数据总数的字段名称，默认：count
      , dataName: 'data'//数据列表的字段名称，默认：data
    }
    },
    dialog:function(option){
    	$.ajax({
    		url:option.url,
    		success:function(res){
    			var param = $.extend({},{
		          type: 1, 
		          content:res
		        },option);
    			if(option.isfull){
            var index = layer.open(param);
            layer.full(index);
          }else{
            layer.open(param);
          }
    		
    	}
    	})
		
    },
    closeAllLayer:function(time){
      if(time == undefined){
        time = 1
      }
      setTimeout(function(){
        layer.closeAll();
      },1000*time)
    },
    getFormData:function (form) {
       var formData = {}, arr = form.serializeArray();
       $.each(arr,function (index,item) {
            formData[item.name] = item.value
       })
        return formData;
    },
    setFormData(form,data,callback,mode){
       form.find('[name]').each(function(key,item){
          var name =  $(item).attr('name'),
          type = $(item).attr('type'),
          tag = $(item)[0].tagName.toLowerCase();
         
          if(type == "radio"){
            $("[name="+name+"][value="+data[name]+"]").attr("checked",true); 
          }else if(type == "label"){
          		$(item).html(data[name])
          }else if(type=="fileprev"){
                
              var name = name.slice(0,-4);
              $("[name="+name+"]").val(data[name]);
              if(data[name]){
                var arr = data[name].split(',');
                var fileList = arr.map(function(item,index){
                   return $('<div style="position: relative;"><a style="padding-top:10px;display: block;" target="blank" href='+item+'>'+item.split('/').slice(-1)+'</a><span class="layui-layer-setwin"  index="'+index+'"><a class="layui-layer-ico layui-layer-close1" href="javascript:;"></a></span></div>')
                })
                $(item).prepend(fileList);
                $(item).find('.layui-layer-setwin').off().on('click',function(){
                  var key =  $(this).index()-1;
                  var valList = $("[name="+name+"]").val().split(',');
                  valList.splice(key,1);
                  $("[name="+name+"]").val(valList);
                  $(this).parent().remove();
                })
              }
          }else if(type=="imageprev"){
              var name = name.slice(0,-4);
              $("[name="+name+"]").val(data[name]);
              if(data[name]){
                var arr = data[name].split(',');
                var imageList = arr.map(function(item,index){
                   return $('<div class="layui-upload-img" style="position:relative;width:100px;height:100px;margin-right:20px;display: inline-block;">'+
                   '<a style="display:inline-block;" target="blank" href="'+item+'">'+
                    '<img style="width:100px;height:100px;" src="'+item+'" >'+
                    '</a>'+
                    '<span class="layui-layer-setwin" index="'+index+'">'+
                    '<a class="layui-layer-ico layui-layer-close2" href="javascript:;"></a></span></div>')
                })
                $(item).prepend(imageList);
                 $(item).find('.layui-layer-setwin').off().on('click',function(){
                  var key =  $(this).index()-1;
                  var valList = $("[name="+name+"]").val().split(',');
                  valList.splice(key,1);
                  $("[name="+name+"]").val(valList);
                  $(this).parent().remove();
                })
                
              }
          }else if(type =="label"){
              $(item).html(data[name])
          }else{
             $(item).val(data[name])
          }
           if(mode =="detail"){
            $(item).attr('disabled',true);
          }
          
       })
       if(callback){
        callback()
       }
    },
    resetFormData:function (form) {
        form[0].reset();
    },
    export:function (url,form) {
        var param =form.serialize();
        param =param+'&Authorization='+sessionStorage.getItem('token');
        window.open(common.baseUrl+url+'?'+param)
    },
    ajax: function (options) {
      console.log(JSON.stringify(options.data),'param')
        var option = $.extend({},options,{
            url:common.baseUrl+options.url,
            dataType:'json',
            data:JSON.stringify(options.data),
            contentType:'application/json'
        })
      return  $.ajax(option)
    }
  


  };
  

  exports('common', common);
}); 

