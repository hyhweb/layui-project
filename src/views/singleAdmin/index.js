layui.use(['element', 'form', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api;
         element.on('tab(single)', function(){
            var id = this.getAttribute('lay-id');
            if(id ==1){
              $('.search').trigger('click')
            }else if(id == 2 ){
               $('.dockersearch').trigger('click')
            }
          });


    $.when(api.getShipCompanyList(),api.getOrderStatusList()).done(function(shipCompany, orderStatus) {
        var shipCompanyList = shipCompany[0],
            orderStatusList = orderStatus[0];
        //下拉渲染
        var selectHTML = shipCompanyList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=shipCompanyId]').append(selectHTML)

        var selectHTML = orderStatusList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('#orderStatus').append(selectHTML)
        form.render()
    })
    var tableParam = $.extend({},
        common.tableConfig, {
            elem: '#table',
            url: common.baseUrl + '/order/shipCompanyContract/pageList',
            cols: [
                [
                    { checkbox: true },
                    { field: 'contractNo', width: 120, title: '合同编号' },{ field: 'bookSpaceNo', width: 140, title: '订舱单号' }, { field: 'shipCompanyName', minWidth: 100, title: '船公司' }, { field: 'orderTypeName', width: 80, title: '业务类型' }, { field: 'createTimeText', width: 150, title: '最新提交时间' }, { field: 'freeExpiryTimeText', width: 100, title: '免费使用期限' }, { field: 'statusName', width: 180, title: '状态',templet:'#statusList' }, { field: '', align: 'center', width: 120, title: "操作", toolbar: '#bar1' }
                ]
            ],
            id: 'table'
        });

    table.render(tableParam);
    var tableParamtodocker = $.extend({},
        common.tableConfig, {
            elem: '#dockertable',
            url: common.baseUrl + '/order/dockContract/pageList',
            cols: [
                [
                    { checkbox: true},
                    { field: 'contractNo', width: 120, title: '合同编号' },{ field: 'bookSpaceNo', width: 140, title: '订舱单号'}, { field: 'shipCompanyName', minWidth: 100, title: '船公司' }, { field: 'orderTypeName', width: 80, title: '业务类型' }, { field: 'createTimeText', width: 150, title: '最新提交时间' }, { field: 'freeExpiryTimeText', width: 100, title: '免费使用期限' }, { field: 'applyFreeExpiryTimeText', width: 100, title: '延期日期' }, { field: 'statusName', width: 180, title: '状态',templet:'#statusList' }, { field: '', align: 'center', width: 120, title: "操作", toolbar: '#dockerbar2' }
                ]
            ],
            id: 'dockertable'
        });

    table.render(tableParamtodocker);

    //监听工具条
    table.on('tool(table)', function(obj) {
        var data = obj.data,
            title = "",
            url = "";
        layui.sessionData('dialog', { key: 'detail', value: data });
        if (obj.event === 'detail') {
            title = '详情';
            url = '../singleAdmin/edit/edit.html';
        } else if (obj.event === 'payment') {
            if (data.orderStatus != 1) {
                layer.msg('合同不是待办单状态,暂时不能支付')
                return;
            }
            title = '费用支付';
            url = '../singleAdmin/payment/index.html';
        } else if (obj.event === 'delaypayment') {
     
              title = "延期费支付";
              url = '../singleAdmin/delayfeepayment/index.html';
          }
        common.dialog({
            title: title,
            area: ['800px', '100%'],
            maxmin: true,
            isfull: true,
            url: url
        })
    })

    //监听工具条
    table.on('tool(dockertable)', function(obj) {
        var data = obj.data,
            title = "",
            url = "";
        layui.sessionData('dialog', { key: 'detail', value: data });
        if (obj.event === 'detail') {
            title = '详情';
            url = '../singleAdmin/dockerdetail/index.html';
        } else if (obj.event === 'payment') {
            if (data.orderStatus != 1) {
                layer.msg('合同不是待办单状态,暂时不能支付')
                return;
            }
            title = '费用支付';
            url = '../singleAdmin/dockerpayment/index.html';
        } else if (obj.event === 'delaypayment') {

              title = "延期费支付";
              url = '../singleAdmin/delayfeepayment/index.html';
          }

        common.dialog({
            title: title,
            area: ['800px', '100%'],
            maxmin: true,
            isfull: true,
            url: url
        })

    })

    var $ = layui.$,
        active = {
            openDialog: function(handle) { //获取选中数据
                var checkStatus = (handle == 4) ? table.checkStatus('dockertable') : table.checkStatus('table'),
                    data = checkStatus.data;
                layui.sessionData('dialog', { key: 'detail', value: data[0] });
                if (data.length != 1) {
                    layer.msg('请选择一条数据进行操作');
                    return;
                }
                var dialogParam = {
                    title: "",
                    area: ['800px', '100%'],
                    maxmin: true,
                    isfull: true,
                    url: ""
                }
                if (handle == "1") {
                    dialogParam.title = "设备交接单";
                    dialogParam.url = '../singleAdmin/containerreceipt/index.html';
                }
                if (handle == "2") {
                    dialogParam.title = "放箱单";
                    dialogParam.url = '../singleAdmin/putlist/index.html';
                }
                if (handle == "3") {
                    if(data[0].orderStatus !=2){
                      layer.msg('只有船公司办单完成才能码头办单')
                      return;
                    }
                    dialogParam.title = "码头办单申请";
                    dialogParam.url = '../singleAdmin/dockersingle/index.html';
                }else if(handle == "4"){
                  if(data[0].orderStatus < 2){
                      layer.msg('只有码头办单办单完成才能延期申请')
                      return;
                    }
                    dialogParam.title = "延期申请";
                    dialogParam.url = '../singleAdmin/delaytime/index.html';
                    dialogParam.area = ['500px', '300px'];
                    dialogParam.isfull = false;
                }
                
                layui.sessionData('dialog', { key: 'mode', value: handle });
                common.dialog(dialogParam)

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

    //监听提交
    form.on('submit(dockersearch)', function(data) {
        console.log(JSON.stringify({ parameter: data.field }))
        //执行重载
        table.reload('dockertable', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: { parameter: data.field }

        });
        return false;
    });

});