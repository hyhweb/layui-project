//config的设置是全局的
layui.config({
  base: '../../source/libs/modules/' //假设这是你存放拓展模块的根目录
}).extend({ //设定模块别名
    formSelects: 'formSelects-v3', //相对于上述 base 目录的子目录
    common: 'common',
    api: 'api'
});