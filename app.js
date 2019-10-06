var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 使用ejs来传递
app.set('view engine', 'ejs');

// css文件可被ejs文件访问
app.use(express.static('assets'));


// 投票状态常量
const ACTIVE_STATUS = 0;
const SLEEP_STATUS = 1;
const DEFAULT_DURATION = 60;
const DEFAULT_MAX_CHOICE = 1;
class Vote {
   /**
    *
    * @param {*} candidates ["选手名单"]
    * @param {*} duration 投票的采集阶段时长 (按秒计算)
    * @param {*} maxChoice 观众可以最多选择几个选项
    */
   constructor(candidates, duration=DEFAULT_DURATION, maxChoice=DEFAULT_MAX_CHOICE) {
      candidates = JSON.parse(candidates);
      if(!Array.isArray(candidates)){
         candidates=null;
         throw "选手名单不是数组";
      }
      else if(isNaN(duration)){
         duration=null;
         throw "投票持续时间不是数字";
      }
      else if(Math.sign(maxChoice)!=1){
         maxChoice=null;
         throw "最大选择数量不是正整数";
      }
      else{
         this.candidates = candidates;
         this.duration = duration;
         this.maxChoice = maxChoice;
         this.status=SLEEP_STATUS;
         this.voteCnt = {};
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
     if(this.status === ACTIVE_STATUS){
       this.status = SLEEP_STATUS;
     }else if(this.status === SLEEP_STATUS){
       this.status = ACTIVE_STATUS;
     }
   }


   /**
    * 收集一枚观众的投票
    * 应该只在状态是active的时候收集投票
    */

   collectTicket(choices) {
      console.log(`choices: ${choices}`);
      if(this.status == ACTIVE_STATUS && choices.length<=this.maxChoice){
         for(var i=0;i<choices.length;i++){
            this.voteCnt[choices[i]]++;
         }
      }else{
         throw `${JSON.stringify(choices)}  投票无效`;
      }
   }
   /**
    * 当投票被激活后,利用 setTimeout 函数开始倒计时
    * 时间到了以后自动切换状态
    */
   beginCountDown() {
      if (this.status === ACTIVE_STATUS){
         // 如果已经开始了
         // 那么不做任何事情
         // 如果需要重启投票
         // 应该创建新的 Vote Object
         throw "已经开启过该投票了"
      }
      // 激活投票系统
      this.toggleStatus();
      // 纪录投票开始的时间点
      this.startTime = new Date();
      // 在规定时间后，重新进入睡眠状态
      setTimeout(this.toggleStatus, this.duration * 1000);
      // 计算投票结束时间
      var endTime = new Date(this.startTime);
      endTime.setSeconds(this.startTime.getSeconds() + this.duration)
      this.endTime = endTime
   }

   /* 把所有 Vote 的变量都打印出来方便debug */
   toString() {
      console.log(`状态: ${this.status}`)
      console.log('-----------------------------')
      console.log(`投票数量: \n${this.voteCnt}`)
      console.log('-----------------------------')
      console.log(`投票开始时间: ${this.startTime}`)
      console.log('-----------------------------')
      console.log(`投票持续时间: ${this.duration}`)
      console.log('-----------------------------')
      console.log(`理论投票结束时间: ${this.endTime}`)
   }
 }


// 全局变量: 用于储存当前的投票
currVote  = undefined;
var page = undefined;


app.get('/', function(req, res){
  //page = fs.readFileSync('index.html').toString();
   if (currVote !== undefined)
      res.render('index', {vote: currVote.candidates});
   else
      res.render('index', {vote: ["投票尚未开始", "苟利国家"]});
  // res.send(page);

});

// 创建一个投票, 保存或者覆盖到 currVote
app.post('/createPoll', function(req,res){
   var params = req.body
   console.log(JSON.stringify(params))
   // TODO: 检查格式 + 创建 Vote Objec
   var response;
   try{
      currVote = new Vote(params.candidates, params.duration, params.maxChoice)
      response = "Success!";
   }catch(msg){
      currVote = null;
      console.error("错误原因: " + msg);
      response = "ERROR: " + msg;
   }
   res.send(response);
})

// 利用 toggleStatus 激活当前的投票
app.get('/startPoll', function(req, res){
   if(!currVote){
      res.send("尚未创建任何投票!");
      return;
   }
   var response;
   try{
      currVote.beginCountDown();
      response = `SUCCESS: ${currVote.endTime}`;
   }catch(msg){
      response = "ERROR: " + msg;
   }
   res.send(response);
})

// 利用 collectTicket() 收集投票
app.post('/vote', function(req, res){
   var params = req.body;
   console.log("params");
   console.log(params);
   console.log(JSON.parse(params.candidates))
   var response;
   try{
      currVote.collectTicket(JSON.parse(params.candidates));
      response = "SUCCESS";
   }catch(msg){
      response = "ERROR: " + msg;
   }
   res.send(response);
})

// 返回当前系统状态
// 如果 currVote = undefined, 提示 "暂时没有投票"
// 如果 currVote.status = ACTIVE_STATUS, 提示"投票还有多久结束以及当前投票"
// 如果 currVote.status = SLEEP_STATUS, 显示当前票数 (投票刚刚创建的时候，大家都是0票)
app.get('/getStatus', function(req, res){
   if (!currVote){
      res.send("暂时没有创建任何投票");
   }else{
      var response = {
         voteCnt: currVote.voteCnt,
         endTime: currVote.endTime,
      };
      response.onGoing = (currVote.status == ACTIVE_STATUS);
      res.send(response);
   }
})

app.use('/assets',express.static('assets'));

app.listen(3000);
