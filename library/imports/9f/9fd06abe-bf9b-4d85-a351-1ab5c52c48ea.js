"use strict";
cc._RF.push(module, '9fd06q+v5tNhaNRGrXFLEjq', 'Game');
// scripts/Game.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // 这个属性引用了星星的预制资源
    starPrefab: {
      default: null,
      type: cc.Prefab
    },
    // 星星产生后消失时间的随机范围
    maxStarDuration: 0,
    minStarDuration: 0,
    // 地面节点，用于确定星星生成的高度
    ground: {
      default: null,
      type: cc.Node
    },
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    player: {
      default: null,
      type: cc.Node
    },
    // score label 的引用
    scoreDisplay: {
      default: null,
      type: cc.Label
    },
    // 得分音效资源
    scoreAudio: {
      default: null,
      type: cc.AudioClip
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad: function onLoad() {
    // 初始化计时器
    this.timer = 0;

    // 获取地平面的 y 轴坐标
    this.groundY = this.ground.y + this.ground.height / 2;
    // 生成一个新的星星
    this.spawnNewStar();

    // 初始化计分
    this.score = 0;
  },
  start: function start() {},
  update: function update(dt) {
    // 每帧更新计时器，超过限度还没有生成新的星星
    if (this.timer > this.starDuration) {
      // 调用游戏失败逻辑
      this.gameOver();
      return;
    }
    this.timer += dt;
  },
  gameOver: function gameOver() {
    // 停止 player 节点的跳跃动作，让节点上的所有 Action 都失效
    this.player.stopAllActions();
    // 重新加载游戏场景 game，也就是游戏重新开始
    cc.director.loadScene("game");
  },
  gainScore: function gainScore() {
    this.score += 1;
    // 更新 scoreDisplay Label 的文字
    this.scoreDisplay.string = "Score: " + this.score;
    // 播放得分音效
    cc.audioEngine.playEffect(this.scoreAudio, false);
  },
  spawnNewStar: function spawnNewStar() {
    // 使用给定的模板在场景中生成一个新的节点
    // instantiate 方法的作用是：克隆指定的任意类型的对象，或者从 Prefab 实例化出新节点，返回值为 Node 或者 Object
    var newStar = cc.instantiate(this.starPrefab);
    // 将新增的节点添加到 Canvas 节点下面
    this.node.addChild(newStar);
    // 为星星设置一个随机位置
    newStar.setPosition(this.getNewStarPosition());
    // 在星星组件上缓存 Game 对象引用
    newStar.getComponent("Star").game = this;

    // 重置计时器，根据消失时间范围随机取一个值
    this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
    this.timer = 0;
  },
  getNewStarPosition: function getNewStarPosition() {
    var randX = 0;
    var randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 20;
    // 根据屏幕宽度，随机得到一个星星 x 坐标
    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;
    // 返回星星坐标
    return cc.v2(randX, randY);
  }
});

cc._RF.pop();