layui.use(['element', 'form', 'layedit', 'laydate', 'table', 'common', 'formSelects'], function() {
    var $ = layui.$,
        table = layui.table,
        element = layui.element,
        form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        common = layui.common;

        var loginName = layui.sessionData('user').info.loginName
        $('.loginName').html(loginName)


    $('body').on("mouseenter", "*[lay-tips]", function() {
        var e = $(this);
        if (!e.parent().hasClass("layui-nav-item") || $('.layui-layout-body').hasClass('layadmin-side-shrink')) {
            var t = e.attr("lay-tips"),
                i = e.attr("lay-offset"),
                n = e.attr("lay-direction"),
                s = layer.tips(t, this, {

                    time: -1,
                    success: function(e, a) {
                        i && e.css("margin-left", i + "px")
                    }
                });
            e.data("index", s)
        }
    }).on("mouseleave", "*[lay-tips]", function() {
        layer.close($(this).data("index"))
    });

    var $ = layui.$,
        active = {
            sideFlexible: function() {
                var wrap = $('.layui-layout-body'),
                    flexible = $('#flexible');
                if (wrap.hasClass('layadmin-side-shrink')) {
                    wrap.removeClass('layadmin-side-shrink');
                    flexible.addClass('layui-icon-shrink-right').removeClass('layui-icon-spread-left');
                } else {
                    wrap.addClass('layadmin-side-shrink');
                    flexible.addClass('layui-icon-spread-left').removeClass('layui-icon-shrink-right');
                }
            }

        };

    $('#flexible').on('click', function() {
        active.sideFlexible()
    })
    $('#breadcrumb-toggle').on('click',function(){
        $('#breadcrumbbox').toggle()
    })
    $('.layui-side-menu').on('click', function() {
        var wrap = $('.layui-layout-body');
        if (wrap.hasClass('layadmin-side-shrink')) {
            wrap.removeClass('layadmin-side-shrink')
        }

    })

    $('#userInfo').on('click',function () {
        common.dialog({
            title: "用户基本信息",
            area: ['600px','400px'],
            maxmin: true,
            url: '../userInfo/index.html'
        })
    })


    $('#logout').on('click', function() {
        layui.sessionData('user', null);
        location.href="../login/index.html";
        
    })

    $('.layui-btn').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    //监听提交
    form.on('submit(search)', function(data) {


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
    });

});