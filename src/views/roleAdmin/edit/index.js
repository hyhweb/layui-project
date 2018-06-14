layui.use(['upload', 'form', 'table', 'api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api = layui.api;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode),
        detail = layui.sessionData('dialog').detail,
        userInfo = layui.sessionData('user').info,
        isPublic = false,
        isAdmin = null,
        companyType = null,
        companyId = null;
    isAdmin = userInfo.isAdmin;
    companyType = userInfo.companyType;
    companyId = userInfo.companyId;




    function companyTypeHandle(value) {
        if (value == 0) {

            $('.shipCompanyId').hide();
            $('.dockId').hide();
            $('.trailerId').hide();

        } else if (value == 1) {
            if (mode == 2) {
                detail.shipCompanyId = detail.companyId
            }
            console.log(isPublic)
            if(isPublic){
                $('.shipCompanyId').hide();
            }else{
                $('.shipCompanyId').show();
            }
            $('.dockId').hide();
            $('.trailerId').hide();

        } else if (value == 2) {
            if (mode == 2) {
                detail.dockId = detail.companyId
            }
            if(isPublic){
                $('.dockId').hide();
            }else{
                $('.dockId').show();
            }
            $('.shipCompanyId').hide();
            $('.trailerId').hide();
        } else if (value == 3) {
            if (mode == 2) {
                detail.trailerId = detail.companyId
            }
            if(isPublic){
                $('.trailerId').hide();
            }else{
                $('.trailerId').show();
            }
            $('.shipCompanyId').hide();
            $('.dockId').hide();

        }
        form.render();
    }
    if (isAdmin == false) {
        $('.companyType').remove();
        $('.shipCompanyId').remove();
        $('.dockId').remove();
        $('.trailerId').remove();
        $('.isPublic').remove();
    } else {
        $('.shipCompanyId').hide();
        $('.dockId').hide();
        $('.trailerId').hide();
        if(mode == 2){
            companyTypeHandle(detail.companyType);
            isPublic = detail.isPublic;
            if(isPublic){
                $('.shipCompanyId').hide();
                $('.dockId').hide();
                $('.trailerId').hide();
                $('[name=shipCompanyId]').val('');
                $('[name=dockId]').val('');
                $('[name=trailerId]').val('');
                form.render()
            }
        }

        form.on('radio(isPublic)',function (data) {
            console.log(data.value)
            isPublic = eval(data.value);
            if(isPublic){
                $('.shipCompanyId').hide();
                $('.dockId').hide();
                $('.trailerId').hide();
                $('[name=shipCompanyId]').val('');
                $('[name=dockId]').val('');
                $('[name=trailerId]').val('');
                form.render()
            }else{
                if(companyType ==1){
                    $('.shipCompanyId').show();
                }else if(companyType ==2){
                    $('.dockId').show();
                }else if(companyType ==3){
                    $('.trailerId').show();
                }
            }

        })

        form.on('select(companyType)', function(data) {
            console.log(data, 'data')
            var value = data.value;
            companyType = value;
            companyTypeHandle(value)
        })
    }




    $.when(api.getHarborList(), api.getShipCompanyList(), api.getCarTeamList()).done(function(harbor, shipCompany, carTeam) {
        var harborList = harbor[0],
            shipCompanyList = shipCompany[0],
            carTeamList = carTeam[0];

        //司机下拉渲染
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
            url = '/system/role/save';
            if(isAdmin == false){
                data.field.companyId = companyId;
                data.field.companyType=companyType
            }
            
        } else if (mode == 2) {
            url = '/system/role/update';
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
        if(isPublic){
              data.field.companyId = null;
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