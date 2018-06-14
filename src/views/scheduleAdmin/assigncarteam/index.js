layui.use(['form', 'common', 'layer'], function() {
    var $ = layui.$,
        form = layui.form,
        common = layui.common,
        layer = layui.layer;
    form.render();

    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    $.when(api.getCarTeamList()).done(function(driver) {
        var driverList = driver;
        console.log(driverList, 'driverList')
        //下拉渲染
        var selectHTML = driverList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=carTeam]').append(selectHTML);

        //表单赋值
        common.setFormData($('.layui-form.edit'), { carTeam: detail[0].carTeamId })

        form.render()


    })

    var active = {
        cancel: function() {
            layer.closeAll();
        }
    };


    form.on('submit(edit)', function(data) {
        var paramData = { "scheduleIds": [], "carTeamId": null };
        paramData.carTeamId = parseInt(data.field.carTeam);
        $.each(detail, function(index, el) {
            paramData.scheduleIds.push(el.scheduleId)
        });
        var param = {
            url: '/schedule/schedule/assignCarTeam',
            method: 'post',
            data: paramData,
            success: function(res) {
                layer.msg(res.msg)
                if (res.success) {
                    common.closeAllLayer()
                    $('.search').trigger('click')
                }
            }
        }

        common.ajax(param)

        return false;
    })

    $('.layui-btn').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


})