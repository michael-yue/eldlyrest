<template>
  <div class="cardlist">
    <div ref="critheader" class="critheader">
      <span style="flex:0 0 auto; margin-right:5px; font-size:14px">会员类型</span>
      <UserTypeSelector type="all" @UserTypeChanged="critUserTypeChangedEvent" />
      <div style="display:flex; align-items: center;margin:0 10px">
        <span style="flex:0 0 auto; margin-right:5px; font-size:14px">会员卡号</span>
        <el-input v-model="cardnumber" label="会员卡号" size="small" />
        <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">姓名</span>
        <el-input v-model="mobile" label="电话" size="small" />
        <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">电话</span>
        <el-input v-model="mobile" label="电话" size="small" />
        <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">生日</span>
        <el-input v-model="mobile" label="电话" size="small" />
      </div>
      <el-button plain size="small" type="primary" @click="query">查询</el-button>
      <el-button plain size="small" type="primary" @click="createDialog">新建</el-button>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-table
        v-loading="loading"
        ref="refTable"
        :data="tableData"
        :class="{'tablestyle': true}"
        :header-cell-style="tableheader"
        border
        size="small"
        height="100%">
        <el-table-column prop="id" label="编码" width="" header-align="center" align="left" />
        <el-table-column prop="realname" label="姓名" width="" header-align="center" align="left" />
        <el-table-column prop="gender" label="性别" width="" header-align="center" align="left" />
        <el-table-column prop="mobile" label="电话" width="" header-align="center" align="left" />
        <el-table-column prop="userType.name" label="类型" width="" header-align="center" align="left" />
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="showRecharge(scope.$index, scope.row)">充值</el-button>
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
    <el-dialog
      :visible.sync="dialogFormVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="true"
      title="会员信息"
      top="5vh">
      <div>
        <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="editForm.realName" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="卡号" prop="cardnumber">
            <el-input v-model="editForm.cardnumber" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="会员类型" prop="userType">
            <UserTypeSelector :user-type-id="editForm.usertypeId" @UserTypeChanged="UserTypeChangedEvent" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="updateData">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRechargeFormVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="true"
      title="会员充值"
      top="5vh">
      <div>
        <el-form :model="rechargeForm" label-width="180px">
          <el-form-item label="会员卡号">
            <el-input v-model="rechargeForm.cardnumber" />
          </el-form-item>
          <el-form-item label="充值金额">
            <el-input v-model="rechargeForm.rechargeamount" />
          </el-form-item>
          <el-form-item label="充值方式">
            <el-radio-group v-model="rechargeForm.payway">
              <el-radio-button :label="1">微信</el-radio-button>
              <el-radio-button :label="3">现金</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeRechargeDialog">取 消</el-button>
        <el-button type="primary" @click="recharge">充 值</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listAllUser, createCard, deleteUser } from '@/api/person.js'
import UserTypeSelector from '@/components/widgets/UserTypeSelector'

export default {
  name: 'PersonArpproveList',
  components: {
    UserTypeSelector
  },
  data() {
    return {
      myHeight: '',
      loading: false,
      // data table
      tableData: [],
      total: 0,
      limit: 10,
      currentPage: 1,
      critUserType: 0,
      cardnumber: '',
      mobile: '',
      // edit dialog
      dialogFormVisible: false,
      dialogRechargeFormVisible: false,
      usertypeId: '',
      editForm: {
        id: '',
        openid: '',
        realName: '',
        usertypeId: '',
        cardnumber: '',
        mobile: ''
      },
      editFormRules: {
        realname: [{ required: true, message: '请输入顺序号', trigger: 'blur' }],
        usertypeId: [{ required: true, message: '请输入代码', trigger: 'blur' }]
      },
      rechargeForm: {
        cardnumber: '',
        payway: 1,
        rechargeamount: ''
      }
    }
  },
  watch: {
    // critUserType(oldval, newval) {
    //   this.retrieve()
    // }
  },
  mounted() {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 100) + 'px'
    var that = this
    window.onresize = function windowResize() {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 100) + 'px'
    }
  },
  created: function() {
    // this.retrieve()
  },
  methods: {
    critUserTypeChangedEvent: function(event) {
      console.log(event)
      this.critUserType = event.userTypeId
    },
    query: function(){
      this.retrieve()
    },
    retrieve: function() {
      this.loading = true
      listAllUser(this.critUserType, this.cardnumber, this.mobile, this.currentPage, this.limit).then(response => {
        this.tableData = response.data
        this.total = response.totalnum
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    createDialog: function() {
      this.dialogFormVisible = true
    },
    tableheader({ row, index }) {
      return 'background:#E4E7ED;'
    },
    // 分页处理
    pagechange: function(currentPage) {
      this.currentPage = currentPage
      this.retrieve()
    },
    handleSizeChange: function(currentSize) {
      this.limit = currentSize
      this.retrieve()
    },
    UserTypeChangedEvent: function(event) {
      this.editForm.usertypeId = event.userTypeId
    },
    closeDialog: function() {
      this.$refs['editForm'].resetFields()
      this.dialogFormVisible = false
    },
    edit: function(index, row) {
      this.editForm.id = row.id
      this.editForm.realName = row.realname
      this.editForm.cardnumber = row.cardnumber
      this.editForm.mobile = row.mobile
      if (row.userType !== null) {
        this.editForm.usertypeId = row.userType.id
      } else {
        this.editForm.usertypeId = ''
      }
      this.dialogFormVisible = true
    },
    updateData: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              createCard(para).then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                }
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.retrieve()
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    showRecharge: function(index, row) {
      console.log(index)
      this.dialogRechargeFormVisible = true
    },
    recharge: function() {
      console.log('recharge')
    },
    closeRechargeDialog: function() {
      this.dialogRechargeFormVisible = false
    }
  }
}
</script>
<style scoped>
.critheader { padding:10px 20px; display:flex; justify-content: flex-start; align-items: center;}
</style>
