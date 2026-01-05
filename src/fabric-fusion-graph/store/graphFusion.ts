import { defineStore, storeToRefs } from "pinia";

import { v4 as uuidv4 } from "uuid";

import _ from "lodash";
import { CanvasLayerEnum, CanvasNameEnum } from "@/fabric-fusion-graph";

interface CanvasInfo {
  uuid: string;
  name: string; // 名字唯一标识画布
  width: number;
  height: number;
  xOffset: number;
  yOffset: number;
  scaleFactor: number;
  layers: CanvasLayerEnum[];

  triggerUUID: string;
}

export interface GraphFusionState {
  canvasMap: Record<string, CanvasInfo>; // 名字 => CanvasInfo
  activeCanvas: string | null; // 当前激活的画布名称
  triggerUUID: string; // 每次更换都会改变，用于 watch
  canvasHoverCursor: string;
  loadingCanvas: boolean;
  excludeLayers: CanvasLayerEnum[];
}

export const useGraphFusionStore = defineStore("app-graph-fusion", {
  state: (): GraphFusionState => ({
    canvasMap: {},
    activeCanvas: null,
    triggerUUID: "",
    canvasHoverCursor: "default",
    loadingCanvas: true,
    excludeLayers: [],
  }),
  getters: {
    // 获取当前激活画布的详细信息
    activeCanvasInfo(state): CanvasInfo | undefined {
      return state.activeCanvas
        ? state.canvasMap[state.activeCanvas]
        : undefined;
    },

    // 获取指定名称的画布信息
    getCanvasByName(state) {
      return (name: CanvasNameEnum): CanvasInfo | undefined => {
        return state.canvasMap[name];
      };
    },
  },
  actions: {
    setExcludeLayers(excludeLayers: CanvasLayerEnum[]) {
      this.excludeLayers = excludeLayers;
    },
    setCanvasLoading(loading: boolean) {
      this.loadingCanvas = loading;
    },
    resetGraphFusion() {
      // this.canvasMap = {};
      // this.activeCanvas = null;
      // this.triggerUUID = '';
      // this.canvasHoverCursor = 'default';
      this.$reset();
    },

    setCanvasHoverCursor(cursor: string = "default") {
      this.canvasHoverCursor = cursor;
    },
    /** 创建一个新画布（名字必须唯一） */
    createCanvas(
      name: CanvasNameEnum,
      layers: CanvasLayerEnum[] = [],

      size: {
        width: number;
        height: number;
        xOffset: number;
        yOffset: number;
        scaleFactor: number;
      }
    ): string {
      if (this.canvasMap[name]) {
        throw new Error(`画布名 "${name}" 已存在`);
      }
      const baseLayers = _.cloneDeep(layers);
      const baseSize = _.cloneDeep(size);

      const uuid = uuidv4();
      const bgColor = "#dceaf5";
      const canvas: CanvasInfo = {
        name,
        uuid: uuid,
        triggerUUID: uuid,
        layers: baseLayers,

        width: baseSize.width,
        height: baseSize.height,
        xOffset: baseSize.xOffset,
        yOffset: baseSize.yOffset,
        scaleFactor: baseSize.scaleFactor,
      };
      this.canvasMap[name] = canvas;

      this.activeCanvas = name;
      // this.updateTriggerUUID();
      return uuid;
    },

    /** 根据画布名切换当前画布 */
    setActiveCanvasByName(name: CanvasNameEnum) {
      if (this.canvasMap[name]) {
        this.activeCanvas = name;
        // this.updateTriggerUUID();
      }
    },

    /** 删除指定画布 */
    removeCanvasByName(name: CanvasNameEnum) {
      if (!this.canvasMap[name]) return;

      delete this.canvasMap[name];

      // 如果当前画布被删除，设置为 null
      if (this.activeCanvas === name) {
        this.activeCanvas = null;
        // this.updateTriggerUUID();
      }
    },

    // updateCanvasBgColor(name: CanvasNameEnum, color: string) {
    //   const canvas = this.canvasMap[name];
    //   if (canvas) {
    //     canvas.bgColor = color;
    //   }
    // },
    /** 修改画布尺寸 */
    updateCanvasSize(
      name: CanvasNameEnum,
      size: { width: number; height: number }
    ) {
      const canvas = this.canvasMap[name];
      if (canvas) {
        canvas.width = size.width;
        canvas.height = size.height;
      }
    },
    //修改画布图层
    updateCanvasLayers(name: CanvasNameEnum, layers: CanvasLayerEnum[]) {
      const baseLayers = _.cloneDeep(layers);

      const canvas = this.canvasMap[name];

      if (canvas) {
        canvas.layers = baseLayers;
      }
    },
    //修改某一特定画布特定图层，有则消除，无则添加
    updateCanvasLayer(name: CanvasNameEnum, layer: CanvasLayerEnum) {
      const canvas = this.canvasMap[name];
      if (canvas) {
        const index = canvas.layers.indexOf(layer);
        if (index !== -1) {
          canvas.layers.splice(index, 1);
        } else {
          canvas.layers.push(layer);
        }
      }
      console.log("updateCanvasLayer");
    },
    addCanvasLayer(name: CanvasNameEnum, layer: CanvasLayerEnum) {
      //先判断有没有，有则不添加重复，无则添加
      if (this.canvasMap[name]?.layers.includes(layer)) {
        return;
      }

      this.updateCanvasLayer(name, layer);
    },
    removeCanvasLayer(name: CanvasNameEnum, layer: CanvasLayerEnum) {
      //先判断有没有，有则消除，无则不操作
      if (!this.canvasMap[name]?.layers.includes(layer)) {
        return;
      }
      this.updateCanvasLayer(name, layer);
    },
    updateCanvasOffset(
      name: CanvasNameEnum,
      offset: { x?: number; y?: number }
    ) {
      const canvas = this.canvasMap[name];
      if (!canvas) return;
      // 判断 offset 是否为空对象
      if (offset && (offset.x !== undefined || offset.y !== undefined)) {
        if (offset.x !== undefined) {
          canvas.xOffset = offset.x;
        }
        if (offset.y !== undefined) {
          canvas.yOffset = offset.y;
        }
      }
    },
    updateCanvasScaleNumber(name: CanvasNameEnum, num: number) {
      const canvas = this.canvasMap[name];
      if (!canvas) return;
      canvas.scaleFactor = num;
    },
    updateCanvasScale(name: CanvasNameEnum) {
      const canvas = this.canvasMap[name];
      if (!canvas) return;
      const scale = 1;
      let canvasW = 0;
      let canvasH = 0;
      canvasW = canvas.width;
      canvasH = canvas.height * 0.6;
      const prefixRatio = 0.8;

      switch (name) {
        case CanvasNameEnum.CYCLE_CANVAS:
        case CanvasNameEnum.EDITOR_CANVAS:
          break;
        default:
          break;
      }

      // canvas.yOffset = -canvasH * 0.5;
      canvas.yOffset = -canvasH * 0.3;

      canvas.scaleFactor = scale * prefixRatio;
    },

    /** 手动触发刷新 */
    updateTriggerUUID(name?: CanvasNameEnum) {
      if (name && this.canvasMap[name]) {
        this.canvasMap[name].triggerUUID = uuidv4();
      } else {
        this.triggerUUID = uuidv4();
      }
    },
  },
});
