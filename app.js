const form = document.querySelector('#orderForm');
const button = document.querySelector('#submitButton');
const message = document.querySelector('#message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  button.disabled = true;

  const data = Object.fromEntries(new FormData(form).entries());
  const orderId = `preview_${Date.now()}`;
  sessionStorage.setItem(orderId, JSON.stringify(data));

  message.textContent = '這是 GitHub Pages 靜態預覽版：正式版付款後會自動生成報告並寄出。';
  setTimeout(() => {
    window.location.href = `success.html?order=${encodeURIComponent(orderId)}&preview=1`;
  }, 600);
});
