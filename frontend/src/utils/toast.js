// Toast System
let toastIdCounter = 0;

// Create toast container if it doesn't exist
export const createToastContainer = () => {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

export const showToast = (title, message, type = 'info') => {
  const toastContainer = createToastContainer();
  const toast = document.createElement('div');
  toastIdCounter++;

  const icons = {
    success: '✅',
    info: '💡',
    warning: '⚠️',
    error: '❌'
  };

  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 3000);
};

// React hook for toast notifications
export const useToast = () => {
  return {
    showSuccess: (title, message) => showToast(title, message, 'success'),
    showError: (title, message) => showToast(title, message, 'error'),
    showWarning: (title, message) => showToast(title, message, 'warning'),
    showInfo: (title, message) => showToast(title, message, 'info')
  };
};