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


/*
vue
*/
var vue = new Vue({
  el:'#app',
  data:{
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
    msgTpl:'尊敬的(.1*)用户，您的会员服务预计在(.2*)到期，请及时处理。'
  },
  computed:{
    validation:function(){
      return {
        account: !this.account.trim()
      }
    }
  },
  methods:{
    upload: function(e){
      var input = e.target;
      var file = input.files[0];
      var fileReader = new FileReader;
      fileReader.onload = function () {
        var dataUrl = this.result;
        vue.iconUrl = dataUrl;
      }
      fileReader.readAsDataURL(file);
    },
    addMenu: function (to) {
      // var arr = to? (to.children=to.children||[]):this.menu;//此方式新数组骨监听
      var arr = to? to.children:this.menu;
      arr.push(this.currMenu={
        name:'new',
        url:'',
        children:[]
      })
    },
    removeMenu: function(item){
      this.currMenu = null;
      var arr = this.menu;
      for (var i = 0; i < arr.length; i++) {
        var t = arr[i];
        if (t==item) {
          arr.splice(i,1)
        }else{
          var arrSub = t.children;
          for (var j = 0; j < arrSub.length; j++) {
            var t = arrSub[j];
            if (t==item) {
              arrSub.splice(j,1)
            }
          }
        }

      }
    }
  }
})
