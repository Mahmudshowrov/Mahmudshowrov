const { chromium } = require('playwright');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch();
  for (const [scale, name] of [[1,'linkedin-banner-1584x396.png'],[2,'linkedin-banner-3168x792@2x.png']]) {
    const p = await b.newPage({ viewport:{width:1584,height:396}, deviceScaleFactor: scale });
    await p.goto('file://' + dir + '/banner.html'); await p.evaluate(()=>document.fonts.ready);
    const w = await p.evaluate(()=>{const r=document.querySelector('.t').getBoundingClientRect();return [r.left,r.right]});
    if (scale===1) console.log('line1 x-range', w);
    await p.locator('#banner').screenshot({ path: dir + '/' + name });
    if (scale===1) {
      // preview with simulated profile photo position (desktop overlap)
      await p.evaluate(()=>{const c=document.createElement('div');c.style.cssText='position:absolute;left:24px;top:230px;width:300px;height:300px;border-radius:50%;background:#bbb;border:6px solid #fff;opacity:.9';document.getElementById('banner').appendChild(c)});
      await p.locator('#banner').screenshot({ path: dir + '/preview-with-photo-overlap.png' });
    }
    await p.close();
  }
  await b.close();
})();
