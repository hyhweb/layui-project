layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api;

    //日期
    laydate.render({
        elem: '#createTime',
        type:'month'
    });


    $.when(api.getCarTeamList()).done(function(carTeam) {
        var  carTeamList = carTeam;
        //下拉渲染
         var selectHTML = carTeamList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=carteamId]').append(selectHTML)

        form.render()
    })



    var tableParam = $.extend({}, {
            elem: '#table',
            url: common.baseUrl + '/order/transaction/pageList',
            cols: [
                [
                    { checkbox: true, fixed: true },
                    { field: 'transactionNo', minWidth: 150, title: '拖车公司', sort: true }, 
                    { field: 'createTimeText', width: 150, title: '业务类型' }, 
                    { field: 'amount', minWidth: 120, title: '办单年月' }, 
                    { field: 'transactionTypeName', title: '订舱单号', minWidth: 150 }, 
                    { field: 'remark', width: 100, title: '船公司' }, 
                    { field: 'operaterName', width: 100, title: '码头' }, 
                    { field: 'transactionStatusName', width: 100, title: '办单状态' }
                ]
            ],
            id: 'table',
            page: true
        },
        common.tableConfig);



    table.render(tableParam);

    var $ = layui.$,
        active = {
            openDialog: function(handle) { //获取选中数据

                if (handle == "0") {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });
                    if (data.length != 1) {
                        layer.msg('请选择一条数据进行操作');
                        return;
                    }

                    layui.sessionData('dialog', { key: 'mode', value: handle });

                    common.dialog({
                        title: '',
                        area: ['900px', ''],
                        maxmin: true,
                        url: '../transactionAdmin/edit/edit.html'
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

        if (data.field.createTime == "") {
            data.field.startCreateTime = "";
            data.field.endCreateTime = "";
        } else {
            var arr = data.field.createTime.split(' - ');
            data.field.startCreateTime = arr[0];
            data.field.endCreateTime = arr[1];
        }

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