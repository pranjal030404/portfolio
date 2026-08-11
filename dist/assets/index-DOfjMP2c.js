(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))c(d);new MutationObserver(d=>{for(const r of d)if(r.type==="childList")for(const y of r.addedNodes)y.tagName==="LINK"&&y.rel==="modulepreload"&&c(y)}).observe(document,{childList:!0,subtree:!0});function e(d){const r={};return d.integrity&&(r.integrity=d.integrity),d.referrerPolicy&&(r.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?r.credentials="include":d.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(d){if(d.ep)return;d.ep=!0;const r=e(d);fetch(d.href,r)}})();const Lt="918400095088",kt=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;function Ct(){const t=document.getElementById("theme"),n=document.querySelector('meta[name="theme-color"]'),e=localStorage.getItem("theme"),c=r=>{document.body.classList.toggle("light",r==="light"),t==null||t.setAttribute("aria-pressed",String(r==="light")),t==null||t.setAttribute("aria-label",r==="light"?"Switch to dark theme":"Switch to light theme"),n==null||n.setAttribute("content",r==="light"?"#f2ede3":"#16130f")},d=window.matchMedia("(prefers-color-scheme: light)").matches;c(e==="light"||e===null&&d?"light":"dark"),t==null||t.addEventListener("click",()=>{const r=document.body.classList.contains("light")?"dark":"light";c(r);try{localStorage.setItem("theme",r)}catch{}})}function Mt(){const t=document.getElementById("menu"),n=document.getElementById("nav");if(!t||!n)return;const e=()=>{n.classList.remove("open"),t.setAttribute("aria-expanded","false"),t.setAttribute("aria-label","Open menu")};t.addEventListener("click",()=>{const c=n.classList.toggle("open");t.setAttribute("aria-expanded",String(c)),t.setAttribute("aria-label",c?"Close menu":"Open menu")}),n.querySelectorAll("a").forEach(c=>c.addEventListener("click",e)),document.addEventListener("keydown",c=>{c.key==="Escape"&&e()})}function qt(){if(!("IntersectionObserver"in window))return;const t=Array.from(document.querySelectorAll('.nav a[href^="#"]')),n=t.map(c=>document.getElementById(c.getAttribute("href").slice(1))).filter(c=>!!c),e=new IntersectionObserver(c=>{c.forEach(d=>{d.isIntersecting&&t.forEach(r=>r.classList.toggle("on",r.getAttribute("href")===`#${d.target.id}`))})},{rootMargin:"-45% 0px -50% 0px"});n.forEach(c=>e.observe(c))}function At(){if(kt()||!("IntersectionObserver"in window))return;const t=Array.from(document.querySelectorAll(".system-head, .flow li, .about-top > *, .now > div, .record, .case, .mid, .minor li, .code-col, .group, .lab-row, .degree, .schooling, .contact-statement, .contact-grid > *")).filter(e=>e.getBoundingClientRect().top>window.innerHeight*.9);if(!t.length)return;t.forEach(e=>e.classList.add("rv"));const n=new IntersectionObserver(e=>{e.forEach(c=>{c.isIntersecting&&(c.target.classList.add("in"),n.unobserve(c.target))})},{threshold:.08,rootMargin:"0px 0px -4% 0px"});t.forEach(e=>n.observe(e))}function $t(){const t=document.getElementById("message-form"),n=document.getElementById("message-status");t&&t.addEventListener("submit",e=>{if(!t.checkValidity())return;e.preventDefault();const c=new FormData(t),d=String(c.get("name")??"").trim(),r=String(c.get("email")??"").trim(),y=String(c.get("text")??"").trim(),$=[d?`Hi Pranjal, I'm ${d}.`:"Hi Pranjal.",r?`Email: ${r}`:"",y].filter(Boolean).join(`
`);window.open(`https://wa.me/${Lt}?text=${encodeURIComponent($)}`,"_blank","noopener,noreferrer"),n&&(n.textContent="Opening WhatsApp…",window.setTimeout(()=>{n.textContent=""},4e3)),t.reset()})}function J(t){return getComputedStyle(document.body).getPropertyValue(t).trim()}function Q(t){const n=localStorage.getItem(t),e=n===null?NaN:Number(n);return Number.isFinite(e)?e:0}function z(t,n){try{localStorage.setItem(t,String(n))}catch{}}const it=28,nt=18,G=26,mt="portfolio_snake_high_score";function Tt(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${it*G}" height="${nt*G}"
                role="img" aria-label="Snake game board"></canvas>
        <div class="g-over" data-over>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action hidden></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
          <button class="g-btn" type="button" data-pause>Pause</button>
        </div>
      </div>

      <div class="g-pad">
        <button class="u" type="button" aria-label="Up">↑</button>
        <button class="l" type="button" aria-label="Left">←</button>
        <button class="d" type="button" aria-label="Down">↓</button>
        <button class="r" type="button" aria-label="Right">→</button>
      </div>

      <p class="g-hint">Arrow keys or WASD · Space to pause</p>
    </div>
  `;const n=t.querySelector("canvas"),e=n.getContext("2d"),c=t.querySelector("[data-over]"),d=t.querySelector("[data-over-title]"),r=t.querySelector("[data-over-note]"),y=t.querySelector("[data-over-action]"),$=t.querySelector("[data-score]"),T=t.querySelector("[data-best]"),g=t.querySelector("[data-restart]"),a=t.querySelector("[data-pause]"),b=t.querySelector(".g-pad");let l="ready",u=[],x={x:1,y:0},h=[],f={x:0,y:0},B=0,k=Q(mt),C=0,q=130;T.textContent=String(k);const I=()=>{window.clearInterval(C),C=0},_=()=>{I(),C=window.setInterval(F,q)},N=()=>{let v;do v={x:Math.floor(Math.random()*it),y:Math.floor(Math.random()*nt)};while(u.some(o=>o.x===v.x&&o.y===v.y));f=v},S=()=>{const v=J("--sunk"),o=J("--text"),s=J("--accent");e.fillStyle=v,e.fillRect(0,0,n.width,n.height),e.strokeStyle=s,e.lineWidth=2,e.strokeRect(f.x*G+5,f.y*G+5,G-10,G-10),u.forEach((W,O)=>{e.fillStyle=O===0?s:o,e.globalAlpha=O===0?1:Math.max(.3,1-O/(u.length+8)),e.fillRect(W.x*G+1,W.y*G+1,G-2,G-2)}),e.globalAlpha=1},E=()=>{S(),l==="playing"?c.hidden=!0:(c.hidden=!1,l==="ready"?(d.textContent="Ready",r.textContent="Press an arrow key to start",y.hidden=!0):l==="paused"?(d.textContent="Paused",r.textContent="Press Space to continue",y.hidden=!0):(d.textContent="Game over",r.textContent=`Score ${B}${B>0&&B===k?" — new best":""}`,y.textContent="Restart",y.hidden=!1)),a.disabled=l!=="playing"&&l!=="paused",a.textContent=l==="paused"?"Resume":"Pause"},R=()=>{I(),l="ready";const v=Math.floor(nt/2);u=[{x:6,y:v},{x:5,y:v},{x:4,y:v}],x={x:1,y:0},h=[],B=0,q=130,$.textContent="0",N(),E()},M=()=>{l="playing",E(),_()},A=()=>{I(),l="gameover",B>k&&(k=B,z(mt,k),T.textContent=String(k)),E()},P=()=>{l==="playing"?(I(),l="paused",E()):l==="paused"&&M()};function F(){const v=h.shift();v&&(x=v);const o={x:u[0].x+x.x,y:u[0].y+x.y};if(o.x<0||o.y<0||o.x>=it||o.y>=nt||u.some(s=>s.x===o.x&&s.y===o.y))return A();u.unshift(o),o.x===f.x&&o.y===f.y?(B+=1,$.textContent=String(B),q=Math.max(65,q-4),_(),N()):u.pop(),S()}const D=(v,o)=>{if(l==="gameover")return;if(l==="ready"){x={x:v,y:o},h=[],M();return}if(l!=="playing")return;const s=h.length?h[h.length-1]:x;s.x===-v&&s.y===-o||s.x===v&&s.y===o||h.length<2&&h.push({x:v,y:o})},i={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]},m=v=>{const o=v.key.length===1?v.key.toLowerCase():v.key;if(o===" "||o==="p"){(l==="playing"||l==="paused")&&(v.preventDefault(),P());return}const s=i[o];s&&((l==="ready"||l==="playing")&&v.preventDefault(),D(s[0],s[1]))},p=v=>{const o=v.target.closest("button");if(!o)return;const W={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[o.className];W&&D(W[0],W[1])},w=()=>R();return window.addEventListener("keydown",m),b.addEventListener("click",p),g.addEventListener("click",w),y.addEventListener("click",w),a.addEventListener("click",P),R(),{destroy(){I(),window.removeEventListener("keydown",m),b.removeEventListener("click",p),g.removeEventListener("click",w),y.removeEventListener("click",w),a.removeEventListener("click",P),t.innerHTML=""}}}const ht="portfolio_typing_best_wpm",tt=30,Bt=["Redis streams decouple ingestion from processing.","TCP devices send frames that must be parsed before storage.","Trackers speak binary, not JSON.","A checksum is cheaper than a corrupted position record.","The parser validates every frame before anything downstream sees it.","MongoDB stores the position history for route playback.","Socket.io pushes updates to the map as they arrive.","A slow consumer should fall behind, not drop packets.","Express routes are thin; the interesting work happens below them.","Geofence alerts fire on the way through the pipeline."];function It(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <p class="g-type" data-text aria-hidden="true"></p>
        <label class="visually-hidden" for="typing-input">Type the text shown above</label>
        <input class="g-input" id="typing-input" type="text" autocomplete="off"
               autocapitalize="off" autocorrect="off" spellcheck="false"
               placeholder="Start typing to begin…">
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>WPM</dt><dd data-wpm>0</dd></div>
          <div><dt>Accuracy</dt><dd data-acc>100%</dd></div>
          <div><dt>Time</dt><dd data-time>${tt}</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
        </div>
      </div>

      <p class="g-hint" data-hint>Thirty seconds. Mistakes count against accuracy.</p>
    </div>
  `;const n=t.querySelector("[data-text]"),e=t.querySelector("input"),c=t.querySelector("[data-wpm]"),d=t.querySelector("[data-acc]"),r=t.querySelector("[data-time]"),y=t.querySelector("[data-best]"),$=t.querySelector("[data-hint]"),T=t.querySelector("[data-restart]");let g="",a=0,b=tt,l=!1,u=0,x=0,h=Q(ht);y.textContent=String(h);const f=()=>{const S=[...Bt].sort(()=>Math.random()-.5);let E="";for(const R of S){if(E.length>150)break;E+=(E?" ":"")+R}return E},B=()=>{const S=e.value,E=[];for(let R=0;R<g.length;R+=1){const M=g[R];let A="";R<S.length?A=S[R]===M?"ok":"bad":R===S.length&&(A="at"),E.push(`<span${A?` class="${A}"`:""}>${M==="<"?"&lt;":M}</span>`)}n.innerHTML=E.join("")},k=()=>{const S=e.value;let E=0;for(let P=0;P<S.length;P+=1)S[P]===g[P]&&(E+=1);const R=Math.max(1,tt-b),M=Math.round(E/5/(R/60)),A=u===0?100:Math.max(0,Math.round((u-x)/u*100));return c.textContent=String(M),d.textContent=`${A}%`,M},C=()=>{window.clearInterval(a),a=0,e.disabled=!0;const S=k();S>h?(h=S,z(ht,h),y.textContent=String(h),$.textContent=`New best — ${S} wpm. Restart to try again.`):$.textContent=`Finished — ${S} wpm. Restart to try again.`},q=()=>{l=!0,a=window.setInterval(()=>{b-=1,r.textContent=String(Math.max(0,b)),k(),b<=0&&C()},1e3)},I=()=>{l||q();const S=e.value;if(S.length>u){const E=S.length-1;u=S.length,S[E]!==g[E]&&(x+=1)}if(B(),S.length>=g.length){C();return}k()},_=()=>{window.clearInterval(a),a=0,g=f(),b=tt,l=!1,u=0,x=0,e.disabled=!1,e.value="",r.textContent=String(tt),c.textContent="0",d.textContent="100%",$.textContent="Thirty seconds. Mistakes count against accuracy.",B()},N=()=>{_(),e.focus()};return e.addEventListener("input",I),T.addEventListener("click",N),_(),e.focus(),{destroy(){window.clearInterval(a),a=0,e.removeEventListener("input",I),T.removeEventListener("click",N),t.innerHTML=""}}}const ct="portfolio_reaction_best";function Rt(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <button class="g-target" type="button" data-target>
          <span class="g-target-head" data-headline>Ready</span>
          <span class="g-target-note" data-note>Click to start, then wait</span>
        </button>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Last</dt><dd data-last>—</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
          <div><dt>Attempts</dt><dd data-count>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-reset>Clear best</button>
        </div>
      </div>

      <p class="g-hint">Wait for the panel to change, then hit it as fast as you can.</p>
    </div>
  `;const n=t.querySelector("[data-target]"),e=t.querySelector("[data-headline]"),c=t.querySelector("[data-note]"),d=t.querySelector("[data-last]"),r=t.querySelector("[data-best]"),y=t.querySelector("[data-count]"),$=t.querySelector("[data-reset]");let T="idle",g=0,a=0,b=0,l=Q(ct);l>0&&(r.textContent=`${l} ms`);const u=()=>{T="armed",a=performance.now(),n.classList.add("armed"),e.textContent="Now",c.textContent="Hit it"},x=()=>{T="waiting",n.classList.remove("armed"),e.textContent="Wait",c.textContent="Not yet…",g=window.setTimeout(u,1200+Math.random()*2800)},h=()=>{window.clearTimeout(g),g=0,T="result",n.classList.remove("armed"),e.textContent="Too soon",c.textContent="Click to go again"},f=()=>{const q=Math.round(performance.now()-a);T="result",n.classList.remove("armed"),b+=1,y.textContent=String(b),d.textContent=`${q} ms`,e.textContent=`${q} ms`,l===0||q<l?(l=q,z(ct,l),r.textContent=`${q} ms`,c.textContent="Best so far — click to go again"):c.textContent="Click to go again"},B=()=>{T==="idle"||T==="result"?x():T==="waiting"?h():T==="armed"&&f()},k=()=>B(),C=()=>{l=0,b=0,z(ct,0),r.textContent="—",d.textContent="—",y.textContent="0"};return n.addEventListener("click",k),$.addEventListener("click",C),{destroy(){window.clearTimeout(g),g=0,n.removeEventListener("click",k),$.removeEventListener("click",C),t.innerHTML=""}}}const j=4,yt="portfolio_2048_best";function Pt(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <div class="grid grid-2048" data-grid role="grid" aria-label="2048 board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Arrow keys or WASD · swipe on touch</p>
    </div>
  `;const n=t.querySelector("[data-grid]"),e=t.querySelector("[data-over]"),c=t.querySelector("[data-over-title]"),d=t.querySelector("[data-over-note]"),r=t.querySelector("[data-over-action]"),y=t.querySelector("[data-score]"),$=t.querySelector("[data-best]"),T=t.querySelector("[data-new]");let g=[],a=0,b=Q(yt),l=!1,u=!1;$.textContent=String(b);const x=(i,m)=>g[i*j+m],h=(i,m,p)=>{g[i*j+m]=p},f=()=>{const i=[];g.forEach((m,p)=>{m===0&&i.push(p)}),i.length&&(g[i[Math.floor(Math.random()*i.length)]]=Math.random()<.9?2:4)},B=()=>{n.innerHTML=g.map(i=>`<div class="tile${i?` t${i>2048?"max":i}`:" t0"}" role="gridcell">${i||""}</div>`).join(""),y.textContent=String(a)},k=i=>{const m=i.filter(Boolean),p=[];let w=0;for(let v=0;v<m.length;v+=1)if(m[v]===m[v+1]){const o=m[v]*2;p.push(o),w+=o,o===2048&&(u=!0),v+=1}else p.push(m[v]);for(;p.length<j;)p.push(0);return{out:p,gained:w}},C=(i,m)=>{const p=[];for(let w=0;w<j;w+=1)m==="left"?p.push(x(i,w)):m==="right"?p.push(x(i,j-1-w)):m==="up"?p.push(x(w,i)):p.push(x(j-1-w,i));return p},q=(i,m,p)=>{for(let w=0;w<j;w+=1)m==="left"?h(i,w,p[w]):m==="right"?h(i,j-1-w,p[w]):h(m==="up"?w:j-1-w,i,p[w])},I=i=>{if(l)return;const m=g.join(",");let p=0;for(let w=0;w<j;w+=1){const v=k(C(w,i));p+=v.gained,q(w,i,v.out)}g.join(",")!==m&&(a+=p,a>b&&(b=a,z(yt,b),$.textContent=String(b)),f(),B(),N())},_=()=>{if(g.includes(0))return!0;for(let i=0;i<j;i+=1)for(let m=0;m<j;m+=1){const p=x(i,m);if(m+1<j&&x(i,m+1)===p||i+1<j&&x(i+1,m)===p)return!0}return!1},N=()=>{if(u){u=!1,c.textContent="2048",d.textContent=`Reached it at ${a} points`,r.textContent="Keep going",e.hidden=!1;return}_()||(l=!0,c.textContent="No moves left",d.textContent=`Score ${a}`,r.textContent="New game",e.hidden=!1)},S=()=>{g=new Array(j*j).fill(0),a=0,l=!1,u=!1,e.hidden=!0,f(),f(),B()},E={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down",a:"left",d:"right",w:"up",s:"down"},R=i=>{const m=i.key.length===1?i.key.toLowerCase():i.key,p=E[m];p&&(i.preventDefault(),I(p))};let M=0,A=0;const P=i=>{M=i.clientX,A=i.clientY},F=i=>{const m=i.clientX-M,p=i.clientY-A;Math.abs(m)<24&&Math.abs(p)<24||I(Math.abs(m)>Math.abs(p)?m>0?"right":"left":p>0?"down":"up")},D=()=>{l?S():e.hidden=!0};return window.addEventListener("keydown",R),n.addEventListener("pointerdown",P),n.addEventListener("pointerup",F),T.addEventListener("click",S),r.addEventListener("click",D),S(),{destroy(){window.removeEventListener("keydown",R),n.removeEventListener("pointerdown",P),n.removeEventListener("pointerup",F),T.removeEventListener("click",S),r.removeEventListener("click",D),t.innerHTML=""}}}const X=9,ot=10,bt="portfolio_minesweeper_best_time";function _t(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <div class="grid grid-mines" data-grid role="grid" aria-label="Minesweeper board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action>New game</button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Mines</dt><dd data-mines>${ot}</dd></div>
          <div><dt>Time</dt><dd data-time>0</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Click to reveal · right click or long press to flag</p>
    </div>
  `;const n=t.querySelector("[data-grid]"),e=t.querySelector("[data-over]"),c=t.querySelector("[data-over-title]"),d=t.querySelector("[data-over-note]"),r=t.querySelector("[data-over-action]"),y=t.querySelector("[data-mines]"),$=t.querySelector("[data-time]"),T=t.querySelector("[data-best]"),g=t.querySelector("[data-new]");let a=[],b=!1,l=!1,u=0,x=0,h=Q(bt),f=0;h>0&&(T.textContent=`${h}s`);const B=(o,s)=>o*X+s,k=(o,s)=>o>=0&&s>=0&&o<X&&s<X,C=o=>{const s=Math.floor(o/X),W=o%X,O=[];for(let Y=-1;Y<=1;Y+=1)for(let K=-1;K<=1;K+=1)!Y&&!K||k(s+Y,W+K)&&O.push(B(s+Y,W+K));return O},q=o=>{const s=new Set([o,...C(o)]);let W=0;for(;W<ot;){const O=Math.floor(Math.random()*a.length);s.has(O)||a[O].mine||(a[O].mine=!0,W+=1)}a.forEach((O,Y)=>{O.near=C(Y).filter(K=>a[K].mine).length}),b=!0},I=()=>{window.clearInterval(x),x=0},_=()=>{I(),x=window.setInterval(()=>{u+=1,$.textContent=String(u)},1e3)},N=()=>a.filter(o=>o.flag).length,S=()=>{n.innerHTML=a.map((o,s)=>`<button class="tile" type="button" data-i="${s}"
             aria-label="cell ${Math.floor(s/X)+1}, ${s%X+1}"></button>`).join("")},E=()=>{const o=n.children;a.forEach((s,W)=>{const O=o[W];if(!O)return;const Y=["tile"];let K="";s.open?(Y.push("open"),s.mine?(Y.push("mine"),K="✳"):s.near&&(Y.push(`n${s.near}`),K=String(s.near))):s.flag&&(Y.push("flag"),K="⚑"),O.className=Y.join(" "),O.textContent=K}),y.textContent=String(ot-N())},R=o=>{const s=a[o];s.open||s.flag||(s.open=!0,!s.mine&&s.near===0&&C(o).forEach(R))},M=o=>{l=!0,I(),a.forEach(s=>{s.mine&&(s.open=!0)}),E(),o?(c.textContent="Cleared",h===0||u<h?(h=u,z(bt,h),T.textContent=`${h}s`,d.textContent=`${u}s — new best`):d.textContent=`${u}s`):(c.textContent="Hit a mine",d.textContent=`After ${u}s`),e.hidden=!1},A=()=>{a.filter(s=>!s.open).length===ot&&M(!0)},P=o=>{l||a[o].flag||(b||(q(o),_()),R(o),E(),a[o].mine?M(!1):A())},F=o=>{l||a[o].open||(a[o].flag=!a[o].flag,E())},D=()=>{I(),a=Array.from({length:X*X},()=>({mine:!1,near:0,open:!1,flag:!1})),b=!1,l=!1,u=0,$.textContent="0",e.hidden=!0,S(),E()},i=o=>{const s=o.target.closest("button[data-i]");return s?Number(s.dataset.i):-1},m=o=>{const s=i(o);s>=0&&P(s)},p=o=>{o.preventDefault();const s=i(o);s>=0&&F(s)},w=o=>{if(o.pointerType==="mouse")return;const s=i(o);s<0||(f=window.setTimeout(()=>{f=0,F(s)},450))},v=()=>{f&&(window.clearTimeout(f),f=0)};return n.addEventListener("click",m),n.addEventListener("contextmenu",p),n.addEventListener("pointerdown",w),n.addEventListener("pointerup",v),n.addEventListener("pointercancel",v),g.addEventListener("click",D),r.addEventListener("click",D),D(),{destroy(){I(),v(),n.removeEventListener("click",m),n.removeEventListener("contextmenu",p),n.removeEventListener("pointerdown",w),n.removeEventListener("pointerup",v),n.removeEventListener("pointercancel",v),g.removeEventListener("click",D),r.removeEventListener("click",D),t.innerHTML=""}}}const U=720,V=480,lt=9,Nt=5,wt="portfolio_breakout_high_score";function Ht(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${U}" height="${V}"
                role="img" aria-label="Breakout game board"></canvas>
        <div class="g-over" data-over>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action hidden></button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Score</dt><dd data-score>0</dd></div>
          <div><dt>Lives</dt><dd data-lives>3</dd></div>
          <div><dt>Level</dt><dd data-level>1</dd></div>
          <div><dt>Best</dt><dd data-best>0</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-restart>Restart</button>
          <button class="g-btn" type="button" data-pause>Pause</button>
        </div>
      </div>

      <p class="g-hint">Arrow keys or A / D · drag on touch · Space to pause</p>
    </div>
  `;const n=t.querySelector("canvas"),e=n.getContext("2d"),c=t.querySelector("[data-over]"),d=t.querySelector("[data-over-title]"),r=t.querySelector("[data-over-note]"),y=t.querySelector("[data-over-action]"),$=t.querySelector("[data-score]"),T=t.querySelector("[data-lives]"),g=t.querySelector("[data-level]"),a=t.querySelector("[data-best]"),b=t.querySelector("[data-restart]"),l=t.querySelector("[data-pause]"),u=110,x=12,h=8;let f="ready",B=0,k=[],C=(U-u)/2,q=U/2,I=V-60,_=4,N=-4,S=0,E=3,R=1,M=Q(wt),A=!1,P=!1;a.textContent=String(M);const F=Math.floor((U-60)/lt),D=20,i=()=>{k=[];for(let L=0;L<Nt;L+=1)for(let H=0;H<lt;H+=1)k.push({x:30+H*F,y:50+L*(D+8),alive:!0})},m=()=>{const L=J("--sunk"),H=J("--text"),Z=J("--accent"),et=J("--border");e.fillStyle=L,e.fillRect(0,0,U,V),k.forEach((at,xt)=>{if(!at.alive)return;const rt=Math.floor(xt/lt);e.fillStyle=rt===0?Z:H,e.globalAlpha=rt===0?1:Math.max(.35,.85-rt*.14),e.fillRect(at.x+1,at.y,F-6,D)}),e.globalAlpha=1,e.fillStyle=Z,e.fillRect(C,V-28,u,x),e.beginPath(),e.arc(q,I,h,0,Math.PI*2),e.fillStyle=H,e.fill(),e.strokeStyle=et,e.lineWidth=1,e.strokeRect(.5,.5,U-1,V-1)},p=()=>{m(),f==="playing"?c.hidden=!0:(c.hidden=!1,f==="ready"?(d.textContent="Ready",r.textContent="Press an arrow key to start",y.hidden=!0):f==="paused"?(d.textContent="Paused",r.textContent="Press Space to continue",y.hidden=!0):(d.textContent=E>0?"Cleared":"Game over",r.textContent=`Score ${S}`,y.textContent="Restart",y.hidden=!1)),l.disabled=f!=="playing"&&f!=="paused",l.textContent=f==="paused"?"Resume":"Pause"},w=()=>{B&&cancelAnimationFrame(B),B=0},v=()=>{q=U/2,I=V-60,_=4*(Math.random()>.5?1:-1),N=-4,C=(U-u)/2},o=()=>{w(),f="gameover",S>M&&(M=S,z(wt,M),a.textContent=String(M)),p()},s=()=>{R+=1,g.textContent=String(R),i(),v(),_*=1.1,N*=1.1},W=()=>{if(A&&(C-=8),P&&(C+=8),C=Math.max(0,Math.min(U-u,C)),q+=_,I+=N,(q<h||q>U-h)&&(_=-_),I<h&&(N=-N),I>V-28-h&&I<V-28+x&&q>C&&q<C+u&&N>0){N=-Math.abs(N);const L=(q-(C+u/2))/(u/2);_=Math.max(-7,Math.min(7,_+L*2.5))}for(const L of k)if(L.alive&&q>L.x&&q<L.x+F-6&&I>L.y&&I<L.y+D){L.alive=!1,N=-N,S+=10,$.textContent=String(S);break}if(!k.some(L=>L.alive)){if(R>=3)return o();s()}if(I>V+h){if(E-=1,T.textContent=String(Math.max(0,E)),E<=0)return o();v(),f="ready",p();return}m(),B=requestAnimationFrame(W)},O=()=>{f!=="playing"&&(f="playing",p(),w(),B=requestAnimationFrame(W))},Y=()=>{f==="playing"?(w(),f="paused",p()):f==="paused"&&O()},K=()=>{w(),f="ready",S=0,E=3,R=1,$.textContent="0",T.textContent="3",g.textContent="1",i(),v(),p()},dt=L=>{const H=L.key.length===1?L.key.toLowerCase():L.key;if(H===" "||H==="p"){(f==="playing"||f==="paused")&&(L.preventDefault(),Y());return}const Z=H==="ArrowLeft"||H==="a",et=H==="ArrowRight"||H==="d";!Z&&!et||((f==="ready"||f==="playing")&&L.preventDefault(),Z&&(A=!0),et&&(P=!0),f==="ready"&&O())},ut=L=>{const H=L.key.length===1?L.key.toLowerCase():L.key;(H==="ArrowLeft"||H==="a")&&(A=!1),(H==="ArrowRight"||H==="d")&&(P=!1)},ft=L=>{const H=n.getBoundingClientRect(),Z=(L-H.left)*(U/H.width);C=Math.max(0,Math.min(U-u,Z-u/2)),f==="ready"?O():f!=="playing"&&m()};let st=!1;const vt=L=>{st=!0,ft(L.clientX)},gt=L=>{st&&ft(L.clientX)},pt=()=>{st=!1};return window.addEventListener("keydown",dt),window.addEventListener("keyup",ut),n.addEventListener("pointerdown",vt),n.addEventListener("pointermove",gt),window.addEventListener("pointerup",pt),b.addEventListener("click",K),y.addEventListener("click",K),l.addEventListener("click",Y),K(),{destroy(){w(),window.removeEventListener("keydown",dt),window.removeEventListener("keyup",ut),n.removeEventListener("pointerdown",vt),n.removeEventListener("pointermove",gt),window.removeEventListener("pointerup",pt),b.removeEventListener("click",K),y.removeEventListener("click",K),l.removeEventListener("click",Y),t.innerHTML=""}}}const St="portfolio_memory_best_moves",Et=["{ }","[ ]","< >","( )","/","\\","+","="];function Ot(t){t.innerHTML=`
    <div class="g">
      <div class="g-board">
        <div class="grid grid-memory" data-grid role="grid" aria-label="Memory board"></div>
        <div class="g-over" data-over hidden>
          <strong data-over-title></strong>
          <p data-over-note></p>
          <button class="g-btn" type="button" data-over-action>Play again</button>
        </div>
      </div>

      <div class="g-meta">
        <dl class="g-stats">
          <div><dt>Moves</dt><dd data-moves>0</dd></div>
          <div><dt>Time</dt><dd data-time>0</dd></div>
          <div><dt>Best</dt><dd data-best>—</dd></div>
        </dl>
        <div class="g-actions">
          <button class="g-btn" type="button" data-new>New game</button>
        </div>
      </div>

      <p class="g-hint">Find the eight pairs in as few moves as you can</p>
    </div>
  `;const n=t.querySelector("[data-grid]"),e=t.querySelector("[data-over]"),c=t.querySelector("[data-over-title]"),d=t.querySelector("[data-over-note]"),r=t.querySelector("[data-over-action]"),y=t.querySelector("[data-moves]"),$=t.querySelector("[data-time]"),T=t.querySelector("[data-best]"),g=t.querySelector("[data-new]");let a=[],b=[],l=new Set,u=0,x=0,h=0,f=0,B=!1,k=Q(St);k>0&&(T.textContent=String(k));const C=()=>{window.clearInterval(h),h=0},q=()=>{C(),h=window.setInterval(()=>{x+=1,$.textContent=String(x)},1e3)},I=()=>{n.innerHTML=a.map((M,A)=>`<button class="card" type="button" data-i="${A}"></button>`).join("")},_=()=>{const M=n.children;a.forEach((A,P)=>{const F=M[P];if(!F)return;const D=b.includes(P)||l.has(P);F.className=`card${D?" up":""}${l.has(P)?" done":""}`,F.textContent=D?A:"",F.setAttribute("aria-label",D?`card ${A}`:"hidden card")}),y.textContent=String(u)},N=()=>{C(),c.textContent="Cleared",k===0||u<k?(k=u,z(St,k),T.textContent=String(k),d.textContent=`${u} moves in ${x}s — new best`):d.textContent=`${u} moves in ${x}s`,e.hidden=!1},S=M=>{if(f||l.has(M)||b.includes(M)||b.length===2||(B||(B=!0,q()),b.push(M),_(),b.length<2))return;u+=1,y.textContent=String(u);const[A,P]=b;if(a[A]===a[P]){l.add(A),l.add(P),b=[],_(),l.size===a.length&&N();return}f=window.setTimeout(()=>{f=0,b=[],_()},700)},E=()=>{C(),window.clearTimeout(f),f=0,a=[...Et,...Et].sort(()=>Math.random()-.5),b=[],l=new Set,u=0,x=0,B=!1,$.textContent="0",e.hidden=!0,I(),_()},R=M=>{const A=M.target.closest("button[data-i]");A&&S(Number(A.dataset.i))};return n.addEventListener("click",R),g.addEventListener("click",E),r.addEventListener("click",E),E(),{destroy(){C(),window.clearTimeout(f),f=0,n.removeEventListener("click",R),g.removeEventListener("click",E),r.removeEventListener("click",E),t.innerHTML=""}}}const Dt={snake:{title:"Snake",mount:Tt},typing:{title:"Typing",mount:It},reaction:{title:"Reaction",mount:Rt},2048:{title:"2048",mount:Pt},minesweeper:{title:"Minesweeper",mount:_t},breakout:{title:"Breakout",mount:Ht},memory:{title:"Memory",mount:Ot}};function Kt(){const t=document.getElementById("lab-stage"),n=document.getElementById("stage-body"),e=document.getElementById("stage-title"),c=document.getElementById("stage-close"),d=Array.from(document.querySelectorAll(".lab-play"));if(!t||!n||!e||!c||!d.length)return;let r=null,y=null;const $=(g=!0)=>{r==null||r.destroy(),r=null,n.textContent="",t.hidden=!0,d.forEach(a=>a.setAttribute("aria-expanded","false")),g&&(y==null||y.focus()),y=null},T=(g,a)=>{const b=Dt[g];b&&($(!1),y=a,e.textContent=b.title,t.hidden=!1,a.setAttribute("aria-expanded","true"),n.textContent="",r=b.mount(n),n.contains(document.activeElement)||e.focus(),t.scrollIntoView({block:"nearest"}))};d.forEach(g=>{g.addEventListener("click",()=>{const a=g.dataset.game??"";y===g?$():T(a,g)})}),c.addEventListener("click",()=>$()),document.addEventListener("keydown",g=>{g.key==="Escape"&&!t.hidden&&$()})}Ct();Mt();qt();At();$t();Kt();
