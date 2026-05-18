// =========================================
// MOCK DATA
// =========================================
const productsData = [
  { id: 1, name: "The Obsidian Chrono", price: 1250, category: "men", img: "https://images.unsplash.com/photo-1524592094714-0f0654ece975?w=500&q=80" },
  { id: 2, name: "Rose Gold Elegance", price: 950, category: "women", img: "https://images.unsplash.com/photo-1587836374828-cb4387df3c7c?w=500&q=80" },
  { id: 3, name: "Titanium Diver", price: 1800, category: "men", img: "https://images.unsplash.com/photo-1548171915-e782e2fa1a1d?w=500&q=80" },
  { id: 4, name: "Midnight Sapphire", price: 1500, category: "limited", img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80" },
  { id: 5, name: "Classic Minimalist", price: 800, category: "women", img: "https://images.unsplash.com/photo-1508656934554-486016e78864?w=500&q=80" },
  { id: 6, name: "The Royal Heritage", price: 2200, category: "limited", img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500&q=80" },
  { id: 7, name: "Carbon Fiber Racing", price: 1950, category: "men", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500&q=80" },
  { id: 8, name: "Pearl Dress Watch", price: 1100, category: "women", img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=500&q=80" },
  { id: 9, name: "Lunar Tourbillon", price: 3500, category: "limited", img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&q=80" }
];

// =========================================
// STATE
// =========================================
let cart = JSON.parse(localStorage.getItem('Vellorum_cart')) || [];

// =========================================
// DOM ELEMENTS
// =========================================
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');

// =========================================
// INIT
// =========================================
document.addEventListener('DOMContentLoaded', () => {
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
});

// =========================================
// CART LOGIC
// =========================================
function setupCartListeners() {
  if (cartIcon) {
    cartIcon.addEventListener('click', toggleCart);
  }
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', toggleCart);
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', toggleCart);
  }
}

function toggleCart() {
  cartSidebar.classList.toggle('open');
  cartOverlay.classList.toggle('active');
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart!`);

    if (!cartSidebar.classList.contains('open')) {
      toggleCart();
    }
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('Vellorum_cart', JSON.stringify(cart));
}

function checkout() {
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
  
  const modalHTML = `
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
  `;
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
  toast.className = `toast ${type}`;
  toast.innerHTML = message;
  
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateCartUI() {
  if (cartCount) {
    cartCount.innerText = cart.length;
  }

  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="color: var(--text-muted);">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="remove-item" onclick="removeFromCart(${index})">
          <i class="fas fa-trash"></i> &times;
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  if (cartTotalEl) {
    cartTotalEl.innerText = `$${total.toLocaleString()}`;
  }
}

// =========================================
// PRODUCTS RENDERER
// =========================================
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = '<p>No products found matching your criteria.</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product-detail.html?id=${product.id}" class="product-link">
        <div class="product-img-wrapper">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <h3 class="product-title">${product.name}</h3>
      </a>
      <div class="product-price">$${product.price}</div>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// =========================================
// SLIDESHOW LOGIC (HOME PAGE)
// =========================================
function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000); // Change slide every 5 seconds
}

// =========================================
// FILTER LOGIC (PRODUCTS PAGE)
// =========================================
function setupFilters() {
  const searchInput = document.getElementById('searchInput');
  const categoryLinks = document.querySelectorAll('.category-list li');

  let currentSearch = '';
  let currentCategory = 'all';

  function applyFilters() {
    let filtered = productsData;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (currentSearch.trim() !== '') {
      const query = currentSearch.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }

    renderProducts(filtered, 'allProducts');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      applyFilters();
    });
  }

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all
      categoryLinks.forEach(l => l.classList.remove('active'));
      // Add active to clicked
      e.target.classList.add('active');

      currentCategory = e.target.getAttribute('data-category');
      applyFilters();
    });
  });
}

// =========================================
// PRODUCT DETAIL LOGIC
// =========================================
function initProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  const product = productsData.find(p => p.id === productId);
  
  if (!product) {
    document.getElementById('productDetailContainer').innerHTML = '<h2>Product not found</h2>';
    document.querySelector('.comments-section').style.display = 'none';
    return;
  }
  
  const container = document.getElementById('productDetailContainer');
  container.innerHTML = `
    <div class="product-detail-image">
      <img src="${product.img}" alt="${product.name}">
    </div>
    <div class="product-detail-info">
      <h1>${product.name}</h1>
      <div class="price">$${product.price}</div>
      <p class="description">
        Experience the unparalleled craftsmanship of the ${product.name}. 
        Engineered with precision and elegance, this exquisite timepiece features a state-of-the-art movement and a beautifully designed dial. 
        Perfect for those who appreciate the finer things in life.
      </p>
      <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `;
  
  initComments(productId);
}

// =========================================
// COMMENTS LOGIC
// =========================================
function initComments(productId) {
  renderComments(productId);
  
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('commentName');
      const textInput = document.getElementById('commentText');
      
      const name = nameInput.value.trim();
      const text = textInput.value.trim();
      
      if (name && text) {
        addComment(productId, name, text);
        nameInput.value = '';
        textInput.value = '';
      }
    });
  }
}

function getComments(productId) {
  return JSON.parse(localStorage.getItem(`Vellorum_comments_${productId}`)) || [];
}

function addComment(productId, name, text) {
  const comments = getComments(productId);
  const newComment = {
    name: name,
    text: text,
    date: new Date().toLocaleDateString()
  };
  comments.push(newComment);
  localStorage.setItem(`Vellorum_comments_${productId}`, JSON.stringify(comments));
  renderComments(productId);
}

function renderComments(productId) {
  const commentsList = document.getElementById('commentsList');
  if (!commentsList) return;
  
  const comments = getComments(productId);
  commentsList.innerHTML = '';
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<p style="color: var(--text-muted);">No reviews yet. Be the first to leave a review!</p>';
    return;
  }
  
  comments.forEach(comment => {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment-card';
    commentEl.innerHTML = `
      <div class="comment-header">
        <span class="comment-name">${comment.name}</span>
        <span class="comment-date">${comment.date}</span>
      </div>
      <div class="comment-body">${comment.text}</div>
    `;
    commentsList.appendChild(commentEl);
  });
}
