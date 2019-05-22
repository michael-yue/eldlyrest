<template>
  <div class="pos" :style="{height: myHeight}">
    <div class="leftcontainer" ref="critheader">
      <div style="flex: 0 0 auto; margin-bottom:10px">
        <el-card>
          <div slot="header" class="clearfix">
              <span>顾客扫二维码</span>
          </div>
          <div style="display:flex">
            <div :span="4" style="margin:10px 10px 0 0">顾客扫码</div>
            <div :span="12">
              <el-input v-model="qrcode" size="large" @keyup.enter.native="submit"/>
            </div>
            <audio id="bgMusic" src="/static/audio/payed.mp3" preload></audio>
          </div>
        </el-card>
      </div>
      <div style="flex: 0 0 auto; margin-bottom:10px">
        <el-card>
          <div slot="header" class="clearfix">
              <span>现金</span>
          </div>
          <div style="display:flex; margin-top:10px; flex-direction:column">
            <div style="display:flex;margin-bottom:5px">
              <div style="flex: 0 0 30%; margin:10px 0 0 0">会员卡号</div>
              <div style="flex: 1 0 auto; margin-right:10px">
                <el-input v-model="cardnumber" size="large" maxlength="30"/>
              </div>
            </div>
            <div style="display:flex;margin-bottom:5px">
              <div style="flex: 0 0 30%; margin-top:10px">现金</div>
              <div style="flex: 0 0 auto; margin-right:10px">
                <el-input v-model="cashamount" size="large" maxlength="4"/>
              </div>
            </div>
            <div :span="24" style="display:flex;justify-content:flex-end">
              <el-button plain size="large" type="primary" @click="buttonRecCash">收款</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div style="flex: 1 0 auto; flex-grow:1">
        <el-card>
          <div slot="header" class="clearfix">
              <span>营业收入</span>
          </div>
          <div style="display:flex; margin-top:10px; flex-direction:column">
            <div>
              <div style="flex: 0 0 30%; margin-top:10px">微信支付</div>
              <div style="flex: 0 0 auto; margin:0 10px 10px 0; text-align:right">
                笔数：{{sales.wxcount}}
              </div>
              <div style="flex: 0 0 auto; margin:0 10px 10px 0; text-align:right">
                金额：{{sales.wxamount}}
              </div>
            </div>
            <div>
              <div style="flex: 0 0 30%; margin-top:10px">现金支付</div>
              <div style="flex: 0 0 auto; margin:0 10px 10px 0; text-align:right">
                笔数：{{sales.cashcount}}
              </div>
              <div style="flex: 0 0 auto; margin:0 10px 10px 0; text-align:right">
                金额：{{sales.cashamount}}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="maincontainer">
      <div style="border:1px solid #f0f0f0; height:100%"  >
        <el-card>
          <div slot="header" class="clearfix">
              <span>收款历史</span>
          </div>
          <div style="display:flex; margin-top:10px; flex-direction:column">
            <ul>
              <li v-for="item in listpayed" :key="item.orderid" class="paylist">
                <div class="transdate">{{item.transdate}}</div>
                <div class="name">{{item.username}}</div>
                <div class="usertype">{{item.usertype}}</div>
                <div class="amount">{{item.amount}}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { payQrcode, payCash } from '@/api/pos.js'
export default {
  name: 'posindex',
  data() {
    return {
      qrcode: '',
      listpayed: [
        {
          orderid: '1',
          transdate: '2019-11-12 12:00',
          username: '王重阳',
          usertype: '普通用户',
          amount: 15
        }
      ],
      cardnumber: '',
      cashamount: '',
      myHeight: '',
      sales: {
        wxcount: 0,
        wxamount: 0,
        cashcount: 0,
        cashamount: 0
      }
    }
  },
  mounted() {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = 50 // this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight) + 'px'
    var that = this
    window.onresize = function windowResize() {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight ) + 'px'
    }
  },
  created: function() {
  },
  methods: {
    submit:function(){
      const param = {qrcode : this.qrcode}
      payQrcode(param).then(res => {
        // 20001???
        this.qrcode = ''
        this.listpayed.unshift(res)
        this.gamemuiscs1 = new Audio('/static/audio/payed.mp3')
        this.gamemuiscs1.play()
      }).catch(error => {
        console.log(error)
      })
   },
   buttonRecCash: function(){
     const param = {cardnumber : this.cardnumber, amount: this.cashamount}
      payCash(param).then(res => {
        // 20001???
        this.cardnumber = ''
        this.amount = ''
        this.listpayed.unshift(res)
      }).catch(error => {
        console.log(error)
      })
   }
  }
}
</script>

<style scoped>
.pos {padding:10px; display: flex; height: 100%;}
.el-card >>> .el-card__header { background: #b3d8ff;}
/* .el-card >>> .el-card__body {height:100%}
.el-card{height:100%} */
/* .critheader { padding:10px 20px; display:flex;} */
.leftcontainer {margin:10px 10px 0 10px; display: flex; flex-direction: column; }
.maincontainer{margin-top:10px; flex-grow: 1}
.paylist {display:flex; padding-bottom: 5px; padding-left:10px}
.paylist .name{min-width: 100px; flex: 0 0 20%}
.paylist .usertype{flex: 0 0 20%;text-align: right}
.paylist .transdate {flex: 0 0 30%}
.paylist .amount {flex: 0 0 20%; text-align: right}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

</style>