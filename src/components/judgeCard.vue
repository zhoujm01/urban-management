<template>
  <a-tabs v-model:activeKey="state.subSelectedKey" class="contentTab" @change="tabTitleClick">
    <template v-for="item in state.currentPageList" :key="item.key">
      <a-tab-pane :tab="item.title" class="contentArea">
        <div class="contentCardArea">
          <template v-for="(item2,index) in item.childContentList">
            <div
              class="contentItemArea"
              :style="{
                      'background-image': 'url('+item2.bgImg+')'
                    }"
            >
              <div class="contentItemTextArea" :id="'contentItemTextAreaId'+index">
                <a-typography class="contentItemText" :id="'contentItemTextId'+index">
                  <template v-if="item2.contentText.indexOf('\n')!=-1">
                    <template v-for="item3 in item2.contentText.split('\n')">
                      <a-typography-paragraph class="contentFont">{{ item3 }}</a-typography-paragraph>
                    </template>
                  </template>
                  <template v-else>
                    <a-typography-paragraph class="contentFont">{{ item2.contentText }}</a-typography-paragraph>
                  </template>
                </a-typography>
                <div class="showMore" v-if="item2.moreFlag">
                  <div>查看更多</div>
                </div>
              </div>
              <div class="contentItemTitleArea">
                <div class="contentItemTitle">{{ item2.title }}</div>
              </div>
            </div>
          </template>
        </div>
        <div>
          <a-pagination
            v-model:current="currentPage"
            :total="menuList[state.selectedIndex].childMenuList[state.subSelectedIndex].childContentList?.length"
            v-show="menuList[state.selectedIndex].childMenuList[state.subSelectedIndex].childContentList?.length>0"
            @change="changePage"
            :pageSize="pageSize"
            class="pageArea"
          />
        </div>
      </a-tab-pane>
    </template>
    <template #renderTabBar="{ DefaultTabBar, ...props }">
      <div class="tabTitleArea">
        <img :src="leftIcon" class="tabButton" @click="clickTabButton(1)" />
        <component :is="DefaultTabBar" v-bind="props" class="tabTitle" />
        <img :src="rightIcon" class="tabButton" @click="clickTabButton(2)" />
      </div>
    </template>
  </a-tabs>
</template>
  
  <script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, toRefs, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  dtdata: Object,
  index: Number
});
// $(window).on("load", function() {});
const dtdata = toRefs(props.dtdata);
const index = ref(props.index);
// debugger;
</script>
  <style lang="less">
// .chartbox {
//   width: 100%;
//   height: 100%;
// }
// #echarts1 {
//   width: 100%;
//   height: 100%;
// }
.contentItemArea {
  // background: #fff;
  min-width: 120px;
  width: calc(32% - 20px);
  margin: 0px 10px;
  height: calc(80vh - 50px);
  background-repeat: no-repeat;
  // background-size: 100%;
  // background-size: auto 100%;
  background-size: cover;
  // justify-content:center;
  display: flex;
  flex-direction: column;
  position: relative;

  // background-position: center;
  .contentItemTextArea {
    margin: 30px 10px;
    height: calc(100% - 120px);
    overflow: hidden;
    // position: relative;
    // display: flex;
    // justify-content: center;
    // width: 100%;
    .contentItemText {
      // width:fit-content;
      width: 100%;
      // height: 100%;
      // overflow: auto;
      // overflow: hidden;
      .contentFont {
        // width: calc(100% - 40px);
        margin: 30px 20px;
        text-align: left;
      }
    }
  }
  .showMore {
    position: absolute;

    // top: 0px;
    bottom: 65px;
    // bottom: -20px;
    // left: 20px;
    width: calc(100% - 20px);
    color: rgb(0, 190, 201);
    // z-index: 1;
  }
  .contentItemTitleArea {
    // position: relative;
    display: flex;
    justify-content: center;
    .contentItemTitle {
      // width: 30%;
      background: rgb(0, 190, 201);
      font-size: 20px;
      padding: 3px 30px;
      border-radius: 50px;
      color: #fff;
    }
  }
}
</style>
  