[← 返回章节首页](../../readme.md)

# Step 10：性能优化——标签缓存

为高频调用的 `getAllTags()` 添加内存缓存，减少数据库查询压力。

## 问题分析

`getAllTags()` 几乎被**每一条 Web 路由**调用——因为 `header.ejs` 的导航条需要标签列表来渲染导航链接。随着访问量增大，每次请求都查一次数据库会产生不必要的压力。

而标签数据实际上**几乎不变**：本项目甚至没有提供增删标签的接口。这是引入缓存的理想场景。

## 缓存实现（模块级变量 + TTL）

```typescript
// src/db/dbTag.ts

let tagsCache: Tag[] | null = null;    // 缓存数据
let cacheTimestamp = 0;                // 最后一次查询的时间戳
const CACHE_TTL = 5 * 60 * 1000;      // 缓存有效期：5 分钟

export async function getAllTags(): Promise<Tag[]> {
    const now = Date.now();
    // 缓存存在且未过期，直接返回
    if (tagsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return tagsCache;
    }
    // 缓存过期或不存在，查数据库并更新缓存
    tagsCache = await origin_getAllTags();
    cacheTimestamp = now;
    return tagsCache;
}

// 供将来增删 tag 时主动清除缓存
export function clearTagsCache() {
    tagsCache = null;
    cacheTimestamp = 0;
}
```

对所有调用方来说，函数签名没有变化——这是这种封装方式的核心优点：**调用方无需任何改动**。

## 设计要点

| 要点 | 说明 |
|---|---|
| 模块级变量 | `tagsCache` 和 `cacheTimestamp` 存活于模块生命周期，服务器重启后重置 |
| TTL（Time To Live） | 5 分钟后强制重新查库，防止数据长期失效 |
| `clearTagsCache()` | 若将来实现了标签增删接口，调用此函数可立即使缓存失效 |
| 原始函数不导出 | `origin_getAllTags()` 设为私有，外部只能通过带缓存的 `getAllTags()` 访问 |

## 适用场景

这种"模块级变量缓存"模式适用于：
- 数据变动不频繁
- 读取频率极高
- 数据量小，可以完整放入内存
