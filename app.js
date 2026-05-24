/* ============================================================
   林赫宮 · 視覺增強腳本
   - 星空粒子背景
   - 即時時辰顯示
   - 表單提交靜態預覽流程
   ============================================================ */

(function () {
  // ===== 星空 =====
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [], W = 0, H = 0, dpr = window.devicePixelRatio || 1;

    function resize() {
      W = canvas.clientWidth = window.innerWidth;
      H = canvas.clientHeight = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor(W * H / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * 0.6 + 0.2,
        s: Math.random() * 0.015 + 0.005,
        hue: Math.random() < 0.15
          ? (Math.random() < 0.5 ? '212,175,55' : '138,92,255')
          : '241,230,200'
      }));
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.s + s.x);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${s.hue}, ${s.a * tw})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.s * 4;
        if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
      }
      requestAnimationFrame(frame);
    }
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
  }

  // ===== 時辰時鐘 =====
  const timeEl = document.getElementById('statusTime');
  const SHICHEN = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  function tick() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    const sc = SHICHEN[Math.floor(((d.getHours() + 1) % 24) / 2)];
    if (timeEl) timeEl.textContent = `${hh}:${mm}:${ss}  ·  ${sc}時`;
  }
  setInterval(tick, 1000); tick();

  // ===== 表單提交：GitHub Pages 靜態預覽流程 =====
  const form = document.getElementById('orderForm');
  const msg  = document.getElementById('message');
  const btn  = document.getElementById('submitButton');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const orderId = `preview_${Date.now()}`;
      sessionStorage.setItem(orderId, JSON.stringify(data));

      if (btn) {
        btn.disabled = true;
        btn.querySelector('.btn-text').textContent = '排盤中 · 請稍候';
      }
      if (msg) {
        msg.textContent = '⌬ 靜態預覽啟動 · 正式版付款後將自動生成報告…';
        msg.style.color = 'var(--gold-hot)';
      }
      setTimeout(() => {
        window.location.href = `success.html?order=${encodeURIComponent(orderId)}&preview=1`;
      }, 2000);
    });
  }
})();
