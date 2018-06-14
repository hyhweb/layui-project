layui.use(['form','laydate','common','table'], function() {
    var $ = layui.jquery,
        form = layui.form,
        common = layui.common,
        table = layui.table,
        laydate = layui.laydate;
		
        
      //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
        var mode = parseInt(layui.sessionData('dialog').mode);
        var detail = layui.sessionData('dialog').detail;
       var contractId = detail.contractId;

       laydate.render({
        	elem:'#applyDate'
			,min: detail.freeExpiryTimeText
        })

       $('#applyDate').val(detail.applyFreeExpiryTimeText)

		form.on('submit(edit)', function(data) {
		if(detail.applyFreeExpiryTimeText == data.field.applyDate){
			layer.msg('延期时间不变，不需要申请')
			return;
		}
		var param = {
        url:'/order/dockContract/applyDelay',
        method: 'post',
        data:{contractId:contractId,applyDate:data.field.applyDate},
        success: function(res) {
                layer.msg(res.msg)
                if (res.success) {
                     common.closeAllLayer()
                    //执行重载table
                    table.reload('dockertable', {
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