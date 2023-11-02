<template>
  <div class="page">
    <div class="backgroundArea">
      <div class="backgroundImg" id="main">
        <!-- 标题栏 -->
        <div class="titleArea">
          <div>
            <div>时间</div>
            <div>用户</div>
          </div>
          <div>
            <div>
              <img class="title1" src="/picture/浦东城管智能综合信息平台.png" />
            </div>
            <div>
              <img class="title2" src="/picture/无人机云平台.png" />
            </div>
          </div>
          <div>
            <div>搜索框</div>
          </div>
        </div>
        <!-- 中部区域 -->
        <div class="centerArea">
          <!-- 左侧 -->
          <!-- <div class="leftMenuArea"> -->
          <div class="leftMenuArea" :style="{width: state.collapsed? '110px':'60px'}">
            <div class="menuButtonArea" @click="toggleCollapsed">
              <img src="/picture/MENU.png" class="menuButton" />
              <img src="/picture/右侧蓝色边.png" class="menuButtonRight" />
            </div>
            <a-menu v-model:selectedKeys="state.selectedKeys" mode="vertical" class="menuArea">
              <template v-for="item in menuList" :key="item.key">
                <a-menu-item class="menuItem" @click="clickMenu(item)">
                  <div :style="{display: state.collapsed? 'block':'none'}">
                    <img :src="item.icon" class="menuIcon" :style="selectMenuColor(item)" />
                    <div class="menuFont">{{ item.title }}</div>
                  </div>
                  <div :style="{display: !state.collapsed? 'block':'none'}">
                    <img :src="item.icon" class="menuIcon" :style="selectMenuColor(item)" />
                  </div>
                </a-menu-item>
              </template>
            </a-menu>
            <div>
              <img
                :src="icon8"
                class="fullScreenButton"
                :style="selectMenuColor(null)"
                @click="clickFullScreen()"
              />
            </div>
            <!-- 二级菜单（弹窗） -->
            <div class="subMenuArea" v-if="state.selectedKeys.length>0" :style="subMenuAreaStyle()">
              <template v-for="(item,index) in menuList[state.selectedIndex].children">
                <div class="subMenuItem">{{ item.title}}</div>
              </template>
            </div>
          </div>
          <!-- 中部 -->
          <div class="mapArea">
            <template v-for="item in placeList">
              <div class="pointArea" :style="{top:item.y,left:item.x}">
                <img src="/picture/机场点位.png" class="pointImg" />
              </div>
            </template>
          </div>
          <!-- 右侧 -->
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import CssFilterConverter from "css-filter-converter";
import { ref, reactive, watch, h, onMounted, onUnmounted, nextTick } from "vue";
import screenfull from "screenfull";
import icon1 from "../assets/svgs/机场.svg";
import icon2 from "../assets/svgs/航线.svg";
import icon3 from "../assets/svgs/任务.svg";
import icon4 from "../assets/svgs/航班.svg";
import icon5 from "../assets/svgs/视频.svg";
import icon6 from "../assets/svgs/数据.svg";
import icon7 from "../assets/svgs/系统.svg";
import icon8 from "../assets/svgs/全屏.svg";
import * as echarts from "echarts";
import "echarts/extension/bmap/bmap";

// src\assets\svgs\航班.svg
export default {
  setup() {
    const router = useRouter();

    const menuList = ref([
      {
        key: "1",
        icon: icon1,
        label: "机场",
        title: "机 场",
        children: [
          {
            key: "1-1",
            label: "机场总量",
            title: "机场总量：10个",
            childContentList: [
              {
                key: "1-1-1",
                label: "1-1-1",
                title: "直线塔",
                bgImg: "/picture/pc/pic_直线塔.png",
                contentText: `单联串：直接挂，直接挂在球头上\n双联串：直接挂,单滑车用二连板；双滑车直接挂\n三联串：外侧两串连接，用槽钢固定，中间串不使用（配图）`,
                moreFlag: false
              },
              {
                key: "1-1-2",
                label: "1-1-2",
                title: "耐张塔",
                bgImg: "/picture/pc/pic_耐张塔.png",
                contentText: `1.必须挂在施工孔中：当需要挂3滑车时，必须要绑钢丝套固定在塔材节点上
                2.预偏设置用新的图（直接在挂线点用葫芦进行预偏）-配图
                3.上扬塔：滑车倒挂，先通过正常挂的滑车，再通过压的滑车；度数小于5°的采用倒挂
                
                1.必须挂在施工孔中：当需要挂3滑车时，必须要绑钢丝套固定在塔材节点上
                2.预偏设置用新的图（直接在挂线点用葫芦进行预偏）-配图
                3.上扬塔：滑车倒挂，先通过正常挂的滑车，再通过压的滑车；度数小于5°的采用倒挂
                1.必须挂在施工孔中：当需要挂3滑车时，必须要绑钢丝套固定在塔材节点上
                2.预偏设置用新的图（直接在挂线点用葫芦进行预偏）-配图
                3.上扬塔：滑车倒挂，先通过正常挂的滑车，再通过压的滑车；度数小于5°的采用倒挂
                1.必须挂在施工孔中：当需要挂3滑车时，必须要绑钢丝套固定在塔材节点上
                2.预偏设置用新的图（直接在挂线点用葫芦进行预偏）-配图
                3.上扬塔：滑车倒挂，先通过正常挂的滑车，再通过压的滑车；度数小于5°的采用倒挂`,
                moreFlag: false
              },
              {
                key: "1-1-3",
                label: "1-1-3",
                title: "钢丝套",
                bgImg: "/picture/pc/pic_钢丝套.png",
                contentText: `1.大截面1250、900导线用Φ26
                2.500导线用Φ24`,
                moreFlag: false
              }
            ]
          },
          {
            key: "1-2",
            label: "在飞行机场",
            title: "在飞行机场：7个"
          }
        ]
      },
      {
        key: "2",
        icon: icon2,
        label: "航线",
        title: "航 线",
        children: [
          {
            key: "2-1",
            label: "滑车悬挂",
            title: "滑车悬挂"
          }
        ]
      },
      {
        key: "3",
        icon: icon3,
        label: "任务",
        title: "任 务",
        children: [
          {
            key: "3-1",
            label: "滑车悬挂3-1",
            title: "滑车悬挂3-1"
          }
        ]
      },
      {
        key: "4",
        icon: icon4,
        label: "航班",
        title: "航 班",
        children: [
          {
            key: "4-1",
            label: "滑车悬挂4",
            title: "滑车悬挂4"
          }
        ]
      },
      {
        key: "5",
        icon: icon5,
        label: "视频",
        title: "视 频",
        children: [
          {
            key: "5-1",
            label: "滑车悬挂5",
            title: "滑车悬挂5"
          }
        ]
      },
      {
        key: "6",
        icon: icon6,
        label: "数据",
        title: "数 据",
        children: [
          {
            key: "6-1",
            label: "滑车悬挂5",
            title: "滑车悬挂5"
          }
        ]
      },
      {
        key: "7",
        icon: icon7,
        label: "系统",
        title: "系 统",
        children: [
          {
            key: "7-1",
            label: "滑车悬挂5",
            title: "滑车悬挂5"
          }
        ]
      }
    ]);
    const state = ref({
      collapsed: false,
      selectedKeys: [],
      selectedIndex: 0,
      subSelectedKey: menuList.value[0].children[0].key,
      subSelectedIndex: 0,
      currentPageList: [], // 当前页显示数据
      currentDataList: [], // 当前条目下分页总数据
      fullScreenFlag: false
    });
    const placeList = ref([
      {
        id: 1,
        name: "机场1",
        x: "0vw",
        y: "50vh"
      },
      {
        id: 2,
        name: "机场1",
        x: "-10vw",
        y: "50vh"
      },
      {
        id: 3,
        name: "机场1",
        x: "-20vw",
        y: "50vh"
      },
      {
        id: 4,
        name: "机场1",
        x: "-30vw",
        y: "50vh"
      },
      {
        id: 5,
        name: "机场1",
        x: "10vw",
        y: "50vh"
      },
      {
        id: 6,
        name: "机场1",
        x: "20vw",
        y: "50vh"
      },
      {
        id: 7,
        name: "机场1",
        x: "1vw",
        y: "50vh"
      },
      {
        id: 8,
        name: "机场1",
        x: "1vw",
        y: "50vh"
      },
      {
        id: 9,
        name: "机场1",
        x: "1vw",
        y: "50vh"
      },
      {
        id: 10,
        name: "机场1",
        x: "1vw",
        y: "50vh"
      }
    ]);
    const getColor = (temp: any) => {
      return CssFilterConverter.hexToFilter(temp).color;
    };
    const selectMenuColor = (currentItem: any) => {
      if (currentItem != null) {
        if (state.value.selectedKeys[0] == currentItem.key) {
          let color = getColor("#4DB2FF");
          return `filter: ${color}`;
        } else {
          return "";
        }
      } else if (currentItem == null) {
        if (state.value.fullScreenFlag) {
          // 进入全屏
          let color = getColor("#4DB2FF");
          return `filter: ${color}`;
        } else {
          // 退出全屏
          return "";
        }
      }
    };
    // 点击全屏按钮
    const clickFullScreen = () => {
      state.value.fullScreenFlag = !state.value.fullScreenFlag;
      //screenfull.isEnabled  此方法返回布尔值，判断当前能不能进入全屏
      if (!screenfull.isEnabled) {
        state.value.fullScreenFlag = false;
        selectMenuColor(null);
        return false;
      }
      selectMenuColor(null);
      //screenfull.toggle 此方法是执行全屏化操作。如果已是全屏状态，则退出全屏
      screenfull.toggle();
    };
    const toggleCollapsed = () => {
      state.value.collapsed = !state.value.collapsed;
    };
    const clickMenu = (tempItem: any) => {
      // searchFlag.value = false;
      menuList.value.forEach((item, index) => {
        if (item.key == tempItem.key) {
          state.value.selectedIndex = index;
          state.value.subSelectedIndex = 0;
          state.value.subSelectedKey = item.children[0].key;
          subMenuAreaStyle();
        }
      });
    };
    // 定位子菜单距顶部位置
    const subMenuAreaStyle = () => {
      let top = 44 + state.value.selectedIndex * 40 - 40;
      return `top: ${top}px`;
    };
    onMounted(() => {
      const chartDom = document.getElementById("main");
      const myChart = echarts.init(chartDom);
      const option = {
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true
          // mapStyle: {
          // }
        },
        series: []
      };

      myChart.setOption(option);
    });
    return {
      // titleText,
      state,
      menuList,
      // searchValue,
      selectMenuColor,
      clickMenu,
      toggleCollapsed,
      subMenuAreaStyle,
      icon8,
      clickFullScreen,
      placeList
      // onSearch,
      // clickTabButton,
      // tabTitleClick,
      // leftIcon,
      // rightIcon,
      // currentPage,
      // pageSize,
      // changePage,
      // searchFlag,
      // searchCardClick,
      // clickContentCard
    };
  }
};
</script>
<style scoped lang="less">
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* 确保超出部分被裁剪 */
}
.backgroundArea {
  overflow: hidden; /* 确保超出部分被裁剪 */
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
.titlePicture {
  height: auto;
  object-fit: cover; /* 新增，确保图片填充整个容器 */
  zoom: 2;
  margin-top: 15vh;
  width: 50%;
  max-width: 200px;
}
.backgroundImg {
  overflow: hidden; /* 确保超出部分被裁剪 */

  background: url("/picture/地图背景.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  width: 100%;
  height: 100%;
  object-fit: cover; /* 新增，确保图片填充整个容器 */
}
.titleArea {
  height: 70px;
  width: 100%;
  // height: 50px;
  // height: auto;
  background: url("/picture/标题形状.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: #fff;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  .title1 {
    height: 35px;
    width: auto;
    margin-top: 5px;
  }
  .title2 {
    height: 20px;
    width: auto;
    margin-top: -10px;
  }
}
.centerArea {
  height: calc(100% - 70px);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  .leftMenuArea {
    background: rgba(0, 28, 116, 0.5);
    position: relative;
    height: 390px;
    .menuButtonArea {
      margin: 10px;
      // margin-bottom: 10px;
      position: relative;
      .menuButton {
        height: 10px;
      }
      .menuButtonRight {
        position: absolute;
        height: 90px;
        right: -10px;
        top: -10px;
      }
    }
    .menuArea {
      width: 100%;
      // width: 20vw;
      background: transparent;
      .menuItem {
        position: relative;

        .menuIcon {
          width: 20px;
          height: 20px;
          position: absolute;
          // top: calc(50% - 10px);
          top: 10px;
          left: 15px;
        }
        .menuFont {
          height: 30px;
          position: absolute;
          top: 0px;
          left: 45px;
          color: #fff;
          // font-weight: 600;
        }
      }
      :deep(.ant-menu-item) {
        margin: 0px 4px;
      }
      :deep(.ant-menu-item-selected) {
        background: transparent;
        .menuFont {
          color: rgb(77, 178, 255);
        }
      }
    }
    .fullScreenButton {
      margin-top: 30px;
    }
    .subMenuArea {
      position: absolute;
      top: 0px;
      right: -210px;
      color: #fff;
      width: 200px;
      height: 120px;
      background: url("/picture/子菜单背景.png");
      background-size: cover;
      object-fit: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .subMenuItem {
        width: 80%;
        height: 30%;
        margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(77, 178, 255, 0.1);
        background-image: url("/picture/左上.png"), url("/picture/左下.png"),
          url("/picture/右上.png"), url("/picture/右下.png");
        background-position: left top, left bottom, right top, right bottom;
        background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
      }
    }
  }
  .mapArea {
    position: relative;
    .pointArea {
      position: absolute;
      top: 0px;
      left: 0px;
      .pointImg {
        width: 10px;
        height: 10px;
      }
    }
  }
}
</style>