layui.use(['element','form', 'layedit', 'laydate','table','common'], function(){
  var $ = layui.$, 
  table = layui.table
  ,element = layui.element
  ,form = layui.form
  ,layer = layui.layer
  ,laydate = layui.laydate
  ,common =  layui.common;

/*

  var tableParam = $.extend({},
        common.tableConfig, {
            elem: '#table',
            url: common.baseUrl + '/order/shipCompanyContract/pageList',
            cols: [
                [
                   
                    { field: 'bookSpaceNo', width: 120, title: '订舱单号' }, { field: 'applyCompanyName', minWidth: 100, title: '船公司' }, { field: 'orderTypeName', width: 80, title: '业务类型' }, { field: 'createTimeText', width: 150, title: '最新提交时间' }, { field: 'freeExpiryTimeText', width: 100, title: '免费使用期限' }, { field: 'orderStatusName', width: 180, title: '状态',templet:'#statusList' }, { field: '', align: 'center', width: 120, title: "操作", toolbar: '#bar1' }
                ]
            ],
            id: 'table'
        });

    table.render(tableParam);

  var $ = layui.$, active = {
    getCheckData: function(){ //获取选中数据
        common.dialog({
          title:"车队审核",
          area:['1000px',''],
          maxmin:true,
          url:'./edit/edit.html'
        })

    }

  };

$('.layui-btn').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });


   //监听提交
  form.on('submit(search)', function(data){
    
     
	  //执行重载
      table.reload('table', {
        page: {
          curr: 1 //重新从第 1 页开始
        },
        where: data.field
        
      });


    layer.alert(JSON.stringify(data.field), {
      title: '提示'
    })
    return false;
  });*/

});