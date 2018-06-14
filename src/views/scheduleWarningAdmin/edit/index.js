layui.use(['upload', 'form', 'table', 'api', 'formSelects'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api = layui.api,
        formSelects = layui.formSelects;





    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode),
        detail = layui.sessionData('dialog').detail,
        userInfo = layui.sessionData('user').info,
         isAdmin = null,
         companyType = null,
         companyId = null;
         isAdmin = (userInfo == undefined)?true :userInfo.isAdmin;
         companyType = (userInfo == undefined)?0 :userInfo.companyType;
         companyId =  (userInfo == undefined)?0 :userInfo.companyId;


    function companyTypeHandle(value) {
        if (value == 0) {

            $('.shipCompanyId').hide();
            $('.dockId').hide();
            $('.trailerId').hide();

        } else if (value == 1) {
            if(mode == 2){
                detail.shipCompanyId = detail.companyId
            }
            $('.shipCompanyId').show();
            $('.dockId').hide();
            $('.trailerId').hide();

        } else if (value == 2) {
             if(mode == 2){
                    detail.dockId = detail.companyId
                }
            $('.shipCompanyId').hide();
            $('.dockId').show();
            $('.trailerId').hide();
        } else if (value == 3) {
            if(mode == 2){
                detail.trailerId = detail.companyId
            }
            $('.shipCompanyId').hide();
            $('.dockId').hide();
            $('.trailerId').show();
        }
        form.render();
    }
    if (isAdmin == false) {
        $('.companyType').remove();
        $('.shipCompanyId').remove();
        $('.dockId').remove();
        $('.trailerId').remove();
    } else {
        $('.shipCompanyId').hide();
        $('.dockId').hide();
        $('.trailerId').hide();
         if(mode == 2){
            companyTypeHandle(detail.companyType)
        }
        form.on('select(companyType)', function(data) {
            console.log(data, 'data')
            var value = data.value;
            companyTypeHandle(value)
        })
    }


    $.when(api.getDockList(), api.getShipCompanyList(),api.getCarTeamList(),api.getRoleList()).done(function(harbor, shipCompany,carTeam,role) {
        var harborList = harbor[0],
            shipCompanyList = shipCompany[0],
            carTeamList = carTeam[0],
            roleList = role[0];

        //下拉渲染
        var selectHTML = shipCompanyList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('#shipCompanyId').append(selectHTML);


        var selectHTML = harborList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })

        $('#dockId').append(selectHTML);

        var selectHTML = carTeamList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })

        $('#trailerId').append(selectHTML);

        var selectHTML = roleList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })

        $('#roleId').append(selectHTML);

        

        if (mode != 1) {
            //表单赋值
            common.setFormData($('.layui-form.edit'), detail)
        }
        form.render()

        if(mode ==2){
            var roleArr = detail.roleList.map(function(item,index){
                return item.value;
            })
            console.log(roleArr,'roleArr')
            formSelects.value('select', roleArr);    //动态赋值
        }

        



    })





    if (mode == 2) {
        $('.loginPwd').remove();
    }
    if (mode == 0) {
        $('.handle-btn').remove()
    }

    form.render();

    //监听提交

    form.on('submit(edit)', function(data) {


      
        var roleIds = formSelects.value('select','val');
        console.log(roleIds)

        if(roleIds ==undefined || roleIds.length == 0){
            layer.msg('请选择角色分类')
         return false;
        }
         data.field.roleIds = roleIds;
        var url = ''
        if (mode == 1) {
            url = '/system/user/save';
            data.field.secretKey = "";
            data.field.salt = "";
            data.field.loginPwd = hex_md5(data.field.loginPwd)
            if(isAdmin == false){
                data.field.companyId = companyId;
                data.field.companyType=companyType
            }
            
        } else if (mode == 2) {
            url = '/system/user/update';
            data.field = $.extend({}, detail, data.field);
        }
        data.field.is_admin = isAdmin;
        if (data.field.companyType == 0) {
            data.field.companyId = 0
        } else if (data.field.companyType == 1) {
            data.field.companyId = data.field.shipCompanyId
        } else if (data.field.companyType == 2) {
            data.field.companyId = data.field.dockId
        } else if (data.field.companyType == 3) {
            data.field.companyId = data.field.trailerId
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