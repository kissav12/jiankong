<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <title>服务状态监控</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2em;
      background: #f8f8f8;
    }
    h1 {
      font-size: 28px;
    }
    .service {
      background: #fff;
      padding: 1em;
      border-radius: 8px;
      margin-bottom: 1em;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .up { border-left: 6px solid #28a745; }
    .down { border-left: 6px solid #dc3545; }
  </style>
</head>
<body>
  <h1>服务状态监控</h1>
  <p>下方显示的是从 Cloudflare Worker 获取的状态：</p>
  <div id="status">加载中...</div>

  <script>
    fetch("https://quiet-meadow-d19c.mqqmengqiqi.workers.dev")
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("status");
        container.innerHTML = "";
        data.monitors.forEach(m => {
          const div = document.createElement("div");
          div.className = "service " + (m.status === 2 ? "up" : "down");
          div.innerHTML = `
            <strong>${m.friendly_name}</strong><br/>
            地址：<a href="${m.url}" target="_blank">${m.url}</a><br/>
            状态：${m.status === 2 ? "🟢 正常" : "🔴 异常"}<br/>
            稳定性：${m.all_time_uptime_ratio || "未知"}%
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        document.getElementById("status").innerText = "获取状态失败：" + err;
      });
  </script>
</body>
</html>
