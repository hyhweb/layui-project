layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api;



    var userInfo = layui.sessionData('user').info;

    form.render();

    var tableParam = $.extend({}, common.tableConfig, {
        elem: '#table',
        url: common.baseUrl + '/system/permission/pageList',
        cols: [
            [
                { checkbox: true },
                { field: 'name', width: 120, title: '权限名称' }, 
                { field: 'code', title: '权限编码' },
                { field: 'createrName', title: '创建人名称' },
                { field: 'createTimeText',  title: '创建时间' }, 
                { field: 'updaterName', title: '更新人名称' },
                { field: 'updateTimeText',  title: '更新时间' }
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
                    title = "新建权限"
                } else {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });

                    if (handle == "2" || handle == 0) {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "编辑权限";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });
 

                if(handle ==1 || handle ==2 || handle ==0){
                    common.dialog({
                        title: title,
                        area: ['800px', ''],
                        maxmin: true,
                        url: '../permissionAdmin/edit/edit.html'
                    }) 
                }
                 if(handle ==3){

                    layer.confirm('确定要删除此权限吗?',{
                        btn:['确定','取消']
                    },
                    function(){
                        var ids = $.map(data,function(item,index){
                            return item.permissionId
                        })
                            var param = {
                                url: '/system/permission/delByIds',
                                method: 'post',
                                data: ids,
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