const fs = require('fs');

const stylesToAppend = `

/* ========================================= */
/* CHECKOUT MODAL STYLES                     */
/* ========================================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.modal-overlay.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: var(--bg-card);
  padding: 40px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  transform: translateY(20px);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.modal-overlay.active .modal-content {
  transform: translateY(0);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.3s ease;
}

.modal-close:hover {
  color: var(--text-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* ========================================= */
/* TOAST NOTIFICATION STYLES                 */
/* ========================================= */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  background: var(--bg-card);
  color: var(--text-color);
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border-left: 4px solid var(--primary-color);
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast.error {
  border-left-color: #ef4444;
}

.toast.success {
  border-left-color: #4ade80;
}
`;

fs.appendFileSync('style.css', stylesToAppend);
console.log('Successfully appended styles to style.css');
