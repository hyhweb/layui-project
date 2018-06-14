layui.use(['upload', 'form','table','api','laytpl'], function() {
    var $ = layui.jquery,
        table = layui.table,
        api =  layui.api;
        var data =  layui.sessionData('dialog').feedetail;
        var tableParam =$.extend({},
        common.tableConfig,{
          elem: '#feedetailtable'
          ,page:false
          ,cols: [[
            {field:'costType', minWidth: 100, title: '费用类型'}
            ,{field:'amount', minWidth: 100, title: '费用金额'}
            ,{field:'createTime', minWidth: 100, title: '描述'}
            
          ]],
          data:data
          ,id: 'detailtable'
        });
         
          
        table.render(tableParam);
            
        
    
   
    

})