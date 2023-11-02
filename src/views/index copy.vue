<template>
  <div class="page">
    <div class="backgroundArea">
      <div class="backgroundImg">
        <!-- 标题栏 -->
        <div>
          
        </div>
        <!-- <img src="/picture/title.png" class="titlePicture" /> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const enterPage = () => {
  // router.push("/contentPage");
  router.push("/modulePage");
};
</script>
<style lang="less" scoped>
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

  background: url("/picture/地图背景.png") center no-repeat;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  width: 100%;
  height: 100%;
  object-fit: cover; /* 新增，确保图片填充整个容器 */
}
</style>