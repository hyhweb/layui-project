layui.use(['upload', 'form', 'table', 'api', 'common'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api = layui.api,
        common = layui.common;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode),
        detail = layui.sessionData('dialog').detail,
        userInfo = layui.sessionData('user').info,
        selectedTreeNode = null;





        var param = {
            url: '/system/permission/getPermissionTreeList',
            method: 'post',
            data:{},
            success: function(res) {

               
               console.log(res,'res')

               // function zTreeBeforeCheck(treeId, treeNode) {
               //      console.log(treeNode,'treeNode')
               //      if(mode ==2){
               //          common.setFormData($('.layui-form.edit'), treeNode)
               //      }
                    
               //  };

                function zTreeBeforeClick(treeId, treeNode, clickFlag) {
                     console.log(treeNode,'treeNode')
                     selectedTreeNode = treeNode;
                    //  if(mode ==2){
                    //     common.setFormData($('.layui-form.edit'), treeNode)
                    // }
                };
                 var setting = {
                    check: {
                        enable: (mode ==1?false:true)
                    },
                    data: {
                        simpleData: {
                            enable: true
                        },
                        key: {
                            name: "name",
                            leaf: true
                        }
                        
                    },
                    callback:{
                        //beforeCheck: zTreeBeforeCheck
                        beforeClick: zTreeBeforeClick
                    }
                };


                var zNodes = res.data;

                var itemHandle = function (item) {
                    if(item.children){
                        $.map(item.children,function (val,key) {
                            if(val.children&&val.children.length == 0){
                                delete val.children;
                            }
                            itemHandle(val)
                        })
                    }else{
                        if(item.children&&item.children.length == 0){
                            delete item.children;
                        }
                    }

                }

                zNodes = $.map(zNodes,function (item,index) {
                    itemHandle(item);
                    return item;
                })
                  
                $.fn.zTree.init($("#treeDemo"), setting, zNodes);

                // 获取树对象
                var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                treeObj.expandAll(true); 
                /** 获取所有树节点 */
                var nodes = treeObj.transformToArray(treeObj.getNodes());
                console.log(nodes,'nodes')
                // 遍历树节点设置树节点为未选中
                for (var k = 0, length_3 = nodes.length; k < length_3; k++) {
                    if(mode ==2 || mode ==0){
                        treeObj.setChkDisabled(nodes[k], true);
                            if(nodes[k].code == detail.code){
                                nodes[k].checked = true;
                               
                               // common.setFormData($('.layui-form.edit'), nodes[k])
                            }
                             treeObj.updateNode(nodes[k],true);
                    }

                    
                }
            },
            complete:function(){
        

            }
        }
        common.ajax(param)

 
    if (mode != 1) {
        //表单赋值
        common.setFormData($('.layui-form.edit'), detail,null,(mode==0?'detail':''))
        if(mode ==2){
            $('[name=code]').attr('disabled','disabled')
        }
    }

    if (mode == 0) {
        $('.handle-btn').remove();

    }

    form.render();

    //监听提交

    form.on('submit(edit)', function(data) {
        // if(mode ==1){
        //     if(selectedTreeNode == null){
        //         layer.msg('请选择新增权限所属的上级节点');
        //         return false;
        //     }
        // }
        
        var url = ''
        if (mode == 1) {
            url = '/system/permission/save';
            data.field.parentCode = (selectedTreeNode == null?'':selectedTreeNode.code);
            
        } else if (mode == 2) {
            url = '/system/permission/update';
            data.field = $.extend({}, detail, data.field);
        }




        var param = {
            url: url,
            method: 'post',
            data: data.field,
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
        return false;
    });

})