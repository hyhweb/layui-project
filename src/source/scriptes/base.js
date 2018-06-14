layui.use(['element'], function() {
    var $ = layui.$,
        element = layui.element;
    $.ajaxSetup({
        headers: { "Authorization": sessionStorage.getItem('token') }
    })

    function renderHtml(url) {
        $.ajax({
            url: '../' + url,
            method: 'get',
            dataType: 'html',
            data: {},
            success: function(res) {
                $('.layui-body-inner').html(res)
            }

        })
    }

    function hashchange() {
        var hash = location.hash.slice(1);
        if (hash.length > 1) {
            renderHtml(hash)
        }
    }

   function breadcrumbRender(menu){
    var breadcrumb = $('#breadcrumb'),
        hash = location.hash.slice(1);
        console.log(menu,'menu')
        if(hash == ""){
            return;
        }
        var breadArr = [{name:'首页'}];
        $.each(menu,function(index,item){
            if(item.children){
                $.each(item.children,function(key,val){
                    if(val.url == hash){
                        breadArr.push({name:item.name,url:item.url})
                        breadArr.push({name:val.name,url:val.url})
                    }
                })
                
            }else{
                if(item.url == hash){
                       if(item.name !="首页"){
                        breadArr.push({name:item.name,url:item.url})
                       }
                       
                    }
            }
        })

      var breadHTML =  $.map(breadArr,function(item,index){
           return $('<a >'+item.name+'</a>')
        })
      breadcrumb.html(breadHTML)
      element.render('breadcrumb')
         console.log(breadArr)

    }

    //菜单生成
    function createMenu() {
        $.ajax({
            url: '../../source/libs/data/menu.json?ver=' + (new Date().getTime()),
            method: 'get',
            dataType: 'json',
            success: function(res) {
                layui.sessionData('menu', { key: 'nav', value: res })
                breadcrumbRender(res)
                var permissionArr = layui.sessionData('permission').info;
                if(permissionArr == undefined) {return false;}
                var menuHTML = $.map(res, function(item, index) {
                    // if (permissionArr.includes("*")) {
                    //     return false;
                    // }

                    var itemHTML = $('<li class="layui-nav-item"></li>');
                    if (item.children) {
                        if(!permissionArr.includes(item.code)){ return false;}
                        itemHTML.append('<a lay-tips=' + item.name + ' lay-href="#"><i class="layui-icon layui-icon-' + item.icon + '"></i><cite>' + item.name + '</cite></a>')
                        var ddHTML = $.map(item.children, function(val, key) {
                            if(!permissionArr.includes(val.code)){ return false;}
                            return $('<dd><a lay-href="' + val.url + '">' + val.name + '</a></dd>')
                        })
                        var dlHTML = $('<dl class="layui-nav-child"></dl>')
                        dlHTML.append(ddHTML)
                        itemHTML.append(dlHTML)

                    } else {
                        if(!permissionArr.includes(item.code)){ return false;}
                        itemHTML.append('<a lay-href="' + item.url + '"><i class="layui-icon layui-icon-' + item.icon + '"></i><cite>' + item.name + '</cite></a>');
                    }
                    return itemHTML;
                })
                var navBox = $('<ul class="layui-nav layui-nav-tree"  lay-filter="test"></ul>').html(menuHTML)
                $('.nav').append(navBox)
                $('.nav [lay-href]').on('click', function() {
                    var href = $(this).attr('lay-href');
                    location.hash = href;

                })
                element.render();

            },
            fail: function(res) {
                console.log(res, 'fail')
            }
        })

    }


    createMenu()
    


    //未登录直接跳到登录页面
    if(layui.sessionData('user').info == undefined){
        location.href="../login/index.html"
    }


    window.onhashchange = function() {
        hashchange();
        var menu = layui.sessionData('menu').nav;
         breadcrumbRender(menu)
    }

    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            hashchange()
        }
    }

    $.ajaxSetup({　　　　　　　　
        beforeSend: function(XMLHttpRequest) {　　　　 //可以设置自定义标头  
            XMLHttpRequest.setRequestHeader('x-access-token', layui.sessionData('token').info);　　　　
        },
        　　
    })


})