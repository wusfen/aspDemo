/*
page switch
*/
onload = onhashchange = function () {
  // a active
  $('a').removeClass('active').each(function(i, el){
    if (el.href==location.href) {
      $(el).addClass('active')
    }
  });

  // show page
  var hash = location.hash;
  var $pages = $('[class^="page-"]');
  var $page = $(hash);
  $pages.hide();
  $page.show();
}
onload();


/*
storage
*/
function storage(key, val) {
  if (window.localStorage) {
    if (arguments.length==1) {
      return (function(){
        try{
          return JSON.parse(localStorage[key]||'null');
        }catch(e){
          return localStorage[key]
        }
      })()
    }
    if (arguments.length>1) {
      localStorage[key] = JSON.stringify(val);
      return val
    }
  }
}
function appData(data) {
  return data?storage('aspDemo', data):storage('aspDemo')
}


/*
vue
*/
var vue = new Vue({
  el:'#app',
  data: appData()||appData({
    account:'和多号',
    port:'',
    tel:'',
    iconUrl: '',
    menu:[
      {
        name:'菜单1',
        url:'',
        children:[
          {
            name:'10086',
            url:'http://10086.cn'
          }
        ]
      },{
        name:'baidu',
        url:'http://m.baidu.com',
        children:[]
      }
    ],
    currMenu: null,
    msgTpl:'尊敬的(.1*)用户，您的会员服务预计在(.2*)到期，请及时处理。',
    msgTplName: '到期提醒',
    msgTplArgs:[
      {a:'用户名', b:'1'},
      {a:'到期时间', b:'2'}
    ]
  }),
  computed:{
    validation:function(){
      return {
        account: !this.account.trim()
      }
    }
  },
  methods:{
    save:function () {
      appData(vue.$data)
    },
    upload: function(e){
      var input = e.target;
      var file = input.files[0];
      var fileReader = new FileReader;
      fileReader.onload = function () {
        var dataUrl = this.result;
        vue.iconUrl = dataUrl;

        vue.save();
      }
      fileReader.readAsDataURL(file);
    },
    addMenu: function (to) {
      // var arr = to? (to.children=to.children||[]):this.menu;//此方式新数组骨监听
      var arr = to? to.children:this.menu;
      arr.push(this.currMenu={
        name:'new',
        url:'http://',
        children:[]
      });
    },
    removeMenu: function(item){
      this.currMenu = null;
      var arr = this.menu;
      for (var i = 0; i < arr.length; i++) {
        var t = arr[i];
        if (t==item) {
          arr.splice(i,1);break;
        }else{
          var arrSub = t.children;
          for (var j = 0; j < arrSub.length; j++) {
            var t = arrSub[j];
            if (t==item) {
              arrSub.splice(j,1);break;
            }
          }
        }
      }
    },
    addMsgArgAfter: function (arg) {
      var arr = this.msgTplArgs;
      if(!arg){
        arr.push({a:'',b:''});
        return;
      }
      for (var i = 0; i < arr.length; i++) {
        if(arr[i]==arg){
          arr.splice(i+1,0,{
            a:'',
            b:''
          });
          break;
        }
      }
    },
    removeMsgArg(arg){
      var arr = this.msgTplArgs;
      for (var i = 0; i < arr.length; i++) {
        if(arr[i]==arg){
          arr.splice(i,1);
          break;
        }
      }
      // 一个都没有，加个
      if (true) {

      }
    }
  }
});

// 保存时机
document.addEventListener('click', vue.save);
// 页面进入时删除 currMenu 副本
vue.currMenu=null
