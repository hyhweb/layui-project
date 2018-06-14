layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api;



    var userInfo = layui.sessionData('user').info,
        isAdmin = userInfo.isAdmin;
    if (isAdmin == false) {
        $('.companyType').remove();
    }

    form.render();

    var tableParam = $.extend({}, common.tableConfig, {
        elem: '#table',
        url: common.baseUrl + '/system/user/pageList',
        cols: [
            [
                { checkbox: true},
                { field: 'companyTypeName', width: 120, title: '平台名称', sort: true }, 
                { field: 'roleNames', title: '订单编号',minWidth: 150 }, 
                { field: 'realName', width: 150, title: '发起人' }, 
                { field: 'loginName', title: '接收人', width: 150 },
                 { field: 'phone', minWidth: 120, title: '预警类别' }, 
                 { field: 'statusName', width: 100, title: '提交时间' }, 
                 { field: 'statusName', width: 100, title: '超过时间' }, 
                 { field: 'statusName', width: 100, title: '预警等级' }, 
                 { field: 'statusName', width: 100, title: '操作',templet:'#toolbar' }
            ]
        ],
        id: 'table',
        page: true
    });



    table.render(tableParam);

    var $ = layui.$,
        active = {
            openDialog: function(handle) { //获取选中数据

                var title = "";
                if (handle == "1") {
                    title = "新建用户"
                } else {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });

                    if (handle == "2") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "编辑用户";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });

                common.dialog({
                    title: title,
                    area: ['800px', ''],
                    maxmin: true,
                    url: '../userAdmin/edit/edit.html'
                })



            }
        };

    $('.layui-btn').on('click', function() {
        var type = $(this).data('type'),
            handle = $(this).data('handle');
        active[type] ? active[type].call(this, handle) : '';
    });


    //监听提交
    form.on('submit(search)', function(data) {
        console.log(JSON.stringify({ parameter: data.field }))
        //执行重载
        table.reload('table', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: { parameter: data.field }

        });
        return false;
    });

});