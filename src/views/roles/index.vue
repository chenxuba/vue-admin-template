<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <span>
          <el-input v-model="rolesName" size="small" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
          <span class='filter-item'>
            <el-button size="mini" type="success" icon="el-icon-search">搜索</el-button>
            <el-button size="mini" type="warning" icon="el-icon-refresh-left">重置</el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus" v-permission="['add']">新增</el-button>
          </span>
        </span>
        <span>
          <el-button-group>
            <el-button icon="el-icon-search" size="mini"></el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="refresh"></el-button>
          </el-button-group>
        </span>
      </div>
    </div>
    <!--角色管理-->
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin-top: 20px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">角色列表</span>
        </div>
        <el-table ref="table" v-loading="loading" highlight-current-row style="width: 100%;" :data="data" @selection-change="selectionChangeHandler" @current-change="handleCurrentChange">
          <el-table-column type="expand" width="55">
            <template slot-scope="scope">
              <el-row :class="['bdbottom','vcenter',index === 0 ? 'bdtop' : '']" v-for="(item1,index) in scope.row.children" :key="index">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag>{{item1.authName}}
                    <el-popconfirm title="确定删除此权限吗？" @onConfirm='removeById(scope.row,item1.id)'>
                      <i class="el-icon-close" slot="reference"></i>
                    </el-popconfirm>
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二三级权限 -->
                <el-col :span="19">
                  <el-row v-for="(item2,i) in item1.children" :key="i" :class="['vcenter',i === 0 ? '': 'bdtop']">
                    <!-- 二级 -->
                    <el-col :span="6">
                      <el-tag type="success">{{item2.authName}}
                        <el-popconfirm title="确定删除此权限吗？" @onConfirm='removeById(scope.row,item2.id)'>
                          <i class="el-icon-close" slot="reference"></i>
                        </el-popconfirm>
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级 -->
                    <el-col :span="18">
                      <el-tag v-for="(item3,j) in item2.children" :key="j" type="warning">{{item3.authName}}
                        <el-popconfirm title="确定删除此权限吗？" @onConfirm='removeById(scope.row,item3.id)'>
                          <i class="el-icon-close" slot="reference"></i>
                        </el-popconfirm>
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" width="55" label="#" />
          <el-table-column prop="roleName" label="名称" />
          <el-table-column prop="dataScope" label="数据权限" />
          <el-table-column :show-overflow-tooltip="true" prop="roleDesc" label="描述" />
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ (scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" v-permission="['edit']">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" v-permission="['delete']">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-s-tools" v-permission="['role']" @click="showSetRolesDialog(scope.row )">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <!-- <pagination /> -->
      </el-card>
    </el-col>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" :visible.sync="rolesDialogVisible" width="50%" @close="colseDialog">
      <!-- 树形控件 -->
      <el-tree :data="rolesList" show-checkbox :props="treeProps" node-key="id" default-expand-all :default-checked-keys='defKeys'></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rolesDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from "axios";
export default {
  name: 'roles',
  data() {
    return {
      data: [],//角色列表
      rolesList: [],//所有权限的数据
      rolesName: "",
      loading: false,
      rolesDialogVisible: false,
      treeProps: {
        label: "authName",
        children: "children"
      },
      defKeys: []
    }
  },

  mounted() {
    axios.get("/api/people.json").then(res => {
      this.data = res.data.data;
    })
  },
  methods: {
    //搜索角色
    toQuery() {

    },
    selectionChangeHandler() {

    },
    handleCurrentChange() {

    },
    //根据id删除对应对权限
    removeById(row, id) {
      alert(row.id)
    },
    // 展示分配权限的弹窗
    showSetRolesDialog(role) {
      axios.get("/api/roles.json").then(res => {
        console.log(res);
        this.rolesList = res.data.data;
      })
      //递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.rolesDialogVisible = true
    },
    //通过递归的形式，获取角色下多有三级权限的id，并保存到defkeys 数组中
    getLeafKeys(node, arr) {
      //如果当前node节点不包含children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    colseDialog() {
      this.defKeys = []
    },
    refresh() {
      this.loading = true;
      axios.get("/api/people.json").then(res => {
        this.data = res.data.data;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 工具栏
.head {
  &-container {
    text-indent: -10px;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        display: flex;
        align-items: center;
      }
      .filter {
        &-item {
          margin-left: 10px;
        }
      }
    }
  }
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-icon-close {
  &:hover {
    color: #fff;
    background: red;
  }
}
</style>
