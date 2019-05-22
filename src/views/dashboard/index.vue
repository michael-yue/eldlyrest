<template>
  <div class="pos" :style="{height: myHeight}">
    <div class="leftcontainer" ref="critheader">
      <div style="flex: 0 0 auto; margin-bottom:10px">
        <el-card>
          <div slot="header" class="clearfix">
              <span>顾客扫二维码</span>
          </div>
          <div style="display:flex">
            <div :span="4" style="margin:10px 10px 0 0;font-size:14px">顾客扫码</div>
            <div :span="12">
              <el-input v-model="qrcode" size="small" @keyup.enter.native="submit"/>
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
              <div style="flex: 0 0 30%; margin:10px 0 0 ;font-size:14px">会员卡号</div>
              <div style="flex: 1 0 auto; margin-right:10px">
                <el-input v-model="cardnumber" size="small" maxlength="30" @keyup.enter.native="queryPerson"/>
              </div>
            </div>
            <div style="display:flex;margin-bottom:5px">
              <div style="flex: 0 0 30%; margin-top:10px;font-size:14px">现金</div>
              <div style="flex: 0 0 auto; margin-right:10px">
                <el-input v-model="cashamount" size="small" maxlength="4"/>
              </div>
            </div>
            <div :span="24" style="display:flex;justify-content:center;margin-top:10px">
              <el-button plain size="small" type="primary" @click="buttonRecCard">刷卡余额</el-button>
              <el-button plain size="small" type="primary" @click="buttonRecCash">现金收款</el-button>
            </div>
          </div>
        </el-card>
      </div>
      <div style="flex: 1 0 auto; flex-grow:1">
        <el-card style="overflow:auto">
          <div slot="header" class="clearfix">
              <span>营业收入</span>
          </div>
          <div style="display:flex; margin-top:10px; flex-direction:column;font-size:14px">
            <div style="display:flex; margin-bottom:10px">
              <div style="flex: 0 0 30%; color:#409EFF">微信支付</div>
            </div>
            <div style="display:flex; margin-bottom:10px">
              <div style="flex: 0 0 30%; text-align:right">营业</div>
              <div style="flex: 0 0 30%; text-align:right">
                笔数：{{sales.wxcount}}
              </div>
              <div style="flex: 0 0 40%; text-align:right">
                金额：{{sales.wxamount}}
              </div>
            </div>
            <div style="display:flex; margin-bottom:10px;font-size:14px">
              <div style="flex: 0 0 30%; text-align:right;">会员充值</div>
              <div style="flex: 0 0 30%; text-align:right;">
                笔数：{{sales.wxrechargecount}}
              </div>
              <div style="flex: 0 0 40%; text-align:right">
                金额：{{sales.wxrechargeamount}}
              </div>
            </div>
            <div style="display:flex; margin-bottom:10px">
              <div style="flex: 0 0 30%; color:#409EFF">现金支付</div>
            </div>
            <div style="display:flex; margin-bottom:10px">
              <div style="flex: 0 0 30%; text-align:right">营业</div>
              <div style="flex: 0 0 30%; text-align:right">
                笔数：{{sales.cashcount}}
              </div>
              <div style="flex: 0 0 40%; text-align:right">
                金额：{{sales.cashamount}}
              </div>
            </div>
            <div style="display:flex; margin-bottom:10px">
              <div style="flex: 0 0 30%; text-align:right">会员充值</div>
              <div style="flex: 0 0 30%; text-align:right">
                笔数：{{sales.cashrechargecount}}
              </div>
              <div style="flex: 0 0 40%; text-align:right">
                金额：{{sales.cashrechargeamount}}
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
              <span>收款记录</span>
          </div>
          <div style="display:flex; margin-top:10px; flex-direction:column;font-size:14px">
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
import { payQrcode, payCash, payCardBalance } from '@/api/pos.js'
import { queryPerson } from '@/api/person.js'
import { getSalesToday } from '@/api/report.js'
export default {
  name: 'posindex',
  data() {
    return {
      qrcode: '',
      listpayed: [],
      cardnumber: '',
      cashamount: '',
      myHeight: '',
      sales: {
        wxcount: 1,
        wxamount: 10,
        cashcount: 2,
        cashamount: 30,
        wxrechargecount: 0,
        wxrechargeamount: 0,
        cashrechargecount: 0,
        cashrechargeamount: 0,
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
    this.refreshSales()
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
        this.refreshSales()
      }).catch(error => {
        console.log(error)
      })
    },
    refreshSales: function() {
      getSalesToday().then(res => {
        this.sales.wxcount = res.data.wxcount
        this.sales.wxamount = res.data.wxamount
        this.sales.cashcount = res.data.cashcount
        this.sales.cashamount = res.data.cashamount
        this.sales.wxrechargecount = res.data.wxrechargecount
        this.sales.wxrechargeamount = res.data.wxrechargeamount
        this.sales.wxrechargecount = res.data.cashrechargecount
        this.sales.wxrechargeamount = res.data.cashrechargeamount
      }).catch(error => {
        console.log(error)
      })
    },
    buttonRecCash: function(){
      const param = {cardnumber : this.cardnumber, cashamount: this.cashamount}
      payCash(param).then(res => {
        // 20001???
        this.cardnumber = ''
        this.cashamount = ''
        this.listpayed.unshift(res)
        this.refreshSales()
      }).catch(error => {
        console.log(error)
      })
    },
    buttonRecCard: function() {
      if (this.carnumber === '') {
        return
      }
      const param = { cardnumber: this.cardnumber }
      payCardBalance(param).then(res => {
        // 20001???
        this.cardnumber = ''
        this.cashamount = ''
        this.listpayed.unshift(res)
        this.refreshSales()
      }).catch(error => {
        console.log(error)
      })
      console.log('buttonRecCard')
    },
    queryPerson: function() {
      queryPerson(this.cardnumber).then(res => {
        console.log(res)
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
/* .el-card >>> .el-card__body {padding:20px} */
.el-card{overflow: hidden;} 
/* .critheader { padding:10px 20px; display:flex;} */
.leftcontainer {margin:10px 10px 0 10px; display: flex; flex-direction: column; }
.maincontainer{margin-top:10px; flex-grow: 1}
.paylist {display:flex; padding-bottom: 10px; padding-left:10px}
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