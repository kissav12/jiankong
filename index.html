<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>18mh Status</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Inter', sans-serif;
      background: #f9f9f9;
      color: #121212;
    }
    header {
      background: #0b1120;
      color: white;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 { margin: 0; font-size: 1.8rem; }
    header small { font-size: 0.9rem; color: #ccc; }
    .status-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.05);
      margin: 2rem auto;
      padding: 2rem;
      max-width: 900px;
      text-align: center;
    }
    .status-card h2 {
      margin-top: 0.5rem;
      font-size: 1.6rem;
    }
    .dot {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #34d399;
      display: inline-block;
      vertical-align: middle;
    }
    .services {
      margin: 3rem auto;
      max-width: 900px;
    }
    .service-box {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.05);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
    .bar {
      display: flex;
      margin-top: 1rem;
      gap: 2px;
      flex-wrap: wrap;
    }
    .bar div {
      width: 6px;
      height: 20px;
      background: #64748b;
      border-radius: 2px;
    }
    .bar div.active {
      background: #34d399;
    }
  </style>
</head>
<body>
  <header>
    <h1>18mh</h1>
    <div>
      <div style="text-align:right;">
        <div><strong>Service status</strong></div>
        <small id="timeInfo">Last updated --:--:-- | Next update in 300 sec.</small>
      </div>
    </div>
  </header>

  <div class="status-card">
    <div class="dot"></div>
    <h2>All systems <span style="color:#34d399">Operational</span></h2>
  </div>

  <div class="services">
    <div class="service-box">
      <div class="service-header">
        <span>18mh.net &rarr; | <span style="color:#22c55e">100.00%</span></span>
        <span style="color:#22c55e">&#x2022; Operational</span>
      </div>
      <div class="bar" id="barArea"></div>
    </div>
  </div>

  <script>
    const barArea = document.getElementById('barArea');
    const timeInfo = document.getElementById('timeInfo');
    const MAX_BARS = 60; // 5分钟一个，共最多300分钟 = 5小时记录
    let logs = [];
    let countdown = 300;

    function drawBars() {
      barArea.innerHTML = '';
      logs.slice(-MAX_BARS).forEach(val => {
        const div = document.createElement('div');
        if (val === 'up') div.classList.add('active');
        barArea.appendChild(div);
      });
    }

    async function checkService() {
      const now = new Date();
      timeInfo.textContent = `Last updated ${now.toLocaleTimeString()} | Next update in ${countdown} sec.`;
      try {
        const res = await fetch("https://quiet-meadow-d19c.mqqmengqiqi.workers.dev");
        const json = await res.json();
        const status = json.monitors?.[0]?.status === 2 ? 'up' : 'down';
        logs.push(status);
        if (logs.length > MAX_BARS) logs.shift();
        drawBars();
      } catch {
        logs.push('down');
        if (logs.length > MAX_BARS) logs.shift();
        drawBars();
      }
    }

    function updateTimer() {
      countdown--;
      const now = new Date();
      timeInfo.textContent = `Last updated ${now.toLocaleTimeString()} | Next update in ${countdown} sec.`;
      if (countdown <= 0) {
        countdown = 300;
        checkService();
      }
    }

    // 初始化
    checkService();
    setInterval(updateTimer, 1000);
  </script>
</body>
</html>
