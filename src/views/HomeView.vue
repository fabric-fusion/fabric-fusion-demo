<template>
  <div class="box-fabric-container">
    <div class="box-fabric-header">
      <button @click="handleRandom">随机</button>
    </div>
    <div class="box-fabric-content">
      <GraphRender />
    </div>
    <div class="box-fabric-footer">footer</div>
  </div>
</template>

<script lang="ts" setup>
// import GraphRender from './GraphRender.vue';

import GraphRender from "@/components/GraphRender.vue";
import { CanvasNameEnum } from "@/fabric-fusion-graph";
import { useGraphFusionStore } from "@/fabric-fusion-graph/store/graphFusion";

const graphFusionStore = useGraphFusionStore();

const handleRandom = () => {
  graphFusionStore.updateTriggerUUID(CanvasNameEnum.EDITOR_CANVAS);
};
</script>

<style scoped>
.box-fabric-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-color: aliceblue;
}

.box-fabric-header {
  height: 50px;
  background-color: rgb(167 199 248);
}

.box-fabric-content {
  height: 100%;
  background-color: rgb(169 250 223);
}

.box-fabric-footer {
  height: 50px;
  background-color: rgb(167 199 248);
}
</style>
