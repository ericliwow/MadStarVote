var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 投票状态常量
const ACTIVE_STATUS = 0;
const SLEEP_STATUS = 1;
const DEFAULT_DURATION = 60;
const DEFAULT_MAX_CHOICE = 1;
class Vote {
   /* 我现在想到可能用得上的variable */
   // candidates = [];
   // duration = DEFAULT_DURATION;
   // maxChoice = DEFAULT_MAX_CHOICE;
   // status = SLEEP_STATUS;
   // // Javascript Object
   // // 样例: voteCnt[candidates[i]]++
   // voteCnt = {};

   /**
    *
    * @param {*} candidates ["选手名单"]
    * @param {*} duration 投票的采集阶段时长 (按秒计算)
    * @param {*} maxChoice 观众可以最多选择几个选项
    */
   constructor(candidates, duration=DEFAULT_DURATION, maxChoice=DEFAULT_MAX_CHOICE) {
      if(!Array.isArray(candidates))
         candidates=null;
      else if(isNaN(duration))
         duration=null;
      else if(Math.sign(maxChoice)!=1)
         maxChoice=null;
      else{
      this.candidates = candidates;
      this.duration = duration;
      this.maxChoice = maxChoice;
      this.status=SLEEP_STATUS;
      for(var i=0;i<candidates.length;i++){
         this.voteCnt[candidates[i]] = 0;
      }
      
      }
   }

   /**
    * 默认创建投票时，状态应该为sleep
    * 转换投票状态 (sleep <-> active)
    */
   toggleStatus() {
     if(this.status === 1){
       this.status = 0;
     }else if(this.status === 0){
       this.status = 1;
     }
   }

   /**
    * 收集一枚观众的投票
    * 应该只在状态是active的时候收集投票
    */

   collectTicket(choices) {
      if(this.status.equals(ACTIVE_STATUS)&&choices.length<=this.maxChoice){
         for(var i=0;i<choices.length;i++)
            voteCnt[choices[i]]++;
      }
   }
   /**
    * 当投票被激活后,利用 setTimeout 函数开始倒计时
    * 时间到了以后自动切换状态
    */
   beginCountDown() {
     //const now = new Date.getTime();
     //const endpoint = now + durtion;
     var timer = duration;
     var minutes = parseInt(timer / 60, 10);
     var seconds = parseInt(timer % 60, 10);

     minutes = minutes < 10 ? "0" + minutes : minutes;
     seconds = seconds < 10 ? "0" + seconds : seconds;

    // display.textContent = minutes + ":" + seconds;
    console.log(minutes + ":" + seconds);

     //end timeout
     if (timer < 0) {
           toggleStatus();
       }
   }

   /* 把所有 Vote 的变量都打印出来方便debug */
   toString() {
     console.log(this.status);
     console.log(voteCnt);
   }
 }


// 全局变量: 用于储存当前的投票
currVote  = new Vote();
console.log(currVote.candidates);
// TODO: 删掉这段教学代码
app.get('/', function(req, res){
   res.send("Hello world!");
});

// 创建一个投票, 保存或者覆盖到 currVote
app.post('/createPoll', function(req,res){
   var params = req.body
   console.log(JSON.stringify(params))
   // TODO: 检查格式 + 创建 Vote Object
   res.send("Success")
})

// 利用 toggleStatus 激活当前的投票
app.get('/startPoll', function(req, res){

})

// 利用 collectTicket() 收集投票
app.get('/vote', function(req, res){

})

// 返回当前系统状态
// 如果 currVote = undefined, 提示 "暂时没有投票"
// 如果 currVote.status = ACTIVE_STATUS, 提示"投票还有多久结束以及当前投票"
// 如果 currVote.status = SLEEP_STATUS, 显示当前票数 (投票刚刚创建的时候，大家都是0票)
app.post('/getStatus', function(req, res){

})

app.listen(3000);
