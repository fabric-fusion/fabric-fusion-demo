export enum CanvasLayerEnum {
  /** 辅助图层 */
  GUIDE_AXIS = 'guide_axis', // 坐标轴
  GUIDE_GRID = 'guide_grid', // 网格

  /** 辅助围岩图片 */
  GUIDE_ROCK = 'guide_rock',

  /** 炮孔截面图 */
  HOLE_CROSS_SECTION = 'hole_cross_section',

  /** 炮孔外部结构 */
  HOLE_OUTER = 'hole_outer', // 炮孔外边界
  HOLE_OUTER_LINE = 'hole_outer_line', // 炮孔外边界线
  HOLE_OUTER_LINE_TEXT = 'hole_outer_line_text',

  /** 炮孔内部结构 */
  HOLE_INNER = 'hole_inner', // 炮孔内边界
  HOLE_INNER_LINE = 'hole_inner_line', // 炮孔内边界线
  HOLE_INNER_LINE_TEXT = 'hole_inner_line_text',

  HOLE_CONNECTION_LINE = 'hole_connection_line',

  /** 炮孔属性标注 */
  HOLE_EXPLOSIVE_STRUCTURE = 'hole_explosive_structure',
  HOLE_SEQUENCE_TEXT = 'hole_sequence_text', // 起爆顺序
  HOLE_EXPLOSIVE_TEXT = 'hole_explosive_text', // 装药信息
  HOLE_SPACING_TEXT = 'hole_spacing_text', // 孔间距

  /** 分区图层 */
  PARTITION = 'partition',
  PARTITION_BORDER = 'partition_border',

  /** 轮廓线图层 */
  OUTLINE = 'outline',
  /** 岩石性质特殊轮廓线图层 */
  CYCLE_ROCK_OUTLINE = 'cycle_rock_outline',
  CYCLE_ROCK_MATCH = 'cycle_rock_match',
  CYCLE_ROCK_INFER = 'cycle_rock_infer',

  CYCLE_ROCK_GRAPH_OUTLINE = 'cycle_rock_graph_outline',
  CYCLE_EFFECT_BG = 'cycle_effect_bg',

  CYCLE_DEFAULT_OUTLINE = 'cycle_default_outline',
  CYCLE_PARTITION = 'cycle_partition',
  CYCLE_ROCK_AREA = 'cycle_rock_area',
  //标注图层
  ANNOTATION_LEFT_IMG = 'annotation_left_img',
  //标注选框
  ANNOTATION_SELECT_LEFT_BOX = 'annotation_select_left_box',

  //标注图层
  ANNOTATION_IMG = 'annotation_img',
  //标注选框
  ANNOTATION_SELECT_BOX = 'annotation_select_box',

  /** 平台图层 */
  PLATFORM = 'platform',
  REMARK = 'remark',
  TEST = 'TEST',
}
type CanvasLayerType = CanvasLayerEnum; // 单个图层类型
