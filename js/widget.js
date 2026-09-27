/* Floating Salesdesk R-Widget Controller for S. Permpoon Heattech */

document.addEventListener('DOMContentLoaded', () => {
  const widgetBtn = document.querySelector('.salesdesk-widget-btn-float');
  const popupDialog = document.querySelector('.salesdesk-popup-dialog');
  const closeBtn = document.querySelector('.popup-close-btn');

  if (widgetBtn && popupDialog) {
    widgetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      popupDialog.classList.toggle('is-open');
    });
  }

  if (closeBtn && popupDialog) {
    closeBtn.addEventListener('click', () => {
      popupDialog.classList.remove('is-open');
    });
  }
});
