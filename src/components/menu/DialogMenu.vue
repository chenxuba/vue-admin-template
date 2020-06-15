<template>
  <div class="dialogmenu">
    <el-dialog :title="dialogMenu.title" :visible.sync="dialogMenu.show" :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body="false">
      <el-form ref="form" :inline="true" :model="formData" :rules="rules" size="small" label-width="80px">
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="formData.type" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 点击选择图标 -->
        <el-form-item v-show="formData.type.toString() !== '2'" label="菜单图标" prop="icon">
          <el-popover placement="bottom-start" width="450" trigger="click" @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="formData.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
              <svg-icon v-if="formData.icon" slot="prefix" :icon-class="formData.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <!-- 菜单标题 -->
        <el-form-item v-if="formData.type.toString() !== '2'" label="菜单标题" prop="title">
          <el-input v-model="formData.title" :style="formData.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
        </el-form-item>
        <!-- 按钮名称 -->
        <el-form-item v-if="formData.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="formData.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
        <!-- 权限标识 -->
        <el-form-item v-show="formData.type.toString() !== '0'" label="权限标识" prop="permission">
          <el-input v-model="formData.permission" :disabled="formData.iframe" placeholder="权限标识" style="width: 178px;" />
        </el-form-item>
        <!-- 路由地址 -->
        <el-form-item v-if="formData.type.toString() !== '2'" label="路由地址" prop="path">
          <el-input v-model="formData.path" placeholder="路由地址" style="width: 178px;" />
        </el-form-item>
        <!-- 菜单排序 -->
        <el-form-item label="菜单排序" prop="menuSort">
          <el-input-number v-model.number="formData.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
        </el-form-item>
        <!-- 组件名称 -->
        <el-form-item v-show="!formData.iframe && formData.type.toString() === '1'" label="组件名称" prop="componentName">
          <el-input v-model="formData.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
        </el-form-item>
        <!-- 组件路径 -->
        <el-form-item v-show="!formData.iframe && formData.type.toString() === '1'" label="组件路径" prop="component">
          <el-input v-model="formData.component" style="width: 178px;" placeholder="组件路径" />
        </el-form-item>
        <!-- 选择上级类目 -->
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenu.show = false" size="small">取 消</el-button>
        <el-button type="primary" @click="dialogMenu.show = false" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dialogmenu',
  props: {
    dialogMenu: Object,
    formData: Object
  },
  data() {
    return {
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 选中图标
    selected(name) {
      this.formData.icon = name
    }
  },
  components: {
    IconSelect: resolve => {
      require(['@/components/IconSelect/index.vue'], resolve)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>