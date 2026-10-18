import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.resolve('docs/Software_Engineering_DA2_Testing_Report.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });

  const pdfPath = path.resolve('docs/Software_Engineering_DA2_Testing_Report.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: {
      top: '1in',
      bottom: '1in',
      left: '1in',
      right: '1in',
    },
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF successfully generated at: ${pdfPath}`);
})();
