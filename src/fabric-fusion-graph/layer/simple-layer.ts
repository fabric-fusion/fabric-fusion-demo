import { fabric } from "@fabric-fusion/core";

/**
 * @description 生成炮孔 Fabric.js 对象列表，每个元素是独立的 `fabric.Group`
 * @param {object} options - 额外的自定义配置
 * @param {string} [options.fill='#000000'] - 炮孔填充颜色
 * @param {Function} [options.onClick] - 炮孔点击回调函数 (data) => void
 * @param {Function} [options.onHover] - 炮孔悬停回调函数 (data) => void
 * @returns {fabric.Object[]} - 生成的炮孔 Fabric 组对象列表（每个炮孔是 `fabric.Group`）
 */
export const generateObjects = (
  options: {
    fill?: string;
    onClick?: (data: any) => void;
    onHover?: (data: any) => void;
  } = {}
): fabric.Object[] => {
  // 默认参数
  const config = {
    fill: "#000000",
    stroke: "#00e100",
    radius: 10,
    ...options, // 合并用户自定义参数
  };

  // 普通数组存储每个 `fabric.Group`，确保它们是独立对象
  const fabricObjects: fabric.Object[] = [];

  ///绘制图形///
  const count = 2;

  for (let i = 0; i < count; i++) {
    const circle = new fabric.Circle({
      radius: config.radius,
      fill: config.fill,
      stroke: config.stroke,
      left: 100,
      top: 100,
    });

    const data = {
      id: i,
      name: `Circle ${i}`,
      // 其他数据...
    };

    // 添加点击事件监听器
    if (config.onClick) {
      circle.on("mousedown", () => config.onClick?.(data));
    }

    // 添加悬停事件监听器
    if (config.onHover) {
      circle.on("mouseover", () => config.onHover?.(data));
    }
    fabricObjects.push(circle);
  }

  return fabricObjects;
};
