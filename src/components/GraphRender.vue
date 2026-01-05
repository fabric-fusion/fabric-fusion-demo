<template>
  <div class="fabric-container">
    <!-- 调试用状态显示（已屏蔽，保留） -->
    <!-- <div>isTrueClick{{ isTrueClick }}</div> -->
    <!-- <div @click="handleClick">234</div> -->
    <!-- <h1>Fabric Canvas Demo</h1> -->

    <div class="toolbar">
      <!-- 功能按钮预留（暂未启用，保留） -->
      <!-- <button @click="addDesign">添加炮孔设计</button> -->
      <!-- <button @click="resetCanvas">重置画布</button> -->
      <!-- <button @click="clearCanvas">清空画布</button> -->

      <!-- 当前键盘与交互状态显示（调试用） -->
      <div>isShiftPressed{{ isShiftPressed }}</div>
      <div>isCtrlPressed{{ isCtrlPressed }}</div>
      <div>isAltPressed{{ isAltPressed }}</div>
      <div>isClickWithoutDrag{{ isClickWithoutDrag }}</div>
      <div>isActiveSelection{{ isActiveSelection }}</div>
    </div>

    <!-- 画布容器，用于自适应尺寸计算 -->
    <div class="canvas-wrapper" ref="canvasContainerRef">
      <!-- Fabric.js 实际渲染的 Canvas 元素 -->
      <canvas id="fabric-canvas" ref="canvasElementRef"></canvas>
    </div>

    <!-- 画布说明组件 -->
    <!-- <CanvasAbout /> -->
  </div>
</template>

<script lang="ts" setup>
/* =========================
 * Vue 相关 API
 * ========================= */
import { ref, onMounted, onUnmounted, watch, computed, reactive } from "vue";

/* =========================
 * Fabric 渲染核心
 * ========================= */
// import { FabricRender, fabric, FabricObjectWithLayer } from '@fabric-fusion/core';
// import { FabricRender, fabric, FabricObjectWithLayer } from '@/fabric-fusion/v5/core';
import { FabricRender, fabric } from "@fabric-fusion/core";
import type { FabricObjectWithLayer } from "@fabric-fusion/core";
// import { CanvasEvents, FabricObject, TEvent } from 'fabric';

/* =========================
 * 业务组件
 * ========================= */
// import CanvasAbout from '@/yunbaopo/components/CanvasAbout.vue';

/* =========================
 * 状态管理
 * ========================= */

import { storeToRefs } from "pinia";
import {
  CanvasLayerEnum,
  CanvasLayerGroupPresets,
  CanvasLayerOrderPreset,
  CanvasNameEnum,
} from "@/fabric-fusion-graph";
import { generateObjects } from "@/fabric-fusion-graph/layer/simple-layer";
import { useGraphFusionStore } from "@/fabric-fusion-graph/store/graphFusion";

/* =========================
 * 工具与配置
 * ========================= */

/* =========================
 * DOM 引用
 * ========================= */
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const canvasElementRef = ref<HTMLCanvasElement | null>(null);

/* =========================
 * Fabric 渲染器实例
 * ========================= */
const mainRender = new FabricRender();

/* =========================
 * 键盘状态
 * ========================= */
const isAltPressed = ref(false);
const isCtrlPressed = ref(false);
const isShiftPressed = ref(false);
const isSpacePressed = ref(false);

/* =========================
 * 画布交互状态
 * ========================= */
const isActiveSelection = ref(true);

/** 是否为“未发生拖拽的点击” */
const isClickWithoutDrag = ref(true);

/** 鼠标是否处于拖拽状态 */
const isMouseDragging = ref(false);

/** 拖拽起始点坐标 */
const dragStartPoint = reactive({ x: 0, y: 0 });

/* =========================
 * Store 数据
 * ========================= */
const graphFusionStore = useGraphFusionStore();
const { canvasHoverCursor, excludeLayers } = storeToRefs(graphFusionStore);

/* =========================
 * 画布基础配置
 * ========================= */
const editorCanvasConfig = {
  name: CanvasNameEnum.EDITOR_CANVAS,
  layer: CanvasLayerGroupPresets.TEST.layers,
  excludeLayers: CanvasLayerGroupPresets.TEST.excludeLayers,
};
/* =========================
 * 图层生成函数
 * ========================= */
const generateTestLayerObjects = async (): Promise<fabric.FabricObject[]> => {
  return generateObjects();
};
const CanvasLayerGeneratorConfig = {
  [CanvasLayerEnum.TEST]: generateTestLayerObjects,
};
/**
 * 重置并重新绘制画布图层
 *
 * 核心职责：
 * 1. 以 Store 中记录的图层配置为「唯一真源」
 * 2. 清理画布中已经不存在于配置中的“陈旧图层”
 * 3. 按需重建指定图层（支持部分重建）
 * 4. 最终统一整理图层在画布中的渲染顺序
 *
 * @param baseLayers
 * - 可选参数
 * - 用于指定“只重建哪些图层”
 * - 若不传，则默认重建画布配置中的全部图层
 */
const resetCanvasLayers = async (
  baseLayers: CanvasLayerEnum[] | CanvasLayerEnum = []
) => {
  /**
   * 图层生成器映射表
   *
   * Key   ：图层枚举值
   * Value ：返回 Promise<FabricObject[]> 的异步生成函数
   *
   * 设计目的：
   * - 不同图层拥有独立的“生成策略”
   * - resetCanvasLayers 本身不关心图层如何生成
   */
  const layerGenerators: Partial<
    Record<CanvasLayerEnum, () => Promise<fabric.FabricObject[]>>
  > = CanvasLayerGeneratorConfig;

  /**
   * 从 FabricRender 中获取图层管理器
   * LayerManager 负责：
   * - 图层的创建 / 删除
   * - 图层中对象的管理
   * - 图层顺序控制
   */
  const layerManager = mainRender.layerManager;

  // 若图层管理器尚未初始化，直接终止，避免空指针错误
  if (!layerManager) return;

  /**
   * 从 Store 中读取当前画布的元信息
   * 这里的 canvasMeta 是“逻辑层面的画布状态”
   */
  const canvasMeta = graphFusionStore.getCanvasByName(editorCanvasConfig.name);

  /**
   * 目标图层列表（逻辑层）
   *
   * 表示：
   * - 当前画布“应该存在”的图层集合
   * - 是本次同步的最终目标状态
   */
  const targetLayers: CanvasLayerEnum[] = canvasMeta?.layers ?? [];

  /**
   * 获取画布当前真实存在的所有图层名称
   *
   * includeHidden: true
   * - 包括被隐藏但仍存在的图层
   *
   * sort: 'none'
   * - 不对结果进行排序，保持原始顺序
   */
  const existingLayers = layerManager.getAllLayerNames({
    includeHidden: true,
    sort: "none",
  });

  /**
   * 计算“陈旧图层”
   *
   * 即：
   * - 画布中真实存在
   * - 但已经不在 targetLayers 配置中的图层
   *
   * 这些图层需要被移除，防止脏数据残留
   */
  const staleLayers = existingLayers.filter(
    (layer: any) => !targetLayers.includes(layer as CanvasLayerEnum)
  );

  /**
   * 若存在陈旧图层，则统一移除
   * removeLayers 支持批量删除
   */
  if (staleLayers.length) {
    layerManager.removeLayers(staleLayers as CanvasLayerEnum[]);
  }

  /**
   * 当前需要被排除重建的图层列表
   *
   * 常见用途：
   * - 某些图层处于锁定状态
   * - 或正在交互中，暂不允许刷新
   */
  const excludedLayerList: CanvasLayerEnum[] = excludeLayers.value ?? [];

  /**
   * 统一 baseLayers 参数结构
   *
   * - 若传入单个枚举值，转为数组
   * - 若未传，则为空数组
   */
  const inputLayers = Array.isArray(baseLayers) ? baseLayers : [baseLayers];

  /**
   * 确定本次“候选重建图层集”
   *
   * 规则：
   * - 若显式传入 baseLayers，则只处理这些图层
   * - 否则默认使用画布配置中的全部目标图层
   */
  const sourceLayers = inputLayers.length ? inputLayers : targetLayers;

  /**
   * 计算最终需要重建的图层列表
   *
   * 在候选集的基础上：
   * - 排除被 excludeLayers 标记的图层
   */
  const layersToRebuild = sourceLayers.filter(
    (layer) => !excludedLayerList.includes(layer)
  );

  /**
   * 逐个重建图层
   *
   * 使用 for...of：
   * - 保证异步流程串行执行
   * - 避免多个图层同时修改画布状态导致异常
   */
  for (const layer of layersToRebuild) {
    /**
     * 获取当前图层对应的生成器函数
     */
    const generator = layerGenerators[layer];

    // 若该图层未配置生成器，直接跳过
    if (!generator) continue;

    /**
     * 移除当前图层的所有旧对象
     * 相当于“清空该图层”
     */
    layerManager.removeLayer(layer);

    /**
     * 调用图层生成器，异步生成新的 Fabric 对象
     */
    const objects = await generator();

    /**
     * 将生成的对象重新添加到对应图层中
     */
    layerManager.addToLayer(objects as FabricObjectWithLayer[], layer);
  }

  /**
   * 以下逻辑用于统一整理图层在画布中的最终渲染顺序
   *
   * 原理：
   * - Fabric 的图层本质仍然是对象栈顺序
   * - 通过精确计算 index，将不同图层“拼接”成一个完整顺序
   */
  let currentIndex = 0;

  /**
   * 按预设的图层顺序枚举进行遍历
   */
  for (const layer of CanvasLayerOrderPreset) {
    /**
     * 若画布中实际存在该图层
     */
    if (layerManager.hasLayer(layer)) {
      /**
       * 将该图层整体移动到指定起始索引位置
       */
      layerManager.moveLayerToIndex(layer, currentIndex);

      /**
       * 获取该图层中包含的对象数量
       */
      const layerObjects = layerManager.getObjectsByLayer(layer);

      /**
       * 更新下一个图层的起始索引
       */
      currentIndex += layerObjects.length;
    }
  }
};

/* =========================
 * Canvas 鼠标事件
 * ========================= */
const handleCanvasMouseDown = (opt: fabric.TEvent) => {
  const pointer = mainRender.canvas.getScenePoint(opt.e);

  dragStartPoint.x = pointer.x;
  dragStartPoint.y = pointer.y;

  isMouseDragging.value = true;
  isClickWithoutDrag.value = true;
};

const handleCanvasMouseMove = (opt: fabric.TEvent) => {
  if (!isMouseDragging.value) return;

  const pointer = mainRender.canvas.getScenePoint(opt.e);
  const dx = pointer.x - dragStartPoint.x;
  const dy = pointer.y - dragStartPoint.y;

  if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
    isClickWithoutDrag.value = false;
  }
};

const handleCanvasMouseUp = () => {
  isMouseDragging.value = false;
};

const handleCanvasMouseOut = () => {};

const handleCanvasObjectModified = async () => {};

const handleCanvasSelectionCreated = () => {};

/* =========================
 * Canvas 状态更新
 * ========================= */
const updateCanvasHoverCursor = () => {
  mainRender.canvas.hoverCursor = canvasHoverCursor.value;
};

const updateCanvasState = (
  mode: "create" | "update" = "create",
  updateType: "size" | "layer" | "all" = "all"
) => {
  const container = canvasContainerRef.value;
  if (!container) return;

  const size = {
    width: container.clientWidth || 0,
    height: container.clientHeight || 0,
    xOffset: 0,
    yOffset: 0,
    scaleFactor: 1,
  };

  if (mode === "create") {
    graphFusionStore.createCanvas(
      editorCanvasConfig.name,
      editorCanvasConfig.layer,
      size
    );
  } else if (mode === "update" && updateType === "size") {
    graphFusionStore.updateCanvasSize(editorCanvasConfig.name, size);
  }

  graphFusionStore.updateCanvasScale(editorCanvasConfig.name);
};

/* =========================
 * 键盘事件
 * ========================= */
const updateKeyboardState = (e: KeyboardEvent) => {
  isAltPressed.value = e.altKey;
  isCtrlPressed.value = e.ctrlKey || e.metaKey;
  isShiftPressed.value = e.shiftKey;

  if (e.type === "keydown" && e.code === "Space") {
    isSpacePressed.value = true;
  }
  if (e.type === "keyup" && e.code === "Space") {
    isSpacePressed.value = false;
  }
};
/* =========================
 * Canvas 初始化
 * ========================= */
const initializeCanvas = () => {
  if (!canvasElementRef.value || !canvasContainerRef.value) return;

  updateCanvasState("create");

  mainRender.init(
    canvasElementRef.value,
    {
      selectionFullyContained: true,
      enableRetinaScaling: true,
      renderOnAddRemove: true,
      preserveObjectStacking: true,
      hoverCursor: canvasHoverCursor.value,
    },
    {
      enableDefaultListeners: true,
      panKey: " ",
      maxZoom: 10,

      // 自定义事件监听
      customListeners: {
        "mouse:down": handleCanvasMouseDown,
        "mouse:up": handleCanvasMouseUp,
        "mouse:move": handleCanvasMouseMove,
        "mouse:out": handleCanvasMouseOut,
        "selection:created": handleCanvasSelectionCreated,
        "object:modified": handleCanvasObjectModified,
      },
    },
    canvasContainerRef.value
  );
};
/* =========================
 * Canvas 清理与销毁
 * ========================= */
const clearCanvasContent = () => {
  mainRender.clear();
};

const disposeCanvasInstance = () => {
  mainRender.canvas.off();
  mainRender.dispose();
};
/** 当前画布触发更新的 UUID */
const canvasTriggerUUID = computed(() => {
  return (
    graphFusionStore?.canvasMap[editorCanvasConfig.name]?.triggerUUID || ""
  );
});
/* =========================
 * 监听触发器
 * ========================= */
watch(canvasTriggerUUID, async () => {
  updateCanvasState("update");
  await resetCanvasLayers();
  graphFusionStore.setExcludeLayers([]);
  updateCanvasHoverCursor();
});

/* =========================
 * 生命周期
 * ========================= */
onMounted(() => {
  graphFusionStore.setCanvasLoading(true);
  graphFusionStore.resetGraphFusion();

  initializeCanvas();

  graphFusionStore.updateTriggerUUID(editorCanvasConfig.name);
  window.addEventListener("resize", () => updateCanvasState("update", "size"));

  window.addEventListener("keydown", updateKeyboardState);
  window.addEventListener("keyup", updateKeyboardState);
  graphFusionStore.setCanvasLoading(false);
  clearCanvasContent();
});

onUnmounted(() => {
  graphFusionStore.removeCanvasByName(editorCanvasConfig.name);
  disposeCanvasInstance();
  window.removeEventListener("resize", () =>
    updateCanvasState("update", "size")
  );
  window.removeEventListener("keydown", updateKeyboardState);
  window.removeEventListener("keyup", updateKeyboardState);
});
</script>

<style scoped>
.fabric-container {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
}

.toolbar {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 48px - 50px);
}
</style>
