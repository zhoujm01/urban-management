<template>
  <div class="mainPage">
    <!-- <div>
      搜索
      <a-input-search v-model:value="value" placeholder="请输入搜索内容" enter-button @search="onSearch" />
    </div>-->
    <div>
      目录
      <!-- <a-tree
        show-icon
        :default-expanded-keys="['communication']"
        :tree-data="treeData"
        @select="onSelect"
      ></a-tree>-->
    </div>
    <div>
      <div>标题</div>
      <div>内容</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const value = ref<string>("");

const onSearch = (searchValue: string) => {
  console.log("use value", searchValue);
  console.log("or use this.value", value.value);
};
</script>