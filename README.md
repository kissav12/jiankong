<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>服务状态监控（图表 + 分页）</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: sans-serif;
      background: #f7f7f7;
      color: #111;
      max-width: 900px;
      margin: auto;
      padding: 2rem;
    }
    h1 {
      text-align: center;
    }
    .controls {
      margin: 1rem 0;
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    input, select {
      padding: 0.4rem 0.6rem;
      font-size: 1rem;
    }
    .stats, .pagination {
      margin: 1rem 0;
      font-weight: bold;
    }
    .service {
      background: #fff;
      border-left: 5px solid;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 6px;
    }
    .up { border-color: green; }
    .down { border-color: red; }
    .pagination button {
      margin-right: 8px;
      padding: 0.3rem 0.7rem;
    }
    canvas {
      margin-top: 2rem;
      background: #fff;
      border-radius: 6px;
      padding: 1rem;
    }
  </style>
</head>
<body>

  <h1>服务状态监控</h1>

  <div class="controls">
    <input type="text" id="search" placeholder="🔍 搜索服务..." />
    <select id="perPage">
      <option value="5">每页 5 个</option>
      <option value="10" selected>每页 10 个</option>
      <option value="20">每页 20 个</option>
    </select>
  </div>

  <div class="stats" id="summary">加载中...</div>
  <div id="status"></div>
  <div class="pagination" id="pagination"></div>

  <canvas id="uptimeChart" height="300"></canvas>

  <script>
    const API_URL = "https://quiet-meadow-d19c.mqqmengqiqi.workers.dev";
    const statusDiv = document.getElementById("status");
    const summary = document.getElementById("summary");
    const searchInput = document.getElementById("search");
    const paginationDiv = document.getElementById("pagination");
    const perPageSelect = document.getElementById("perPage");
    let chartInstance = null;

    let allData = [], currentPage = 1;

    async function fetchStatus() {
      summary.textContent = "加载中...";
      statusDiv.innerHTML = "...";
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        allData = json.monitors || [];
        currentPage = 1;
        render();
      } catch (err) {
        statusDiv.innerHTML = `<p>获取失败：${err.message}</p>`;
        summary.textContent = "加载失败";
      }
    }

    function render() {
      const keyword = searchInput.value.trim().toLowerCase();
      let filtered = allData.filter(m =>
        m.friendly_name.toLowerCase().includes(keyword)
      );

      const total = filtered.length;
      const perPage = parseInt(perPageSelect.value);
      const pageCount = Math.ceil(total / perPage);
      const offset = (currentPage - 1) * perPage;
      const pageData = filtered.slice(offset, offset + perPage);

      // 状态统计
      const up = filtered.filter(m => m.status === 2).length;
      const down = total - up;
      summary.textContent = `共 ${total} 个服务 | 🟢 正常：${up} | 🔴 异常：${down}`;

      // 服务卡片渲染
      statusDiv.innerHTML = "";
      pageData.forEach(m => {
        const div = document.createElement("div");
        div.className = "service " + (m.status === 2 ? "up" : "down");
        div.innerHTML = `
          <strong>${m.friendly_name}</strong><br>
          地址：<a href="${m.url}" target="_blank">${m.url}</a><br>
          状态：${m.status === 2 ? "🟢 正常" : "🔴 异常"}<br>
          稳定性：${m.all_time_uptime_ratio || "N/A"}%
        `;
        statusDiv.appendChild(div);
      });

      // 分页渲染
      paginationDiv.innerHTML = "";
      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;
        btn.onclick = () => { currentPage = i; render(); };
        paginationDiv.appendChild(btn);
      }

      // 图表渲染
      const labels = filtered.map(m => m.friendly_name);
      const data = filtered.map(m => parseFloat(m.all_time_uptime_ratio || "0"));

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(document.getElementById("uptimeChart"), {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "稳定性 (%)",
            data,
            backgroundColor: "#1e90ff"
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 100 }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    searchInput.addEventListener("input", () => { currentPage = 1; render(); });
    perPageSelect.addEventListener("change", () => { currentPage = 1; render(); });

    fetchStatus();
    setInterval(fetchStatus, 60000); // 每 60 秒刷新
  </script>
</body>
</html>
