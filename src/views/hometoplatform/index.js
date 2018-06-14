layui.use(['common','laydate'],function () {
    $ = layui.$,
    common = layui.common, element = layui.element,
    laydate = layui.laydate;
    var tabIndex = 1,timeType=0;
    var param ={
        timeType:timeType,
        startTime:'',
        endTime:''
    }
    laydate.render({
        elem:'#date',
        range:true,
        done: function(value, date, endDate){
            console.log(value); //得到日期生成的值，如：2017-08-18
            console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            $('.layui-btn').addClass('layui-btn-primary');
            var startTime = date.year+"-"+date.month+"-"+date.date+" 00:00:00",
            endTime = endDate.year+"-"+endDate.month+"-"+endDate.date+" 24:00:00" ;
            param ={
                timeType:4,
                startTime:startTime,
                endTime:endTime
            }
            renderEchart(param)
        }
    })

    element.on('tab(echart)', function(elem){
        var id =$(this).attr('lay-id');
        console.log(id)
        tabIndex = id;
        renderEchart(param)
    });
    var active = {
        render:function (handle) {
            param = {
                timeType:handle
            }
            renderEchart(param)
        }
    }
    $('.layui-btn').on('click', function(){
        var type = $(this).data('type'),
            handle =  $(this).data('handle');
        $(this).siblings('button').addClass('layui-btn-primary');
        $(this).toggleClass('layui-btn-primary');
        $('#date').val('');
        active[type] ? active[type].call(this,handle) : '';
    });

    var renderPage = function () {
        var param = {
            url:'/statistics/platformHome/count',
            method:'get',
            success:function (res) {
                console.log(res,'res')
                if(res.success){
                    var data = res.data;
                    $('.serviceCostTotal').html(data.serviceCostTotal);
                    $('.visitCount').html(data.visitCount);
                    $('.payCount').html(data.payCount);
                    $('.carTeamCount').html(data.carTeamCount);
                    createEchat(data.serviceCostList)
                    sortHandle(data.carTeamRankingList)
                }
            }
        }
        common.ajax(param)
    }


    var renderEchart = function (paramData) {
        var url = "";
        if(tabIndex == 1){
            url="/statistics/platformHome/serviceCostList"
        }else if(tabIndex == 2){
            url="/statistics/platformHome/visitList"
        }
        var param = {
            url:url,
            method:'post',
            data:paramData||{},
            success:function (res) {
                console.log(res)
                createEchat(res.data);
            }
        }
        common.ajax(param)

    }


    
    var sortHandle = function (data) {
        data =  data.sort(function (a,b) {
            return (a.value - b.value)
        });
       var listHTML = $.map(data,function (item,index) {
            var itemHTML = $('<li><i class="circle '+(index>2?'gray':'')+'"></i><span class="inline" style="padding-left: 10px;">'+item.text+'</span><span  class="inline" style="padding-left: 10px;">'+item.value+'</span></li>');
            return itemHTML;
        })
        $('.sort').html(listHTML)
    }

    var createEchat = function (data,seriesName) {
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);
        option = null;
        
        var xAxisArr = $.map(data,function (item,index) {
              return item.text;
        })

        var seriesArr = $.map(data,function (item,index) {
            return item.value
        })

        option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxisArr,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:seriesName,
                    type:'bar',
                    barWidth: '60%',
                    data:seriesArr
                }
            ]
        };

        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    }

    renderPage();

})