layui.use(['laytpl', 'laypage', 'form'], function() {
    var laytpl = layui.laytpl,
        $ = layui.$,
        laypage = layui.laypage,
        form = layui.form;
    var mode = parseInt(layui.sessionData('dialog').mode);
    var detail = layui.sessionData('dialog').detail;
    var contractId = detail.contractId;
    var param = {
        url: '/order/shipCompanyContract/get/' + contractId,
        method: 'get',
        success: function(res) {
            if (res.success) {
                pageHandle(res.data)
                
            }else{
                layer.msg(res.msg)
            }
        }
    }
    common.ajax(param)



    function pageHandle(data) {
        laypage.render({
            elem: 'page1',
            limit: 1,
            count: data.contractDetailsList.length //数据总数，从服务端得到
                ,
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                console.log(obj.limit); //得到每页显示的条数
                var allData = data;
                var datalist = data.contractDetailsList;
                var thisData = $.extend({},{currentContract:datalist[obj.curr-1]},allData);
                
               console.log(thisData,'thisData')
                laytpl(putlist.innerHTML).render(thisData, function(html) {
                    putlistbox.innerHTML = html;
                    form.render();


                        var printParam = {
                        globalStyles: true,
                        mediaPrint: false,
                        stylesheet: null,
                        noPrintSelector: ".no-print",
                        iframe: false,
                        append: null,
                        prepend: null,
                        manuallyCopyFormValues: true,
                        timeout: 750,
                        title: null,
                        doctype: '<!doctype html>'
                    }
                    $('.print1').on('click', function() {
                        $("#print1").print(printParam);

                      })

                })
                //首次不执行
                if (!first) {
                    //do something
                }
            }
        });
    }






})