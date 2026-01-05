import { nanoid } from "nanoid";

// ========== 配置区 ==========

// 是否开启“每个 TAB 独立存储”
const ENABLE_TAB_ISOLATION = true;

// tabId 存储到 sessionStorage 的 key
const SESSION_TAB_ID_KEY = "tab-storage-helper-tab-id";

// 本地存储过期时间（毫秒），例如 24小时 = 24 * 60 * 60 * 1000
const STORAGE_EXPIRE_MS = 24 * 60 * 60 * 1000;

// ========== 工具函数 ==========

/** 检测 localStorage 是否可用 */
function isStorageAvailable() {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn("[TabStorageHelper] localStorage 不可用", e);
    return false;
  }
}

/** 生成 tabId */
function generateTabId() {
  return nanoid(10);
}

/** 获取当前 tabId */
function getTabId() {
  let tabId = sessionStorage.getItem(SESSION_TAB_ID_KEY);
  if (!tabId) {
    tabId = generateTabId();
    sessionStorage.setItem(SESSION_TAB_ID_KEY, tabId);
  }
  return tabId;
}

/** 计算完整的存储 key */
function getStorageKey(baseKey: string) {
  if (ENABLE_TAB_ISOLATION) {
    const tabId = getTabId();
    return `${baseKey}-${tabId}`;
  }
  return baseKey;
}

/** 自动清除当前 tab 存储 */
function clearStorage(baseKey: string) {
  try {
    const fullKey = getStorageKey(baseKey);
    localStorage.removeItem(fullKey);
  } catch (e) {
    console.warn("[TabStorageHelper] 清理 localStorage 失败", e);
  }
}

/** devtools 日志 */
function devLog(message: string, ...args: any[]) {
  if (import.meta.env.DEV) {
    console.log(
      `%c[TabStorageHelper]%c ${message}`,
      "color:#00c4b6;font-weight:bold;",
      "color:inherit;",
      ...args
    );
  }
}

// ========== 核心导出 ==========

/** 创建 persist 配置 */
export function createPersistConfig(baseKey: string) {
  const isAvailable = isStorageAvailable();
  const storageKey = getStorageKey(baseKey);

  // 初始化：监听 tab 关闭清理
  if (ENABLE_TAB_ISOLATION && isAvailable) {
    window.addEventListener("beforeunload", () => {
      clearStorage(baseKey);
    });
  }

  if (import.meta.env.DEV && ENABLE_TAB_ISOLATION) {
    devLog(
      `TAB 隔离已启用，当前 tabId: ${sessionStorage.getItem(
        SESSION_TAB_ID_KEY
      )}`
    );
  }

  if (!isAvailable) {
    devLog("localStorage 不可用，将禁用 persist 功能");
    return undefined;
  }

  return {
    key: storageKey,
    storage: {
      getItem: (key: string) => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          const data = JSON.parse(raw);
          if (data.__expireAt && Date.now() > data.__expireAt) {
            // 已过期
            localStorage.removeItem(key);
            devLog(`检测到存储已过期，已清理: ${key}`);
            return null;
          }
          return JSON.stringify(data.value);
        } catch (e) {
          console.warn("[TabStorageHelper] 读取失败", e);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          const data = {
            value: JSON.parse(value),
            __expireAt: Date.now() + STORAGE_EXPIRE_MS,
          };
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
          console.warn("[TabStorageHelper] 写入失败", e);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn("[TabStorageHelper] 移除失败", e);
        }
      },
    },
  };
}
