# Is the Vote Manipulated by Russians?

Chart.js: A JavaScript library for charting https://www.chartjs.org/
Beginner Java Tutorial: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/What_is_JavaScript


## Plan B: 微信投票/Google Form

### Requirements for Madstar Voting System: 
* 活动大概有500人到现场
* 比赛分很多轮进行 所以每次Matchup需要输入新的选手信息到Voting Program里
* 限制每个人只能投一票
1. MAC地址
1. IP地址
1. Cookies
* 投票的网页如何发送到每一个人的设备上
* 门票上印二维码
* 每个人的二维码不一样来确保只能投票一次

## 投票有哪些选项 可以一次投几个选手

启动接口  (只面对技术部成员 观众无法看到)
管理界面
创建一个投票组 
告诉程序哪些选手在对抗  (传数组?)
投票启动
Group里面有不同的Choice

投票的Life Cycle
关闭 aka.睡觉/睡眠
投票收集 aka.采集
开始新一轮投票
屏幕上显示采集时长是xxx秒 (倒计时)
允许在采集时开始新一轮投票 覆盖上一轮结果
结果 aka.结果
倒计时结束后状态转移到
重新回到睡眠状态(?)
再关闭 aka.

如何和用户交互
睡眠Phase: 欢迎界面
先登陆用户自己的Code
然后进入系统对应的Phase

采集Phase: 选项/倒计时
Optional: 实时显示投票结果 (长连接)
点击选项时触发Vote接口
选项名(选手)
除了采集Phase都会被禁用
每Call一次留下cookie做标记
显示门票上的Code
后端服务器每次收到投票时检查设备上有没有之前的Code
投票后按键会被禁用
结果Phase: 显示结果
投完票回到什么界面?
获取状态接口
根据目前状态前端决定显示什么界面
拿到投票选项和结果后分别显示选项和结果?
决定是在大屏幕还是在用户设备界面上显示

管理员界面看起来是什么样?

多个设备同时访问服务器---> @Galvin
