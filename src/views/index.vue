<template>
  <div class="page">
    <div class="backgroundArea">
      <div id="mars3dContainer2" :class="'mars3d-container'" class="mapStyle"></div>
      <div class="backgroundImg">
        <!-- 标题栏 -->
        <div class="titleArea">
          <div style="position: absolute;top:0px;left:0px">
            <!-- <div>时间</div> -->
            <div>
              <img src="/picture/用户.png" style="height: 25px;position:absolute;top:40px;left:0px;" />
            </div>
          </div>
          <div>
            <div>
              <img class="title1" src="/picture/浦东城管智能综合信息平台.png" />
            </div>
            <div>
              <img class="title2" src="/picture/无人机云平台.png" />
            </div>
          </div>
          <div style="position: absolute;top:-5px;right:0px">
            <!-- 搜索框 -->
            <div>
              <a-input
                class="searchInput"
                v-model:value="searchValue"
                placeholder="输入机场名称"
                :bordered="false"
              >
                <template #prefix>
                  <img class="searchLogo" src="/picture/搜索.png" />
                </template>
              </a-input>
            </div>
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
            <div
              class="subMenuArea"
              v-if="state.selectedKeys.length>0&&state.selectedKeys[0]!='4'"
              :style="subMenuAreaStyle()"
            >
              <template v-for="(item,index) in menuList[state.selectedIndex].children">
                <div
                  class="subMenuItem"
                  @click="clickSubItem(item,index)"
                  :style="{ color:state.subSelectedKey==item.key?'#00FAB5':'#fff'}"
                >{{ item.title}}</div>
              </template>
            </div>
          </div>
          <!-- 中部 -->
          <div>
            <!-- 三级（弹窗） -->
            <div class="elseArea" v-if="state.subSelectedKey=='1-2'">
              <!-- :style="subMenuAreaStyle()" -->
              <div style="margin-top:20px;">
                <template
                  v-for="(item,index) in menuList[state.selectedIndex].children[state.subSelectedIndex].children"
                >
                  <!-- class="subMenuItem"
                  @click="clickSubItem(item,index)"
                  :style="{ color:state.subSelectedKey==item.key?'#00FAB5':'#fff'}"-->
                  <div
                    style="text-align: left;width: 340px;margin-left:10px"
                    @click="clickContentItem(item)"
                  >
                    <div
                      :style="{ color:state.contentSelectedId==item.id?'#00FAB5':'#fff'}"
                    >{{ item.name}}</div>
                    <div
                      style="color: rgba(255, 255, 255, 0.6);font-size:14px"
                      :style="{ color:state.contentSelectedId==item.id?'rgba(0, 250, 181, 0.6)':'rgba(255, 255, 255, 0.6)'}"
                    >{{ item.address}}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div style="position:relative;height:100vh">
            <div style="position: absolute;right:0px;top:0px;">
              <img
                src="/picture/天气.png"
                style="width: 50px;"
                v-if="!state.showTQ"
                @click="()=>{state.showTQ=true}"
              />
              <img
                src="/picture/雷电预警.png"
                style="width: 200px;"
                v-if="state.showTQ"
                @click="()=>{state.showTQ=false}"
              />
            </div>
            <!-- 点击三级后显示详情 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.contentSelectedId!=0">
              <img src="/picture/监管对象.png" style="width: 300px;" />
            </div>
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='3-1'">
              <img src="/picture/监管对象 (2).png" style="width: 550px;" />
            </div>
            <div style="position: absolute;right:10px;top:50px" v-if="state.selectedKeys[0]=='4'">
              <img src="/picture/航班列表.png" style="width: 750px;" />
            </div>
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='5-1'">
              <img src="/picture/机场直播 (1).png" style="width: 600px;" />
            </div>
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='7-1'">
              <img src="/picture/机场直播.png" style="width: 600px;" />
            </div>

            <div>
              <div style="position: absolute;right:0px;bottom:130px;">
                <img
                  src="/picture/反制.png"
                  style="width: 50px;"
                  v-if="!state.showFZ"
                  @click="addArea1(1)"
                />
                <img
                  src="/picture/反制1.png"
                  style="width: 100px;"
                  v-if="state.showFZ"
                  @click="addArea1(2)"
                />
              </div>
              <div style="position: absolute;right:0px;bottom:80px;">
                <img
                  src="/picture/禁飞.png"
                  style="width: 50px;"
                  v-if="!state.showJF"
                  @click="addArea2(1)"
                />
                <img
                  src="/picture/禁飞1.png"
                  style="width: 100px;"
                  v-if="state.showJF"
                  @click="addArea2(2)"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="bottomArea">
          <div v-for="item in dtdata" :key="item.id">
            <div>{{ item.text }}</div>
          </div>
          <!-- <TextScroll
            :text="state.text"
            width="100%"
            :amount="4"
            background-color="#FFF"
            :height="50"
          /> -->
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

import TextScroll from "../components/TextScroll.vue";

import * as mars3d from "mars3d";
import "mars3d/dist/mars3d.css";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "mars3d-cesium";

export default {
  components: { TextScroll },

  setup() {
    const router = useRouter();

    var mapOptions = {
      basemaps: [
        {
          name: "天地图",
          type: "tdt",
          layer: "img_d",
          show: true
        }
      ],
      scene: {
        center: {
          lat: 31.13,
          lng: 121.75,
          alt: 80000,
          heading: 0,
          pitch: -90
        }
      }
    };

    var map = null;

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
            children: []
          },
          {
            key: "1-2",
            label: "在飞行机场",
            title: "在飞行机场：7个",
            children: [
              {
                id: 1,
                name: "1.金桥机场",
                address: "5G未来中心(浦东新区金海路1347号三号楼)"
              },
              {
                id: 2,
                name: "2.川沙机场",
                address: "川沙大厦(浦东新区川沙路5077号)"
              },
              {
                id: 3,
                name: "3.张江机场",
                address: "汇智商业广场(浦东新区金科路3057号)"
              },
              {
                id: 4,
                name: "4.花木机场",
                address: "浦东新区城市管理行政执法局(浦东新区樱花路298弄)"
              },
              {
                id: 5,
                name: "5.书院机场",
                address: "(禹州城市广场)老芦公路895号2号楼"
              },
              {
                id: 6,
                name: "6.大团机场",
                address: "上海市浦东新区汇技路209号3号楼9层楼顶"
              },
              {
                id: 7,
                name: "7.新场机场",
                address: "上海市浦东新区新场镇石笋街8号"
              }
            ]
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
            label: "监管对象",
            title: "监管对象",
            children: []
          },
          {
            key: "2-2",
            label: "监管要素",
            title: "监管要素",
            children: []
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
            label: "智能任务",
            title: "智能任务：30个",
            children: []
          },
          {
            key: "3-2",
            label: "普通任务",
            title: "普通任务：12个",
            children: []
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
            label: "",
            title: "",
            children: []
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
            label: "直播画面",
            title: "直播画面",
            children: []
          },
          {
            key: "5-2",
            label: "监控画面",
            title: "监控画面",
            children: []
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
            label: "数据分析",
            title: "数据分析",
            children: []
          },
          {
            key: "6-2",
            label: "数据统计",
            title: "数据统计",
            children: []
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
            label: "模型库",
            title: "模型库",
            children: []
          },
          {
            key: "7-2",
            label: "风险库",
            title: "风险库",
            children: []
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
      fullScreenFlag: false,
      contentSelectedIndex: 0,
      contentSelectedId: 0,
      showTQ: false,
      showFZ: false,
      showJF: false,
      text:[{
        title: 'M60T  航班按时起飞  航线正常  '
      },{
        title: 'M30T  航班按时起飞  航线正常  '
      },{
        title: 'M50T  航班受其他航线影响  航班异常'
      },]
    });

    const dtdata = ref([
      {
        id: 1,
        text: " M60T  航班按时起飞  航线正常  "
      },
      {
        id: 2,
        text: " M30T  航班按时起飞  航线正常   "
      },
      {
        id: 3,
        text: " M50T  航班受其他航线影响  航班异常  "
      }
    ]);
    const placeList = ref([
      {
        id: 1,
        name: "机场1",
        lat: 31.22,
        lng: 121.56,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.1911,
            lng: 121.5811
          },
          {
            key: "1-2",
            name: "航线1",
            lat: 31.2433,
            lng: 121.5433
          },
          {
            key: "1-3",
            name: "航线1",
            lat: 31.2077,
            lng: 121.5877
          }
        ]
      },
      {
        id: 2,
        name: "机场2",
        lat: 31.28,
        lng: 121.64,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.2529,
            lng: 121.6822
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 31.3054,
            lng: 121.6289
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 31.2629,
            lng: 121.6698
          }
        ]
      },
      {
        id: 3,
        name: "机场3",
        lat: 30.95,
        lng: 121.85,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 30.9822,
            lng: 121.8222
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 30.9292,
            lng: 121.8903
          }
        ]
      },
      {
        id: 4,
        name: "机场4",
        lat: 31.03,
        lng: 121.84,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0622,
            lng: 121.8022
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0038,
            lng: 121.8705
          }
        ]
      },
      {
        id: 5,
        name: "机场5",
        lat: 31.12,
        lng: 121.68,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.1622,
            lng: 121.7022
          }
        ]
      },
      {
        id: 6,
        name: "机场6",
        lat: 31.06,
        lng: 121.65,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0322,
            lng: 121.6122
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0894,
            lng: 121.6872
          }
        ]
      },
      {
        id: 7,
        name: "机场7",
        lat: 31.02,
        lng: 121.75,
        children: [
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0522,
            lng: 121.7822
          },
          {
            key: "1-1",
            name: "航线1",
            lat: 31.0064,
            lng: 121.7294
          }
        ]
      },
      {
        id: 8,
        name: "机场8",
        lat: 31.2,
        lng: 121.69,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.2322,
          //   lng: 121.6522
          // }
        ]
      },
      {
        id: 9,
        name: "机场9",
        lat: 31.14,
        lng: 121.54,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.1622,
          //   lng: 121.5822
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.1084,
          //   lng: 121.5277
          // }
        ]
      },
      {
        id: 10,
        name: "机场10",
        lat: 31.1,
        lng: 121.78,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.1422,
          //   lng: 121.8122
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.0893,
          //   lng: 121.7683
          // }
        ]
      }
    ]);
    let timer = null;
    const placeIndex = ref(0);

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
          state.value.subSelectedKey = null;
          state.value.contentSelectedId = 0;
          state.value.contentSelectedIndex = 0;
          subMenuAreaStyle();
        }
      });
      if (tempItem.key == "1") {
        // 点击机场
        clearInterval(timer);
        placeIndex.value = 0;
        graphicLayer.clear();
        addPlacePoint(placeList.value);

        // 航线动效
        addPlaceLine();
      } else {
        clearInterval(timer);
        placeIndex.value = 0;
        graphicLayer.clear();
        addPlacePoint(placeList.value);
      }
    };
    // 定位子菜单距顶部位置
    const subMenuAreaStyle = () => {
      let top = 44 + state.value.selectedIndex * 40 - 40;
      return `top: ${top}px`;
    };

    const addDemoGraphics = () => {
      const geoJsonLayer = new mars3d.layer.GeoJsonLayer({
        name: "上海浦东",
        url: "https://geo.datav.aliyun.com/areas_v3/bound/310115.json",
        symbol: {
          type: "polygon",
          styleOptions: {
            materialType: mars3d.MaterialType.PolyGradient, // 重要参数，指定材质
            materialOptions: {
              color: "#fff",
              opacity: 0.0
            }
          },
          callback: function(attr, styleOpt) {
            const randomHeight = (attr.childrenNum || 1) * 500; // 测试的高度
            return {
              materialOptions: {
                // color: getColor()
              },
              height: 0,
              diffHeight: randomHeight
            };
          }
        }
        // popup: "{name}"
      });
      map.addLayer(geoJsonLayer);
    };

    let graphicLayer = null;

    // 添加地图机场点
    const addPlacePoint = currentData => {
      graphicLayer.clear();
      console.log("加载数据", currentData);

      for (let i = currentData.length - 1; i >= 0; i--) {
        const item = currentData[i];

        const graphic = new mars3d.graphic.BillboardEntity({
          id: item.id,
          name: item.name,
          position: new mars3d.LngLatPoint(item.lng, item.lat),
          style: {
            // color: "#ffff00",
            image: "/picture/机场点位.png",
            // pixelSize: 20,
            scale: 1.5,
            clampToGround: true,
            outlineWidth: 0
          },
          attr: { remark: "示例3" }
          // popup: item.name
        });
        graphicLayer.addGraphic(graphic);
      }
    };

    // 航线动效
    const addPlaceLine = () => {
      let j = placeIndex.value;
      let currentData = placeList.value;
      const tempItem = currentData[j];
      const item1 = tempItem.children;
      if (item1.length > 0) {
        const center = Cesium.Cartesian3.fromDegrees(
          tempItem.lng,
          tempItem.lat,
          1
        );

        const lineMaterial = mars3d.MaterialUtil.createMaterial(
          mars3d.MaterialType.LineFlow,
          {
            image: "/picture/航线光点.png",
            speed: 5
          }
        );
        clearInterval(timer);
        let i = 0;
        if (item1.length > 0) {
          // 首次立即出现
          showLine(item1[i], center, lineMaterial);
          i++;

          timer = setInterval(() => {
            if (i < item1.length) {
              const item = item1[i];
              i++;
              showLine(item, center, lineMaterial);
            } else {
              placeIndex.value++;
              clearInterval(timer);
            }
          }, 3400);
        }
      } else {
        clearInterval(timer);
        placeIndex.value++;
      }
    };

    const showLine = (item, center, lineMaterial) => {
      const thisPoint = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 1);
      let position3 = [thisPoint, center, thisPoint];

      const graphic = new mars3d.graphic.PolylinePrimitive({
        positions: mars3d.PolyUtil.interLine(position3, {
          minDistance: "auto"
        }), // 切分坐标，使流动材质均匀些
        style: {
          width: 30,
          material: lineMaterial
        }
      });
      graphicLayer.addGraphic(graphic);
      setTimeout(() => {
        graphicLayer.removeGraphic(graphic);
      }, 3400);
    };

    // 点击子菜单
    const clickSubItem = (tempItem, index) => {
      // switch(tempItem.)
      // console.log("temp ", tempItem);
      state.value.subSelectedIndex = index;
      state.value.subSelectedKey = tempItem.key;
      state.value.contentSelectedId = 0;
      state.value.contentSelectedIndex = 0;
    };

    const clickContentItem = (tempItem, index) => {
      state.value.contentSelectedIndex = index;
      state.value.contentSelectedId = tempItem.id;
    };

    const addArea1 = flag => {
      const graphic = new mars3d.graphic.BillboardEntity({
        id: 9998,
        name: "反制区",
        position: new mars3d.LngLatPoint(121.9, 30.98),
        style: {
          // color: "#ffff00",
          image: "/picture/反制区域显示.png",
          // pixelSize: 20,
          scale: 0.5,
          clampToGround: true,
          outlineWidth: 0
        },
        attr: { remark: "示例3" }
        // popup: item.name
      });
      if (flag == 1) {
        state.value.showFZ = true;
        graphicLayer.addGraphic(graphic);
      } else {
        state.value.showFZ = false;
        graphicLayer.removeGraphic(graphic1);
      }
    };

    const addArea2 = flag => {
      const graphic1 = new mars3d.graphic.BillboardEntity({
        id: 9999,
        name: "禁飞区",
        position: new mars3d.LngLatPoint(121.93, 30.96),
        style: {
          // color: "#ffff00",
          image: "/picture/禁飞区域显示.png",
          // pixelSize: 20,
          scale: 0.4,
          clampToGround: true,
          outlineWidth: 0
        },
        attr: { remark: "示例3" }
        // popup: item.name
      });
      if (flag == 1) {
        state.value.showJF = true;
        graphicLayer.addGraphic(graphic1);
      } else {
        state.value.showJF = false;
        graphicLayer.removeGraphic(graphic1);
      }
    };
    onMounted(async function() {
      console.log(mars3d);

      map = new mars3d.Map("mars3dContainer2", mapOptions);
      // 创建矢量数据图层
      graphicLayer = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer);
      addDemoGraphics();
      addPlacePoint(placeList.value);
      // addArea1();
      // addArea2();
    });
    watch(
      () => placeIndex.value,
      () => {
        if (placeIndex.value < placeList.value.length) {
          addPlaceLine();
        }
      }
    );
    onUnmounted(() => {
      clearInterval(timer);
      map = null;
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
      clickSubItem,
      clickContentItem,
      addArea1,
      addArea2,
      dtdata
      // placeList
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
.mapStyle {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
}
.backgroundImg {
  z-index: 1;
  overflow: hidden; /* 确保超出部分被裁剪 */

  // background: url("/picture/地图背景.png");
  // background-repeat: no-repeat;
  // background-size: cover;
  // background-position: center;

  // width: 100%;
  // height: 100%;
  object-fit: cover; /* 新增，确保图片填充整个容器 */
}
.titleArea {
  position: relative;
  z-index: 1;
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
  justify-content: center;
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
  .elseArea {
    position: absolute;
    top: 200px;
    left: 70px;
    z-index: 2;
    color: #fff;
    width: 355px;
    height: 363px;
    background: url("/picture/在飞弹窗.png");
    background-size: cover;
    object-fit: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // .subMenuItem {
    //   width: 80%;
    //   height: 30%;
    //   margin: 10px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;

    //   background-color: rgba(77, 178, 255, 0.1);
    //   background-image: url("/picture/左上.png"), url("/picture/左下.png"),
    //     url("/picture/右上.png"), url("/picture/右下.png");
    //   background-position: left top, left bottom, right top, right bottom;
    //   background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    // }
  }
  // .mapArea {
  //   position: relative;
  //   .pointArea {
  //     position: absolute;
  //     top: 0px;
  //     left: 0px;
  //     .pointImg {
  //       width: 10px;
  //       height: 10px;
  //     }
  //   }
  // }
}
.searchLogo {
  width: 15px;
  margin-right: 5px;
}
.searchInput {
  background: transparent;
  border-bottom: solid 1px rgba(255, 255, 255, 0.5);
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 90%;
  margin: 10px 0px;

  :deep(.ant-input) {
    color: rgba(255, 255, 255, 1);
  }
  ::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}
.bottomArea {
  position: absolute;
  z-index: 2;
  bottom: 0px;
  height: 40px;
  right: 25%;
  width: 50%;
  color: rgba(255, 255, 255, 0.8);
  flex-direction: row;
  display: flex;
  background: url("/picture/底部背景.png");
  justify-content: center;
  align-items: end;
}
</style>