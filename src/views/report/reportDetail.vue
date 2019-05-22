<template>
  <div class="orderlist">
    <div ref="critheader" style="padding:10px 20px">
      <el-card>
        <span style="font-size:14px">选择日期：</span>
        <el-date-picker
          v-model="dateRange"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
        <!-- <el-button :loading="downloading" type="primary" plain size="small" icon="document" @click="handleDownload">导出excel</el-button> -->
      </el-card>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <div ref="tableheader" style="display:flex;flex-direction:column;padding:10px">
        <div style="width:100%;text-align:center;font-size:16px;color:#606266">统计报表</div>
        <div style="display:flex; font-size:14px;color:#606266">
          <div style="flex:1 1 auto; text-align:right"> 报表日期：{{ repdate }}</div>
        </div>
      </div>
      <el-table id="datatable" :data="orders" :header-cell-style="tableheader" border size="small" height="100%">
        <el-table-column prop="transDate" label="日期" >
          <template slot-scope="scope">
            <div>{{ scope.row.transDate.time | formatDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="user.realname" label="姓名" align="right"/>
        <el-table-column prop="payWay" label="支付方式" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.payWay === '1'">微信支付</div>
            <div v-else>现金支付</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right"/>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.$index, scope.row)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px; text-align: right">
        <el-pagination
          :current-page="currentPage"
          :page-size="limit"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="pagechange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getTransList } from '@/api/report'
import { parseTime, getYesterday, getThisPeriodStart, getThisPeriodEnd,
  getLastPeriodStart, getLastPeriodEnd, getThisMonthStart, getThisMonthEnd,
  getLastMonthStart, getLastMonthEnd } from '@/utils'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'CashReport',
  filters: {
    formatDate(time) {
      const date = new Date(time)
      return parseTime(date, '{yyyy}-{m}-{d} {h}:{i}:{s}')
    }
  },
  data() {
    return {
      orders: [],
      myHeight: '',
      repdate: '',
      selectedUserType: '',
      dateRange: [],
      total: 0,
      limit: 10,
      currentPage: 1,
      pickerOptions: {
        shortcuts: [
          {
            text: '昨日',
            onClick(picker) {
              picker.$emit('pick', [getYesterday(), getYesterday()])
            }
          }, {
            text: '本期',
            onClick(picker) {
              picker.$emit('pick', [getThisPeriodStart(), getThisPeriodEnd()])
            }
          }, {
            text: '上期',
            onClick(picker) {
              picker.$emit('pick', [getLastPeriodStart(), getLastPeriodEnd()])
            }
          }, {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', [getThisMonthStart(), getThisMonthEnd()])
            }
          }, {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', [getLastMonthStart(), getLastMonthEnd()])
            }
          }
        ]
      }
    }
  },
  watch: {
    dateRange: function(val, oldval) {
      this.retrieveData()
    }
  },
  mounted() {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    const tableheaderheight = this.$refs.tableheader.offsetHeight
    this.myHeight = (h - critheaderheight - tableheaderheight - 100) + 'px'
    var that = this
    window.onresize = function windowResize() {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - tableheaderheight - 100) + 'px'
    }
  },
  created: function() {
    //
  },
  methods: {
    retrieveData() {
      this.orders = []
      var repdatefrom = parseTime(new Date(this.dateRange[0]), '{y}-{m}-{d}')
      var repdateto = parseTime(new Date(this.dateRange[1]), '{y}-{m}-{d}')
      this.repdate = parseTime(new Date(this.dateRange[0]), '{y}年{m}月{d}日') +
      '到' + parseTime(new Date(this.dateRange[1]), '{y}年{m}月{d}日')
      getTransList('001', repdatefrom, repdateto, this.currentPage, this.limit).then(response => {
        this.orders = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    /*
    * 以下设置class
    */
    tableheader({ row, index }) {
      return 'background:#DCDFE6;'
    },
    handleDownload() {
      this.downloading = true
      // require.ensure([], () => {
      //   // const { export_json_to_excel } = require('@/vendor/Export2Excel')
      //   // const tHeader = ['日期', '姓名', '地址']
      //   // const filterVal = ['itemid', 'planamount1', 'actualamount1']
      //   // const list = this.tableData
      //   // const data = this.formatJson(filterVal, list)
      //   // export_json_to_excel(tHeader, data, '利润报表')
      //   const { export_table_to_excel } = require('@/vendor/Export2Excel')
      //   export_table_to_excel(id)
      //   this.downloading = false
      // })
      // const wb = XLSX.utils.table_to_book(document.querySelector('#datatable'))
      /* get binary string as output */
      // const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去，
      var fix = document.querySelector('.el-table__fixed')
      var wb
      if (fix) {
        wb = XLSX.utils.table_to_book(document.querySelector('#datatable').removeChild(fix))
        document.querySelector('#datatable').appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(document.querySelector('#datatable'))
      }

      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: 'application/octet-stream'
          }),
          '人员就餐统计.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      this.downloading = false
      return wbout
    }
  }
}
</script>

<style scoped>
.orderlist{display: flex; flex-direction: column;flex-flow: column;align-items: stretch;height:100%}
.el-card >>> .el-card__body {height:100%}
.el-card{height:100%}
.ordercontents {display:flex; padding:5px; font-size:14px}
.billtype {flex:1 1 200px}
.amount{flex:1 1 200px; text-align: right}
</style>
