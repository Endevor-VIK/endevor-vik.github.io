/* Offline review UI smoke; original native frames are not edited. */
const fs=require('fs'),path=require('path');const {chromium}=require('playwright');let browser;
(async()=>{const checks=[];try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage();await page.goto('file://'+path.join(__dirname,'REVIEW.html'));
 for(const width of ['1440','1920','390','360'])for(const scene of ['surfaces','work','doctrine','aftermath','world','characters','work02','work03','work05'])for(const arm of ['before','current','aplus']){
  await page.selectOption('#vp',width);await page.selectOption('#scene',scene);await page.locator(`[data-arm="${arm}"]`).click();await page.locator('#frame').evaluate(i=>i.decode());
  const state=await page.evaluate(()=>{const i=document.getElementById('frame');return {w:i.naturalWidth,displayed:i.getBoundingClientRect().width,link:document.getElementById('native').getAttribute('href'),src:i.getAttribute('src'),segments:document.getElementById('segment').options.length};});checks.push({width,scene,arm,pass:state.w===Number(width)&&state.displayed===Number(width)&&state.link===state.src&&state.segments>0});
 }
 for(const scene of ['work02-disclosure','work03-disclosure','work05-disclosure']){await page.selectOption('#scene',scene);checks.push({scene,pass:await page.locator('[data-arm="current"]').getAttribute('aria-pressed')==='true'});}
 const report={kind:'R1P_OFFLINE_NATIVE_REVIEW_ROUTER',checks,summary:{checks:checks.length,failed:checks.filter(c=>!c.pass)}};fs.writeFileSync(path.join(__dirname,'review-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));if(report.summary.failed.length)process.exitCode=1;
 }finally{if(browser)await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
