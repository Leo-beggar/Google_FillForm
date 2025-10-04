// PDF上传与解析逻辑
// 需引入 pdf.js
const pdfjsLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.js';
const pdfjsWorkerUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js';

function loadPdfJs() {
  if (!window.pdfjsLib) {
    const script = document.createElement('script');
    script.src = pdfjsLibUrl;
    script.onload = () => {
      window['pdfjsLib'].GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;
    };
    document.head.appendChild(script);
  }
}

loadPdfJs();

document.getElementById('pdf-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  if (!window.pdfjsLib) {
    alert('pdf.js 加载中，请稍后再试');
    return;
  }
  const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
  let textContent = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    textContent += text.items.map(item => item.str).join(' ') + '\n';
  }
  document.getElementById('pdf-info').innerText = textContent;
});
