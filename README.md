project/
├── api/
│   └── itdog-monitor.js
├── package.json
├── vercel.json
├── README.md

// api/itdog-monitor.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const url = 'https://www.itdog.cn/http/';
  const testDomain = 'https://2887.temsxpom.cc/';

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  try {
    await page.goto(url);
    await page.type('input[type=text]', testDomain);
    await page.click('button:has-text("快速测试")');

    // 等待测试结果出现
    await page.waitForSelector('.fail-count', { timeout: 15000 });

    const result = await page.evaluate(() => {
      const failEl = document.querySelector('.fail-count');
      const failCount = parseInt(failEl?.textContent ?? '0');
      const availability = 100 - failCount;
      return {
        failCount,
        availability: availability < 0 ? 0 : availability,
      };
    });

    await browser.close();
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    await browser.close();
    return res.status(500).json({ success: false, error: err.message });
  }
}

// package.json
{
  "name": "itdog-monitor",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "puppeteer": "^21.3.8"
  }
}

// vercel.json
{
  "functions": {
    "api/itdog-monitor.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}

// README.md
# itdog-monitor

使用 Puppeteer 抓取 itdog.cn 网站监控状态，部署于 Vercel。

## API Endpoint

```
GET https://your-project.vercel.app/api/itdog-monitor
```

## 返回格式

```json
{
  "success": true,
  "data": {
    "failCount": 5,
    "availability": 95
  }
}
```

## 注意事项
- 默认测试 https://2887.temsxpom.cc/
- 可修改 `itdog-monitor.js` 中的 `testDomain`
- 运行 Puppeteer 需要无沙箱参数
