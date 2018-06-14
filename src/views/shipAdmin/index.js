layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common','api'], function() {
    var table = layui.table,
        $ = layui.$,
        element = layui.element,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        api = layui.api,
        common = layui.common;
        api.getHarborList().then(function(res){
         var selectHTML = res.data.map(function(item,index){
             return $('<option value="'+item.value+'">'+item.text+'</option>')
          })
          $('[name=harborId]').append(selectHTML)
          form.render('select')
        })
        
    var tableParam = $.extend({}, {
            elem: '#table',
            id: 'table',
            url: common.baseUrl + '/base/shipCompany/pageList',
            cols: [
                [
                    { checkbox: true},
                    { field: 'shipCompanyName', minWidth: 120, title: '船公司网点名称', sort: true }, { field: 'address', minWidth: 120, title: '地址' }, { field: 'harborName', width: 100, title: '所属港区', sort: true }, { field: 'parentName', width: 120, title: '所属船公司' }, { field: 'contacts', title: '联系人', minWidth: 150 }, { field: 'phone', minWidth: 120, title: '联系电话' }, { field: 'createTimeText', minWidth: 150, title: '入驻时间' }, { field: 'statusName', width: 100, title: '状态' }
                ]
            ]
        },
        common.tableConfig);
    table.render(tableParam);
    var $ = layui.$,
        active = {
            openDialog: function(handle) { //获取选中数据
                var title = "";
                if (handle == "1") {
                    title = "新建船公司"
                } else {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });

                    if (handle == "2") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "编辑船公司";
                    } else if (handle == "0") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "船公司信息";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });
                common.dialog({
                    title: title,
                    area: ['800px',''],
                    maxmin: true,
                    url: '../shipAdmin/edit/edit.html'
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