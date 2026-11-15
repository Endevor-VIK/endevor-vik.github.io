#!/usr/bin/env node
'use strict';
// Two fixed evidence captures, overwritten on repeat; 8 MiB ceiling, no traces/video.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const OUT=__dirname,BASE='https://endevor-vik.github.io/',SHA='bfdc1911a59efd46cb6230eb207f873a93d87c94';
const options={headless:true},proxy=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;
if(proxy){const p=new URL(proxy);options.proxy={server:p.protocol+'//'+p.host};if(p.username)options.proxy.username=decodeURIComponent(p.username);if(p.password)options.proxy.password=decodeURIComponent(p.password)}
(async()=>{const browser=await chromium.launch(options),results=[];try{
 for(const [lang,width,height] of [['ru',390,844],['en',1440,900]]){
  const context=await browser.newContext({locale:lang,viewport:{width,height},reducedMotion:'reduce'});
  try{await context.addInitScript(()=>sessionStorage.setItem('axiom_loader_seen','1'));const page=await context.newPage();
   await page.goto(BASE+'?lang='+lang+'&release='+SHA,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>{const e=document.querySelector('#manifesto');scrollTo({top:e.getBoundingClientRect().top+scrollY-70,behavior:'instant'})});
   await page.waitForFunction(()=>{const i=document.querySelector('#manifesto .ax-chapter-plate img');return i.complete&&i.naturalWidth>0},{},{timeout:25000});
   await page.evaluate(()=>document.querySelector('#manifesto .ax-chapter-plate img').decode());
   const state=await page.evaluate(()=>{const i=document.querySelector('#manifesto .ax-chapter-plate img');return{lang:document.documentElement.lang,image:i.currentSrc,naturalWidth:i.naturalWidth,opacity:getComputedStyle(i).opacity,headline:document.querySelector('#ax-history-title').innerText}});
   if(state.lang!==lang||Number(state.opacity)!==1)throw Error(JSON.stringify(state));
   const data=await page.screenshot({animations:'disabled'}),name=`settled-${lang}-${width}-black-sun.png`;
   if(data.length>8*1024*1024)throw Error('Capture budget');fs.writeFileSync(path.join(OUT,name),data);
   results.push({status:'PASS',...state,capture:name,sha256:crypto.createHash('sha256').update(data).digest('hex')});
  }finally{await context.close()}
 }
 fs.writeFileSync(path.join(OUT,'settled-visual.json'),JSON.stringify({time:new Date().toISOString(),target:BASE,source_sha:SHA,engine:browser.version(),results},null,2)+'\n');
 console.log('Settled public media: '+results.length+' PASS');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
