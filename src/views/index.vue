<template>
  <div class="page">
    <div class="backgroundArea">
      <div id="mars3dContainer2" :class="'mars3d-container'" class="mapStyle"></div>
      <div class="backgroundImg">
        <!-- 标题栏 -->
        <div class="titleArea">
          <div style="position: absolute;top:0px;left:0px">
            <!-- <a-upload
              name="file"
              :customRequest="customUpload"
              v-model:file-list="fileList"
              :showUploadList="false"
              accept=".kml, .json, .kmz"
            >
              <div style="color:rgb(0, 190, 201);margin-top:5px">添加</div>
            </a-upload>-->
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
            <div
              class="elseArea"
              v-if="state.subSelectedKey=='1-2'"
              :style="{left:state.collapsed?'120px':'70px'}"
            >
              <img
                style="width: 410px;height: 363px;position:absolute;top:0px;left:0px;z-index:2;"
                src="/picture/在飞弹窗.png"
              />
              <!-- :style="subMenuAreaStyle()" -->
              <div style="margin-top:30px;margin-left:10px;z-index:2;">
                <template
                  v-for="(item,index) in menuList[state.selectedIndex].children[state.subSelectedIndex].children"
                >
                  <!-- class="subMenuItem"
                  @click="clickSubItem(item,index)"
                  :style="{ color:state.subSelectedKey==item.key?'#00FAB5':'#fff'}"-->
                  <div
                    style="text-align: left;width: 380px;margin-left:10px"
                    @click="clickContentItem(item,index)"
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
          <!-- 档logo -->
          <div
            style="position: absolute;left:0px;bottom:0px;height:20px;width:100px;background:#000"
          ></div>
          <!-- 底部左侧 地图样式切换 -->
          <!-- <div style="position: absolute;left:0px;bottom:30px">
            <div
              v-if="state.mapStyleFlag==false"
              @click="()=>{state.mapStyleFlag=true}"
              class="showMapButton"
            >
              <img src="/picture/箭头3.png" style="width: 15px;height:15px;margin:0px 8px" />
            </div>
            <div v-else class="mapStyleArea">
              <div class="checkArea">
                <div>
                  <div class="checkItemImg">
                    <img src="/picture/地图.png" style="width:80px;height:65px;border-radius: 10px;" />
                  </div>
                  <div
                    style="position: relative;left:10px;bottom:13px;z-index:4;background:rgba(0, 0, 0,0.5);border-radius:0px 0px 10px 10px;"
                  >
                    <a-checkbox style="border-radius: 50px;">Checkbox</a-checkbox>默认
                  </div>
                </div>
              </div>
              <div class="hiddenButton" @click="()=>{state.mapStyleFlag=false}">
                <img src="/picture/箭头3收起.png" style="width: 15px;height:15px;" />
              </div>
            </div>
          </div>-->
          <!-- 底部滚动区 -->
          <div class="bottomTextArea">
            <div v-for="item in dtdata" :key="item.id">
              <div>{{ item.text }}</div>
            </div>
            <!-- <TextScroll
            :text="state.text"
            width="100%"
            :amount="4"
            background-color="#FFF"
            :height="50"
            />-->

            <!-- 切换地图样式 -->
          </div>
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

import planePointIcon from "../assets/svgs/icon_机场.svg";

import TextScroll from "../components/TextScroll.vue";

import * as mars3d from "mars3d";
import "mars3d/dist/mars3d.css";
import "mars3d-cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "mars3d-cesium";
import { planepoint } from "@turf/turf";

import { message } from "ant-design-vue";

import { toGeoJSON } from "kml-geojson";
// import * as kgUtil from "./conver/geoJSONToKml";
// import {toGeoJSON,tokml} from './conver/geoJSONToKml'

// import kml2 from "/line/川沙机场/川沙航线/200米演示.kmz";

import pointIcon from "../assets/svgs/地图上的标记1.svg";
import { app } from "../main";

// import file1 from "/dist/line/大团机场/大团航线/*.kmz";

import { v4 as uuidV4 } from "uuid";

export default {
  components: { TextScroll },

  setup() {
    const router = useRouter();

    const appSettings = app.config.globalProperties.$appSettings;
    // const baseUrl = ref(appSettings.restUrl + "uploadimg");

    const searchValue = ref();

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

    const fileList = ref([]);

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
            title: "机场总量：15个",
            children: []
          },
          {
            key: "1-2",
            label: "在飞行机场",
            title: "在飞行机场：7个",
            children: [
              {
                id: 1,
                name: "1.泥城机场",
                // kml文件地址 http://localhost:5173/line/川沙机场/川沙.kml
                fileAddress: appSettings.restUrl + "line/泥城机场/泥城.kml",
                // kmz航线文件地址 /public/line/川沙机场/川沙航线/*.kmz
                lineAddress: "/public/line/泥城机场/泥城/*.kmz",
                address: "上海市浦东新区泥城镇秋山路1775弄25号2号楼12层楼顶"
              },
              {
                id: 2,
                name: "2.张江机场",
                fileAddress: appSettings.restUrl + "line/张江机场/张江.kml",
                lineAddress: "/public/line/张江机场/张江航线/*.kmz",
                address: "上海市浦东新区金科路3057号汇智国际商业广场5层楼顶"
              },
              {
                id: 3,
                name: "3.书院机场",
                fileAddress: appSettings.restUrl + "line/书院机场/书院.kml",
                lineAddress: "/public/line/书院机场/书院航线/*.kmz",
                address: "上海市浦东新区老芦公路895号禹洲城市广场2号楼11层楼顶"
              },
              {
                id: 4,
                name: "4.川沙机场",
                fileAddress: appSettings.restUrl + "line/川沙机场/川沙.kml",
                lineAddress: "/public/line/川沙机场/川沙航线/*.kmz",
                address: "上海市浦东新区川沙路5007号顶楼水塔塔顶"
              },
              {
                id: 5,
                name: "5.大团机场",
                fileAddress: appSettings.restUrl + "line/大团机场/大团.kml",
                lineAddress: "/public/line/大团机场/大团航线/*.kmz",
                address: "上海市浦东新区大团镇汇技路209号3号楼9层楼顶"
              },
              {
                id: 6,
                name: "6.六灶机场",
                fileAddress: appSettings.restUrl + "line/六灶机场/六灶.kml",
                lineAddress: "/public/line/六灶机场/六灶/*.kmz",
                address: "上海市浦东新区川沙新镇南六公路1188号B楼6楼楼顶"
              },
              {
                id: 7,
                name: "7.金桥机场",
                fileAddress:
                  appSettings.restUrl +
                  "line/金桥机场/KML导出_20231110093722.kml",
                lineAddress: "/public/line/金桥机场/金桥航线/*.kmz",
                address: "上海市浦东新区金海路1357号3号楼9层楼的楼顶"
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
      // {
      //   key: "4",
      //   icon: icon4,
      //   label: "航班",
      //   title: "航 班",
      //   children: [
      //     {
      //       key: "4-1",
      //       label: "",
      //       title: "",
      //       children: []
      //     }
      //   ]
      // },
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
      mapStyleFlag: false,
      text: [
        {
          title: "M60T  航班按时起飞  航线正常  "
        },
        {
          title: "M30T  航班按时起飞  航线正常  "
        },
        {
          title: "M50T  航班受其他航线影响  航班异常"
        }
      ]
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
        name: "泥城机场",
        lat: 30.886564,
        lng: 121.811018,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 30.858394,
          //   lng: 121.799323
          // },
          // {
          //   key: "1-2",
          //   name: "航线1",
          //   lat: 30.893203,
          //   lng: 121.803282
          // },
          // {
          //   key: "1-3",
          //   name: "航线1",
          //   lat: 30.902372,
          //   lng: 121.832921
          // }
        ]
      },
      {
        id: 2,
        name: "张江机场",
        lat: 31.205602,
        lng: 121.596878,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.224347,
          //   lng: 121.612832
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.183231,
          //   lng: 121.573213
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.213211,
          //   lng: 121.583211
          // }
        ]
      },
      {
        id: 3,
        name: "书院机场",
        lat: 30.977697,
        lng: 121.864152,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 30.983217,
          //   lng: 121.873211
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 30.954292,
          //   lng: 121.842303
          // }
        ]
      },
      {
        id: 4,
        name: "川沙机场",
        lat: 31.194529,
        lng: 121.694344,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.213212,
          //   lng: 121.702133
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.18321,
          //   lng: 121.652138
          // }
        ]
      },
      {
        id: 5,
        name: "大团机场",
        lat: 31.006455,
        lng: 121.719885,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.032197,
          //   lng: 121.701238
          // }
        ]
      },
      {
        id: 6,
        name: "六灶机场",
        lat: 31.097215,
        lng: 121.705817,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.071238,
          //   lng: 121.692103
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.124232,
          //   lng: 121.712832
          // }
        ]
      },
      {
        id: 7,
        name: "金桥机场",
        lat: 31.267368,
        lng: 121.624309,
        children: [
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.243298,
          //   lng: 121.603298
          // },
          // {
          //   key: "1-1",
          //   name: "航线1",
          //   lat: 31.273281,
          //   lng: 121.64321
          // }
        ]
      },
      {
        id: 8,
        name: "彭镇机场",
        lat: 30.945772,
        lng: 121.789615,
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
        name: "惠南机场",
        lat: 31.041714,
        lng: 121.745596,
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
        name: "航头机场",
        lat: 31.039864,
        lng: 121.575397,
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
      },

      {
        id: 11,
        name: "高桥机场",
        lat: 31.36275,
        lng: 121.536535,
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
      },
      {
        id: 12,
        name: "高行机场",
        lat: 31.328869,
        lng: 121.584887,
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
      },
      {
        id: 13,
        name: "三林机场",
        lat: 31.141283,
        lng: 121.496834,
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
      },
      {
        id: 14,
        name: "周康机场",
        lat: 31.132738,
        lng: 121.605306,
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
      },
      {
        id: 15,
        name: "花木机场",
        lat: 31.20756,
        lng: 121.545236,
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
        // clearInterval(timer);
        placeIndex.value = 0;
        graphicLayer.clear();
        graphicLayer1.clear();
        graphicLayer2.clear();
        addPlacePoint(placeList.value);

        // 航线动效
        // addPlaceLine();
      } else {
        // clearInterval(timer);
        placeIndex.value = 0;
        graphicLayer.clear();
        graphicLayer1.clear();
        graphicLayer2.clear();
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
    let graphicLayer1 = null;
    let graphicLayer2 = null;

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
            image: planePointIcon,
            // pixelSize: 20,
            scale: 0.16,
            clampToGround: true,
            outlineWidth: 0
          },
          attr: { remark: "示例3" },
          popup: item.name
        });
        graphicLayer.addGraphic(graphic);
      }
    };

    // 航线材质
    // 注册自定义材质
    const LineSpriteType = "LineSprite";
    mars3d.MaterialUtil.register(LineSpriteType, {
      fabric: {
        uniforms: {
          image: Cesium.Material.DefaultImageId,
          speed: 20,
          globalAlpha: 1.0
        },
        source: `czm_material czm_getMaterial(czm_materialInput materialInput)
      {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec4 colorImage = texture(image, vec2(fract(st.s - speed*czm_frameNumber/1000.0), st.t));
        material.alpha = colorImage.a * globalAlpha;
        material.diffuse = colorImage.rgb * 1.5 ;
        return material;
      }`
      },
      translucent: true
    });
    // 航线动效
    const addPlaceLine = () => {
      // let j = placeIndex.value;

      let currentData = placeList.value;
      for (let j = 0; j < currentData.length; j++) {
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
              // image: "/picture/航线光点.png",
              speed: 5
            }
          );
          // clearInterval(timer);
          // let i = 0;
          for (let i = 0; i < item1.length; i++) {
            const thisPoint = Cesium.Cartesian3.fromDegrees(
              item1[i].lng,
              item1[i].lat,
              1
            );
            // let position3 = [thisPoint, center, thisPoint];
            let position3 = [center, thisPoint];
            const graphic = new mars3d.graphic.PolylinePrimitive({
              positions: mars3d.PolyUtil.interLine(position3, {
                minDistance: "auto"
              }), // 切分坐标，使流动材质均匀些
              style: {
                width: 30,
                // material: lineMaterial
                // 使用自定义材质
                materialType: LineSpriteType,
                materialOptions: {
                  image: "/picture/光点4.png",
                  speed: 10
                }
              }
            });
            graphicLayer.addGraphic(graphic);
          }
        } else {
          placeIndex.value++;
        }
      }
    };

    let pathEntity;
    function initPath(data) {
      const property = new Cesium.SampledPositionProperty();
      property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD;

      let start;
      let stop;
      for (let i = 0, len = data.length; i < len; i++) {
        const item = data[i];
        const lng = Number(item.x.toFixed(6)); // 经度
        const lat = Number(item.y.toFixed(6)); // 纬度
        const height = item.z; // 高度
        const time = item.time; // 时间

        let position = null;
        if (lng && lat) {
          position = Cesium.Cartesian3.fromDegrees(lng, lat, height);
        }
        let juliaDate = null;
        if (time) {
          juliaDate = Cesium.JulianDate.fromIso8601(time);
        }
        if (position && juliaDate) {
          property.addSample(juliaDate, position);
        }

        if (i === 0) {
          start = juliaDate;
        } else if (i === len - 1) {
          stop = juliaDate;
        }

        const graphic = new mars3d.graphic.PointPrimitive({
          position,
          style: {
            pixelSize: 4,
            color: "#cccccc"
          },
          popup: "编号:" + item.id + "<br/>时间:" + time
        });
        graphicLayer.addGraphic(graphic);
      }

      // 设置时钟属性
      map.clock.startTime = start.clone();
      map.clock.stopTime = stop.clone();
      map.clock.currentTime = start.clone();
      map.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      map.clock.multiplier = 5;

      if (map.controls.timeline) {
        map.controls.timeline.zoomTo(start, stop);
      }

      // 创建path对象
      pathEntity = new mars3d.graphic.PathEntity({
        position: property,
        orientation: new Cesium.VelocityOrientationProperty(property),
        style: {
          resolution: 1,
          leadTime: 0,
          trailTime: 3600,
          color: "#ff0000",
          width: 3
        },
        label: {
          text: "飞机1号",
          font_size: 19,
          font_family: "楷体",
          color: Cesium.Color.AZURE,
          outline: true,
          visibleDepth: false,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
        },
        // billboard: {
        //   image: "img/marker/lace-blue.png",
        //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   visibleDepth: false
        // },
        model: {
          url: "//data.mars3d.cn/gltf/mars/wrj.glb",
          scale: 0.1,
          minimumPixelSize: 20
        },
        popup: "飞行1号"
      });
      graphicLayer.addGraphic(pathEntity);

      // 圆锥追踪体
      const coneTrack = new mars3d.graphic.ConeTrack({
        position: property,
        style: {
          length: 100,
          angle: 12, // 半场角度
          color: "#ff0000",
          opacity: 0.5
        }
      });
      graphicLayer.addGraphic(coneTrack);
    }

    const isindexof = ref([]);
    let drawlayer = null; //图层对象
    let allLineList = [];
    const lineCount = ref(0);
    const lineFileCount = ref(0);
    // 点击机场显示监管对象及航线
    const getPlaneLineList = currentItem => {
      graphicLayer1.clear();
      graphicLayer2.clear();
      lineCount.value = 0;
      lineFileCount.value = 0;
      allLineList = [];

      // 机场 "http://localhost:5173/line/川沙机场/川沙.kml"
      fetch(currentItem.fileAddress)
        .then(response => response.text())
        .then(data => {
          // 在这里处理文件内容
          const anystr: any = data;
          // console.log("anystr:111", anystr);

          // 转xml
          const xml = new DOMParser().parseFromString(anystr, "text/xml");
          // console.log("kml:xml", xml);
          // // 新建的文件夹名称
          // const filename =
          //   xml.querySelector("Folder > name")?.textContent ??
          //   xml.querySelector("name").textContent;
          // console.log(xml);
          newselect = true;

          setTimeout(() => {
            toGeoJSON(xml).then(geojson => {
              // console.log("geojson", geojson);

              for (let i = 0; i < geojson.features.length; i++) {
                let item = geojson.features[i];
                if (item.geometry.type == "Point") {
                  const graphic = new mars3d.graphic.BillboardEntity({
                    name: item.properties.name,
                    position: item.geometry.coordinates,
                    style: {
                      image: pointIcon,
                      scale: 0.5,
                      color: "#2d8cf0",
                      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                      clampToGround: true
                    },
                    attr: { remark: item.properties.name },
                    popup: item.properties.name
                  });
                  graphicLayer1.addGraphic(graphic);
                } else if (item.geometry.type == "LineString") {
                  const graphic = new mars3d.graphic.CorridorEntity({
                    positions: item.geometry.coordinates,
                    style: {
                      // width: item.properties.strokeWidth,
                      width: 30,
                      color: item.properties.stroke
                    },
                    attr: { remark: item.properties.name },
                    popup: item.properties.name
                  });
                  graphicLayer1.addGraphic(graphic);
                } else if (item.geometry.type == "Polygon") {
                  const graphic = new mars3d.graphic.PolygonEntity({
                    positions: item.geometry.coordinates,
                    style: {
                      color: item.properties.fill,
                      opacity: 0.5
                    },
                    attr: { remark: item.properties.name },
                    popup: item.properties.name
                  });
                  graphicLayer1.addGraphic(graphic);
                }
              }
            });
          }, 500);
        });
      // 航线  "/public/line/川沙机场/川沙航线/*.kmz"
      let modulesFiles;
      switch (currentItem.id) {
        // /public  /dist
        case 1:
          // "/dist/line/泥城机场/泥城/*.kmz"
          modulesFiles = import.meta.glob("/dist/line/泥城机场/泥城/*.kmz");
          break;
        case 2:
          modulesFiles = import.meta.glob(
            "/dist/line/张江机场/张江航线/*.kmz"
          );
          break;
        case 3:
          modulesFiles = import.meta.glob("/dist/line/书院机场/书院航线/*.kmz");
          break;
        case 4:
          modulesFiles = import.meta.glob("/dist/line/川沙机场/川沙航线/*.kmz");
          break;
        case 5:
          modulesFiles = import.meta.glob("/dist/line/大团机场/大团航线/*.kmz");
          break;
        case 6:
          modulesFiles = import.meta.glob("/dist/line/六灶机场/六灶/*.kmz");
          break;
        case 7:
          modulesFiles = import.meta.glob("/dist/line/金桥机场/金桥航线/*.kmz");
          break;
      }

      let modules = [];
      console.log("modulesFiles", modulesFiles);
      for (const path in modulesFiles) {
        modules = [].concat(modules, modulesFiles[path].name);
      }
      // console.log("modules", modules);
      allLineList = [];
      if (modules != null && modules.length > 0) {
        lineFileCount.value = modules.length;
        modules.forEach(item => {
          let nameList = item.toString().split("/");
          let name = nameList[nameList.length - 1].split(".")[0];
          // let kmlfile = new URL(item.toString().substring(5), import.meta.url)
          //   .href;

          // public:8 dist:6
          let kmlfile =appSettings.restUrl+item.toString().substring(nameList[1].length+1);

          // console.log("kmlfile", kmlfile);
          var geocachePromise = Cesium.KmlDataSource.load(kmlfile).then(
            function(dataSource) {
              // console.log("dataSource", dataSource);
              // 获取实体数组
              var geocacheEntities = dataSource.entities.values;

              let lineList = [];
              for (var i = 0; i < geocacheEntities.length; i++) {
                var entity = geocacheEntities[i];

                let position = entity.position;
                if (position != undefined) {
                  var cartographicPosition = Cesium.Cartographic.fromCartesian(
                    entity.position.getValue(Cesium.JulianDate.now())
                  );
                  var latitude = Cesium.Math.toDegrees(
                    cartographicPosition.latitude
                  );
                  var longitude = Cesium.Math.toDegrees(
                    cartographicPosition.longitude
                  );

                  const thisPoint = Cesium.Cartesian3.fromDegrees(
                    longitude,
                    latitude,
                    100
                  );
                  lineList.push(thisPoint);

                  // lineList.push([longitude, latitude, 100]);
                }
              }
              // console.log("lineList", lineList);
              if (lineList != null && lineList.length > 0) {
                let tempItem = {
                  name: name,
                  lineList: lineList
                };
                allLineList.push(tempItem);
              }
              lineCount.value++;
            }
          );
        });
      }
    };

    const showLine = () => {
      console.log("allLineList", allLineList);
      if (allLineList != null && allLineList.length > 0) {
        allLineList.forEach(item => {
          const graphic = new mars3d.graphic.PolylineEntity({
            positions: item.lineList,
            style: {
              width: 5,
              materialType: mars3d.MaterialType.LineFlowColor,
              materialOptions: {
                color: "#00ffff",
                speed: 10,
                percent: 0.5,
                alpha: 0.7
              }
            },
            attr: { remark: item.name },
            popup: item.name
          });

          graphicLayer2.addGraphic(graphic);
        });
      }
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
      // 显示机场及航线数据
      // debugger;
      getPlaneLineList(tempItem);
    };

    // 反制区显示
    const addArea1 = flag => {
      const graphic1 = new mars3d.graphic.BillboardEntity({
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
        graphicLayer.addGraphic(graphic1);
      } else {
        state.value.showFZ = false;
        graphicLayer.removeGraphic(graphic1);
      }
    };

    // 禁飞区显示
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

    let newselect = false; //需要重新选择最后一个文件夹
    const gData = ref();
    // 自定义上传 上传组件仅保留选择文件功能 不然会自动调接口
    const customUpload = e => {
      const files = fileList.value;
      fileList.value = [];
      if (files.length > 0) {
        // 拿到文件后读取
        const file = files[0].originFileObj;
        let filelast = file.name.slice(file.name.lastIndexOf("."));
        if (filelast == ".kml") {
          console.log("kml:", file);
          const reader = new FileReader();
          let rename = false; //是否重名
          reader.readAsText(file, "utf-8");
          reader.onload = async () => {
            // const anystr: any = reader.result;
            // console.log("anystr",anystr);
            fetch("http://localhost:5173/line/川沙机场/川沙.kml")
              .then(response => response.text())
              .then(data => {
                // 在这里处理文件内容
                const anystr: any = data;
                console.log("anystr:111", anystr);

                // 转xml
                const xml = new DOMParser().parseFromString(anystr, "text/xml");
                console.log("kml:xml", xml);
                // // 新建的文件夹名称
                // const filename =
                //   xml.querySelector("Folder > name")?.textContent ??
                //   xml.querySelector("name").textContent;
                // console.log(xml);
                newselect = true;

                setTimeout(() => {
                  toGeoJSON(xml).then(geojson => {
                    console.log("geojson", geojson);

                    for (let i = 0; i < geojson.features.length; i++) {
                      let item = geojson.features[i];
                      if (item.geometry.type == "Point") {
                        const graphic = new mars3d.graphic.BillboardEntity({
                          name: item.properties.name,
                          position: item.geometry.coordinates,
                          style: {
                            image: "/picture/机场点位.png",
                            scale: 1,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            clampToGround: true
                          },
                          attr: { remark: item.properties.name },
                          popup: item.properties.name
                        });
                        graphicLayer.addGraphic(graphic);
                      } else if (item.geometry.type == "LineString") {
                        const graphic = new mars3d.graphic.CorridorEntity({
                          positions: item.geometry.coordinates,
                          style: {
                            // width: item.properties.strokeWidth,
                            width: 50,
                            color: item.properties.stroke
                          },
                          attr: { remark: item.properties.name },
                          popup: item.properties.name
                        });
                        graphicLayer.addGraphic(graphic);
                      } else if (item.geometry.type == "Polygon") {
                        const graphic = new mars3d.graphic.PolygonEntity({
                          positions: item.geometry.coordinates,
                          style: {
                            color: item.properties.fill,
                            opacity: 0.5
                          },
                          attr: { remark: item.properties.name },
                          popup: item.properties.name
                        });
                        graphicLayer.addGraphic(graphic);
                      }
                    }
                  });
                }, 500);
              });
          };
        } else if (filelast == ".kmz") {
          console.log("kmz:", file);

          // var geocachePromise = Cesium.KmlDataSource.load(kml2).then(function(
          //   dataSource
          // ) {
          //   map.dataSources.add(dataSource);
          //   console.log("dataSource", dataSource);
          //   // 获取实体数组
          //   var geocacheEntities = dataSource.entities.values;
          //   console.log("geocacheEntities", geocacheEntities);
          //   let lineList = [];
          //   for (var i = 0; i < geocacheEntities.length; i++) {
          //     var entity = geocacheEntities[i];
          //     let position = entity.position;
          //     if (position != undefined) {
          //       var cartographicPosition = Cesium.Cartographic.fromCartesian(
          //         entity.position.getValue(Cesium.JulianDate.now())
          //       );
          //       var latitude = Cesium.Math.toDegrees(
          //         cartographicPosition.latitude
          //       );
          //       var longitude = Cesium.Math.toDegrees(
          //         cartographicPosition.longitude
          //       );
          //       const thisPoint = Cesium.Cartesian3.fromDegrees(
          //         longitude,
          //         latitude,
          //         1
          //       );
          //       lineList.push(thisPoint);
          //     }
          //   }
          //   console.log("lineList", lineList);
          //   const graphic = new mars3d.graphic.PolylinePrimitive({
          //     positions: mars3d.PolyUtil.interLine(lineList, {
          //       minDistance: "auto"
          //     }), // 切分坐标，使流动材质均匀些
          //     style: {
          //       width: 30,
          //       // material: lineMaterial
          //       // 使用自定义材质
          //       materialType: LineSpriteType,
          //       materialOptions: {
          //         image: "/picture/光点4.png",
          //         speed: 5
          //       }
          //     }
          //   });
          //   graphicLayer.addGraphic(graphic);
          // });
        }
      }
    };

    onMounted(async function() {
      console.log(mars3d);

      map = new mars3d.Map("mars3dContainer2", mapOptions);
      // 创建矢量数据图层
      graphicLayer = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer);
      // 创建矢量数据图层
      graphicLayer1 = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer1);
      // 创建矢量数据图层
      graphicLayer2 = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer2);

      addDemoGraphics();
      addPlacePoint(placeList.value);
      // getPlaneLineList();
    });
    watch(
      () => lineCount.value,
      () => {
        // console.log(lineCount.value)
        if (
          lineCount.value == lineFileCount.value &&
          lineFileCount.value != 0
        ) {
          showLine();
        }
      }
    );
    onUnmounted(() => {
      // clearInterval(timer);
      map = null;
    });
    return {
      // titleText,
      state,
      menuList,
      searchValue,
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
      dtdata,
      fileList,
      customUpload
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
  background: url("/picture/标题背景.png");
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

    background-size: contain;
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
  right: 0px;
  width: 100%;
  // color: rgba(255, 255, 255, 0.8);
  flex-direction: row;
  display: flex;
  // background: url("/picture/底部背景.png");
  justify-content: center;
  align-items: end;
  .showMapButton {
    background: rgba(0, 39, 205, 0.3);
    color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 90px;
    border-radius: 0px 10px 10px 0px;
    // margin: 0px 8px;
  }
}
.mapStyleArea {
  background: rgba(0, 39, 205, 0.3);
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 90px;
  border-radius: 0px 10px 10px 0px;
  .checkArea {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 10px;
    .checkItemImg {
      position: relative;
      left: 10px;
      top: 18px;
      z-index: 3;
    }
  }
  .hiddenButton {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 8px;
  }
}
.bottomTextArea {
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