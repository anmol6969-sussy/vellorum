// =========================================
// MOCK DATA
// =========================================
const productsData = [
  { id: 1, name: "The Obsidian Chrono", price: 1250, category: "men", img: "https://picsum.photos/seed/watch1/400/500" },
  { id: 2, name: "Rose Gold Elegance", price: 950, category: "women", img: "https://picsum.photos/seed/watch2/400/500" },
  { id: 3, name: "Titanium Diver", price: 1800, category: "men", img: "https://picsum.photos/seed/watch3/400/500" },
  { id: 4, name: "Midnight Sapphire", price: 1500, category: "limited", img: "https://picsum.photos/seed/watch4/400/500" },
  { id: 5, name: "Classic Minimalist", price: 800, category: "women", img: "https://picsum.photos/seed/watch5/400/500" },
  { id: 6, name: "The Royal Heritage", price: 2200, category: "limited", img: "https://picsum.photos/seed/watch6/400/500" }
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
  updateCartUI();
  setupCartListeners();

  // Page specific logic
  if (document.querySelector('.hero')) {
    initSlideshow();
    renderProducts(productsData.slice(0, 3), 'featuredProducts'); // Render 3 featured on home
  }

  if (document.querySelector('.products-page')) {
    renderProducts(productsData, 'allProducts');
    setupFilters();
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

    // Optional: Open cart when adding item
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
      <div class="product-img-wrapper">
        <img src="${product.img}" alt="${product.name}">
      </div>
      <h3 class="product-title">${product.name}</h3>
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
