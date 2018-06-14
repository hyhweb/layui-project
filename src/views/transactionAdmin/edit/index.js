layui.use(['upload', 'form', 'table', 'api', 'common','laytpl'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        common = layui.common,
        laytpl = layui.laytpl,
        api = layui.api;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var transactionId = detail.transactionId;
    var param = {
        url: '/order/transaction/get/' + transactionId,
        method: 'get',
        success: function(res) {
            if (res.success) {
                common.setFormData($('.layui-form.edit'), res.data)
                detail = res.data;
                laytpl(costListtpl.innerHTML).render({costList:res.data.costList.reverse()},function(html){
                    $('.amount').after(html)
                })
            } else {
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)





    if (mode == 2) {

    }
    if (mode == 0) {
        $('.handle-btn').remove()
    }

    form.render();




    var tableParam = $.extend({}, common.tableConfig, {
        elem: '#detailtable',
        url: common.baseUrl + '/order/transaction/detailList',
        where: { parameter: { transactionId: detail.transactionId } },
        cols: [
            [
                { checkbox: true, fixed: true },
                { field: 'bookSpaceNo', minWidth: 120, title: '订舱单号', sort: true }, { field: 'orderTypeName', widbookSpaceNoh: 150, title: '业务类型' }, { field: 'containerNo', minWidth: 120, title: '箱号' }, { field: 'containerTypeName', title: '箱型', minWidth: 150 }, { field: 'leadSealNo', width: 100, title: '铅封号' }
            ]
        ],
        id: 'detailtable',
        page: true
    });



    table.render(tableParam);









    //监听提交

    form.on('submit(edit)', function(data) {

        var url = ''
        if (mode == 1) {
            url = '/base/trailer/save'
            data.field.secretKey = ""
        } else if (mode == 2) {
            url = '/base/trailer/update';
            data.field = $.extend({}, detail, data.field);
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