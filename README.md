<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8" />
  <title>服务状态监控</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      font-family: 'Helvetica Neue', sans-serif;
      background: #0f1117;
      color: #fff;
    }
    header {
      background: #151820;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-summary {
      background: #1c1f26;
      border-radius: 12px;
      margin: 2rem;
      padding: 2rem;
      text-align: center;
    }
    .status-summary .dot {
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #28d87a;
      border-radius: 50%;
      margin-right: 1rem;
    }
    .bar {
      height: 18px;
      width: 6px;
      border-radius: 3px;
      margin: 0 2px;
      display: inline-block;
    }
    .bar.up {
      background-color: #28d87a;
    }
    .bar.down {
      background-color: #f44336;
    }
    .section {
      background: #1c1f26;
      margin: 2rem;
      border-radius: 12px;
      padding: 2rem;
    }
    .timer {
      font-size: 14px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <header>
    <h1>18mh</h1>
    <div>
      <strong>Service status</strong><br />
      <span class="timer" id="timer">Last updated: -- | Next update in 300 sec.</span>
    </div>
  </header>

  <div class="status-summary">
    <div>
      <span class="dot" id="currentStatusDot"></span>
      <strong>All systems <span id="currentStatusText">Loading...</span></strong>
    </div>
  </div>

  <div class="section">
    <h2>Services</h2>
    <p>https://2887.temsxpom.cc/| <span id="latestResultText">Checking...</span></p>
    <div id="statusBars"></div>
  </div>

  <script>
    const domain = "18mh.net";
    const checkInterval = 300; // seconds
    const barsToShow = 60; // 5分钟 x 60 = 5小时历史
    let statusHistory = [];
    let countdown = checkInterval;

    function updateTimerDisplay() {
      document.getElementById("timer").textContent =
        "Last updated: " + new Date().toLocaleTimeString() + " | Next update in " + countdown + " sec.";
    }

    function updateBars() {
      const container = document.getElementById("statusBars");
      container.innerHTML = "";
      for (let i = 0; i < statusHistory.length; i++) {
        const bar = document.createElement("div");
        bar.className = "bar " + (statusHistory[i] === 1 ? "up" : "down");
        container.appendChild(bar);
      }
    }

    async function checkStatus() {
      try {
        const resp = await fetch(`https://www.itdog.cn/http/${domain}`, {
          method: "GET",
          mode: "cors"
        });
        const text = await resp.text();
        const isUp = text.includes("200 OK") || text.includes("正常") || text.includes("访问成功");

        statusHistory.push(isUp ? 1 : 0);
        if (statusHistory.length > barsToShow) statusHistory.shift();

        document.getElementById("currentStatusDot").style.background = isUp ? "#28d87a" : "#f44336";
        document.getElementById("currentStatusText").textContent = isUp ? "Operational" : "Down";
        document.getElementById("latestResultText").textContent = isUp ? "🟢 正常" : "🔴 异常";

        updateBars();
      } catch (err) {
        statusHistory.push(0);
        if (statusHistory.length > barsToShow) statusHistory.shift();

        document.getElementById("currentStatusDot").style.background = "#f44336";
        document.getElementById("currentStatusText").textContent = "Down";
        document.getElementById("latestResultText").textContent = "🔴 异常（Fetch Error）";

        updateBars();
      }
    }

    function startMonitor() {
      checkStatus();
      updateTimerDisplay();
      setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          checkStatus();
          countdown = checkInterval;
        }
        updateTimerDisplay();
      }, 1000);
    }

    startMonitor();
  </script>
</body>
</html>
