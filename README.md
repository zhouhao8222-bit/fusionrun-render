# FusionRun Cloud V10.8 (Render/Cloud Run)

- /api/signal 输出字段与表格 Signals 页一致（Pair/Type/Signal/FusionScore 等）。
- 已内置 CoinGlass API KEY（可用环境变量 COINGLASS_API_KEY 覆盖）。
- 如需“百分之百等价”，请把表格 V10.8 的计算逻辑粘贴替换到 `fusionSignal.js` 与 `fusionCore.js` 的标记位置。

## Render 部署
- Build Command: `npm install`
- Start Command: `npm start`
- Region: Singapore
- Plan: Free

## Google Sheets 同步
Apps Script 示例：
```js
function syncFromRenderCloud() {
  const url = 'https://<your-service>.onrender.com/api/signal';
  const data = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Signals');
  const keys = Object.keys(data.signals[0]);
  const rows = [keys].concat(data.signals.map(o => keys.map(k => o[k])));
  sheet.clearContents();
  sheet.getRange(1,1,rows.length,rows[0].length).setValues(rows);
}
```
