layui.use(['element', 'form', 'upload', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api,upload = layui.upload;




         //上传合作协议
    upload.render({
        elem: '#excel',
        url: common.baseUrl+'/warning/dangerousGoods/batchImport',
        accept: 'file', //普通文件
        acceptMime:"xls|xlsx",
        exts:'xls|xlsx',
        multiple: false,
        choose:function (obj) {
        },
        before: function(obj){

        },
        done: function(res){
            layer.msg(res.msg)
            if(res.success){
                $('.search-btn').trigger('click')
            }
           
        }
        
    }); 


    $.when(api.getDriverList(), api.getTrailerSpceTypeList()).done(function(harbor, trailerSpceType) {
        var harborList = harbor[0],
            trailerSpceTypeList = trailerSpceType[0];
        //司机下拉渲染
        var selectHTML = harborList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=driverId]').append(selectHTML)
        //拖车规格下拉渲染
        var selectHTML = trailerSpceTypeList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=spec]').append(selectHTML)
        form.render()



    })



    var tableParam = $.extend({}, {
            elem: '#table',
            url: common.baseUrl + '/warning/dangerousGoods/pageList',
            cols: [
                [
                    { checkbox: true, fixed: false },
                    { field: 'dangerousGoodsName', minWidth: 120, title: '危险品名称', sort: true },
                    { field: 'address', minWidth: 120, title: '危险品所在地址' }, 
                    { field: 'belongsCustomerName', title: '危险品所属客户', minWidth: 150 }, 
                    { field: 'latitude', width: 100, title: '地理坐标',templet:'#latitudetpl' }, 
                    { field: 'validText', width: 100, title: '有效状态' }
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

                    if (handle == "2") {
                        if (data.length != 1) {
                            layer.msg('请选择一条数据进行操作');
                            return;
                        }
                        title = "编辑危险品定位";
                    }

                }
                layui.sessionData('dialog', { key: 'mode', value: handle });
                 if(handle ==1 || handle ==2 || handle ==0){
                     common.dialog({
                        title: title,
                        area: ['800px', ''],
                        maxmin: true,
                        url: '../dangerousGoodsPosition/edit/edit.html'
                    })
                 }
               


                if(handle ==3){

                    layer.confirm('确定要删除此危险品定位吗?',{
                        btn:['确定','取消']
                    },
                    function(){
                        var ids = $.map(data,function(item,index){
                            return item.dangerousGoodsId
                        })
                            var param = {
                                url: '/warning/trackDangerousGoods/delByIds',
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