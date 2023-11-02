<template>
  <a-layout style="min-height: 100vh;width:100vw;">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" />

      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="state.collapsed"
        :items="items"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <div class="animateArea">
          <div class="animate-border">
            <i></i>
            <i></i>
          </div>
        </div>
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>User</a-breadcrumb-item>
          <a-breadcrumb-item>Bill</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">Bill is a cat.</div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">Ant Design ©2018 Created by Ant UED</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined
} from "@ant-design/icons-vue";
import { ref, reactive, watch, h } from "vue";
const collapsed = ref<boolean>(false);
// const selectedKeys = ref<string[]>(["1"]);
const state = reactive({
  collapsed: false,
  selectedKeys: ["1"],
  openKeys: ["sub1"],
  preOpenKeys: ["sub1"]
});
const items = reactive([
  {
    key: "1",
    icon: () => h(PieChartOutlined),
    label: "Option 1",
    title: "Option 1"
  },
  {
    key: "2",
    icon: () => h(DesktopOutlined),
    label: "Option 2",
    title: "Option 2"
  },
  {
    key: "3",
    icon: () => h(InboxOutlined),
    label: "Option 3",
    title: "Option 3"
  },
  {
    key: "sub1",
    icon: () => h(MailOutlined),
    label: "Navigation One",
    title: "Navigation One",
    children: [
      {
        key: "5",
        label: "Option 5",
        title: "Option 5"
      },
      {
        key: "6",
        label: "Option 6",
        title: "Option 6"
      },
      {
        key: "7",
        label: "Option 7",
        title: "Option 7"
      },
      {
        key: "8",
        label: "Option 8",
        title: "Option 8"
      }
    ]
  },
  {
    key: "sub2",
    icon: () => h(AppstoreOutlined),
    label: "Navigation Two",
    title: "Navigation Two",
    children: [
      {
        key: "9",
        label: "Option 9",
        title: "Option 9"
      },
      {
        key: "10",
        label: "Option 10",
        title: "Option 10"
      },
      {
        key: "sub3",
        label: "Submenu",
        title: "Submenu",
        children: [
          {
            key: "11",
            label: "Option 11",
            title: "Option 11"
          },
          {
            key: "12",
            label: "Option 12",
            title: "Option 12"
          }
        ]
      }
    ]
  }
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
// const toggleCollapsed = () => {
//   state.collapsed = !state.collapsed;
//   state.openKeys = state.collapsed ? [] : state.preOpenKeys;
// };
</script>
<style scoped lang="less">
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

// 动画效果边框
.animateArea {
  border: 1px solid rgba(255, 32, 32, 0.3);
  /* 宽高和相对定位是一定要给的,因为这会影响.animate-border子元素的定位 */
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;

  /* 利用伪元素和两个i元素产生4条线 */
  .animate-border {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
    }
    i {
      position: absolute;
      display: inline-block;
      height: 100%;
      width: 1px;
    }
    &::before {
      top: 0;
      left: -100%;
      background-image: linear-gradient(90deg, transparent, #000, transparent);

      animation: one 4s linear infinite;
    }
    i:nth-child(1) {
      top: -100%;
      right: 0;
      background-image: linear-gradient(180deg, transparent, #000, transparent);
      /* 动画名称  动画持续时间  动画渲染函数 动画延迟时间 动画执行次数 */
      animation: two 4s linear 1s infinite;
    }
    &::after {
      bottom: 0;
      right: -100%;
      background-image: linear-gradient(-90deg, transparent, #000, transparent);
      animation: three 4s linear 2s infinite;
    }
    i:nth-child(2) {
      bottom: -100%;
      left: 0;
      background-image: linear-gradient(360deg, transparent, #000, transparent);
      animation: four 4s linear 3s infinite;
    }
  }
}

@keyframes one {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

@keyframes two {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

@keyframes three {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

@keyframes four {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
