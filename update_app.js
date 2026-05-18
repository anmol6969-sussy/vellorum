const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Replace products data
const oldProductsDataRegex = /const productsData = \[[\s\S]*?\];/;
const newProductsData = `const productsData = [
  { id: 1, name: "The Obsidian Chrono", price: 1250, category: "men", img: "https://images.unsplash.com/photo-1524592094714-0f0654ece975?w=500&q=80" },
  { id: 2, name: "Rose Gold Elegance", price: 950, category: "women", img: "https://images.unsplash.com/photo-1587836374828-cb4387df3c7c?w=500&q=80" },
  { id: 3, name: "Titanium Diver", price: 1800, category: "men", img: "https://images.unsplash.com/photo-1548171915-e782e2fa1a1d?w=500&q=80" },
  { id: 4, name: "Midnight Sapphire", price: 1500, category: "limited", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80" },
  { id: 5, name: "Classic Minimalist", price: 800, category: "women", img: "https://images.unsplash.com/photo-1508656934554-486016e78864?w=500&q=80" },
  { id: 6, name: "The Royal Heritage", price: 2200, category: "limited", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&q=80" },
  { id: 7, name: "Carbon Fiber Racing", price: 1950, category: "men", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500&q=80" },
  { id: 8, name: "Pearl Dress Watch", price: 1100, category: "women", img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&q=80" },
  { id: 9, name: "Lunar Tourbillon", price: 3500, category: "limited", img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80" }
];`;
content = content.replace(oldProductsDataRegex, newProductsData);

// Replace DOMContentLoaded
const oldInitRegex = /document\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);/;
const newInit = `document.addEventListener('DOMContentLoaded', () => {
  createCheckoutModal();
  createToastContainer();
  updateCartUI();
  setupCartListeners();

  if (document.querySelector('.hero')) {
    initSlideshow();
    renderProducts(productsData.slice(0, 3), 'featuredProducts');
  }

  if (document.querySelector('.products-page')) {
    renderProducts(productsData, 'allProducts');
    setupFilters();
  }

  if (document.querySelector('.product-detail-page')) {
    initProductDetail();
  }
});`;
content = content.replace(oldInitRegex, newInit);

// Update addToCart to show toast
const oldAddToCartRegex = /function addToCart\(productId\) \{[\s\S]*?function removeFromCart/m;
const newAddToCart = `function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    saveCart();
    updateCartUI();
    showToast(\`\${product.name} added to cart!\`);

    if (!cartSidebar.classList.contains('open')) {
      toggleCart();
    }
  }
}

function removeFromCart`;
content = content.replace(oldAddToCartRegex, newAddToCart);

// Update checkout to use modal
const oldCheckoutRegex = /function checkout\(\) \{[\s\S]*?function updateCartUI/m;
const newCheckout = `function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  
  if (cartSidebar.classList.contains('open')) {
    toggleCart();
  }
  
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function confirmPurchase(e) {
  e.preventDefault();
  
  document.getElementById('checkoutFormWrapper').style.display = 'none';
  document.getElementById('checkoutSuccess').style.display = 'block';
  
  cart = [];
  saveCart();
  updateCartUI();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      document.getElementById('checkoutFormWrapper').style.display = 'block';
      document.getElementById('checkoutSuccess').style.display = 'none';
      document.getElementById('checkoutForm').reset();
    }, 300);
  }
}

// =========================================
// UI COMPONENTS (MODAL & TOAST)
// =========================================
function createCheckoutModal() {
  if (document.getElementById('checkoutModal')) return;
  
  const modalHTML = \`
    <div class="modal-overlay" id="checkoutModal">
      <div class="modal-content">
        <div class="modal-close" onclick="closeCheckoutModal()">&times;</div>
        
        <div id="checkoutFormWrapper">
          <h2>Complete Your Purchase</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">Please enter your details to finalize the order.</p>
          <form id="checkoutForm" onsubmit="confirmPurchase(event)">
            <div class="form-group">
              <input type="text" placeholder="Full Name" required>
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email Address" required>
            </div>
            <div class="form-group">
              <input type="text" placeholder="Shipping Address" required>
            </div>
            <div class="form-group">
              <input type="text" placeholder="Card Number (mock)" required>
            </div>
            <button type="submit" class="btn" style="width: 100%;">Confirm Purchase</button>
          </form>
        </div>
        
        <div id="checkoutSuccess" style="display: none; text-align: center; padding: 30px 0;">
          <div style="font-size: 60px; color: #4ade80; margin-bottom: 20px;">
            <i class="fas fa-check-circle">✓</i>
          </div>
          <h2>Payment Successful!</h2>
          <p style="color: var(--text-muted); margin-top: 10px;">Thank you for your purchase. Your luxury timepiece will be shipped soon.</p>
          <button class="btn" onclick="closeCheckoutModal()" style="margin-top: 20px;">Continue Shopping</button>
        </div>
      </div>
    </div>
  \`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function createToastContainer() {
  if (document.getElementById('toastContainer')) return;
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastContainer';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = \`toast \${type}\`;
  toast.innerHTML = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateCartUI`;
content = content.replace(oldCheckoutRegex, newCheckout);

fs.writeFileSync('app.js', content);
console.log('Successfully updated app.js');
