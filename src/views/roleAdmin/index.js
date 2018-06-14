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
        url: common.baseUrl + '/system/role/pageList',
        cols: [
            [
                { checkbox: true },
                { field: 'roleCode', width: 150, title: '角色代码' }, 
                { field: 'name', width: 150, title: '角色名称' }, 
                { field: 'companyTypeName', width: 150, title: '用户分类' },
                { field: 'companyName', width: 120, title: '公司名称' },
                { field: 'userNames', title: '用户账户', minWidth: 150 },
                 { field: 'statusName', width: 100, title: '状态' }
            ]
        ],
        id: 'table'
    });



    table.render(tableParam);

    var $ = layui.$,
        active = {
            openDialog: function(handle) { //获取选中数据

                var title = "";
                if (handle == "1") {
                    title = "新建角色"
                } else {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });

                    if (handle == "2") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "编辑角色";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });
                 if (handle == "1" || handle == "2") {
                       common.dialog({
                        title: title,
                        area: ['800px', ''],
                        maxmin: true,
                        url: '../roleAdmin/edit/edit.html'
                    }) 
                 }

                 if (handle == "3") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                       common.dialog({
                        title: "权限分配",
                        area: ['800px', ''],
                        maxmin: true,
                        url: '../roleAdmin/assignPermissions/index.html'
                    }) 
                 }


                 



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