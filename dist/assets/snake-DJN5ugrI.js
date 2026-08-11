import{s as Y,t as w,a as B}from"./types-C8ad4B2y.js";const E=24,p=18,l=20,N="portfolio_snake_high_score";function F(r){r.innerHTML=`
    <div class="g">
      <div class="g-board">
        <canvas class="g-canvas" width="${E*l}" height="${p*l}"
                role="img" aria-label="Snake game board"></canvas>
        <div class="g-over" hidden>
          <strong data-over-title>Ready</strong>
          <p data-over-note>Press an arrow key to start</p>
        </div>
        <div class="g-pad">
          <button class="u" type="button" aria-label="Up">↑</button>
          <button class="l" type="button" aria-label="Left">←</button>
          <button class="d" type="button" aria-label="Down">↓</button>
          <button class="r" type="button" aria-label="Right">→</button>
        </div>
      </div>

      <div class="g-side">
        <div>
          <dl class="g-stat"><dt>Score</dt><dd data-score>0</dd></dl>
          <dl class="g-stat"><dt>Best</dt><dd data-best>0</dd></dl>
        </div>
        <button class="g-btn" type="button" data-restart>Restart</button>
        <p class="g-hint">Arrow keys or WASD.<br>Space pauses.</p>
      </div>
    </div>
  `;const y=r.querySelector("canvas"),s=y.getContext("2d"),b=r.querySelector(".g-over"),L=r.querySelector("[data-over-title]"),O=r.querySelector("[data-over-note]"),C=r.querySelector("[data-score]"),A=r.querySelector("[data-best]");let i=[],v={x:1,y:0},d=[],g={x:0,y:0},c=0,f=Y(N),a=0,u=130,n="idle";A.textContent=String(f);const R=()=>{let t;do t={x:Math.floor(Math.random()*E),y:Math.floor(Math.random()*p)};while(i.some(e=>e.x===t.x&&e.y===t.y));g=t},x=()=>{const t=Math.floor(p/2);i=[{x:6,y:t},{x:5,y:t},{x:4,y:t}],v={x:1,y:0},d=[],c=0,u=130,C.textContent="0",R(),m()},m=()=>{const t=w("--sunk"),e=w("--text"),o=w("--accent"),h=w("--border");s.fillStyle=t,s.fillRect(0,0,y.width,y.height),s.strokeStyle=o,s.lineWidth=2,s.strokeRect(g.x*l+4,g.y*l+4,l-8,l-8),i.forEach((K,k)=>{s.fillStyle=k===0?o:e,s.globalAlpha=k===0?1:Math.max(.35,1-k/(i.length+6)),s.fillRect(K.x*l+1,K.y*l+1,l-2,l-2)}),s.globalAlpha=1,n==="paused"&&(s.fillStyle=h,s.font="12px ui-monospace, monospace",s.textAlign="center",s.fillText("PAUSED",y.width/2,y.height/2))},q=()=>{n="over",window.clearInterval(a),a=0,c>f?(f=c,B(N,f),A.textContent=String(f),L.textContent=`New best — ${c}`):L.textContent=`Score ${c}`,O.textContent="Restart, or press an arrow key",b.hidden=!1},S=()=>{const t=d.shift();t&&(v=t);const e={x:i[0].x+v.x,y:i[0].y+v.y};if(e.x<0||e.y<0||e.x>=E||e.y>=p||i.some(o=>o.x===e.x&&o.y===e.y))return q();i.unshift(e),e.x===g.x&&e.y===g.y?(c+=1,C.textContent=String(c),u=Math.max(65,u-4),window.clearInterval(a),a=window.setInterval(S,u),R()):i.pop(),m()},M=()=>{(n==="over"||n==="idle")&&x(),n="running",b.hidden=!0,window.clearInterval(a),a=window.setInterval(S,u)},U=()=>{n==="running"?(n="paused",window.clearInterval(a),a=0,m()):n==="paused"&&(n="running",a=window.setInterval(S,u))},I=(t,e)=>{const o=d.length?d[d.length-1]:v;o.x===-t&&o.y===-e||o.x===t&&o.y===e||(d.length<2&&d.push({x:t,y:e}),n!=="running"&&M())},W={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]},D=t=>{const e=t.key.length===1?t.key.toLowerCase():t.key;if(e===" "||e==="p"){(n==="running"||n==="paused")&&(t.preventDefault(),U());return}const o=W[e];o&&((n==="running"||n==="paused")&&t.preventDefault(),I(o[0],o[1]))},T=r.querySelector(".g-pad"),P=t=>{const e=t.target.closest("button");if(!e)return;const h={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[e.className];h&&I(h[0],h[1])},_=r.querySelector("[data-restart]"),$=()=>{n="idle",x(),M()};return window.addEventListener("keydown",D),T.addEventListener("click",P),_.addEventListener("click",$),x(),b.hidden=!1,{destroy(){window.clearInterval(a),a=0,window.removeEventListener("keydown",D),T.removeEventListener("click",P),_.removeEventListener("click",$),r.innerHTML=""}}}export{F as mount};
