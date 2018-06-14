layui.define(['common'],function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
  
  var $ = layui.$,
  common = layui.common,
   requestList = {};
  var api = {
  	//获取所属港区
  	getHarborList:{url:'/base/shipCompany/getHarborList',type:'get'},
  	//所属船公司
    getShipCompanyList:{url:'/base/shipCompany/getShipCompanyList',type:'get'},
    //所有司机
    getDriverList:{url:'/base/trailer/getDriverList',type:'post'},
    //所有拖车规格
    getTrailerSpceTypeList:{url:'/base/trailer/getTrailerSpceTypeList',type:'post'},
	//所有拖车司机
    getTrailerList:{url:'/schedule/schedule/getTrailerList',type:'get'},
  //所有车队
    getCarTeamList:{url:'/system/user/getCarTeamList',type:'post'},
    //所有码头
    getDockList:{url:'/system/user/getDockList',type:'post'},
    //所有角色
    getRoleList:{url:'/system/user/getRoleList',type:'post'},
    


  }

  for(var key in api){
  	(function(key){
  		requestList[key] = function (param) {
			var param = param || {}
		    param.url = api[key].url;
		    param.type = api[key].type;
		   return common.ajax(param)
		}
  	})(key)
	
  }

exports('api', requestList);
})