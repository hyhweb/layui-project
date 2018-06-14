layui.use(['element', 'form', 'upload', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api,upload = layui.upload;





    var tableParam = $.extend({}, {
            elem: '#table',
            url: common.baseUrl + '/warning/trackDangerousGoods/pageList',
            cols: [
                [
                    { checkbox: true, fixed: false },
                    { field: 'dangerousGoodsName', minWidth: 120, title: '货物名称', sort: true },
                    { field: 'orderTypeText', minWidth: 120, title: '业务类型' }, 
                    { field: 'bookSpaceNo', title: '订舱单号', minWidth: 150 }, 
                    { field: 'containerNo', width: 100, title: '集装箱号' }, 
                    { field: 'carTeamName', width: 100, title: '拖车公司' },
                    { field: 'plateNumber', width: 100, title: '司机/车牌',templet:'#drivertpl' },
                    { field: '', width: 100, title: '地理坐标' ,templet:'#latitudetpl'},
                    { field: 'noticeTypeText', width: 100, title: '预警提示' }
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

                var title = "";
                if (handle == "1") {
                    title = "新建危险品定位"
                } else {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    layui.sessionData('dialog', { key: 'detail', value: data[0] });

                    if (handle == "0") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "危险品跟踪预警详情";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });
                 if(handle ==1 || handle ==2 || handle ==0){
                     common.dialog({
                        title: title,
                        area: ['800px', ''],
                        maxmin: true,
                        url: '../dangerousGoodsFollow/edit/edit.html'
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