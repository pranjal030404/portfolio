import{s as L,a as f}from"./types-C8ad4B2y.js";const c="portfolio_reaction_best";function T(e){e.innerHTML=`
    <div class="g">
      <div class="g-board">
        <div class="g-target" data-target role="button" tabindex="0"
             aria-label="Reaction target — activate to start, then activate again when it changes">
          <strong data-headline>Start</strong>
          <span data-note>Click or press Enter, then wait</span>
        </div>
      </div>

      <div class="g-side">
        <div>
          <dl class="g-stat"><dt>Last</dt><dd data-last>—</dd></dl>
          <dl class="g-stat"><dt>Best</dt><dd data-best>—</dd></dl>
          <dl class="g-stat"><dt>Attempts</dt><dd data-count>0</dd></dl>
        </div>
        <button class="g-btn" type="button" data-reset>Clear best</button>
        <p class="g-hint">Wait for the panel to change,<br>then hit it as fast as you can.</p>
      </div>
    </div>
  `;const n=e.querySelector("[data-target]"),o=e.querySelector("[data-headline]"),r=e.querySelector("[data-note]"),m=e.querySelector("[data-last]"),i=e.querySelector("[data-best]"),u=e.querySelector("[data-count]"),g=e.querySelector("[data-reset]");let a="idle",d=0,v=0,l=0,s=L(c);s>0&&(i.textContent=`${s}ms`);const y=()=>{a="armed",v=performance.now(),n.classList.add("armed"),o.textContent="Now",r.textContent="Hit it"},b=()=>{a="waiting",n.classList.remove("armed"),o.textContent="Wait",r.textContent="Not yet…",d=window.setTimeout(y,1200+Math.random()*2800)},h=()=>{window.clearTimeout(d),d=0,a="result",n.classList.remove("armed"),o.textContent="Too soon",r.textContent="Go again"},E=()=>{const t=Math.round(performance.now()-v);a="result",n.classList.remove("armed"),l+=1,u.textContent=String(l),m.textContent=`${t}ms`,s===0||t<s?(s=t,f(c,s),i.textContent=`${t}ms`,o.textContent=`${t}ms`,r.textContent="Best so far — go again"):(o.textContent=`${t}ms`,r.textContent="Go again")},x=()=>{a==="idle"||a==="result"?b():a==="waiting"?h():a==="armed"&&E()},C=t=>{t.preventDefault(),x()},p=t=>{t.key!=="Enter"&&t.key!==" "||(t.preventDefault(),x())},w=()=>{s=0,l=0,f(c,0),i.textContent="—",m.textContent="—",u.textContent="0"};return n.addEventListener("pointerdown",C),n.addEventListener("keydown",p),g.addEventListener("click",w),{destroy(){window.clearTimeout(d),d=0,n.removeEventListener("pointerdown",C),n.removeEventListener("keydown",p),g.removeEventListener("click",w),e.innerHTML=""}}}export{T as mount};
