const params = new URLSearchParams(window.location.search);
const orderId = params.get('order');
const statusText = document.querySelector('#statusText');
const reportPath = document.querySelector('#reportPath');

async function poll() {
  if (!orderId) {
    statusText.textContent = '找不到訂單編號。';
    return;
  }

  if (params.get('preview') === '1') {
    const saved = sessionStorage.getItem(orderId);
    const data = saved ? JSON.parse(saved) : null;
    statusText.textContent = '靜態預覽完成';
    reportPath.textContent = data
      ? `正式版會為 ${data.date} ${data.time} ${data.gender} ${data.location} 產生長版 HTML，並寄到 ${data.email}。`
      : '正式版會在付款後生成長版 HTML 並寄出。';
    return;
  }

  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
    const order = await response.json();
    if (!response.ok) throw new Error(order.error || '查詢失敗');

    const labels = {
      pending_payment: '等待付款確認',
      paid: '付款完成，等待排程',
      generating: '正在生成長版報告',
      emailing: '報告已生成，正在寄送',
      completed: '報告已完成',
      failed: '生成失敗',
    };

    statusText.textContent = labels[order.status] || order.status;
    if (order.reportPath) reportPath.textContent = `HTML：${order.reportPath}`;
    if (order.emailSkipped) reportPath.textContent += `（未寄信：${order.emailSkipped}）`;
    if (order.error) reportPath.textContent = order.error;
    if (order.status !== 'completed' && order.status !== 'failed') {
      setTimeout(poll, 5000);
    }
  } catch (error) {
    statusText.textContent = error.message;
    setTimeout(poll, 8000);
  }
}

poll();
