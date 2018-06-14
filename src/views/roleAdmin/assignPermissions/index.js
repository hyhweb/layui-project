layui.use(['upload', 'form', 'table', 'api'], function() {
    var $ = layui.jquery,
        upload = layui.upload,
        form = layui.form,
        table = layui.table,
        api = layui.api;
    //根据不同的弹出框（新增，编辑，查看）,渲染数据和处理业务
    var mode = parseInt(layui.sessionData('dialog').mode),
        detail = layui.sessionData('dialog').detail,
        userInfo = layui.sessionData('user').info,
         selectedTreeNode = null,
        isAdmin = null,
        companyType = null,
        companyId = null;
        isAdmin = userInfo.isAdmin;
        companyType = userInfo.companyType;
        companyId = userInfo.companyId;







       

    var createTree = function(rolePermissionIdArr){


        var param = {
            url: '/system/permission/getPermissionTreeList',
            method: 'post',
            data:{},
            success: function(res) {

               
               console.log(res,'res')

               function zTreeBeforeCheck(treeId, treeNode) {
                    console.log(treeNode,'treeNode')
                    // if(mode ==2){
                    //     common.setFormData($('.layui-form.edit'), treeNode)
                    // }
                    
                };

                // function zTreeBeforeClick(treeId, treeNode, clickFlag) {
                //      console.log(treeNode,'treeNode')
                //      selectedTreeNode = treeNode;
                //     //  if(mode ==2){
                //     //     common.setFormData($('.layui-form.edit'), treeNode)
                //     // }
                // };
                 var setting = {
                    check: {
                        enable: (mode ==1?false:true)
                    },
                    data: {
                        simpleData: {
                            enable: false,
                        },
                        key: {
                            name: "name"
                        }

                    },
                    callback:{
                        beforeCheck: zTreeBeforeCheck
                       // beforeClick: zTreeBeforeClick
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
                    
                          
                            if(rolePermissionIdArr.includes(nodes[k].id)){
                                nodes[k].checked = true;
                               
                               // common.setFormData($('.layui-form.edit'), nodes[k])
                            }else{
                                nodes[k].checked = false;
                            }
                             treeObj.updateNode(nodes[k],true);
                    

                    
                }
            },
            complete:function(){
        

            }
        }
        common.ajax(param)

}

       common.ajax({
        url:'/system/role/getRolePermission',
        method:'post',
        data:{roleId:detail.roleId},
        success:function(res){
            var  rolePermissionIdArr = [];
            var data = res.data;
            if(res.success){
               rolePermissionIdArr = $.map(data,function(item,index){
                    return item.permissionId;
                });
               console.log(rolePermissionIdArr,'rolePermissionIdArr')
               createTree(rolePermissionIdArr)
            }
            



        }
    })
    

    //监听提交

    form.on('submit(edit)', function(data) {
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        nodes=treeObj.getCheckedNodes(true);
        console.log(nodes,'nodes')

        var url = '',paramData=[]
        // if (mode == 1) {
        //     url = '/system/role/save';
        //     data.field.secretKey = "";
        //     data.field.salt = "";
        //     if(isAdmin == false){
        //         data.field.companyId = companyId;
        //         data.field.companyType=companyType
        //     }
            
        // } else if (mode == 2) {
        //     url = '/system/role/update';
        //     data.field = $.extend({}, detail, data.field);
        // }else 
        if(mode == 3){
            url = '/system/role/saveRolePermission';
            var permissionIds = $.map(nodes,function(item,index){
               // if(item.children.length == 0){
                    return item.id;
               // }
            })
            paramData = {roleId:detail.roleId,permissionIds:permissionIds}
        }



        // data.field.is_admin = isAdmin;
        // if (data.field.companyType == 0) {
        //     data.field.companyId = 0
        // } else if (data.field.companyType == 1) {
        //     data.field.companyId = data.field.shipCompanyId
        // } else if (data.field.companyType == 2) {
        //     data.field.companyId = data.field.dockId
        // } else if (data.field.companyType == 3) {
        //     data.field.companyId = data.field.trailerId
        // }





        var param = {
            url: url,
            method: 'post',
            data: paramData,
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