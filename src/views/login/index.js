layui.use(['form', 'common'], function () {
    var $ = layui.$
        , setter = layui.setter
        , form = layui.form
        , common = layui.common
        , router = layui.router()
        , search = router.search;


//访问量
    $("#visit").attr("src", common.baseUrl + "/statistics/visit/save");

    $.ajaxSetup({
        beforeSend: function (XMLHttpRequest) {　　　　 //可以设置自定义标头
            XMLHttpRequest.setRequestHeader('x-access-token', layui.sessionData('token').info);
        },
    })
    form.render();


    $('#getsmscode').on('click', function () {
        var phone = $('[name=phone]').val();
        if (phone == "") {
            layer.msg('请输入手机号码')
            return;
        }
        var param = {
            url: '/userLogin/sendCode/' + phone,
            method: 'get',
            success: function (res) {
                layer.msg(res.msg)
                if (res.success) {
                    common.closeAllLayer()
                }
            }
        }
        common.ajax(param)
    })


    //         AES加密
    function encryptByAES(message, key) {
        //把私钥转换成16进制的字符串
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var options = {
            iv: keyHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
        //模式为ECB padding为Pkcs7
        var encrypted = CryptoJS.AES.encrypt(message, keyHex, options);
        return base64.encode(encrypted.ciphertext.toString());

    }

    console.log(encryptByAES("message", "key"), 'encryptByAES(message,key)')
    //提交
    form.on('submit(login-submit)', function (data) {
        data.field.loginPwd = hex_md5(data.field.loginPwd)

        var str = JSON.stringify(data.field);

        console.log(data)

        var param = {
            url: '/userLogin/getSecretKey/' + data.field.phone,
            method: 'get',
            success: function (res) {
                if (res.success) {
                    var key = res.data;

                    var param = {
                        url: '/userLogin/login/' + data.field.phone,
                        method: 'post',
                        data: encryptByAES(str, key),
                        success: function (res) {
                            layer.msg(res.msg)
                            if (res.success) {
                                var data = res.data.user;
                                layui.sessionData('user', {key: 'info', value: res.data.user});
                                layui.sessionData('token', {key: 'info', value: res.data.token});
                                common.closeAllLayer()


                                var param = {
                                    url: '/system/user/getPermissionCodeList',
                                    type: 'post',
                                    success: function (res) {
                                        if (res.success) {
                                            var permissionArr = res.data;
                                            layui.sessionData('permission', {key: 'info', value: permissionArr})
                                            console.log(res, 'permission');
                                            if (data.companyType == 0) {
                                                //平台
                                                location.href = "../main/index.html"
                                            } else if (data.companyType == 3) {
                                                //拖车公司
                                                location.href = "../main/index.html#hometotrailer/index.html"
                                            }

                                        }

                                    }
                                }
                                common.ajax(param)


                            }
                        }
                    }
                    common.ajax(param)

                }
            }
        }


        common.ajax(param)


    });


});