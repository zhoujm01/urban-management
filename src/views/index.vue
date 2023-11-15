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
            <div style="margin-top: 7px;margin-left:10px">{{ timeInfo.nowTime }}</div>
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
            <!-- 标题光点 -->
            <div class="titleLight">
              <div class="warning">
                <!-- <div class="text"> -->
                <img class="text" src="/picture/光线.png" />
                <!-- </div> -->
              </div>
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
                @change="searchChange"
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
            <!-- 3个窗口 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.contentSelectedId!=0">
              <img src="/picture/监管对象-单个窗口.png" style="width: 300px;" />
              <img src="/picture/数据分析.png" style="width: 300px;" />
              <img src="/picture/实时视频.png" style="width: 300px;" />
            </div>
            <!-- 任务 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='3-1'">
              <img src="/picture/监管对象 (2).png" style="width: 550px;" />
            </div>
            <!-- 航班 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.selectedKeys[0]=='4'">
              <img src="/picture/航班列表.png" style="width: 750px;" />
            </div>
            <!-- 直播画面 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='5-1'">
              <img src="/picture/机场直播 (1).png" style="width: 600px;" />
            </div>
            <!-- 数据分析 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='6-1'">
              <img src="/picture/数据分析.png" style="width: 300px;" />
            </div>
            <!-- 模型库 -->
            <div style="position: absolute;right:10px;top:50px" v-if="state.subSelectedKey=='7-1'">
              <img src="/picture/机场直播.png" style="width: 600px;" />
            </div>

            <div>
              <div style="position: absolute;right:0px;bottom:130px;" @click="addArea1()">
                <img src="/picture/反制.png" style="width: 50px;" v-if="!state.showFZ" />
                <img src="/picture/反制1.png" style="width: 100px;" v-if="state.showFZ" />
              </div>
              <div style="position: absolute;right:0px;bottom:80px;" @click="addArea2()">
                <img src="/picture/禁飞.png" style="width: 50px;" v-if="!state.showJF" />
                <img src="/picture/禁飞1.png" style="width: 100px;" v-if="state.showJF" />
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
            <!-- <div class="buttomText">
              <div v-for="item in dtdata" :key="item.id">
                <div>{{ item.text }}</div>
              </div>
            </div>-->
            <div class="warning">
              <div class="text">M60T 航班按时起飞 航线正常 M30T 航班按时起飞 航线正常 M50T 航班受其他航线影响 航班异常</div>
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

// import file1 from "/line/大团机场/大团航线/*.kmz";

import { v4 as uuidV4 } from "uuid";

export default {
  components: { TextScroll },

  setup() {
    const router = useRouter();

    const appSettings = app.config.globalProperties.$appSettings;
    // const baseUrl = ref(appSettings.restUrl + "uploadimg");

    const searchValue = ref();

    const timeInfo = reactive({
      setInterval: null,
      nowTime: ""
    });

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
                lat: 30.886564,
                lng: 121.811018,
                // kml文件地址 http://localhost:5173/line/川沙机场/川沙.kml
                fileAddress: "/line/泥城机场/泥城.kml",
                // kmz航线文件地址 /public/line/川沙机场/川沙航线/*.kmz
                lineAddress: "/public/line/泥城机场/泥城/*.kmz",
                address: "上海市浦东新区泥城镇秋山路1775弄25号2号楼12层楼顶"
              },
              {
                id: 2,
                name: "2.张江机场",
                lat: 31.205602,
                lng: 121.596878,
                fileAddress: "/line/张江机场/张江.kml",
                lineAddress: "/public/line/张江机场/张江航线/*.kmz",
                address: "上海市浦东新区金科路3057号汇智国际商业广场5层楼顶"
              },
              {
                id: 3,
                name: "3.书院机场",
                lat: 30.977697,
                lng: 121.864152,
                fileAddress: "/line/书院机场/书院.kml",
                lineAddress: "/public/line/书院机场/书院航线/*.kmz",
                address: "上海市浦东新区老芦公路895号禹洲城市广场2号楼11层楼顶"
              },
              {
                id: 4,
                name: "4.川沙机场",
                lat: 31.194529,
                lng: 121.694344,
                fileAddress: "/line/川沙机场/川沙.kml",
                lineAddress: "/public/line/川沙机场/川沙航线/*.kmz",
                address: "上海市浦东新区川沙路5007号顶楼水塔塔顶"
              },
              {
                id: 5,
                name: "5.大团机场",
                lat: 31.006455,
                lng: 121.719885,
                fileAddress: "/line/大团机场/大团.kml",
                lineAddress: "/public/line/大团机场/大团航线/*.kmz",
                address: "上海市浦东新区大团镇汇技路209号3号楼9层楼顶"
              },
              {
                id: 6,
                name: "6.六灶机场",
                lat: 31.097215,
                lng: 121.705817,
                fileAddress: "/line/六灶机场/六灶.kml",
                lineAddress: "/public/line/六灶机场/六灶/*.kmz",
                address: "上海市浦东新区川沙新镇南六公路1188号B楼6楼楼顶"
              },
              {
                id: 7,
                name: "7.金桥机场",
                lat: 31.267368,
                lng: 121.624309,
                fileAddress: "/line/金桥机场/KML导出_20231110093722.kml",
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
            children: [
              {
                id: 1,
                name: "1.泥城机场",
                lat: 30.886564,
                lng: 121.811018,
                // kml文件地址
                fileAddress: "/line/泥城机场/泥城.kml"
              },
              {
                id: 2,
                name: "2.张江机场",
                lat: 31.205602,
                lng: 121.596878,
                fileAddress: "/line/张江机场/张江.kml"
              },
              {
                id: 3,
                name: "3.书院机场",
                lat: 30.977697,
                lng: 121.864152,
                fileAddress: "/line/书院机场/书院.kml"
              },
              {
                id: 4,
                name: "4.川沙机场",
                lat: 31.194529,
                lng: 121.694344,
                fileAddress: "/line/川沙机场/川沙.kml"
              },
              {
                id: 5,
                name: "5.大团机场",
                lat: 31.006455,
                lng: 121.719885,
                fileAddress: "/line/大团机场/大团.kml"
              },
              {
                id: 6,
                name: "6.六灶机场",
                lat: 31.097215,
                lng: 121.705817,
                fileAddress: "/line/六灶机场/六灶.kml"
              },
              {
                id: 7,
                name: "7.金桥机场",
                lat: 31.267368,
                lng: 121.624309,
                fileAddress: "/line/金桥机场/KML导出_20231110093722.kml"
              },
              {
                id: 8,
                name: "彭镇机场",
                lat: 30.945772,
                lng: 121.789615,
                fileAddress: ""
              },
              {
                id: 9,
                name: "惠南机场",
                lat: 31.041714,
                lng: 121.745596,
                fileAddress: ""
              },
              {
                id: 10,
                name: "航头机场",
                lat: 31.039864,
                lng: 121.575397,
                fileAddress: ""
              },

              {
                id: 11,
                name: "高桥机场",
                lat: 31.36275,
                lng: 121.536535,
                fileAddress: "/line/高桥机场/高桥.kml"
              },
              {
                id: 12,
                name: "高行机场",
                lat: 31.328869,
                lng: 121.584887,
                fileAddress: "/line/高行机场/高行.kml"
              },
              {
                id: 13,
                name: "三林机场",
                lat: 31.141283,
                lng: 121.496834,
                fileAddress: "/line/三林机场/三林.kml"
              },
              {
                id: 14,
                name: "周康机场",
                lat: 31.132738,
                lng: 121.605306,
                fileAddress: ""
              },
              {
                id: 15,
                name: "花木机场",
                lat: 31.20756,
                lng: 121.545236,
                fileAddress: "/line/花木机场/花木.kml"
              }
            ]
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

    let graphicLayer3 = null;

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
      // map.
      console.log("item:::", currentItem);

      map.setCameraView({
        lat: currentItem.lat,
        lng: currentItem.lng,
        alt: 30000,
        heading: 0,
        pitch: -90
      });

      // 机场 "http://localhost:5173/line/川沙机场/川沙.kml"
      let fileUrl = new URL(currentItem.fileAddress, import.meta.url).href;
      // const baseUrl = window.location.href.replace(/\/$/, "");

      // const baseUrl = window.location.origin.replace(/\/$/, "");
      // const buildUrl = `${baseUrl}/dist`;
      // let fileUrl = buildUrl + currentItem.fileAddress;
      console.log("fileUrl:", fileUrl);
      showPlaneInfo(fileUrl);

      // 航线  "/public/line/川沙机场/川沙航线/*.kmz"
      let modulesFiles;
      let modules = [];
      switch (currentItem.id) {
        // /public  /dist
        case 1:
          // "/line/泥城机场/泥城/*.kmz"
          // modulesFiles = import.meta.glob("/line/泥城机场/泥城/*.kmz");
          modules = [
            "/line/泥城机场/泥城/200m演示.kmz",
            "/line/泥城机场/泥城/300m演示.kmz",
            "/line/泥城机场/泥城/新建航线.kmz",
            "/line/泥城机场/泥城/泥城001.kmz",
            "/line/泥城机场/泥城/泥城002.kmz",
            "/line/泥城机场/泥城/泥城003.kmz",
            "/line/泥城机场/泥城/泥城01.kmz",
            "/line/泥城机场/泥城/泥城02.kmz",
            "/line/泥城机场/泥城/泥城03.kmz",
            "/line/泥城机场/泥城/泥城04.kmz",
            "/line/泥城机场/泥城/泥城05.kmz",
            "/line/泥城机场/泥城/泥城06.kmz",
            "/line/泥城机场/泥城/泥城07.kmz",
            "/line/泥城机场/泥城/泥城1区域.kmz",
            "/line/泥城机场/泥城/泥城2区域.kmz",
            "/line/泥城机场/泥城/泥城3区域.kmz",
            "/line/泥城机场/泥城/泥城4区域.kmz",
            "/line/泥城机场/泥城/泥城5区域.kmz",
            "/line/泥城机场/泥城/泥城万达未来城.kmz",
            "/line/泥城机场/泥城/泥城临港产业佳园.kmz",
            "/line/泥城机场/泥城/泥城云帆名苑.kmz",
            "/line/泥城机场/泥城/泥城云帆花苑.kmz",
            "/line/泥城机场/泥城/泥城云帆雅苑.kmz",
            "/line/泥城机场/泥城/泥城云松景庭.kmz",
            "/line/泥城机场/泥城/泥城云松翠庭.kmz",
            "/line/泥城机场/泥城/泥城云树仁居.kmz",
            "/line/泥城机场/泥城/泥城云树雅居.kmz",
            "/line/泥城机场/泥城/泥城云水盛兴居.kmz",
            "/line/泥城机场/泥城/泥城云汉富颐园.kmz",
            "/line/泥城机场/泥城/泥城云锦丽苑.kmz",
            "/line/泥城机场/泥城/泥城云锦佳苑.kmz",
            "/line/泥城机场/泥城/泥城云锦名苑.kmz",
            "/line/泥城机场/泥城/泥城云锦新苑.kmz",
            "/line/泥城机场/泥城/泥城五尺沟南段.kmz",
            "/line/泥城机场/泥城/泥城人民小区.kmz",
            "/line/泥城机场/泥城/泥城兴旺新村.kmz",
            "/line/泥城机场/泥城/泥城凌波苑.kmz",
            "/line/泥城机场/泥城/泥城华丽新村.kmz",
            "/line/泥城机场/泥城/泥城垃圾站.kmz",
            "/line/泥城机场/泥城/泥城大芦线.kmz",
            "/line/泥城机场/泥城/泥城大芦线五尺沟.kmz",
            "/line/泥城机场/泥城/泥城工地02照片.kmz",
            "/line/泥城机场/泥城/泥城工地1.kmz",
            "/line/泥城机场/泥城/泥城工地10.kmz",
            "/line/泥城机场/泥城/泥城工地11.kmz",
            "/line/泥城机场/泥城/泥城工地12.kmz",
            "/line/泥城机场/泥城/泥城工地13.kmz",
            "/line/泥城机场/泥城/泥城工地14.kmz",
            "/line/泥城机场/泥城/泥城工地15.kmz",
            "/line/泥城机场/泥城/泥城工地16.kmz",
            "/line/泥城机场/泥城/泥城工地17.kmz",
            "/line/泥城机场/泥城/泥城工地18.kmz",
            "/line/泥城机场/泥城/泥城工地19.kmz",
            "/line/泥城机场/泥城/泥城工地1照片.kmz",
            "/line/泥城机场/泥城/泥城工地2.kmz",
            "/line/泥城机场/泥城/泥城工地3.kmz",
            "/line/泥城机场/泥城/泥城工地4.kmz",
            "/line/泥城机场/泥城/泥城工地5.kmz",
            "/line/泥城机场/泥城/泥城工地6.kmz",
            "/line/泥城机场/泥城/泥城工地7.kmz",
            "/line/泥城机场/泥城/泥城工地8.kmz",
            "/line/泥城机场/泥城/泥城工地9.kmz",
            "/line/泥城机场/泥城/泥城彭平花园.kmz",
            "/line/泥城机场/泥城/泥城文卫新村.kmz",
            "/line/泥城机场/泥城/泥城新元盛璟苑.kmz",
            "/line/泥城机场/泥城/泥城新出土工地.kmz",
            "/line/泥城机场/泥城/泥城春晓苑.kmz",
            "/line/泥城机场/泥城/泥城沪芦高速小区.kmz",
            "/line/泥城机场/泥城/泥城泐马河.kmz",
            "/line/泥城机场/泥城/泥城泥城苑.kmz",
            "/line/泥城机场/泥城/泥城浦纳逸墅.kmz",
            "/line/泥城机场/泥城/泥城海云苑.kmz",
            "/line/泥城机场/泥城/泥城清风名苑.kmz",
            "/line/泥城机场/泥城/泥城清风花苑.kmz",
            "/line/泥城机场/泥城/泥城碧桂园浦东星座.kmz",
            "/line/泥城机场/泥城/泥城美芦苑.kmz",
            "/line/泥城机场/泥城/泥城荷风华庭.kmz",
            "/line/泥城机场/泥城/泥城荷风翠庭.kmz",
            "/line/泥城机场/泥城/泥城蓝色城邦.kmz",
            "/line/泥城机场/泥城/泥城金利都新村.kmz",
            "/line/泥城机场/泥城/泥城雨浥苑.kmz",
            "/line/泥城机场/泥城/泥城非东港铭筑.kmz",
            "/line/泥城机场/泥城/泥城非丽都华庭1.kmz",
            "/line/泥城机场/泥城/泥城非丽都景苑.kmz",
            "/line/泥城机场/泥城/泥城非云松华庭.kmz",
            "/line/泥城机场/泥城/泥城非云树欣居.kmz",
            "/line/泥城机场/泥城/泥城非云锦雅苑.kmz",
            "/line/泥城机场/泥城/泥城非清风丽苑.kmz",
            "/line/泥城机场/泥城/泥城非清风雅苑.kmz",
            "/line/泥城机场/泥城/泥城非荷风景庭.kmz",
            "/line/泥城机场/泥城/泥城非鸿音广场.kmz",
            "/line/泥城机场/泥城/红皮车巡查1.kmz",
            "/line/泥城机场/泥城/红皮车巡查2.kmz"
          ];
          break;
        case 2:
          // modulesFiles = import.meta.glob("/line/张江机场/张江航线/*.kmz");
          modules = [
            "/line/张江机场/张江航线/1.kmz",
            "/line/张江机场/张江航线/1000214579.kmz",
            "/line/张江机场/张江航线/1000235293.kmz",
            "/line/张江机场/张江航线/1000237082.kmz",
            "/line/张江机场/张江航线/115003272.kmz",
            "/line/张江机场/张江航线/115004060.kmz",
            "/line/张江机场/张江航线/115019012.kmz",
            "/line/张江机场/张江航线/115019041.kmz",
            "/line/张江机场/张江航线/115019093.kmz",
            "/line/张江机场/张江航线/14811003Y006502.kmz",
            "/line/张江机场/张江航线/14811003Y006970.kmz",
            "/line/张江机场/张江航线/14811005Y006639.kmz",
            "/line/张江机场/张江航线/14811005Y012426.kmz",
            "/line/张江机场/张江航线/14811006Y005476.kmz",
            "/line/张江机场/张江航线/14819003Y015498.kmz",
            "/line/张江机场/张江航线/14819008Z003142115018894.kmz",
            "/line/张江机场/张江航线/14819011Y002785.kmz",
            "/line/张江机场/张江航线/14819012Y015980.kmz",
            "/line/张江机场/张江航线/200米演示.kmz",
            "/line/张江机场/张江航线/2070800.kmz",
            "/line/张江机场/张江航线/220080.kmz",
            "/line/张江机场/张江航线/300米演示.kmz",
            "/line/张江机场/张江航线/5130206.kmz",
            "/line/张江机场/张江航线/5130316.kmz",
            "/line/张江机场/张江航线/5130317.kmz",
            "/line/张江机场/张江航线/5130318.kmz",
            "/line/张江机场/张江航线/522422995.kmz",
            "/line/张江机场/张江航线/622422575.kmz",
            "/line/张江机场/张江航线/上海临床研究中心新建工程地下室.kmz",
            "/line/张江机场/张江航线/上海市浦东新区张家浜楔形绿地A2-11地块住宅项目001.kmz",
            "/line/张江机场/张江航线/上海市轨道交通21号线一期工程广兰路站土建工程.kmz",
            "/line/张江机场/张江航线/上海集成电路设计产业园2B-6项目除桩基工程一号基坑.kmz",
            "/line/张江机场/张江航线/上海集成电路设计产业园2b-6项目001.kmz",
            "/line/张江机场/张江航线/上海集成电路设计产业园4-2项目002.kmz",
            "/line/张江机场/张江航线/上药生物医药产业基地建设项目002.kmz",
            "/line/张江机场/张江航线/东园雅集龙东花园东郊硅谷.kmz",
            "/line/张江机场/张江航线/东方别墅.kmz",
            "/line/张江机场/张江航线/东方花园.kmz",
            "/line/张江机场/张江航线/东昕生物技术有限公司厂房扩建工程01.kmz",
            "/line/张江机场/张江航线/东郊华庭.kmz",
            "/line/张江机场/张江航线/东郊壹号.kmz",
            "/line/张江机场/张江航线/东郊宾馆别墅区.kmz",
            "/line/张江机场/张江航线/东郊花园1期.kmz",
            "/line/张江机场/张江航线/东郊花园三期合生东郊别墅.kmz",
            "/line/张江机场/张江航线/中兴通讯 研发中心三期项目.kmz",
            "/line/张江机场/张江航线/中医药大学医药国家标准化研究中心项目（西门-蔡伦路）.kmz",
            "/line/张江机场/张江航线/临时用地张江生活垃圾分类.kmz",
            "/line/张江机场/张江航线/九间堂.kmz",
            "/line/张江机场/张江航线/云间大绿地别墅1.kmz",
            "/line/张江机场/张江航线/云间大绿地别墅2.kmz",
            "/line/张江机场/张江航线/云间大绿地别墅3.kmz",
            "/line/张江机场/张江航线/人工智能岛二期项目.kmz",
            "/line/张江机场/张江航线/人工智能岛二期项目001.kmz",
            "/line/张江机场/张江航线/信号测试-东.kmz",
            "/line/张江机场/张江航线/信号测试-北.kmz",
            "/line/张江机场/张江航线/信号测试-南.kmz",
            "/line/张江机场/张江航线/信号测试-西.kmz",
            "/line/张江机场/张江航线/前程路电力隧道和管线工程西段.kmz",
            "/line/张江机场/张江航线/前程路（白杨路~芳波北路）新建工程.kmz",
            "/line/张江机场/张江航线/北蔡鹏海社区Z000901单元09C-01地块动迁安置房项目.kmz",
            "/line/张江机场/张江航线/华域汽车技术研发中心建筑工程项目001.kmz",
            "/line/张江机场/张江航线/华州君庭.kmz",
            "/line/张江机场/张江航线/厂房扩建工程001.kmz",
            "/line/张江机场/张江航线/变焦试验.kmz",
            "/line/张江机场/张江航线/合声东郊御品园.kmz",
            "/line/张江机场/张江航线/四季雅苑1.kmz",
            "/line/张江机场/张江航线/四季雅苑2.kmz",
            "/line/张江机场/张江航线/城市经典玉墅夏宫.kmz",
            "/line/张江机场/张江航线/居里路1号项目002.kmz",
            "/line/张江机场/张江航线/张家浜楔形绿地E1b-09地块九年一贯制学校项目001.kmz",
            "/line/张江机场/张江航线/张家浜楔形绿地工程（四期）001.kmz",
            "/line/张江机场/张江航线/张江世外桃源花园别墅小区其.kmz",
            "/line/张江机场/张江航线/张江世茂湖滨花园.kmz",
            "/line/张江机场/张江航线/张江东郊中心其.kmz",
            "/line/张江机场/张江航线/张江中区单元卓闻路张衡路以南华夏中路新建工程一期.kmz",
            "/line/张江机场/张江航线/张江中医药大学学生公寓其.kmz",
            "/line/张江机场/张江航线/张江中芯花园北区其.kmz",
            "/line/张江机场/张江航线/张江仁恒河滨城2期.kmz",
            "/line/张江机场/张江航线/张江北中路480弄小区其.kmz",
            "/line/张江机场/张江航线/张江北蔡大街31弄32弄小区其.kmz",
            "/line/张江机场/张江航线/张江北蔡蓬溪二村其.kmz",
            "/line/张江机场/张江航线/张江华丽家族花园.kmz",
            "/line/张江机场/张江航线/张江华发四季.kmz",
            "/line/张江机场/张江航线/张江唐丰苑其.kmz",
            "/line/张江机场/张江航线/张江国脉苑其.kmz",
            "/line/张江机场/张江航线/张江圣马丽诺桥语别墅其.kmz",
            "/line/张江机场/张江航线/张江城市经典高迪其.kmz",
            "/line/张江机场/张江航线/张江培育苑其 (1).kmz",
            "/line/张江机场/张江航线/张江培育苑其.kmz",
            "/line/张江机场/张江航线/张江大众中心村其.kmz",
            "/line/张江机场/张江航线/张江天之骄子创业公寓其.kmz",
            "/line/张江机场/张江航线/张江小区测试.kmz",
            "/line/张江机场/张江航线/张江川杨新苑三期.kmz",
            "/line/张江机场/张江航线/张江川杨新苑四期其.kmz",
            "/line/张江机场/张江航线/张江川杨河.kmz",
            "/line/张江机场/张江航线/张江川杨紫薇苑其.kmz",
            "/line/张江机场/张江航线/张江工地001.kmz",
            "/line/张江机场/张江航线/张江工地002.kmz",
            "/line/张江机场/张江航线/张江工地003.kmz",
            "/line/张江机场/张江航线/张江工地004.kmz",
            "/line/张江机场/张江航线/张江工地005.kmz",
            "/line/张江机场/张江航线/张江工地006.kmz",
            "/line/张江机场/张江航线/张江工地007.kmz",
            "/line/张江机场/张江航线/张江工地008.kmz",
            "/line/张江机场/张江航线/张江工地009.kmz",
            "/line/张江机场/张江航线/张江工地01.kmz",
            "/line/张江机场/张江航线/张江工地010.kmz",
            "/line/张江机场/张江航线/张江工地011.kmz",
            "/line/张江机场/张江航线/张江工地012.kmz",
            "/line/张江机场/张江航线/张江工地013（待验证）.kmz",
            "/line/张江机场/张江航线/张江工地014.kmz",
            "/line/张江机场/张江航线/张江工地015.kmz",
            "/line/张江机场/张江航线/张江工地016.kmz",
            "/line/张江机场/张江航线/张江工地017.kmz",
            "/line/张江机场/张江航线/张江工地018.kmz",
            "/line/张江机场/张江航线/张江工地019.kmz",
            "/line/张江机场/张江航线/张江工地020.kmz",
            "/line/张江机场/张江航线/张江工地021.kmz",
            "/line/张江机场/张江航线/张江工地022.kmz",
            "/line/张江机场/张江航线/张江工地023（待验证）.kmz",
            "/line/张江机场/张江航线/张江工地024.kmz",
            "/line/张江机场/张江航线/张江工地025.kmz",
            "/line/张江机场/张江航线/张江工地026.kmz",
            "/line/张江机场/张江航线/张江工地027.kmz",
            "/line/张江机场/张江航线/张江工地028.kmz",
            "/line/张江机场/张江航线/张江工地029.kmz",
            "/line/张江机场/张江航线/张江工地030.kmz",
            "/line/张江机场/张江航线/张江工地正射001.kmz",
            "/line/张江机场/张江航线/张江工地正射002.kmz",
            "/line/张江机场/张江航线/张江张家浜.kmz",
            "/line/张江机场/张江航线/张江张江汤臣豪园二期.kmz",
            "/line/张江机场/张江航线/张江拆后01.kmz",
            "/line/张江机场/张江航线/张江拆后02.kmz",
            "/line/张江机场/张江航线/张江数字产业创新平台项目001.kmz",
            "/line/张江机场/张江航线/张江新城路428弄其.kmz",
            "/line/张江机场/张江航线/张江新花苑其.kmz",
            "/line/张江机场/张江航线/张江日月光水岸花园二期其.kmz",
            "/line/张江机场/张江航线/张江日月集团员工生活园区其.kmz",
            "/line/张江机场/张江航线/张江时代金领金桥爱建园.kmz",
            "/line/张江机场/张江航线/张江樟盛苑其.kmz",
            "/line/张江机场/张江航线/张江水清木华公寓.kmz",
            "/line/张江机场/张江航线/张江汇智湖畔家园.kmz",
            "/line/张江机场/张江航线/张江汤臣豪园一期其.kmz",
            "/line/张江机场/张江航线/张江汤臣豪园其.kmz",
            "/line/张江机场/张江航线/张江浦东花园其.kmz",
            "/line/张江机场/张江航线/张江润和国际总部园.kmz",
            "/line/张江机场/张江航线/张江玉兰小区其.kmz",
            "/line/张江机场/张江航线/张江玉兰香苑一期A区其.kmz",
            "/line/张江机场/张江航线/张江玉兰香苑四期其 (1).kmz",
            "/line/张江机场/张江航线/张江玉兰香苑四期其.kmz",
            "/line/张江机场/张江航线/张江申城佳苑一期其.kmz",
            "/line/张江机场/张江航线/张江申城佳苑三期A块其.kmz",
            "/line/张江机场/张江航线/张江申城佳苑三期B块其.kmz",
            "/line/张江机场/张江航线/张江申城佳苑二期A块其.kmz",
            "/line/张江机场/张江航线/张江白杨小区其.kmz",
            "/line/张江机场/张江航线/张江碧云别墅北区其.kmz",
            "/line/张江机场/张江航线/张江碧云别墅南区其.kmz",
            "/line/张江机场/张江航线/张江碧云别墅银杏苑其.kmz",
            "/line/张江机场/张江航线/张江碧云国际社区晓园其.kmz",
            "/line/张江机场/张江航线/张江碧云尊邸其.kmz",
            "/line/张江机场/张江航线/张江碧云花园.kmz",
            "/line/张江机场/张江航线/张江碧云花园二期其.kmz",
            "/line/张江机场/张江航线/张江科学园项目.kmz",
            "/line/张江机场/张江航线/张江维诗凯亚俐马花园其.kmz",
            "/line/张江机场/张江航线/张江胡姬花园其.kmz",
            "/line/张江机场/张江航线/张江芳华苑北区其.kmz",
            "/line/张江机场/张江航线/张江芳华路268弄其.kmz",
            "/line/张江机场/张江航线/张江芳华路小区其.kmz",
            "/line/张江机场/张江航线/张江芳草苑其.kmz",
            "/line/张江机场/张江航线/张江芳草路253弄其.kmz",
            "/line/张江机场/张江航线/张江莲中二村其.kmz",
            "/line/张江机场/张江航线/张江莲宏苑其.kmz",
            "/line/张江机场/张江航线/张江莲康苑其.kmz",
            "/line/张江机场/张江航线/张江莲怡苑其.kmz",
            "/line/张江机场/张江航线/张江莲泰苑其.kmz",
            "/line/张江机场/张江航线/张江莲溪八村其.kmz",
            "/line/张江机场/张江航线/张江莲溪村其.kmz",
            "/line/张江机场/张江航线/张江莲馨苑其.kmz",
            "/line/张江机场/张江航线/张江莲鼎苑其.kmz",
            "/line/张江机场/张江航线/张江蓬溪六村其.kmz",
            "/line/张江机场/张江航线/张江虹南小区其.kmz",
            "/line/张江机场/张江航线/张江西北区07-03科技总部平台项目002.kmz",
            "/line/张江机场/张江航线/张江路.kmz",
            "/line/张江机场/张江航线/张江金桥酒店公寓.kmz",
            "/line/张江机场/张江航线/张江阳光花城.kmz",
            "/line/张江机场/张江航线/张江非万科翡翠公园.kmz",
            "/line/张江机场/张江航线/张江非万科翡翠公园一期.kmz",
            "/line/张江机场/张江航线/张江非东方日出苑.kmz",
            "/line/张江机场/张江航线/张江非中天碧云苑.kmz",
            "/line/张江机场/张江航线/张江非中芯花园1期.kmz",
            "/line/张江机场/张江航线/张江非仁恒河滨城3期.kmz",
            "/line/张江机场/张江航线/张江非仁恒河滨城二期.kmz",
            "/line/张江机场/张江航线/张江非古桐二村.kmz",
            "/line/张江机场/张江航线/张江非培花七村.kmz",
            "/line/张江机场/张江航线/张江非孙桥公寓.kmz",
            "/line/张江机场/张江航线/张江非广兰名苑.kmz",
            "/line/张江机场/张江航线/张江非张江三湘海尚.kmz",
            "/line/张江机场/张江航线/张江非张江名流豪庭.kmz",
            "/line/张江机场/张江航线/张江非张江汤臣豪园三期.kmz",
            "/line/张江机场/张江航线/张江非张江汤臣豪园四期.kmz",
            "/line/张江机场/张江航线/张江非御河硅谷.kmz",
            "/line/张江机场/张江航线/张江非日月光水岸花园.kmz",
            "/line/张江机场/张江航线/张江非星云小区.kmz",
            "/line/张江机场/张江航线/张江非春港丽园.kmz",
            "/line/张江机场/张江航线/张江非杨镇新村.kmz",
            "/line/张江机场/张江航线/张江非汤臣湖庭花园.kmz",
            "/line/张江机场/张江航线/张江非玉兰香苑一期.kmz",
            "/line/张江机场/张江航线/张江非玉兰香苑三期.kmz",
            "/line/张江机场/张江航线/张江非玉兰香苑二期.kmz",
            "/line/张江机场/张江航线/张江非申城佳苑.kmz",
            "/line/张江机场/张江航线/张江非益丰新村.kmz",
            "/line/张江机场/张江航线/张江非盛大天地青春里.kmz",
            "/line/张江机场/张江航线/张江非第九城市一期.kmz",
            "/line/张江机场/张江航线/张江非紫薇景苑.kmz",
            "/line/张江机场/张江航线/张江非绿城·玉兰公馆.kmz",
            "/line/张江机场/张江航线/张江非芳丽苑.kmz",
            "/line/张江机场/张江航线/张江非芳佳苑.kmz",
            "/line/张江机场/张江航线/张江非莲安东路79弄小区.kmz",
            "/line/张江机场/张江航线/张江非虹御公寓.kmz",
            "/line/张江机场/张江航线/张江非金洋十方庭.kmz",
            "/line/张江机场/张江航线/张江非锦绣小区.kmz",
            "/line/张江机场/张江航线/张江非香楠小区东区.kmz",
            "/line/张江机场/张江航线/张江非香楠小区西区.kmz",
            "/line/张江机场/张江航线/张江非龙港小区.kmz",
            "/line/张江机场/张江航线/张江非龙科公寓.kmz",
            "/line/张江机场/张江航线/张江高科苑其.kmz",
            "/line/张江机场/张江航线/张江鹏裕苑其.kmz",
            "/line/张江机场/张江航线/御翠园1.kmz",
            "/line/张江机场/张江航线/御翠园2.kmz",
            "/line/张江机场/张江航线/御翠园3.kmz",
            "/line/张江机场/张江航线/教学航线.kmz",
            "/line/张江机场/张江航线/时代金领高楼区.kmz",
            "/line/张江机场/张江航线/梵高别墅.kmz",
            "/line/张江机场/张江航线/汤臣金桥花园1期.kmz",
            "/line/张江机场/张江航线/汤臣金桥花园商品住宅项目西地块二期三期及东地块-西地块二期.kmz",
            "/line/张江机场/张江航线/汤臣高尔夫别墅.kmz",
            "/line/张江机场/张江航线/浦东新区北蔡Z000501单元白杨路以东片区02-01地块项目桩基工程.kmz",
            "/line/张江机场/张江航线/环业西路与绿科路工地.kmz",
            "/line/张江机场/张江航线/益江路.kmz",
            "/line/张江机场/张江航线/盛大天地.kmz",
            "/line/张江机场/张江航线/碧云花园二期.kmz",
            "/line/张江机场/张江航线/红皮车行动.kmz",
            "/line/张江机场/张江航线/罗山花苑别墅区.kmz",
            "/line/张江机场/张江航线/银泰花园低楼区.kmz",
            "/line/张江机场/张江航线/阳光花城.kmz",
            "/line/张江机场/张江航线/陶园别墅.kmz",
            "/line/张江机场/张江航线/集成电路设计产业园3-4项目.kmz",
            "/line/张江机场/张江航线/集成电路设计产业园3C-10项目.kmz"
          ];
          break;
        case 3:
          // modulesFiles = import.meta.glob("/line/书院机场/书院航线/*.kmz");
          modules = [
            "/line/书院机场/书院航线/200m演示.kmz",
            "/line/书院机场/书院航线/300m演示.kmz",
            "/line/书院机场/书院航线/书院001.kmz",
            "/line/书院机场/书院航线/书院002.kmz",
            "/line/书院机场/书院航线/书院01.kmz",
            "/line/书院机场/书院航线/书院02.kmz",
            "/line/书院机场/书院航线/书院03.kmz",
            "/line/书院机场/书院航线/书院04.kmz",
            "/line/书院机场/书院航线/书院05.kmz",
            "/line/书院机场/书院航线/书院06.kmz",
            "/line/书院机场/书院航线/书院07.kmz",
            "/line/书院机场/书院航线/书院08.kmz",
            "/line/书院机场/书院航线/书院09.kmz",
            "/line/书院机场/书院航线/书院10.kmz",
            "/line/书院机场/书院航线/书院11.kmz",
            "/line/书院机场/书院航线/书院12.kmz",
            "/line/书院机场/书院航线/书院1区域.kmz",
            "/line/书院机场/书院航线/书院1号公寓.kmz",
            "/line/书院机场/书院航线/书院2区域.kmz",
            "/line/书院机场/书院航线/书院3区域.kmz",
            "/line/书院机场/书院航线/书院4区域.kmz",
            "/line/书院机场/书院航线/书院东方颐城.kmz",
            "/line/书院机场/书院航线/书院中建玖里书香.kmz",
            "/line/书院机场/书院航线/书院临时任务.kmz",
            "/line/书院机场/书院航线/书院丽泽荷亭苑.kmz",
            "/line/书院机场/书院航线/书院丽泽菊清苑.kmz",
            "/line/书院机场/书院航线/书院亭园新村.kmz",
            "/line/书院机场/书院航线/书院华元小区.kmz",
            "/line/书院机场/书院航线/书院工地01.kmz",
            "/line/书院机场/书院航线/书院工地1.kmz",
            "/line/书院机场/书院航线/书院工地2.kmz",
            "/line/书院机场/书院航线/书院新出土工地.kmz",
            "/line/书院机场/书院航线/书院新舒苑北苑.kmz",
            "/line/书院机场/书院航线/书院新舒苑南苑.kmz",
            "/line/书院机场/书院航线/书院测试.kmz",
            "/line/书院机场/书院航线/书院非丽泽兰馨苑.kmz",
            "/line/书院机场/书院航线/书院非丽泽梅傲苑.kmz",
            "/line/书院机场/书院航线/垃圾站东.kmz",
            "/line/书院机场/书院航线/垃圾站北.kmz",
            "/line/书院机场/书院航线/垃圾站大.kmz",
            "/line/书院机场/书院航线/垃圾站点南.kmz",
            "/line/书院机场/书院航线/大治河巡查7.kmz",
            "/line/书院机场/书院航线/大治河巡查8.kmz",
            "/line/书院机场/书院航线/新建倾斜摄影2.kmz",
            "/line/书院机场/书院航线/新建航线.kmz",
            "/line/书院机场/书院航线/新建航线1.kmz",
            "/line/书院机场/书院航线/新建航线2.kmz",
            "/line/书院机场/书院航线/演示.kmz",
            "/line/书院机场/书院航线/红皮车书院.kmz"
          ];
          break;
        case 4:
          // modulesFiles = import.meta.glob("/line/川沙机场/川沙航线/*.kmz");
          modules = [
            "/line/川沙机场/川沙航线/1000211821.kmz",
            "/line/川沙机场/川沙航线/1000212862.kmz",
            "/line/川沙机场/川沙航线/1000214895.kmz",
            "/line/川沙机场/川沙航线/1000218546.kmz",
            "/line/川沙机场/川沙航线/1000218670.kmz",
            "/line/川沙机场/川沙航线/1000219024.kmz",
            "/line/川沙机场/川沙航线/1000219929.kmz",
            "/line/川沙机场/川沙航线/1000220119.kmz",
            "/line/川沙机场/川沙航线/1000220272.kmz",
            "/line/川沙机场/川沙航线/1000221508.kmz",
            "/line/川沙机场/川沙航线/1000221758.kmz",
            "/line/川沙机场/川沙航线/1000222794.kmz",
            "/line/川沙机场/川沙航线/1000225293.kmz",
            "/line/川沙机场/川沙航线/1000225637.kmz",
            "/line/川沙机场/川沙航线/1000226202.kmz",
            "/line/川沙机场/川沙航线/1000226892.kmz",
            "/line/川沙机场/川沙航线/1000227048.kmz",
            "/line/川沙机场/川沙航线/1000231434.kmz",
            "/line/川沙机场/川沙航线/1000231770.kmz",
            "/line/川沙机场/川沙航线/1000232010.kmz",
            "/line/川沙机场/川沙航线/1000232580.kmz",
            "/line/川沙机场/川沙航线/1000233369.kmz",
            "/line/川沙机场/川沙航线/1000234470.kmz",
            "/line/川沙机场/川沙航线/1000234902.kmz",
            "/line/川沙机场/川沙航线/1000236948.kmz",
            "/line/川沙机场/川沙航线/1000239316.kmz",
            "/line/川沙机场/川沙航线/1000239625.kmz",
            "/line/川沙机场/川沙航线/1000240279.kmz",
            "/line/川沙机场/川沙航线/1000240508.kmz",
            "/line/川沙机场/川沙航线/1000241202.kmz",
            "/line/川沙机场/川沙航线/1000242072.kmz",
            "/line/川沙机场/川沙航线/1000242550.kmz",
            "/line/川沙机场/川沙航线/1000242641.kmz",
            "/line/川沙机场/川沙航线/1000243311.kmz",
            "/line/川沙机场/川沙航线/1000243381.kmz",
            "/line/川沙机场/川沙航线/1000243483.kmz",
            "/line/川沙机场/川沙航线/1000243654.kmz",
            "/line/川沙机场/川沙航线/1000243991.kmz",
            "/line/川沙机场/川沙航线/1000244353.kmz",
            "/line/川沙机场/川沙航线/1000245533.kmz",
            "/line/川沙机场/川沙航线/1000245573.kmz",
            "/line/川沙机场/川沙航线/1000246381.kmz",
            "/line/川沙机场/川沙航线/1010247.kmz",
            "/line/川沙机场/川沙航线/1010271.kmz",
            "/line/川沙机场/川沙航线/1010312.kmz",
            "/line/川沙机场/川沙航线/1010313.kmz",
            "/line/川沙机场/川沙航线/115003252.kmz",
            "/line/川沙机场/川沙航线/115003326.kmz",
            "/line/川沙机场/川沙航线/115003378.kmz",
            "/line/川沙机场/川沙航线/115007522.kmz",
            "/line/川沙机场/川沙航线/115009366.kmz",
            "/line/川沙机场/川沙航线/115018911.kmz",
            "/line/川沙机场/川沙航线/115019321.kmz",
            "/line/川沙机场/川沙航线/115019660.kmz",
            "/line/川沙机场/川沙航线/115019690.kmz",
            "/line/川沙机场/川沙航线/115019699.kmz",
            "/line/川沙机场/川沙航线/115019709.kmz",
            "/line/川沙机场/川沙航线/115019724.kmz",
            "/line/川沙机场/川沙航线/115019765.kmz",
            "/line/川沙机场/川沙航线/115019827.kmz",
            "/line/川沙机场/川沙航线/115019830.kmz",
            "/line/川沙机场/川沙航线/115019867.kmz",
            "/line/川沙机场/川沙航线/115019877.kmz",
            "/line/川沙机场/川沙航线/115020819.kmz",
            "/line/川沙机场/川沙航线/115020824.kmz",
            "/line/川沙机场/川沙航线/14812012Y014497.kmz",
            "/line/川沙机场/川沙航线/14812013Y007683.kmz",
            "/line/川沙机场/川沙航线/14815055Y003501.kmz",
            "/line/川沙机场/川沙航线/14815101Y002720.kmz",
            "/line/川沙机场/川沙航线/14815101Y003053.kmz",
            "/line/川沙机场/川沙航线/14815104Y001448.kmz",
            "/line/川沙机场/川沙航线/14815104Y001873.kmz",
            "/line/川沙机场/川沙航线/14815107Y001286.kmz",
            "/line/川沙机场/川沙航线/14815108Y002753.kmz",
            "/line/川沙机场/川沙航线/14816116Y048012.kmz",
            "/line/川沙机场/川沙航线/200米演示.kmz",
            "/line/川沙机场/川沙航线/2070759-4.kmz",
            "/line/川沙机场/川沙航线/2070789-1.kmz",
            "/line/川沙机场/川沙航线/2071143.kmz",
            "/line/川沙机场/川沙航线/22424481.kmz",
            "/line/川沙机场/川沙航线/300米演示.kmz",
            "/line/川沙机场/川沙航线/322423295.kmz",
            "/line/川沙机场/川沙航线/422424386.kmz",
            "/line/川沙机场/川沙航线/5130209.kmz",
            "/line/川沙机场/川沙航线/5130303.kmz",
            "/line/川沙机场/川沙航线/5130304-1.kmz",
            "/line/川沙机场/川沙航线/5130305.kmz",
            "/line/川沙机场/川沙航线/5130378.kmz",
            "/line/川沙机场/川沙航线/C06跨川沙路连桥项目001.kmz",
            "/line/川沙机场/川沙航线/PD-CS-428.kmz",
            "/line/川沙机场/川沙航线/万丰别墅.kmz",
            "/line/川沙机场/川沙航线/东菱花苑.kmz",
            "/line/川沙机场/川沙航线/人民医院门急诊医技综合楼改扩建工程001.kmz",
            "/line/川沙机场/川沙航线/倾斜川沙大厦.kmz",
            "/line/川沙机场/川沙航线/勤俭村.kmz",
            "/line/川沙机场/川沙航线/华夏花园.kmz",
            "/line/川沙机场/川沙航线/合庆镇川沙北社区D06D-15地块征收安置房项目001.kmz",
            "/line/川沙机场/川沙航线/合庆（北社区D06D）01015.kmz",
            "/line/川沙机场/川沙航线/土方车非现测试.kmz",
            "/line/川沙机场/川沙航线/川沙01.kmz",
            "/line/川沙机场/川沙航线/川沙01二期.kmz",
            "/line/川沙机场/川沙航线/川沙02.kmz",
            "/line/川沙机场/川沙航线/川沙02二期.kmz",
            "/line/川沙机场/川沙航线/川沙03.kmz",
            "/line/川沙机场/川沙航线/川沙03二期.kmz",
            "/line/川沙机场/川沙航线/川沙04.kmz",
            "/line/川沙机场/川沙航线/川沙04二期.kmz",
            "/line/川沙机场/川沙航线/川沙05.kmz",
            "/line/川沙机场/川沙航线/川沙05二期.kmz",
            "/line/川沙机场/川沙航线/川沙06.kmz",
            "/line/川沙机场/川沙航线/川沙06二期.kmz",
            "/line/川沙机场/川沙航线/川沙07.kmz",
            "/line/川沙机场/川沙航线/川沙07二期.kmz",
            "/line/川沙机场/川沙航线/川沙08.kmz",
            "/line/川沙机场/川沙航线/川沙09.kmz",
            "/line/川沙机场/川沙航线/川沙09二期.kmz",
            "/line/川沙机场/川沙航线/川沙10.kmz",
            "/line/川沙机场/川沙航线/川沙11.kmz",
            "/line/川沙机场/川沙航线/川沙12.kmz",
            "/line/川沙机场/川沙航线/川沙13.kmz",
            "/line/川沙机场/川沙航线/川沙14.kmz",
            "/line/川沙机场/川沙航线/川沙15.kmz",
            "/line/川沙机场/川沙航线/川沙16.kmz",
            "/line/川沙机场/川沙航线/川沙17.kmz",
            "/line/川沙机场/川沙航线/川沙18.kmz",
            "/line/川沙机场/川沙航线/川沙19.kmz",
            "/line/川沙机场/川沙航线/川沙20.kmz",
            "/line/川沙机场/川沙航线/川沙21.kmz",
            "/line/川沙机场/川沙航线/川沙22.kmz",
            "/line/川沙机场/川沙航线/川沙23.kmz",
            "/line/川沙机场/川沙航线/川沙24.kmz",
            "/line/川沙机场/川沙航线/川沙25.kmz",
            "/line/川沙机场/川沙航线/川沙26.kmz",
            "/line/川沙机场/川沙航线/川沙27.kmz",
            "/line/川沙机场/川沙航线/川沙七恒东郊花园其.kmz",
            "/line/川沙机场/川沙航线/川沙万馨佳园其.kmz",
            "/line/川沙机场/川沙航线/川沙东唐花苑其.kmz",
            "/line/川沙机场/川沙航线/川沙东唐苑南区其.kmz",
            "/line/川沙机场/川沙航线/川沙东绣苑.kmz",
            "/line/川沙机场/川沙航线/川沙临丰小区其.kmz",
            "/line/川沙机场/川沙航线/川沙临河小区其.kmz",
            "/line/川沙机场/川沙航线/川沙体育场征地改扩建工程001.kmz",
            "/line/川沙机场/川沙航线/川沙佳洲欣苑其.kmz",
            "/line/川沙机场/川沙航线/川沙佳运公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙保利御樽苑其.kmz",
            "/line/川沙机场/川沙航线/川沙保利金爵公寓.kmz",
            "/line/川沙机场/川沙航线/川沙兴东名苑其.kmz",
            "/line/川沙机场/川沙航线/川沙凯佳公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙创新佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙办龙新世纪公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙北城小区其.kmz",
            "/line/川沙机场/川沙航线/川沙华夏社区单元A01街坊（A01-02c地块）征收安置房项目核准和能评001.kmz",
            "/line/川沙机场/川沙航线/川沙华天小区其.kmz",
            "/line/川沙机场/川沙航线/川沙华府其.kmz",
            "/line/川沙机场/川沙航线/川沙华沙二村其.kmz",
            "/line/川沙机场/川沙航线/川沙华邦佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙华飞金桂苑其.kmz",
            "/line/川沙机场/川沙航线/川沙唐人宛其.kmz",
            "/line/川沙机场/川沙航线/川沙唐镇中芯花园其.kmz",
            "/line/川沙机场/川沙航线/川沙园西小区其.kmz",
            "/line/川沙机场/川沙航线/川沙城东社区 PDP0-0703单元D05B-02地块（“城中村”改造项目—太平村A片地块.kmz",
            "/line/川沙机场/川沙航线/川沙城南路东区其.kmz",
            "/line/川沙机场/川沙航线/川沙城南路西区其.kmz",
            "/line/川沙机场/川沙航线/川沙培元新苑其.kmz",
            "/line/川沙机场/川沙航线/川沙大星村青六路小区其.kmz",
            "/line/川沙机场/川沙航线/川沙妙栏小区其.kmz",
            "/line/川沙机场/川沙航线/川沙妙栏路200弄其.kmz",
            "/line/川沙机场/川沙航线/川沙妙栏路392弄其.kmz",
            "/line/川沙机场/川沙航线/川沙妙镜公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙妙镜家园其.kmz",
            "/line/川沙机场/川沙航线/川沙妙龙一村其.kmz",
            "/line/川沙机场/川沙航线/川沙学北路20弄小区其.kmz",
            "/line/川沙机场/川沙航线/川沙川杨河.kmz",
            "/line/川沙机场/川沙航线/川沙川沙路4650弄其.kmz",
            "/line/川沙机场/川沙航线/川沙川虹新苑.kmz",
            "/line/川沙机场/川沙航线/川沙张江国际豪庭其.kmz",
            "/line/川沙机场/川沙航线/川沙御华庭其.kmz",
            "/line/川沙机场/川沙航线/川沙御景豪园其.kmz",
            "/line/川沙机场/川沙航线/川沙心圆东苑.kmz",
            "/line/川沙机场/川沙航线/川沙心圆西苑其.kmz",
            "/line/川沙机场/川沙航线/川沙拆后001.kmz",
            "/line/川沙机场/川沙航线/川沙拆后002.kmz",
            "/line/川沙机场/川沙航线/川沙拆后003.kmz",
            "/line/川沙机场/川沙航线/川沙拆后01.kmz",
            "/line/川沙机场/川沙航线/川沙拆后02.kmz",
            "/line/川沙机场/川沙航线/川沙拆后03.kmz",
            "/line/川沙机场/川沙航线/川沙拆后04.kmz",
            "/line/川沙机场/川沙航线/川沙拆后05.kmz",
            "/line/川沙机场/川沙航线/川沙拆后06.kmz",
            "/line/川沙机场/川沙航线/川沙拆后07.kmz",
            "/line/川沙机场/川沙航线/川沙拆后08.kmz",
            "/line/川沙机场/川沙航线/川沙拆后09.kmz",
            "/line/川沙机场/川沙航线/川沙拆后10.kmz",
            "/line/川沙机场/川沙航线/川沙新川公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙新川小区其.kmz",
            "/line/川沙机场/川沙航线/川沙新德公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙新德路506弄小区其.kmz",
            "/line/川沙机场/川沙航线/川沙新洲豪园其.kmz",
            "/line/川沙机场/川沙航线/川沙新润花苑其.kmz",
            "/line/川沙机场/川沙航线/川沙旺族家园其.kmz",
            "/line/川沙机场/川沙航线/川沙明珠小区其.kmz",
            "/line/川沙机场/川沙航线/川沙晴川佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙曙光苑其.kmz",
            "/line/川沙机场/川沙航线/川沙曹家沟.kmz",
            "/line/川沙机场/川沙航线/川沙桃园公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙水景豪园其.kmz",
            "/line/川沙机场/川沙航线/川沙河滨小区其.kmz",
            "/line/川沙机场/川沙航线/川沙浦东运河.kmz",
            "/line/川沙机场/川沙航线/川沙浦发华庭.kmz",
            "/line/川沙机场/川沙航线/川沙浦发馨汇佳苑.kmz",
            "/line/川沙机场/川沙航线/川沙玉兰苑其.kmz",
            "/line/川沙机场/川沙航线/川沙玉宇小区其.kmz",
            "/line/川沙机场/川沙航线/川沙玉宇新苑其.kmz",
            "/line/川沙机场/川沙航线/川沙玉桥苑其.kmz",
            "/line/川沙机场/川沙航线/川沙珠光苑其.kmz",
            "/line/川沙机场/川沙航线/川沙申华公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙界龙阳光苑其.kmz",
            "/line/川沙机场/川沙航线/川沙盛唐福邸其.kmz",
            "/line/川沙机场/川沙航线/川沙立诚苑其.kmz",
            "/line/川沙机场/川沙航线/川沙紫金九号二期.kmz",
            "/line/川沙机场/川沙航线/川沙绿地公寓其.kmz",
            "/line/川沙机场/川沙航线/川沙绿海家园其.kmz",
            "/line/川沙机场/川沙航线/川沙翔川家园北区其.kmz",
            "/line/川沙机场/川沙航线/川沙试运行04.kmz",
            "/line/川沙机场/川沙航线/川沙试运行05.kmz",
            "/line/川沙机场/川沙航线/川沙试运行06.kmz",
            "/line/川沙机场/川沙航线/川沙试运行07.kmz",
            "/line/川沙机场/川沙航线/川沙试运行10.kmz",
            "/line/川沙机场/川沙航线/川沙试运行11.kmz",
            "/line/川沙机场/川沙航线/川沙试运行12.kmz",
            "/line/川沙机场/川沙航线/川沙试运行14.kmz",
            "/line/川沙机场/川沙航线/川沙试运行15.kmz",
            "/line/川沙机场/川沙航线/川沙试运行16.kmz",
            "/line/川沙机场/川沙航线/川沙试运行17.kmz",
            "/line/川沙机场/川沙航线/川沙象屿鼎城其.kmz",
            "/line/川沙机场/川沙航线/川沙贝越水岸名邸其.kmz",
            "/line/川沙机场/川沙航线/川沙运河小区其.kmz",
            "/line/川沙机场/川沙航线/川沙违法用地01.kmz",
            "/line/川沙机场/川沙航线/川沙通城欧洲苑其.kmz",
            "/line/川沙机场/川沙航线/川沙金唐公寓.kmz",
            "/line/川沙机场/川沙航线/川沙金磊苑其.kmz",
            "/line/川沙机场/川沙航线/川沙银光苑其.kmz",
            "/line/川沙机场/川沙航线/川沙锦川佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙阳光城·愉景湾.kmz",
            "/line/川沙机场/川沙航线/川沙陆家嘴锦绣观澜.kmz",
            "/line/川沙机场/川沙航线/川沙非上浦小区.kmz",
            "/line/川沙机场/川沙航线/川沙非上海1988villa.kmz",
            "/line/川沙机场/川沙航线/川沙非东唐苑.kmz",
            "/line/川沙机场/川沙航线/川沙非东锦苑.kmz",
            "/line/川沙机场/川沙航线/川沙非临园小区.kmz",
            "/line/川沙机场/川沙航线/川沙非华川家园.kmz",
            "/line/川沙机场/川沙航线/川沙非华港花园.kmz",
            "/line/川沙机场/川沙航线/川沙非华盛名门.kmz",
            "/line/川沙机场/川沙航线/川沙非合欢公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非园二小区.kmz",
            "/line/川沙机场/川沙航线/川沙非城南小区.kmz",
            "/line/川沙机场/川沙航线/川沙非城西小区.kmz",
            "/line/川沙机场/川沙航线/川沙非妙城公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非妙境路715弄小区.kmz",
            "/line/川沙机场/川沙航线/川沙非孙浦路199号.kmz",
            "/line/川沙机场/川沙航线/川沙非川图路300号.kmz",
            "/line/川沙机场/川沙航线/川沙非川沙路4840号.kmz",
            "/line/川沙机场/川沙航线/川沙非御珑宫廷.kmz",
            "/line/川沙机场/川沙航线/川沙非德川新苑.kmz",
            "/line/川沙机场/川沙航线/川沙非恒乐苑.kmz",
            "/line/川沙机场/川沙航线/川沙非捷雄花苑.kmz",
            "/line/川沙机场/川沙航线/川沙非新川苑.kmz",
            "/line/川沙机场/川沙航线/川沙非新德三村.kmz",
            "/line/川沙机场/川沙航线/川沙非新德佳苑.kmz",
            "/line/川沙机场/川沙航线/川沙非新德四村.kmz",
            "/line/川沙机场/川沙航线/川沙非新德路365弄小区.kmz",
            "/line/川沙机场/川沙航线/川沙非晨光公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非曙光北苑.kmz",
            "/line/川沙机场/川沙航线/川沙非曙光南桥小区.kmz",
            "/line/川沙机场/川沙航线/川沙非曙航苑.kmz",
            "/line/川沙机场/川沙航线/川沙非月亮湾园.kmz",
            "/line/川沙机场/川沙航线/川沙非桃园小区.kmz",
            "/line/川沙机场/川沙航线/川沙非永达公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非沙田公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非泰星公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非瀚龙苑.kmz",
            "/line/川沙机场/川沙航线/川沙非界龙花苑.kmz",
            "/line/川沙机场/川沙航线/川沙非界龙阳光苑西区.kmz",
            "/line/川沙机场/川沙航线/川沙非绿波城.kmz",
            "/line/川沙机场/川沙航线/川沙非翔川家园.kmz",
            "/line/川沙机场/川沙航线/川沙非舒馨北苑.kmz",
            "/line/川沙机场/川沙航线/川沙非舜川公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非见龙苑.kmz",
            "/line/川沙机场/川沙航线/川沙非金利公寓.kmz",
            "/line/川沙机场/川沙航线/川沙非青厦小区.kmz",
            "/line/川沙机场/川沙航线/川沙非鸿基公寓.kmz",
            "/line/川沙机场/川沙航线/川沙顺馨佳园其.kmz",
            "/line/川沙机场/川沙航线/川沙鹤兴苑其.kmz",
            "/line/川沙机场/川沙航线/川沙黄楼新世纪花苑其.kmz",
            "/line/川沙机场/川沙航线/川沙黄楼花苑其.kmz",
            "/line/川沙机场/川沙航线/川沙鼎名流苑其.kmz",
            "/line/川沙机场/川沙航线/川沙齐友佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙齐爱佳苑其.kmz",
            "/line/川沙机场/川沙航线/川沙（C06-01）02013.kmz",
            "/line/川沙机场/川沙航线/川沙（人民医院）01012.kmz",
            "/line/川沙机场/川沙航线/川沙（城东社区D06B）03014.kmz",
            "/line/川沙机场/川沙航线/川沙（城东社区PDP0）06018.kmz",
            "/line/川沙机场/川沙航线/川沙（川沙体育场）04016.kmz",
            "/line/川沙机场/川沙航线/川沙（新市镇d0c）07019.kmz",
            "/line/川沙机场/川沙航线/川沙（高级中学）05017.kmz",
            "/line/川沙机场/川沙航线/张江总部园头部企业及上市公司总部区（B6-02）项目001.kmz",
            "/line/川沙机场/川沙航线/明察暗访合庆专业合作社项目.kmz",
            "/line/川沙机场/川沙航线/明星花苑.kmz",
            "/line/川沙机场/川沙航线/杨家宅.kmz",
            "/line/川沙机场/川沙航线/梅园.kmz",
            "/line/川沙机场/川沙航线/欧泊圣堡.kmz",
            "/line/川沙机场/川沙航线/欧泊圣堡2.kmz",
            "/line/川沙机场/川沙航线/欧泊圣堡3.kmz",
            "/line/川沙机场/川沙航线/浦东运河.kmz",
            "/line/川沙机场/川沙航线/环东七村1.kmz",
            "/line/川沙机场/川沙航线/环东七村2.kmz",
            "/line/川沙机场/川沙航线/环东七村3.kmz",
            "/line/川沙机场/川沙航线/环东七村4.kmz",
            "/line/川沙机场/川沙航线/环东七村5.kmz",
            "/line/川沙机场/川沙航线/环东七村6.kmz",
            "/line/川沙机场/川沙航线/环东七村7.kmz",
            "/line/川沙机场/川沙航线/环东二村.kmz",
            "/line/川沙机场/川沙航线/环东六村1.kmz",
            "/line/川沙机场/川沙航线/环东六村2.kmz",
            "/line/川沙机场/川沙航线/环东六村3.kmz",
            "/line/川沙机场/川沙航线/环东别墅.kmz",
            "/line/川沙机场/川沙航线/督察违法项目合庆农产物流项目.kmz",
            "/line/川沙机场/川沙航线/督察违法项目合庆艺场项目.kmz",
            "/line/川沙机场/川沙航线/营房村.kmz",
            "/line/川沙机场/川沙航线/试1000207795.kmz",
            "/line/川沙机场/川沙航线/试1000219721.kmz",
            "/line/川沙机场/川沙航线/试1000220170.kmz",
            "/line/川沙机场/川沙航线/试1000228467.kmz",
            "/line/川沙机场/川沙航线/金宇别墅.kmz"
          ];
          break;
        case 5:
          // modulesFiles = import.meta.glob("/line/大团机场/大团航线/*.kmz");
          modules = [
            "/line/大团机场/大团航线/006389.kmz",
            "/line/大团机场/大团航线/07813.kmz",
            "/line/大团机场/大团航线/08284.kmz",
            "/line/大团机场/大团航线/09062.kmz",
            "/line/大团机场/大团航线/10区域大团.kmz",
            "/line/大团机场/大团航线/110886.kmz",
            "/line/大团机场/大团航线/11区域大团.kmz",
            "/line/大团机场/大团航线/12549.kmz",
            "/line/大团机场/大团航线/12681.kmz",
            "/line/大团机场/大团航线/12763.kmz",
            "/line/大团机场/大团航线/12801.kmz",
            "/line/大团机场/大团航线/12区域大团.kmz",
            "/line/大团机场/大团航线/13563.kmz",
            "/line/大团机场/大团航线/13区域大团.kmz",
            "/line/大团机场/大团航线/14区域大团.kmz",
            "/line/大团机场/大团航线/15区域大团.kmz",
            "/line/大团机场/大团航线/16区域大团.kmz",
            "/line/大团机场/大团航线/17区域大团.kmz",
            "/line/大团机场/大团航线/18244.kmz",
            "/line/大团机场/大团航线/18区域大团.kmz",
            "/line/大团机场/大团航线/19区域大团.kmz",
            "/line/大团机场/大团航线/1区域大团.kmz",
            "/line/大团机场/大团航线/200mm演示.kmz",
            "/line/大团机场/大团航线/20区域大团.kmz",
            "/line/大团机场/大团航线/21区域大团.kmz",
            "/line/大团机场/大团航线/22区域大团.kmz",
            "/line/大团机场/大团航线/23区域大团.kmz",
            "/line/大团机场/大团航线/24区域大团.kmz",
            "/line/大团机场/大团航线/25区域大团.kmz",
            "/line/大团机场/大团航线/26区域大团.kmz",
            "/line/大团机场/大团航线/27区域大团.kmz",
            "/line/大团机场/大团航线/28区域大团.kmz",
            "/line/大团机场/大团航线/29区域大团.kmz",
            "/line/大团机场/大团航线/2区域大团.kmz",
            "/line/大团机场/大团航线/300m演示.kmz",
            "/line/大团机场/大团航线/30区域大团.kmz",
            "/line/大团机场/大团航线/32区域大团.kmz",
            "/line/大团机场/大团航线/33区域大团.kmz",
            "/line/大团机场/大团航线/34区域大团.kmz",
            "/line/大团机场/大团航线/35区域大团.kmz",
            "/line/大团机场/大团航线/36区域大团.kmz",
            "/line/大团机场/大团航线/37区域大团.kmz",
            "/line/大团机场/大团航线/38区域大团.kmz",
            "/line/大团机场/大团航线/39区域大团.kmz",
            "/line/大团机场/大团航线/3区域大团.kmz",
            "/line/大团机场/大团航线/40m航道.kmz",
            "/line/大团机场/大团航线/40区域大团.kmz",
            "/line/大团机场/大团航线/41区域大团.kmz",
            "/line/大团机场/大团航线/42区域大团.kmz",
            "/line/大团机场/大团航线/43区域大团.kmz",
            "/line/大团机场/大团航线/49044.kmz",
            "/line/大团机场/大团航线/4区域大团.kmz",
            "/line/大团机场/大团航线/51594.kmz",
            "/line/大团机场/大团航线/5区域大团.kmz",
            "/line/大团机场/大团航线/60550.kmz",
            "/line/大团机场/大团航线/63965.kmz",
            "/line/大团机场/大团航线/64469.kmz",
            "/line/大团机场/大团航线/68133.kmz",
            "/line/大团机场/大团航线/69284.kmz",
            "/line/大团机场/大团航线/6区域大团.kmz",
            "/line/大团机场/大团航线/7区域大团.kmz",
            "/line/大团机场/大团航线/86426.kmz",
            "/line/大团机场/大团航线/8区域大团.kmz",
            "/line/大团机场/大团航线/92313.kmz",
            "/line/大团机场/大团航线/9区域大团.kmz",
            "/line/大团机场/大团航线/二期大团01.kmz",
            "/line/大团机场/大团航线/二期大团02.kmz",
            "/line/大团机场/大团航线/二期大团03.kmz",
            "/line/大团机场/大团航线/二期大团110115.kmz",
            "/line/大团机场/大团航线/二期大团17798.kmz",
            "/line/大团机场/大团航线/二期大团17806.kmz",
            "/line/大团机场/大团航线/二期大团1号线.kmz",
            "/line/大团机场/大团航线/二期大团2号线.kmz",
            "/line/大团机场/大团航线/二期大团3号线.kmz",
            "/line/大团机场/大团航线/二期大团419410.kmz",
            "/line/大团机场/大团航线/二期大团419529.kmz",
            "/line/大团机场/大团航线/二期大团422543.kmz",
            "/line/大团机场/大团航线/二期大团4号线.kmz",
            "/line/大团机场/大团航线/二期大团5号线.kmz",
            "/line/大团机场/大团航线/二期大团6号线.kmz",
            "/line/大团机场/大团航线/二期大团70562.kmz",
            "/line/大团机场/大团航线/二期大团70580.kmz",
            "/line/大团机场/大团航线/二期大团7号线.kmz",
            "/line/大团机场/大团航线/二期大团8号线.kmz",
            "/line/大团机场/大团航线/南田公寓.kmz",
            "/line/大团机场/大团航线/大团 13区域.kmz",
            "/line/大团机场/大团航线/大团001.kmz",
            "/line/大团机场/大团航线/大团002.kmz",
            "/line/大团机场/大团航线/大团003.kmz",
            "/line/大团机场/大团航线/大团004.kmz",
            "/line/大团机场/大团航线/大团005.kmz",
            "/line/大团机场/大团航线/大团006.kmz",
            "/line/大团机场/大团航线/大团007.kmz",
            "/line/大团机场/大团航线/大团008.kmz",
            "/line/大团机场/大团航线/大团009.kmz",
            "/line/大团机场/大团航线/大团01.kmz",
            "/line/大团机场/大团航线/大团010.kmz",
            "/line/大团机场/大团航线/大团011.kmz",
            "/line/大团机场/大团航线/大团012.kmz",
            "/line/大团机场/大团航线/大团013.kmz",
            "/line/大团机场/大团航线/大团014.kmz",
            "/line/大团机场/大团航线/大团02.kmz",
            "/line/大团机场/大团航线/大团03.kmz",
            "/line/大团机场/大团航线/大团04.kmz",
            "/line/大团机场/大团航线/大团05.kmz",
            "/line/大团机场/大团航线/大团06.kmz",
            "/line/大团机场/大团航线/大团07.kmz",
            "/line/大团机场/大团航线/大团08.kmz",
            "/line/大团机场/大团航线/大团09.kmz",
            "/line/大团机场/大团航线/大团10.kmz",
            "/line/大团机场/大团航线/大团10区域.kmz",
            "/line/大团机场/大团航线/大团11.kmz",
            "/line/大团机场/大团航线/大团11区域.kmz",
            "/line/大团机场/大团航线/大团12.kmz",
            "/line/大团机场/大团航线/大团12区域.kmz",
            "/line/大团机场/大团航线/大团13.kmz",
            "/line/大团机场/大团航线/大团14.kmz",
            "/line/大团机场/大团航线/大团14区域.kmz",
            "/line/大团机场/大团航线/大团15.kmz",
            "/line/大团机场/大团航线/大团15区域.kmz",
            "/line/大团机场/大团航线/大团16.kmz",
            "/line/大团机场/大团航线/大团16区域.kmz",
            "/line/大团机场/大团航线/大团17.kmz",
            "/line/大团机场/大团航线/大团18.kmz",
            "/line/大团机场/大团航线/大团18区域.kmz",
            "/line/大团机场/大团航线/大团19.kmz",
            "/line/大团机场/大团航线/大团19区域.kmz",
            "/line/大团机场/大团航线/大团1区域.kmz",
            "/line/大团机场/大团航线/大团20.kmz",
            "/line/大团机场/大团航线/大团20区域.kmz",
            "/line/大团机场/大团航线/大团21.kmz",
            "/line/大团机场/大团航线/大团21区域.kmz",
            "/line/大团机场/大团航线/大团22.kmz",
            "/line/大团机场/大团航线/大团22区域.kmz",
            "/line/大团机场/大团航线/大团23.kmz",
            "/line/大团机场/大团航线/大团23区域.kmz",
            "/line/大团机场/大团航线/大团24.kmz",
            "/line/大团机场/大团航线/大团25.kmz",
            "/line/大团机场/大团航线/大团26.kmz",
            "/line/大团机场/大团航线/大团27.kmz",
            "/line/大团机场/大团航线/大团28.kmz",
            "/line/大团机场/大团航线/大团29.kmz",
            "/line/大团机场/大团航线/大团2区域.kmz",
            "/line/大团机场/大团航线/大团30.kmz",
            "/line/大团机场/大团航线/大团31.kmz",
            "/line/大团机场/大团航线/大团3区域.kmz",
            "/line/大团机场/大团航线/大团49559.kmz",
            "/line/大团机场/大团航线/大团4区域.kmz",
            "/line/大团机场/大团航线/大团5区域.kmz",
            "/line/大团机场/大团航线/大团6区域.kmz",
            "/line/大团机场/大团航线/大团7区域.kmz",
            "/line/大团机场/大团航线/大团8区域.kmz",
            "/line/大团机场/大团航线/大团9区域.kmz",
            "/line/大团机场/大团航线/大团三团港.kmz",
            "/line/大团机场/大团航线/大团上河商务园.kmz",
            "/line/大团机场/大团航线/大团丹桂佳苑.kmz",
            "/line/大团机场/大团航线/大团九九别墅.kmz",
            "/line/大团机场/大团航线/大团二灶港.kmz",
            "/line/大团机场/大团航线/大团华盛新村.kmz",
            "/line/大团机场/大团航线/大团南园坊.kmz",
            "/line/大团机场/大团航线/大团南湾新村.kmz",
            "/line/大团机场/大团航线/大团南瑞别墅.kmz",
            "/line/大团机场/大团航线/大团吉园坊.kmz",
            "/line/大团机场/大团航线/大团听潮五村.kmz",
            "/line/大团机场/大团航线/大团听潮六村.kmz",
            "/line/大团机场/大团航线/大团听潮四村.kmz",
            "/line/大团机场/大团航线/大团听潮豪园.kmz",
            "/line/大团机场/大团航线/大团城南小区.kmz",
            "/line/大团机场/大团航线/大团城南小区2.kmz",
            "/line/大团机场/大团航线/大团大杨小区.kmz",
            "/line/大团机场/大团航线/大团大治河东.kmz",
            "/line/大团机场/大团航线/大团大治河西.kmz",
            "/line/大团机场/大团航线/大团宝业万华城.kmz",
            "/line/大团机场/大团航线/大团富成别墅.kmz",
            "/line/大团机场/大团航线/大团彩虹园.kmz",
            "/line/大团机场/大团航线/大团惠南一方新城.kmz",
            "/line/大团机场/大团航线/大团成功家园别墅.kmz",
            "/line/大团机场/大团航线/大团振东苑.kmz",
            "/line/大团机场/大团航线/大团新线1.kmz",
            "/line/大团机场/大团航线/大团新线10.kmz",
            "/line/大团机场/大团航线/大团新线11.kmz",
            "/line/大团机场/大团航线/大团新线12.kmz",
            "/line/大团机场/大团航线/大团新线13.kmz",
            "/line/大团机场/大团航线/大团新线14.kmz",
            "/line/大团机场/大团航线/大团新线15.kmz",
            "/line/大团机场/大团航线/大团新线16.kmz",
            "/line/大团机场/大团航线/大团新线17.kmz",
            "/line/大团机场/大团航线/大团新线18.kmz",
            "/line/大团机场/大团航线/大团新线19.kmz",
            "/line/大团机场/大团航线/大团新线2.kmz",
            "/line/大团机场/大团航线/大团新线20.kmz",
            "/line/大团机场/大团航线/大团新线21.kmz",
            "/line/大团机场/大团航线/大团新线22.kmz",
            "/line/大团机场/大团航线/大团新线23.kmz",
            "/line/大团机场/大团航线/大团新线24.kmz",
            "/line/大团机场/大团航线/大团新线3.kmz",
            "/line/大团机场/大团航线/大团新线4.kmz",
            "/line/大团机场/大团航线/大团新线5.kmz",
            "/line/大团机场/大团航线/大团新线6.kmz",
            "/line/大团机场/大团航线/大团新线7.kmz",
            "/line/大团机场/大团航线/大团新线8.kmz",
            "/line/大团机场/大团航线/大团新线9.kmz",
            "/line/大团机场/大团航线/大团方新天地.kmz",
            "/line/大团机场/大团航线/大团机场测试航线.kmz",
            "/line/大团机场/大团航线/大团枫丹白露别墅.kmz",
            "/line/大团机场/大团航线/大团水岸家园.kmz",
            "/line/大团机场/大团航线/大团汇城小区.kmz",
            "/line/大团机场/大团航线/大团汇金星城.kmz",
            "/line/大团机场/大团航线/大团江南清漪园.kmz",
            "/line/大团机场/大团航线/大团泰燕华庭.kmz",
            "/line/大团机场/大团航线/大团测试航线0129.kmz",
            "/line/大团机场/大团航线/大团浦东运河南团芦港.kmz",
            "/line/大团机场/大团航线/大团爱家新城北区.kmz",
            "/line/大团机场/大团航线/大团爱家花园.kmz",
            "/line/大团机场/大团航线/大团申云小区.kmz",
            "/line/大团机场/大团航线/大团碧盈苑别墅.kmz",
            "/line/大团机场/大团航线/大团线1.kmz",
            "/line/大团机场/大团航线/大团线2.kmz",
            "/line/大团机场/大团航线/大团绿地布鲁斯小镇1期南区.kmz",
            "/line/大团机场/大团航线/大团绿地布鲁斯小镇2期.kmz",
            "/line/大团机场/大团航线/大团西门锦绣苑东苑.kmz",
            "/line/大团机场/大团航线/大团试运行1号线.kmz",
            "/line/大团机场/大团航线/大团试运行2号线.kmz",
            "/line/大团机场/大团航线/大团试运行3号线.kmz",
            "/line/大团机场/大团航线/大团试运行4号线.kmz",
            "/line/大团机场/大团航线/大团试运行54334.kmz",
            "/line/大团机场/大团航线/大团试运行55314.kmz",
            "/line/大团机场/大团航线/大团试运行59125.kmz",
            "/line/大团机场/大团航线/大团试运行5号线.kmz",
            "/line/大团机场/大团航线/大团试运行61092.kmz",
            "/line/大团机场/大团航线/大团试运行63673.kmz",
            "/line/大团机场/大团航线/大团试运行6号线.kmz",
            "/line/大团机场/大团航线/大团试运行70426.kmz",
            "/line/大团机场/大团航线/大团试运行71879.kmz",
            "/line/大团机场/大团航线/大团试运行79033.kmz",
            "/line/大团机场/大团航线/大团试运行79786.kmz",
            "/line/大团机场/大团航线/大团试运行80362.kmz",
            "/line/大团机场/大团航线/大团试运行84568.kmz",
            "/line/大团机场/大团航线/大团试运行87856.kmz",
            "/line/大团机场/大团航线/大团试运行90243.kmz",
            "/line/大团机场/大团航线/大团金团花苑.kmz",
            "/line/大团机场/大团航线/大团金玉佳苑.kmz",
            "/line/大团机场/大团航线/大团鑫通公寓.kmz",
            "/line/大团机场/大团航线/大团锦苑坊.kmz",
            "/line/大团机场/大团航线/大团非上河商务园.kmz",
            "/line/大团机场/大团航线/大团非富成公寓.kmz",
            "/line/大团机场/大团航线/大团非桃源花苑.kmz",
            "/line/大团机场/大团航线/大团非欣菊苑.kmz",
            "/line/大团机场/大团航线/大团非西门锦绣苑西苑.kmz",
            "/line/大团机场/大团航线/大团鸿园坊.kmz",
            "/line/大团机场/大团航线/大团（中部社区）01006.kmz",
            "/line/大团机场/大团航线/大治河巡检1.kmz",
            "/line/大团机场/大团航线/大治河巡检2.kmz",
            "/line/大团机场/大团航线/宣桥垃圾站.kmz",
            "/line/大团机场/大团航线/宣桥水上服务区.kmz",
            "/line/大团机场/大团航线/工业区.kmz",
            "/line/大团机场/大团航线/新大团（中部社区）01006.kmz",
            "/line/大团机场/大团航线/新建建图航拍2.kmz",
            "/line/大团机场/大团航线/新建航线.kmz",
            "/line/大团机场/大团航线/新建航线1.kmz",
            "/line/大团机场/大团航线/新建航线2.kmz",
            "/line/大团机场/大团航线/新建航线3.kmz",
            "/line/大团机场/大团航线/浦东新区大团镇中部社区pds5-0.kmz"
          ];
          break;
        case 6:
          // modulesFiles = import.meta.glob("/line/六灶机场/六灶/*.kmz");
          modules = [
            "/line/六灶机场/六灶/10区域六灶.kmz",
            "/line/六灶机场/六灶/11区域六灶.kmz",
            "/line/六灶机场/六灶/12区域六灶.kmz",
            "/line/六灶机场/六灶/13区域六灶.kmz",
            "/line/六灶机场/六灶/14区域六灶.kmz",
            "/line/六灶机场/六灶/15区域六灶.kmz",
            "/line/六灶机场/六灶/16区域六灶.kmz",
            "/line/六灶机场/六灶/17区域六灶.kmz",
            "/line/六灶机场/六灶/18区域六灶.kmz",
            "/line/六灶机场/六灶/19区域六灶.kmz",
            "/line/六灶机场/六灶/1区域六灶.kmz",
            "/line/六灶机场/六灶/200m.kmz",
            "/line/六灶机场/六灶/20区域六灶.kmz",
            "/line/六灶机场/六灶/21区域六灶.kmz",
            "/line/六灶机场/六灶/22区域六灶.kmz",
            "/line/六灶机场/六灶/23区域六灶.kmz",
            "/line/六灶机场/六灶/24区域六灶.kmz",
            "/line/六灶机场/六灶/25区域六灶.kmz",
            "/line/六灶机场/六灶/27区域六灶.kmz",
            "/line/六灶机场/六灶/28区域六灶.kmz",
            "/line/六灶机场/六灶/29区域六灶.kmz",
            "/line/六灶机场/六灶/2区域六灶.kmz",
            "/line/六灶机场/六灶/31区域六灶.kmz",
            "/line/六灶机场/六灶/32区域六灶.kmz",
            "/line/六灶机场/六灶/33区域六灶.kmz",
            "/line/六灶机场/六灶/3区域六灶.kmz",
            "/line/六灶机场/六灶/4区域六灶.kmz",
            "/line/六灶机场/六灶/5区域六灶.kmz",
            "/line/六灶机场/六灶/6区域六灶.kmz",
            "/line/六灶机场/六灶/7区域六灶.kmz",
            "/line/六灶机场/六灶/8区域六灶.kmz",
            "/line/六灶机场/六灶/9区域六灶.kmz",
            "/line/六灶机场/六灶/s32渣土车.kmz",
            "/line/六灶机场/六灶/s32渣土车02.kmz",
            "/line/六灶机场/六灶/六灶001.kmz",
            "/line/六灶机场/六灶/六灶002.kmz",
            "/line/六灶机场/六灶/六灶003.kmz",
            "/line/六灶机场/六灶/六灶004.kmz",
            "/line/六灶机场/六灶/六灶005.kmz",
            "/line/六灶机场/六灶/六灶006.kmz",
            "/line/六灶机场/六灶/六灶007.kmz",
            "/line/六灶机场/六灶/六灶008.kmz",
            "/line/六灶机场/六灶/六灶009.kmz",
            "/line/六灶机场/六灶/六灶01.kmz",
            "/line/六灶机场/六灶/六灶010.kmz",
            "/line/六灶机场/六灶/六灶02.kmz",
            "/line/六灶机场/六灶/六灶03.kmz",
            "/line/六灶机场/六灶/六灶04.kmz",
            "/line/六灶机场/六灶/六灶05.kmz",
            "/line/六灶机场/六灶/六灶06.kmz",
            "/line/六灶机场/六灶/六灶07.kmz",
            "/line/六灶机场/六灶/六灶08.kmz",
            "/line/六灶机场/六灶/六灶09.kmz",
            "/line/六灶机场/六灶/六灶10.kmz",
            "/line/六灶机场/六灶/六灶10区域.kmz",
            "/line/六灶机场/六灶/六灶11.kmz",
            "/line/六灶机场/六灶/六灶11区域.kmz",
            "/line/六灶机场/六灶/六灶12.kmz",
            "/line/六灶机场/六灶/六灶12区域.kmz",
            "/line/六灶机场/六灶/六灶13.kmz",
            "/line/六灶机场/六灶/六灶13区域.kmz",
            "/line/六灶机场/六灶/六灶14.kmz",
            "/line/六灶机场/六灶/六灶14区域.kmz",
            "/line/六灶机场/六灶/六灶15.kmz",
            "/line/六灶机场/六灶/六灶15区域.kmz",
            "/line/六灶机场/六灶/六灶16.kmz",
            "/line/六灶机场/六灶/六灶16区域.kmz",
            "/line/六灶机场/六灶/六灶17.kmz",
            "/line/六灶机场/六灶/六灶17区域.kmz",
            "/line/六灶机场/六灶/六灶18.kmz",
            "/line/六灶机场/六灶/六灶18区域.kmz",
            "/line/六灶机场/六灶/六灶19.kmz",
            "/line/六灶机场/六灶/六灶19区域.kmz",
            "/line/六灶机场/六灶/六灶20.kmz",
            "/line/六灶机场/六灶/六灶21.kmz",
            "/line/六灶机场/六灶/六灶22.kmz",
            "/line/六灶机场/六灶/六灶23.kmz",
            "/line/六灶机场/六灶/六灶24.kmz",
            "/line/六灶机场/六灶/六灶25.kmz",
            "/line/六灶机场/六灶/六灶26.kmz",
            "/line/六灶机场/六灶/六灶27.kmz",
            "/line/六灶机场/六灶/六灶28.kmz",
            "/line/六灶机场/六灶/六灶29.kmz",
            "/line/六灶机场/六灶/六灶2区域.kmz",
            "/line/六灶机场/六灶/六灶30.kmz",
            "/line/六灶机场/六灶/六灶31.kmz",
            "/line/六灶机场/六灶/六灶32.kmz",
            "/line/六灶机场/六灶/六灶33.kmz",
            "/line/六灶机场/六灶/六灶34.kmz",
            "/line/六灶机场/六灶/六灶35.kmz",
            "/line/六灶机场/六灶/六灶36.kmz",
            "/line/六灶机场/六灶/六灶37.kmz",
            "/line/六灶机场/六灶/六灶38.kmz",
            "/line/六灶机场/六灶/六灶39.kmz",
            "/line/六灶机场/六灶/六灶3区域.kmz",
            "/line/六灶机场/六灶/六灶40.kmz",
            "/line/六灶机场/六灶/六灶41.kmz",
            "/line/六灶机场/六灶/六灶4区域.kmz",
            "/line/六灶机场/六灶/六灶5区域.kmz",
            "/line/六灶机场/六灶/六灶7区域.kmz",
            "/line/六灶机场/六灶/六灶9区域.kmz",
            "/line/六灶机场/六灶/六灶上海蓝堡别墅.kmz",
            "/line/六灶机场/六灶/六灶保利云上拾光.kmz",
            "/line/六灶机场/六灶/六灶六灶港.kmz",
            "/line/六灶机场/六灶/六灶工地01.kmz",
            "/line/六灶机场/六灶/六灶工地1.kmz",
            "/line/六灶机场/六灶/六灶工地2.kmz",
            "/line/六灶机场/六灶/六灶工地3.kmz",
            "/line/六灶机场/六灶/六灶工地4.kmz",
            "/line/六灶机场/六灶/六灶工地5.kmz",
            "/line/六灶机场/六灶/六灶工地6.kmz",
            "/line/六灶机场/六灶/六灶工地7.kmz",
            "/line/六灶机场/六灶/六灶工地8.kmz",
            "/line/六灶机场/六灶/六灶建德南郊别墅.kmz",
            "/line/六灶机场/六灶/六灶民乐城丽园南园.kmz",
            "/line/六灶机场/六灶/六灶民乐城惠园.kmz",
            "/line/六灶机场/六灶/六灶民乐城惠园东苑.kmz",
            "/line/六灶机场/六灶/六灶民乐城惠康苑北苑.kmz",
            "/line/六灶机场/六灶/六灶民乐城惠康苑西苑.kmz",
            "/line/六灶机场/六灶/六灶汇领商墅.kmz",
            "/line/六灶机场/六灶/六灶爱家华城东区.kmz",
            "/line/六灶机场/六灶/六灶爱家华城西区.kmz",
            "/line/六灶机场/六灶/六灶红皮车1.kmz",
            "/line/六灶机场/六灶/六灶绿都绣云里.kmz",
            "/line/六灶机场/六灶/六灶艺泰安邦花园.kmz",
            "/line/六灶机场/六灶/六灶莱茵别墅.kmz",
            "/line/六灶机场/六灶/六灶非民乐城丽苑北园.kmz",
            "/line/六灶机场/六灶/六灶非民乐城兰丽苑西苑.kmz",
            "/line/六灶机场/六灶/六灶非民乐城惠益绿苑.kmz",
            "/line/六灶机场/六灶/六灶非民乐城惠益绿苑东苑.kmz",
            "/line/六灶机场/六灶/六灶非民乐城惠益绿苑西苑.kmz",
            "/line/六灶机场/六灶/六灶鹿和雅苑.kmz",
            "/line/六灶机场/六灶/六灶鹿康雅苑.kmz",
            "/line/六灶机场/六灶/惠南机场航线测试.kmz",
            "/line/六灶机场/六灶/惠南测试航线0129.kmz",
            "/line/六灶机场/六灶/惠南（东南社区04）02010.kmz",
            "/line/六灶机场/六灶/惠南（东南社区16）03011.kmz",
            "/line/六灶机场/六灶/惠南（岱美汽车）01009.kmz",
            "/line/六灶机场/六灶/拱极东路盐大路土方车停车场.kmz",
            "/line/六灶机场/六灶/新建航线(1).kmz",
            "/line/六灶机场/六灶/新建航线.kmz"
          ];
          break;
        case 7:
          // modulesFiles = import.meta.glob("/line/金桥机场/金桥航线/*.kmz");
          modules = [
            "/line/金桥机场/金桥航线/1000250946.kmz",
            "/line/金桥机场/金桥航线/1000258136.kmz",
            "/line/金桥机场/金桥航线/1000260442.kmz",
            "/line/金桥机场/金桥航线/1000261698.kmz",
            "/line/金桥机场/金桥航线/1000264197.kmz",
            "/line/金桥机场/金桥航线/1000264558.kmz",
            "/line/金桥机场/金桥航线/115004077.kmz",
            "/line/金桥机场/金桥航线/115019818.kmz",
            "/line/金桥机场/金桥航线/115019905 (1).kmz",
            "/line/金桥机场/金桥航线/115019905.kmz",
            "/line/金桥机场/金桥航线/115019934.kmz",
            "/line/金桥机场/金桥航线/115020048.kmz",
            "/line/金桥机场/金桥航线/115020069.kmz",
            "/line/金桥机场/金桥航线/115020277.kmz",
            "/line/金桥机场/金桥航线/115020826.kmz",
            "/line/金桥机场/金桥航线/14810102Y014713.kmz",
            "/line/金桥机场/金桥航线/14811103Y008739.kmz",
            "/line/金桥机场/金桥航线/2070666.kmz",
            "/line/金桥机场/金桥航线/2070667.kmz",
            "/line/金桥机场/金桥航线/2070668.kmz",
            "/line/金桥机场/金桥航线/2070711.kmz",
            "/line/金桥机场/金桥航线/2070715.kmz",
            "/line/金桥机场/金桥航线/2070721.kmz",
            "/line/金桥机场/金桥航线/2930-02地块改扩建项目.kmz",
            "/line/金桥机场/金桥航线/5130200-1.kmz",
            "/line/金桥机场/金桥航线/上海市浦东新区张家浜楔形绿地.kmz",
            "/line/金桥机场/金桥航线/上海市轨道交通21号线一期工程凌河路站站本体.kmz",
            "/line/金桥机场/金桥航线/上海市轨道交通21号线一期工程土建10标东靖路站.kmz",
            "/line/金桥机场/金桥航线/上海轨道交通崇明线一期工程申江路站站本体.kmz",
            "/line/金桥机场/金桥航线/上海轨道交通崇明线一期工程申江路站（站本体）.kmz",
            "/line/金桥机场/金桥航线/上海金鼎20-01地块办公和商业新建项目（除桩基工程）.kmz",
            "/line/金桥机场/金桥航线/东沟配套商品房A-4地块征收安置房项目001.kmz",
            "/line/金桥机场/金桥航线/东源丽晶别墅1.kmz",
            "/line/金桥机场/金桥航线/东源丽晶别墅2.kmz",
            "/line/金桥机场/金桥航线/东源丽晶别墅3.kmz",
            "/line/金桥机场/金桥航线/五莲路.kmz",
            "/line/金桥机场/金桥航线/凌河路.kmz",
            "/line/金桥机场/金桥航线/创联金海花苑.kmz",
            "/line/金桥机场/金桥航线/利津路.kmz",
            "/line/金桥机场/金桥航线/大气检测足球场.kmz",
            "/line/金桥机场/金桥航线/巨峰路.kmz",
            "/line/金桥机场/金桥航线/张家浜楔形绿地E1d-01地块住宅项目.kmz",
            "/line/金桥机场/金桥航线/张家浜楔形绿地华漕达金家宅河-唐陆公路河道整治工程.kmz",
            "/line/金桥机场/金桥航线/张家浜楔形绿地工程（三期）1标段-02.kmz",
            "/line/金桥机场/金桥航线/曹路中心镇区D1B-6地块商办项目001.kmz",
            "/line/金桥机场/金桥航线/正射测试.kmz",
            "/line/金桥机场/金桥航线/沿江通道浦东段越江段五洲大道工程高速公路主线施工6标.kmz",
            "/line/金桥机场/金桥航线/浦东新区浦兴社区Y000901单元02-01A地块项目001.kmz",
            "/line/金桥机场/金桥航线/碧云别墅北区.kmz",
            "/line/金桥机场/金桥航线/胶东路.kmz",
            "/line/金桥机场/金桥航线/荷泽路.kmz",
            "/line/金桥机场/金桥航线/蓝山小城1.kmz",
            "/line/金桥机场/金桥航线/蓝山小城2.kmz",
            "/line/金桥机场/金桥航线/蓝山小城3.kmz",
            "/line/金桥机场/金桥航线/蓝山小城4.kmz",
            "/line/金桥机场/金桥航线/金台路.kmz",
            "/line/金桥机场/金桥航线/金台路特写航线.kmz",
            "/line/金桥机场/金桥航线/金桥01.kmz",
            "/line/金桥机场/金桥航线/金桥01二期.kmz",
            "/line/金桥机场/金桥航线/金桥02.kmz",
            "/line/金桥机场/金桥航线/金桥02二期.kmz",
            "/line/金桥机场/金桥航线/金桥03 (1).kmz",
            "/line/金桥机场/金桥航线/金桥03.kmz",
            "/line/金桥机场/金桥航线/金桥03二期.kmz",
            "/line/金桥机场/金桥航线/金桥04.kmz",
            "/line/金桥机场/金桥航线/金桥05.kmz",
            "/line/金桥机场/金桥航线/金桥06.kmz",
            "/line/金桥机场/金桥航线/金桥07.kmz",
            "/line/金桥机场/金桥航线/金桥08.kmz",
            "/line/金桥机场/金桥航线/金桥09.kmz",
            "/line/金桥机场/金桥航线/金桥一方雅苑其.kmz",
            "/line/金桥机场/金桥航线/金桥七街坊枣庄路998弄其.kmz",
            "/line/金桥机场/金桥航线/金桥七街坊金口路411弄其.kmz",
            "/line/金桥机场/金桥航线/金桥东一小区其.kmz",
            "/line/金桥机场/金桥航线/金桥东二小区.kmz",
            "/line/金桥机场/金桥航线/金桥东兴华苑其.kmz",
            "/line/金桥机场/金桥航线/金桥东方城市华庭其.kmz",
            "/line/金桥机场/金桥航线/金桥东源名都其.kmz",
            "/line/金桥机场/金桥航线/金桥东荷小区其.kmz",
            "/line/金桥机场/金桥航线/金桥东语璟庭其.kmz",
            "/line/金桥机场/金桥航线/金桥东路安居苑九街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥东陆新村三街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥东陆新村四街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥东陆锦悦苑其.kmz",
            "/line/金桥机场/金桥航线/金桥中大新苑其.kmz",
            "/line/金桥机场/金桥航线/金桥中大苑其.kmz",
            "/line/金桥机场/金桥航线/金桥中星长岛苑其.kmz",
            "/line/金桥机场/金桥航线/金桥中虹家园.kmz",
            "/line/金桥机场/金桥航线/金桥丰舍东苑其.kmz",
            "/line/金桥机场/金桥航线/金桥丰舍西苑.kmz",
            "/line/金桥机场/金桥航线/金桥丽都成品其.kmz",
            "/line/金桥机场/金桥航线/金桥仁恒森兰雅苑其.kmz",
            "/line/金桥机场/金桥航线/金桥伟业金锦苑一邨其.kmz",
            "/line/金桥机场/金桥航线/金桥伟业金锦苑三邨.kmz",
            "/line/金桥机场/金桥航线/金桥伟业金锦苑东风丽景其.kmz",
            "/line/金桥机场/金桥航线/金桥伟业金锦苑二邨其.kmz",
            "/line/金桥机场/金桥航线/金桥佩玛山丘其.kmz",
            "/line/金桥机场/金桥航线/金桥佳伟景苑.kmz",
            "/line/金桥机场/金桥航线/金桥佳虹小区其.kmz",
            "/line/金桥机场/金桥航线/金桥信和花园其.kmz",
            "/line/金桥机场/金桥航线/金桥六合苑其.kmz",
            "/line/金桥机场/金桥航线/金桥凯鑫苑其.kmz",
            "/line/金桥机场/金桥航线/金桥华高二村.kmz",
            "/line/金桥机场/金桥航线/金桥华高二村北区其.kmz",
            "/line/金桥机场/金桥航线/金桥华高庭园其.kmz",
            "/line/金桥机场/金桥航线/金桥华高新苑南区其.kmz",
            "/line/金桥机场/金桥航线/金桥华高苑其.kmz",
            "/line/金桥机场/金桥航线/金桥博三小区.kmz",
            "/line/金桥机场/金桥航线/金桥同方锦城其.kmz",
            "/line/金桥机场/金桥航线/金桥和苑其.kmz",
            "/line/金桥机场/金桥航线/金桥和街小区其.kmz",
            "/line/金桥机场/金桥航线/金桥外环运河.kmz",
            "/line/金桥机场/金桥航线/金桥好人家其.kmz",
            "/line/金桥机场/金桥航线/金桥宝佳苑其.kmz",
            "/line/金桥机场/金桥航线/金桥巨峰家苑其.kmz",
            "/line/金桥机场/金桥航线/金桥幸福公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥张家浜.kmz",
            "/line/金桥机场/金桥航线/金桥拆后001.kmz",
            "/line/金桥机场/金桥航线/金桥拆后01.kmz",
            "/line/金桥机场/金桥航线/金桥拆后02.kmz",
            "/line/金桥机场/金桥航线/金桥拆后03.kmz",
            "/line/金桥机场/金桥航线/金桥新城.kmz",
            "/line/金桥机场/金桥航线/金桥新村五街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥新村十一街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥新村浦三小区其.kmz",
            "/line/金桥机场/金桥航线/金桥新芳邻.kmz",
            "/line/金桥机场/金桥航线/金桥新里绿地崴廉公寓.kmz",
            "/line/金桥机场/金桥航线/金桥新高苑佳苑其.kmz",
            "/line/金桥机场/金桥航线/金桥新高苑小区春园其.kmz",
            "/line/金桥机场/金桥航线/金桥新高苑小区雅园其.kmz",
            "/line/金桥机场/金桥航线/金桥春江花悦园其.kmz",
            "/line/金桥机场/金桥航线/金桥景丽苑其.kmz",
            "/line/金桥机场/金桥航线/金桥曹家沟.kmz",
            "/line/金桥机场/金桥航线/金桥朱家门小区其.kmz",
            "/line/金桥机场/金桥航线/金桥柳埠小区.kmz",
            "/line/金桥机场/金桥航线/金桥桥湾点晴苑其.kmz",
            "/line/金桥机场/金桥航线/金桥梵克雅堡其.kmz",
            "/line/金桥机场/金桥航线/金桥森兰星河湾.kmz",
            "/line/金桥机场/金桥航线/金桥欧洲阳光城二期其.kmz",
            "/line/金桥机场/金桥航线/金桥正射高程.kmz",
            "/line/金桥机场/金桥航线/金桥正旺苑.kmz",
            "/line/金桥机场/金桥航线/金桥民春苑其.kmz",
            "/line/金桥机场/金桥航线/金桥民胜苑其.kmz",
            "/line/金桥机场/金桥航线/金桥永业小区其.kmz",
            "/line/金桥机场/金桥航线/金桥永建路86弄小区其.kmz",
            "/line/金桥机场/金桥航线/金桥汇佳苑其.kmz",
            "/line/金桥机场/金桥航线/金桥汇园其.kmz",
            "/line/金桥机场/金桥航线/金桥沪一小区其.kmz",
            "/line/金桥机场/金桥航线/金桥沪二小区其.kmz",
            "/line/金桥机场/金桥航线/金桥河道巡检01.kmz",
            "/line/金桥机场/金桥航线/金桥河道巡检02.kmz",
            "/line/金桥机场/金桥航线/金桥浦东运河北.kmz",
            "/line/金桥机场/金桥航线/金桥浦东青年公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥浦兴苑其.kmz",
            "/line/金桥机场/金桥航线/金桥浦开仁恒金桥世纪其.kmz",
            "/line/金桥机场/金桥航线/金桥浦开仁恒金桥世纪其2.kmz",
            "/line/金桥机场/金桥航线/金桥浦江东旭公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥浦江东旭公寓南区其.kmz",
            "/line/金桥机场/金桥航线/金桥浦沁苑其.kmz",
            "/line/金桥机场/金桥航线/金桥海阳工厂项目总承包工程-2号点.kmz",
            "/line/金桥机场/金桥航线/金桥湾南二街坊其.kmz",
            "/line/金桥机场/金桥航线/金桥湾点晴苑其.kmz",
            "/line/金桥机场/金桥航线/金桥爱法小区其.kmz",
            "/line/金桥机场/金桥航线/金桥爱法花园西区其.kmz",
            "/line/金桥机场/金桥航线/金桥璞真园其.kmz",
            "/line/金桥机场/金桥航线/金桥申华小区其.kmz",
            "/line/金桥机场/金桥航线/金桥百富丽山庄其.kmz",
            "/line/金桥机场/金桥航线/金桥盛世春晓苑.kmz",
            "/line/金桥机场/金桥航线/金桥碧云东方公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云别墅北区其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云别墅南区其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云别墅银杏苑其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云国际社区晓园其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云左岸一期其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云新天地家园网球场其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云花园其.kmz",
            "/line/金桥机场/金桥航线/金桥碧云花园服务公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥紫翠苑其.kmz",
            "/line/金桥机场/金桥航线/金桥绵河苑其.kmz",
            "/line/金桥机场/金桥航线/金桥绿城上海御园其.kmz",
            "/line/金桥机场/金桥航线/金桥美亚地块项目001.kmz",
            "/line/金桥机场/金桥航线/金桥聚缘苑其.kmz",
            "/line/金桥机场/金桥航线/金桥舜峰家苑其.kmz",
            "/line/金桥机场/金桥航线/金桥苑其.kmz",
            "/line/金桥机场/金桥航线/金桥莱金佳园其.kmz",
            "/line/金桥机场/金桥航线/金桥莱阳新家园其.kmz",
            "/line/金桥机场/金桥航线/金桥融都金桥园其.kmz",
            "/line/金桥机场/金桥航线/金桥证大家园五期其.kmz",
            "/line/金桥机场/金桥航线/金桥试运行01.kmz",
            "/line/金桥机场/金桥航线/金桥试运行2.kmz",
            "/line/金桥机场/金桥航线/金桥贝尔新村其.kmz",
            "/line/金桥机场/金桥航线/金桥赵家沟.kmz",
            "/line/金桥机场/金桥航线/金桥通四11-01地块住宅项目.kmz",
            "/line/金桥机场/金桥航线/金桥邮电金桥新村其.kmz",
            "/line/金桥机场/金桥航线/金桥都市花园其.kmz",
            "/line/金桥机场/金桥航线/金桥酒店公寓.kmz",
            "/line/金桥机场/金桥航线/金桥金东名苑东区其.kmz",
            "/line/金桥机场/金桥航线/金桥金台路200弄小区其.kmz",
            "/line/金桥机场/金桥航线/金桥金巷小区.kmz",
            "/line/金桥机场/金桥航线/金桥金杨七街坊枣庄路810弄其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨七街坊金口路471弄其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨九街坊金阳路685弄其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨十街坊115弄其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨十街坊161弄其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨新村八街坊银山路342其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨新村八街坊银山路370其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨新村八街坊银山路其.kmz",
            "/line/金桥机场/金桥航线/金桥金杨路750弄小区其.kmz",
            "/line/金桥机场/金桥航线/金桥金泽苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金海华城华美新苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金港小区东区其.kmz",
            "/line/金桥机场/金桥航线/金桥金燕家苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金群苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金芝苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金葵佳苑其.kmz",
            "/line/金桥机场/金桥航线/金桥金葵新城东区.kmz",
            "/line/金桥机场/金桥航线/金桥金葵新城其.kmz",
            "/line/金桥机场/金桥航线/金桥金鼎首府其.kmz",
            "/line/金桥机场/金桥航线/金桥银山小区其.kmz",
            "/line/金桥机场/金桥航线/金桥银桥花苑.kmz",
            "/line/金桥机场/金桥航线/金桥阳光国际公寓其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光城睿湾其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光欧洲城金色米兰苑其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑10弄其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑176弄其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑265弄其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑268弄其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑40弄其.kmz",
            "/line/金桥机场/金桥航线/金桥阳光苑98弄其.kmz",
            "/line/金桥机场/金桥航线/金桥非上泰雅苑.kmz",
            "/line/金桥机场/金桥航线/金桥非东二小区.kmz",
            "/line/金桥机场/金桥航线/金桥非东五小区.kmz",
            "/line/金桥机场/金桥航线/金桥非东力新村.kmz",
            "/line/金桥机场/金桥航线/金桥非东波苑联鑫坊.kmz",
            "/line/金桥机场/金桥航线/金桥非东陆新村七街坊.kmz",
            "/line/金桥机场/金桥航线/金桥非东陆新村五街坊.kmz",
            "/line/金桥机场/金桥航线/金桥非东陆新村六街坊.kmz",
            "/line/金桥机场/金桥航线/金桥非东陆路1528弄.kmz",
            "/line/金桥机场/金桥航线/金桥非中大丽都.kmz",
            "/line/金桥机场/金桥航线/金桥非中大雅苑.kmz",
            "/line/金桥机场/金桥航线/金桥非今达花园.kmz",
            "/line/金桥机场/金桥航线/金桥非凌河路420弄.kmz",
            "/line/金桥机场/金桥航线/金桥非华高一村.kmz",
            "/line/金桥机场/金桥航线/金桥非华高新苑.kmz",
            "/line/金桥机场/金桥航线/金桥非博一小区.kmz",
            "/line/金桥机场/金桥航线/金桥非双桥小区.kmz",
            "/line/金桥机场/金桥航线/金桥非同方锦城C区.kmz",
            "/line/金桥机场/金桥航线/金桥非天歌华庭.kmz",
            "/line/金桥机场/金桥航线/金桥非安居苑八街坊.kmz",
            "/line/金桥机场/金桥航线/金桥非宜嘉苑.kmz",
            "/line/金桥机场/金桥航线/金桥非寿二小区.kmz",
            "/line/金桥机场/金桥航线/金桥非巨峰家苑.kmz",
            "/line/金桥机场/金桥航线/金桥非张桥小区.kmz",
            "/line/金桥机场/金桥航线/金桥非新村四街坊台儿庄小区.kmz",
            "/line/金桥机场/金桥航线/金桥非新高苑兰园.kmz",
            "/line/金桥机场/金桥航线/金桥非星晓家园.kmz",
            "/line/金桥机场/金桥航线/金桥非星纳家园.kmz",
            "/line/金桥机场/金桥航线/金桥非星金家园.kmz",
            "/line/金桥机场/金桥航线/金桥非星颂家园.kmz",
            "/line/金桥机场/金桥航线/金桥非曹路家苑.kmz",
            "/line/金桥机场/金桥航线/金桥非柳博小区.kmz",
            "/line/金桥机场/金桥航线/金桥非柳埠小区.kmz",
            "/line/金桥机场/金桥航线/金桥非森兰名轩.kmz",
            "/line/金桥机场/金桥航线/金桥非民耀路97弄.kmz",
            "/line/金桥机场/金桥航线/金桥非民风小区.kmz",
            "/line/金桥机场/金桥航线/金桥非江南山水.kmz",
            "/line/金桥机场/金桥航线/金桥非河滨城市花园.kmz",
            "/line/金桥机场/金桥航线/金桥非海尚东苑.kmz",
            "/line/金桥机场/金桥航线/金桥非爱法新城.kmz",
            "/line/金桥机场/金桥航线/金桥非爱法新都.kmz",
            "/line/金桥机场/金桥航线/金桥非碧云新天地家园.kmz",
            "/line/金桥机场/金桥航线/金桥非碧云新天地家园南区.kmz",
            "/line/金桥机场/金桥航线/金桥非紫翠·新行苑.kmz",
            "/line/金桥机场/金桥航线/金桥非绿景苑.kmz",
            "/line/金桥机场/金桥航线/金桥非船舶小区.kmz",
            "/line/金桥机场/金桥航线/金桥非荷一小区.kmz",
            "/line/金桥机场/金桥航线/金桥非荷三小区.kmz",
            "/line/金桥机场/金桥航线/金桥非荷五小区.kmz",
            "/line/金桥机场/金桥航线/金桥非蓝山小城.kmz",
            "/line/金桥机场/金桥航线/金桥非证大家园.kmz",
            "/line/金桥机场/金桥航线/金桥非证大家园一期.kmz",
            "/line/金桥机场/金桥航线/金桥非证大家园二期.kmz",
            "/line/金桥机场/金桥航线/金桥非证大家园四期.kmz",
            "/line/金桥机场/金桥航线/金桥非金台三居.kmz",
            "/line/金桥机场/金桥航线/金桥非金和佳园.kmz",
            "/line/金桥机场/金桥航线/金桥非金新花苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金杨九街坊.kmz",
            "/line/金桥机场/金桥航线/金桥非金杨路660弄.kmz",
            "/line/金桥机场/金桥航线/金桥非金桥名都.kmz",
            "/line/金桥机场/金桥航线/金桥非金桥新家园.kmz",
            "/line/金桥机场/金桥航线/金桥非金桥湾清水苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金桥花苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金浦小区.kmz",
            "/line/金桥机场/金桥航线/金桥非金石苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金舍苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金舟苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金藤苑.kmz",
            "/line/金桥机场/金桥航线/金桥非金领之都B区.kmz",
            "/line/金桥机场/金桥航线/金桥非金鹏苑.kmz",
            "/line/金桥机场/金桥航线/金桥非铂庭俱进家园.kmz",
            "/line/金桥机场/金桥航线/金桥非长岛花苑.kmz",
            "/line/金桥机场/金桥航线/金桥非阳光城市家园.kmz",
            "/line/金桥机场/金桥航线/金桥非阳光欧洲城一期.kmz",
            "/line/金桥机场/金桥航线/金桥非阳光苑.kmz",
            "/line/金桥机场/金桥航线/金桥非阳光苑358弄其.kmz",
            "/line/金桥机场/金桥航线/金桥非高行银杏苑.kmz",
            "/line/金桥机场/金桥航线/金桥非高行馨苑.kmz",
            "/line/金桥机场/金桥航线/金桥馨苑其.kmz",
            "/line/金桥机场/金桥航线/金桥高行家园.kmz",
            "/line/金桥机场/金桥航线/金桥高行家园其.kmz",
            "/line/金桥机场/金桥航线/金桥黄山新苑其.kmz",
            "/line/金桥机场/金桥航线/金桥龙腾阁小区其.kmz",
            "/line/金桥机场/金桥航线/金桥龙臣公寓其.kmz",
            "/line/金桥机场/金桥航线/金海商业广场新建项目（变更）001.kmz",
            "/line/金桥机场/金桥航线/金海路渣土车监管.kmz",
            "/line/金桥机场/金桥航线/金鼎天地05-01地块住宅新建项目001.kmz",
            "/line/金桥机场/金桥航线/长岛路.kmz",
            "/line/金桥机场/金桥航线/阳光欧洲城1.kmz",
            "/line/金桥机场/金桥航线/阳光欧洲城2.kmz"
          ];
          break;
      }

      // console.log("modulesFiles", modulesFiles);
      // for (const path in modulesFiles) {
      //   modules = [].concat(modules, modulesFiles[path].name);
      // }
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
          // let kmlfile = appSettings.restUrl + item.toString();

          let kmlfile = new URL(item.toString(), import.meta.url).href;
          // const baseUrl = window.location.href.replace(/\/$/, "");
          // const baseUrl = window.location.origin.replace(/\/$/, "");

          // const buildUrl = `${baseUrl}/dist`;
          // let kmlfile = buildUrl + item.toString();

          // let kmlfile =
          //   appSettings.restUrl +
          //   item.toString().substring(nameList[1].length + 1);

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
      // 点击监管对象，显示所有监管对象
      graphicLayer1.clear();
      graphicLayer2.clear();
      // graphicLayer1

      if (tempItem.key == "2-1") {
        map.setCameraView({
          lat: 31.13,
          lng: 121.75,
          alt: 80000,
          heading: 0,
          pitch: -90
        });
        menuList.value[1].children[0].children.forEach(item => {
          if (item.fileAddress != null && item.fileAddress != "") {
            let fileUrl = new URL(item.fileAddress, import.meta.url).href;
            // showPlaneInfo(fileUrl);
            // 仅显示所有点
            fetch(fileUrl)
              .then(response => response.text())
              .then(data => {
                // 在这里处理文件内容
                const anystr: any = data;
                // console.log("anystr:111", anystr);

                // 转xml
                const xml = new DOMParser().parseFromString(anystr, "text/xml");
                // console.log("kml:xml", xml);
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
                      }
                    }
                  });
                }, 500);
              });
          }
        });
      }
    };

    const clickContentItem = (tempItem, index) => {
      state.value.contentSelectedIndex = index;
      state.value.contentSelectedId = tempItem.id;
      // 显示机场及航线数据
      // debugger;
      getPlaneLineList(tempItem);
    };

    const graphicFZ = ref(
      new mars3d.graphic.BillboardEntity({
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
        attr: { remark: "反制区" }
        // popup: item.name
      })
    );
    // 反制区显示
    const addArea1 = () => {
      // graphicFZ.value =
      if (state.value.showFZ == false) {
        state.value.showFZ = true;
        graphicLayer3.addGraphic(graphicFZ.value);
      } else if (state.value.showFZ == true) {
        state.value.showFZ = false;
        graphicLayer3.removeGraphic(graphicFZ.value);
      }
    };

    const graphicJF = ref(
      new mars3d.graphic.BillboardEntity({
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
        attr: { remark: "禁飞区" }
        // popup: item.name
      })
    );
    // 禁飞区显示
    const addArea2 = () => {
      if (state.value.showJF == false) {
        state.value.showJF = true;
        graphicLayer3.addGraphic(graphicJF.value);
      } else if (state.value.showJF == true) {
        state.value.showJF = false;
        graphicLayer3.removeGraphic(graphicJF.value);
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

    const showPlaneInfo = fileUrl => {
      fetch(fileUrl)
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
    };

    // 搜索机场名称
    const searchChange = () => {
      if (searchValue.value != null && searchValue.value != "") {
        let center = null;
        placeList.value.forEach(item => {
          if (center == null) {
            if (item.name.indexOf(searchValue.value) != -1) {
              center = item;
            }
          }
        });
        if (center != null) {
          map.setCameraView({
            lat: center.lat,
            lng: center.lng,
            alt: 30000,
            heading: 0,
            pitch: -90
          });
        }
      }
    };

    // 显示时间
    const setNowTimes = () => {
      let myDate = new Date();
      // let wk = myDate.getDay();
      // let yy = String(myDate.getFullYear());
      // let mm = myDate.getMonth() + 1;
      // let dd = String(
      //   myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      // );
      // console.log("vvvvvvvv", wk);
      let hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      let sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );

      // let weeks = [
      //   "星期日",
      //   "星期一",
      //   "星期二",
      //   "星期三",
      //   "星期四",
      //   "星期五",
      //   "星期六"
      // ];
      // let week = weeks[wk];
      // timeInfo.nowDate = yy + "-" + mm + "-" + dd + "";
      timeInfo.nowTime = hou + ":" + min + ":" + sec;
      // timeInfo.nowWeek = week;
    };

    onMounted(async function() {
      console.log(mars3d);
      timeInfo.setInterval = setInterval(() => {
        setNowTimes();
      }, 1000);

      map = new mars3d.Map("mars3dContainer2", mapOptions);
      // 创建矢量数据图层 机场点位
      graphicLayer = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer);
      // 创建矢量数据图层 监管对象、机场
      graphicLayer1 = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer1);
      // 创建矢量数据图层 航线
      graphicLayer2 = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer2);
      // 创建矢量数据图层 禁飞、反制区
      graphicLayer3 = new mars3d.layer.GraphicLayer();
      map.addLayer(graphicLayer3);

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
      timeInfo,
      state,
      menuList,
      searchValue,
      searchChange,
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

.warning {
  display: inline-block;
  // width: 600px;
  width: calc(100% - 20px);
  height: 32px;
  // border-radius: 32px;
  position: absolute;
  margin-top: 10px;
  margin-left: 5px;
  overflow: hidden;

  .text {
    color: rgba(255, 255, 255, 0.8);
    // font-size: 18px;
    line-height: 36px;
    display: inline-block;
    white-space: nowrap;
    animation: 20s wordsLoop linear infinite normal;
  }
  @keyframes wordsLoop {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
}
// 标题光点
.titleLight {
  width: 100%;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: end;

  .warning {
    display: inline-block;
    // width: 600px;
    width: 480px;
    height: 30px;
    // border-radius: 32px;
    position: absolute;
    margin-top: 10px;
    margin-left: 10px;
    overflow: hidden;

    .text {
      // color: rgba(255, 255, 255, 0.8);
      // // font-size: 18px;
      // line-height: 36px;
      height: 30px;
      width: 300px;

      display: inline-block;
      white-space: nowrap;
      animation: 20s wordsLoop1 linear infinite normal;
    }
    @keyframes wordsLoop1 {
      0% {
        transform: translateX(70%);
      }
      50% {
        transform: translateX(-70%);
      }
      100% {
        transform: translateX(70%);
      }
    }
  }
}
</style>