import { CanvasLayerEnum } from '../layer';

/**
 * 图层渲染顺序预设（从底到顶）
 */
export const CanvasLayerOrderPreset: CanvasLayerEnum[] = [
  //annotation
  CanvasLayerEnum.ANNOTATION_LEFT_IMG,
  CanvasLayerEnum.ANNOTATION_SELECT_LEFT_BOX,

  CanvasLayerEnum.ANNOTATION_IMG,
  CanvasLayerEnum.ANNOTATION_SELECT_BOX,

  // 辅助图层（最底层）
  CanvasLayerEnum.GUIDE_ROCK,
  CanvasLayerEnum.GUIDE_GRID,
  CanvasLayerEnum.HOLE_CROSS_SECTION,
  CanvasLayerEnum.CYCLE_ROCK_MATCH,
  CanvasLayerEnum.CYCLE_ROCK_INFER,
  CanvasLayerEnum.OUTLINE,
  CanvasLayerEnum.CYCLE_ROCK_OUTLINE,
  CanvasLayerEnum.CYCLE_DEFAULT_OUTLINE,
  CanvasLayerEnum.CYCLE_ROCK_AREA,

  CanvasLayerEnum.PARTITION_BORDER,
  CanvasLayerEnum.GUIDE_AXIS,
  CanvasLayerEnum.HOLE_OUTER_LINE,
  CanvasLayerEnum.HOLE_INNER_LINE,
  CanvasLayerEnum.HOLE_CONNECTION_LINE,

  // 炮孔属性标注（上层文字）
  CanvasLayerEnum.HOLE_SEQUENCE_TEXT,
  CanvasLayerEnum.HOLE_EXPLOSIVE_TEXT,
  CanvasLayerEnum.HOLE_SPACING_TEXT,
  CanvasLayerEnum.HOLE_SPACING_TEXT,

  CanvasLayerEnum.PARTITION,
  CanvasLayerEnum.CYCLE_PARTITION,
  CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,
  CanvasLayerEnum.HOLE_INNER_LINE_TEXT,
  CanvasLayerEnum.HOLE_INNER,

  CanvasLayerEnum.HOLE_OUTER,

  CanvasLayerEnum.TEST,
];

export const CanvasLayerGroupPresets = {
  /** 炮孔布置图层组合 */
  HOLE_OUTER_LAYOUT: {
    name: '炮孔布置图层',
    layers: [
      CanvasLayerEnum.GUIDE_GRID,
      // CanvasLayerEnum.GUIDE_ROCK,
      CanvasLayerEnum.CYCLE_ROCK_MATCH,
      CanvasLayerEnum.CYCLE_ROCK_INFER,

      CanvasLayerEnum.GUIDE_AXIS,
      CanvasLayerEnum.HOLE_CROSS_SECTION,
      CanvasLayerEnum.OUTLINE,
      CanvasLayerEnum.PARTITION_BORDER,
      CanvasLayerEnum.PARTITION,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_SPACING_TEXT,
      CanvasLayerEnum.HOLE_OUTER,
      CanvasLayerEnum.CYCLE_ROCK_AREA,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,
    ],
  },
  /** 起爆顺序图层组合 */

  HOLE_SEQUENCE: {
    name: '起爆顺序图层',
    layers: [
      CanvasLayerEnum.GUIDE_GRID,
      CanvasLayerEnum.GUIDE_AXIS,
      CanvasLayerEnum.HOLE_CROSS_SECTION,
      CanvasLayerEnum.OUTLINE,
      CanvasLayerEnum.HOLE_SEQUENCE_TEXT,
      CanvasLayerEnum.PARTITION_BORDER,
      // CanvasLayerEnum.PARTITION,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,

      // CanvasLayerEnum.HOLE_OUTER_SPACING_TEXT,

      CanvasLayerEnum.HOLE_OUTER,
    ],
  },
  HOLE_EXPLOSIVE: {
    name: '装药量图层',
    layers: [
      CanvasLayerEnum.GUIDE_GRID,
      CanvasLayerEnum.GUIDE_AXIS,
      CanvasLayerEnum.HOLE_CROSS_SECTION,
      CanvasLayerEnum.OUTLINE,
      CanvasLayerEnum.HOLE_EXPLOSIVE_TEXT,
      CanvasLayerEnum.PARTITION_BORDER,
      // CanvasLayerEnum.PARTITION,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,

      // CanvasLayerEnum.HOLE_OUTER_SPACING_TEXT,

      CanvasLayerEnum.HOLE_OUTER,
    ],
  },
  HOLE_EXPLOSIVE_STRUCTURE: {
    name: '装药量结构图层',
    layers: [
      CanvasLayerEnum.GUIDE_GRID,
      CanvasLayerEnum.GUIDE_AXIS,
      CanvasLayerEnum.HOLE_CROSS_SECTION,
      CanvasLayerEnum.OUTLINE,
      CanvasLayerEnum.PARTITION_BORDER,
      // CanvasLayerEnum.PARTITION,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,

      // CanvasLayerEnum.HOLE_OUTER_SPACING_TEXT,

      CanvasLayerEnum.HOLE_OUTER,
      CanvasLayerEnum.HOLE_EXPLOSIVE_STRUCTURE,
    ],
  },
  HOLE_AXIS: {
    name: '坐标轴图层',
    layers: [
      CanvasLayerEnum.GUIDE_GRID,
      CanvasLayerEnum.GUIDE_AXIS,
      CanvasLayerEnum.HOLE_CROSS_SECTION,
      CanvasLayerEnum.OUTLINE,
      // CanvasLayerEnum.HOLE_OUTER_SPACING_TEXT,
      CanvasLayerEnum.PARTITION_BORDER,
      // CanvasLayerEnum.PARTITION,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,

      CanvasLayerEnum.HOLE_OUTER,
    ],
  },

  CYCLE_ROCK_PROPERTIES: {
    name: '岩体图层',
    layers: [
      CanvasLayerEnum.GUIDE_ROCK,
      // CanvasLayerEnum.CYCLE_ROCK_MATCH,
      // CanvasLayerEnum.CYCLE_ROCK_INFER,
      CanvasLayerEnum.CYCLE_ROCK_OUTLINE,
      CanvasLayerEnum.CYCLE_ROCK_AREA,
    ],
  },
  CYCLE_BASIC_INFO: {
    name: '基本信息',
    layers: [
      // CanvasLayerEnum.GUIDE_GRID,
      CanvasLayerEnum.CYCLE_DEFAULT_OUTLINE,
      CanvasLayerEnum.CYCLE_PARTITION,
    ],
  },
  CYCLE_DESIGN: {
    name: '方案设计',
    layers: [
      CanvasLayerEnum.OUTLINE,
      CanvasLayerEnum.HOLE_OUTER,
      CanvasLayerEnum.PARTITION_BORDER,
      CanvasLayerEnum.HOLE_OUTER_LINE,
      CanvasLayerEnum.HOLE_OUTER_LINE_TEXT,

      CanvasLayerEnum.HOLE_SPACING_TEXT,
      // CanvasLayerEnum.PARTITION,
    ],
  },
  ANNOTATION: {
    name: '标注',
    layers: [CanvasLayerEnum.ANNOTATION_IMG, CanvasLayerEnum.ANNOTATION_SELECT_BOX],
    excludeLayers: [],
  },
  ANNOTATION_DOUBLE: {
    name: '标注',
    layers: [CanvasLayerEnum.ANNOTATION_LEFT_IMG, CanvasLayerEnum.ANNOTATION_SELECT_LEFT_BOX],
    excludeLayers: [],
  },
  EFFECT: {
    name: '标注',
    layers: [CanvasLayerEnum.CYCLE_EFFECT_BG],
    excludeLayers: [],
  },
  TEST: {
    name: '测试',
    layers: [CanvasLayerEnum.TEST],
    excludeLayers: [],
  },
  /** 全部显示（可选） */
  // FULL_VIEW: Object.values(CanvasLayerEnum),
};
