import Clipboard from 'clipboard';

export const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    const tempElement = document.createElement('div');
    tempElement.style.position = 'fixed';
    tempElement.style.pointerEvents = 'none';
    tempElement.style.opacity = 0;
    tempElement.innerHTML = `<button class="copy-btn" data-clipboard-text="${text}"></button>`;
    document.body.appendChild(tempElement);

    const clipboard = new Clipboard('.copy-btn');

    clipboard.on('success', (e) => {
      e.clearSelection();
      clipboard.destroy();
      document.body.removeChild(tempElement);
      resolve();
    });

    clipboard.on('error', (e) => {
      clipboard.destroy();
      document.body.removeChild(tempElement);
      reject(e);
    });

    tempElement.querySelector('.copy-btn').click();
  });
}
