(function(){

var Event = new Vue();

var alert_sound = document.getElementById("alert-sound");
var myinput = document.getElementById("task-input");

Vue.component('task',{
     template:'#task-tpl',
     props:['todo'],
     methods:{
       action: function (name,params){
          Event.$emit(name, params);  //事件调度器
       }
     }
})

new Vue({
   el:"#main",
   data:{
      list:[],
      current:{
        // title:",,,",
        // completed:false,
        // description:'...',
        // alert_at:'2020-10-01'
        // id:...
        //alert_confirmed:false
      },
      last_id:0
        },
      mounted:function()
      {
        var me = this;
        this.list = ms.get('list') || [];
        this.last_id = ms.get('last_id') || this.last_id;

        setInterval(function(){
          me.check_alerts();
        },1000);


        Event.$on('remove',function(params){   //事件调度器
           if(params) me.remove(params);
        });

        Event.$on('toggle_complete',function(params){   //事件调度器
           if(params) me.toggle_complete(params);
        });

        Event.$on('set_current',function(params){   //事件调度器
           if(params) me.set_current(params);
        });

        Event.$on('toggle_detail',function(params){   //事件调度器
           if(params) me.toggle_detail(params);
        });

      },
      methods:{

        check_alerts(){
          var me = this;
          this.list.forEach(function (row,i) {
            var alert_at = row.alert_at;
              if(!alert_at || row.alert_confirmed) {  alert_sound.pause(); return};
              console.log("row.alert_at:",row.alert_at);

              var alert_at = (new Date(alert_at)).getTime();  //获取时间戳
              var now = (new Date()).getTime();
              console.log("timestamp",alert_at);

              if(now>=alert_at)
              {
                alert_sound.play();
                var confirmed = confirm(row.title);
                Vue.set(me.list[i],'alert_confirmed',confirmed);
              }

          })

        },

        merge(){
          var is_update,id;
          is_update = id = this.current.id;
          if(is_update){ //更新

          //findIndex找到数组中id为当前点击的这个的那一条记录

            var index = this.list.findIndex(function(item){return item.id == is_update;});

           Vue.set(this.list, index, Object.assign({},this.current));

         }else{ //新建

            var title = this.current.title;
            if(!title) return;

            var todo = Object.assign({},this.current);

            this.last_id++;
            ms.set('last_id',this.last_id);

            todo.id=this.last_id;//主键

             this.list.push(todo);
           }


           this.set_current({});//清空

        },
        toggle_detail: function(id){
              var index = this.list.findIndex(function(item){return item.id == id; });
              Vue.set(this.list[index],'show_detail',!this.list[index].show_detail);
        },

        remove(id){
          var index = this.list.findIndex(function(item){return item.id == id; });

          this.list.splice(index,1);

        },

        set_current(todo){
             this.current = Object.assign({},todo);
        },

        toggle_complete(id){
          var i = this.list.findIndex(function(item){return item.id == id; });
           //vue不能直接改data里数组的内容
          Vue.set(  this.list[i], 'completed', !this.list[i].completed);
        }

      },
      watch:{
        list:{
          deep:true,
          handler:function(newval){
              if(newval){
                 ms.set('list',newval);
              }else{
                 ms.set('list',[]);
              }
          }
        }
      }
   })


})();
