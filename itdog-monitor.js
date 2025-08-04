export default {
  async fetch(req, env, ctx) {
    const KV_KEY = 'monitor_history';
    const now = new Date().toISOString();

    // 模拟抓取失败数量（此处可替换为爬虫平台实际抓取）
    const failCount = Math.floor(Math.random() * 10); // 0~9之间的随机失败数
    const newEntry = { time: now, fail: failCount };

    // 读取已有历史
    let history = [];
    try {
      const prev = await env.MONITOR_KV.get(KV_KEY);
      history = prev ? JSON.parse(prev) : [];
    } catch (_) {}

    // 添加新记录并保存
    history.unshift(newEntry);
    if (history.length > 144) history = history.slice(0, 144); // 最多存储12小时（5分钟 x 144）

    await env.MONITOR_KV.put(KV_KEY, JSON.stringify(history));

    const total = history.length;
    const failures = history.reduce((sum, r) => sum + r.fail, 0);

    return new Response(JSON.stringify({
      total,
      failures,
      history
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
