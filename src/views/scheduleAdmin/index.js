layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common', 'api'], function() {
    var table = layui.table
    $ = layui.$, element = layui.element, form = layui.form, layer = layui.layer, laydate = layui.laydate, common = layui.common,
        api = layui.api;


    $.when(api.getDockList(),api.getScheduleStatusList()).done(function(dock,scheduleStatus) {
        var dockList = dock[0],
        scheduleStatusList = scheduleStatus[0];
        //下拉渲染
        var selectHTML = dockList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=takeDockId]').append(selectHTML)
        var selectHTML = scheduleStatusList.data.map(function(item, index) {
            return $('<option value="' + item.value + '">' + item.text + '</option>')
        })
        $('[name=scheduleStatus]').append(selectHTML)
        form.render()
    })



    var tableParam = $.extend({}, {
            elem: '#table',
            url: common.baseUrl + '/schedule/schedule/pageList',
            cols: [
                [
                    { checkbox: true },
                    { field: '', minWidth: 120, title: '订舱单号', templet: '#bookSpaceNotpl' }, 
                    { field: '', minWidth: 120, title: '业务类型', templet: '#orderTypetpl' }, 
                    { field: '', minWidth: 120, title: '集装箱号', templet: '#applyContainerNotpl' }, 
                    { field: '', title: '箱型/箱量', minWidth: 150, templet: '#containerTypetpl' }, 
                    { field: '', width: 100, title: '铅封号', templet: '#leadSealNotpl' }, 
                    { field: '', width: 100, title: '提柜码头', templet: '#takeDockNametpl' }

                    , { field: '', width: 100, title: '状态', templet: '#statustpl' }, 
                    { field: '', width: 200, title: '指派司机车牌（*必填）', templet: '#drivertpl', event: 'getdata' }, 
                    { field: '', width: 250, title: '装卸货地址', templet: '#addresstpl', event: 'getdata' }, 
                    { field: 'remark', width: 250, title: '备注', templet: '#remarktpl', event: 'getdata' }
                ]
            ],
            id: 'table',
            page: true,
            done: function() {
                $.when(api.getTrailerList()).done(function(harbor) {
                    var harborList = harbor;
                    //下拉渲染
                    var selectHTML = harborList.data.map(function(item, index) {
                        return $('<option value="' + item.value + '">' + item.other + "/" + item.text + '</option>')
                    })
                    $('[name=trailerId]').append(selectHTML)
                    $('[name=trailerId]').each(function(index, item) {
                        var trailerId = $(item).attr('trailerId');
                        $(item).val(trailerId)

                    })

                    
                    form.render();

                })
            }
        },
        common.tableConfig);
    table.render(tableParam);

    var $ = layui.$,
        active = {
            assignDriver: function() {
                var checkStatus = table.checkStatus('table'),
                    data = checkStatus.data;
                var scheduleIdArr = [],
                    scheduledTransition = [],
                    abledAssing = true;
                if (data.length == 0) {
                    layer.msg('请选择需要指派的行程')
                    return;
                }
                console.log(scheduledTransition, 'scheduledTransition')

                $.map(data, function(item, index) {
                    scheduleIdArr.push(item.scheduleId)
                })

                var scheduleIdStr = scheduleIdArr.join(','),
                    scheduleModifyArr = [];
                scheduleArr.filter(function(item, index) {
                    if (scheduleIdStr.indexOf(item.scheduleId) != -1) {
                        scheduleModifyArr.push(item)
                    }
                })

                $.map(data, function(item, index) {
                    if (item.scheduleStatus > 1) {
                        layer.msg('包含了不能派车状态的行程，请重新选择');
                        abledAssing = false;
                        return;
                    }


                    scheduleIdArr.push(item.scheduleId)
                    if (scheduleModifyArr[index] == undefined) {
                        scheduleModifyArr[index] = {}
                    }
                    var obj = {
                        scheduleId: (scheduleModifyArr[index].scheduleId == undefined ? item.scheduleId : scheduleModifyArr[index].scheduleId),
                        trailerId: (scheduleModifyArr[index].trailerId == undefined ? item.trailerId : scheduleModifyArr[index].trailerId),
                        // driverId:(scheduleModifyArr[index].driverId ==undefined?item.driverId:scheduleModifyArr[index].driverId)
                    }


                    if (obj.driverId == "") {
                        layer.msg('包含了未指定司机的行程，请重新选择');
                        abledAssing = false;
                        return;
                    }
                    obj.taskList = [];
                    if (item.taskList != undefined) {
                        $.map(item.taskList, function(val, key) {
                            if (scheduleModifyArr[index].taskList == undefined) {
                                scheduleModifyArr[index].taskList = {}
                            }
                            if (scheduleModifyArr[index].taskList[key] == undefined) {
                                scheduleModifyArr[index].taskList[key] = {}
                            }
                            var itemObj = {
                                taskId: (scheduleModifyArr[index].taskList[key].taskId == undefined ? val.taskId : scheduleModifyArr[index].taskList[key].taskId),
                                address: (scheduleModifyArr[index].taskList[key].address == undefined ? val.address : scheduleModifyArr[index].taskList[key].address),
                                remark: (scheduleModifyArr[index].taskList[key].remark == undefined ? val.remark : scheduleModifyArr[index].taskList[key].remark)
                            }
                            obj.taskList.push(itemObj)

                        })

                    }


                    scheduledTransition.push(obj)
                })

                if (!abledAssing) {
                    return;
                }


                var param = {
                    url: '/schedule/schedule/assignDriver',
                    method: 'post',
                    data: scheduledTransition,
                    success: function(res) {

                        layer.msg(res.msg)
                        if (res.success) {
                            $('.search').trigger('click')
                        }
                    }
                }




                layer.confirm('确定派车?', { btn: ['确定', '取消'] },
                    function() {
                        console.log(scheduledTransition,'scheduledTransition');
                        var hasSelectDriver =  true;
                        $.map(scheduledTransition,function(item,index){
                            if(item.trailerId == null){
                                hasSelectDriver = false;
                                return;
                            }
                        })

                        if(!hasSelectDriver){
                            layer.msg('请选择指派司机车牌')
                            return false;
                        }

                        
                        common.ajax(param)
                    },
                    function() {})
            },
            cancelAssignDriver:function(){
              var checkStatus = table.checkStatus('table'),
              data = checkStatus.data;
              if(data.length ==0){
                  layer.msg('请选择数据进行操作');
                  return;
                }
              layer.confirm('确定取消指派司机？',{
                btns:['确定','取消']
              },function(){
                var paramData = [];
                $.each(data, function(index, el) {
                    paramData.push(el.scheduleId)
                });

                var param = {
                    url: '/schedule/schedule/cancelAssignDriver',
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

              })

            },
            cancelMerge: function() {
                function handle() {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    if (data.length == 0) {
                        layer.msg('请选择需要取消的双拖')
                        return;
                    }
                    var scheduleIdArr = [],
                        hasDouble = true;
                    $.map(data, function(item, index) {
                        if (item.scheduleStatus > 1) {
                            layer.msg('包含了不能取消双拖的行程，请重新选择');
                            hasDouble = false;
                            return;
                        }

                        if (item.isDouble == false) {
                            layer.msg('包含了不是双拖的行程，请重新选择');
                            hasDouble = false;
                            return;
                        }
                        scheduleIdArr.push(item.scheduleId)
                    })
                    if (!hasDouble) return;
                    console.log(scheduleIdArr, 'scheduleIdArr')

                    var param = {
                        url: '/schedule/schedule/cancelMerge',
                        method: 'post',
                        data: scheduleIdArr,
                        success: function(res) {
                            layer.msg(res.msg)
                            if (res.success) {
                                $('.search').trigger('click')
                            }
                        }
                    }
                    common.ajax(param)
                }
                layer.confirm('确定取消双拖?', { btn: ['确定', '取消'] },
                    function() {
                        handle()
                    })
            },
            merge: function() {
                function handle() {
                    var checkStatus = table.checkStatus('table'),
                        data = checkStatus.data;
                    if (data.length == 0) {
                        layer.msg('请选择需要双拖的行程')
                        return;
                    } else {
                        if (data.length != 2) {
                            layer.msg('只能选择两个行程进行双拖')
                            return;
                        }
                    }
                    var taskIdArr = [],
                        hasDouble = false;
                    $.map(data, function(item, index) {
                        if (item.scheduleStatus > 1) {
                            layer.msg('包含了不可双拖状态的行程，请重新选择');
                            hasDouble = true;
                            return;
                        }

                        if (item.isDouble == true) {
                            layer.msg('包含了已双拖的行程，请重新选择');
                            hasDouble = true;
                            return;
                        }
                        $.map(item.taskList, function(val, key) {
                            taskIdArr.push(val.taskId)
                        })
                    })
                    if (hasDouble) { return }
                    var param = {
                        url: '/schedule/schedule/merge',
                        method: 'post',
                        data: taskIdArr,
                        success: function(res) {
                            layer.msg(res.msg)
                            if (res.success) {
                                $('.search').trigger('click')
                            }
                        }
                    }
                    common.ajax(param)
                }

                layer.confirm('确定双拖?', { btn: ['确定', '取消'] },
                    function() {
                        handle()
                    }
                )
            },
            assignCarTeam:function(){
              var checkStatus = table.checkStatus('table'),
              data = checkStatus.data;
              layui.sessionData('dialog',{key:'detail',value:data});
              var title = "指派车队";
              if(data.length ==0){
                  layer.msg('请选择数据进行操作');
                  return;
                }
                if(data[0].isAssignedCarTeam == true){
                    layer.msg('已经指派车队，不能重复指派车队');
                    return;
                }
              common.dialog({
                title:title,
                area:['600px','300px'],
                maxmin:true,
                url:'../scheduleAdmin/assigncarteam/index.html'
              })

            },
            cancelAssignCarTeam:function(){
              var checkStatus = table.checkStatus('table'),
              data = checkStatus.data;
              if(data.length ==0){
                  layer.msg('请选择数据进行操作');
                  return;
                }
              layer.confirm('确定取消指派车队？',{
                btns:['确定','取消']
              },function(){
                var paramData = [];
                $.each(data, function(index, el) {
                    paramData.push(el.scheduleId)
                });

                var param = {
                    url: '/schedule/schedule/cancelAssignCarTeam',
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