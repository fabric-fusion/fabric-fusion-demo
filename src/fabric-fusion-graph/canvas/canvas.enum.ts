// 定义可扩展的画布名称数组
export const CanvasNames = [
  'editor_canvas',
  'outline_canvas',
  'preview_canvas',
  'platform_canvas',
] as const;

// 使用枚举进行类型扩展
export enum CanvasNameEnum {
  EDITOR_CANVAS = 'editor_canvas',
  OUTLINE_CANVAS = 'outline_canvas',
  PREVIEW_CANVAS = 'preview_canvas',
  PLATFORM_CANVAS = 'platform_canvas',
  CYCLE_CANVAS = 'cycle_canvas',
  CYCLE_OVERBREAK_CANVAS = 'cycle_overbreak_canvas',
  ANNOTATION_LEFT_CANVAS = 'annotation_left_canvas',
  ANNOTATION_CANVAS = 'annotation_canvas',
  ROCK_GRAPH_CANVAS = 'rock_graph_canvas',
  CYCLE_EFFECT_BG_CANVAS = 'cycle_effect_bg_canvas',
}

type CanvasName = (typeof CanvasNames)[number];
