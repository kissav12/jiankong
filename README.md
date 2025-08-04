<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>服务状态监控</title>
  <style>
    body {
      font-family: 'Helvetica Neue', sans-serif;
      padding: 2rem;
      background-color: #f4f4f4;
      color: #333;
    }
    h1 {
      color: #222;
      margin-bottom: 1rem;
    }
    .service {
      background: #fff;
      border: 1px solid #ccc;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .status-up {
      color: green;
    }
    .status-down {
      color: red;
    }
  </style>
</head>
<body>
  <h1>服务状态监控</h1>
  <div id="status">加载中...</div>

  <script>
    fetch("https://quiet-meadow-d19c.mqqmengqiqi.workers.dev")
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById("status");
        container.innerHTML = "";
        data.monitors.forEach(m => {
          const div = document.createElement("div");
          div.className = "service";
          div.innerHTML = `
            <strong>${m.friendly_name}</strong><br/>
            地址：<a href="${m.url}" target="_blank">${m.url}</a><br/>
            状态：<span class="${m.status === 2 ? 'status-up' : 'status-down'}">
              ${m.status === 2 ? '🟢 正常' : '🔴 异常'}
            </span><br/>
            稳定性：${m.all_time_uptime_ratio}%
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        document.getElementById("status").innerText = "获取状态失败： " + err;
      });
  </script>
</body>
</html>
