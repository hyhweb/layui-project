layui.use([ 'form','common'], function(){
  var $ = layui.$
  ,setter = layui.setter
  ,form = layui.form
  ,common = layui.common
  ,router = layui.router()
  ,search = router.search;

  form.render();

   
   $('#getsmscode').on('click',function(){
     var phone = $('[name=phone]').val();
     if(phone == ""){
      layer.msg('请输入手机号码')
      return;
     }
      var param = {
        url:'/register/sendCode/'+phone ,
        method: 'get',
        success: function(res) {
            layer.msg(res.msg)
            if (res.success) {
                 common.closeAllLayer()
            }
        }
    }
    common.ajax(param)
   })



  //提交
  form.on('submit(reg-submit)', function(data){
    if(data.field.loginPwd !==data.field.repass){
      layer.msg('确定密码与密码不一致')
      return;
    }
    data.field.loginPwd = hex_md5(data.field.loginPwd)
    var param = {
        url:'/register/carTeam' ,
        method: 'post',
        data: data.field,
        success: function(res) {
            layer.msg(res.msg)
            if (res.success) {
                 common.closeAllLayer()
                 location.href="../login/index.html";
            }
        }
    }
    common.ajax(param)

   

   
    
  });
  
 
  
});