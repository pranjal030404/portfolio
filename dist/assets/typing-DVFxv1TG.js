import{s as H,a as R}from"./types-C8ad4B2y.js";const L="portfolio_typing_best_wpm",p=30,N=["Redis streams decouple ingestion from processing.","TCP devices send frames that must be parsed before storage.","Node.js handles the processing pipeline.","A checksum is cheaper than a corrupted position record.","The parser validates every frame before anything downstream sees it.","MongoDB stores the position history for route playback.","Socket.io pushes updates to the map as they arrive.","Trackers speak binary, not JSON.","A slow consumer should fall behind, not drop packets.","Express routes are thin; the interesting work happens below them."];function _(n){n.innerHTML=`
    <div class="g">
      <div class="g-board">
        <div class="g-type" data-text aria-hidden="true"></div>
        <label class="visually-hidden" for="typing-input">Type the text shown above</label>
        <input class="g-input" id="typing-input" type="text" autocomplete="off"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="Start typing to begin…">
      </div>

      <div class="g-side">
        <div>
          <dl class="g-stat"><dt>WPM</dt><dd data-wpm>0</dd></dl>
          <dl class="g-stat"><dt>Accuracy</dt><dd data-acc>100%</dd></dl>
          <dl class="g-stat"><dt>Time</dt><dd data-time>${p}</dd></dl>
          <dl class="g-stat"><dt>Best</dt><dd data-best>0</dd></dl>
        </div>
        <button class="g-btn" type="button" data-restart>Restart</button>
        <p class="g-hint" data-hint>Thirty seconds.<br>Mistakes count against accuracy.</p>
      </div>
    </div>
  `;const C=n.querySelector("[data-text]"),a=n.querySelector("input"),m=n.querySelector("[data-wpm]"),v=n.querySelector("[data-acc]"),w=n.querySelector("[data-time]"),x=n.querySelector("[data-best]"),h=n.querySelector("[data-hint]"),S=n.querySelector("[data-restart]");let r="",o=0,c=p,g=!1,l=0,f=0,d=H(L);x.textContent=String(d);const q=()=>{const t=[...N].sort(()=>Math.random()-.5);let e="";for(const s of t){if(e.length>190)break;e+=(e?" ":"")+s}return e},y=()=>{const t=a.value;let e="";for(let s=0;s<r.length;s+=1){const i=r[s]===" "?"&nbsp;":r[s];s<t.length?e+=t[s]===r[s]?`<b>${i}</b>`:`<span class="bad">${i}</span>`:s===t.length?e+=`<span class="at">${i}</span>`:e+=`<span>${i}</span>`}C.innerHTML=e},b=()=>{const t=a.value;let e=0;for(let u=0;u<t.length;u+=1)t[u]===r[u]&&(e+=1);const s=Math.max(1,p-c),i=Math.round(e/5/(s/60)),I=l===0?100:Math.max(0,Math.round((l-f)/l*100));return m.textContent=String(i),v.textContent=`${I}%`,i},T=()=>{window.clearInterval(o),o=0,a.disabled=!0;const t=b();t>d?(d=t,R(L,d),x.textContent=String(d),h.innerHTML=`New best — ${t} wpm.<br>Restart to try again.`):h.innerHTML=`Finished — ${t} wpm.<br>Restart to try again.`},$=()=>{g=!0,o=window.setInterval(()=>{c-=1,w.textContent=String(Math.max(0,c)),b(),c<=0&&T()},1e3)},M=()=>{g||$();const t=a.value;if(t.length>l){const e=t.length-1;l=t.length,t[e]!==r[e]&&(f+=1)}if(t.length>=r.length){y(),T();return}y(),b()},k=()=>{window.clearInterval(o),o=0,r=q(),c=p,g=!1,l=0,f=0,a.disabled=!1,a.value="",w.textContent=String(p),m.textContent="0",v.textContent="100%",h.innerHTML="Thirty seconds.<br>Mistakes count against accuracy.",y()},E=()=>{k(),a.focus()};return a.addEventListener("input",M),S.addEventListener("click",E),k(),{destroy(){window.clearInterval(o),o=0,a.removeEventListener("input",M),S.removeEventListener("click",E),n.innerHTML=""}}}export{_ as mount};
