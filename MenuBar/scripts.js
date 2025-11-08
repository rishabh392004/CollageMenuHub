const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const menuSection = document.getElementById('menu-section');
const confirmationSection = document.getElementById('confirmation-section');
const newOrderBtn = document.getElementById('new-order-btn');
const orderTotalSpan = document.getElementById('order-total');
const prepTimeSpan = document.getElementById('prep-time');

const cartModal = document.getElementById('cart-modal');
const viewCartBtn = document.getElementById('view-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

let cart = {};

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    loginSection.style.display = 'none';
    menuSection.style.display = 'block';
});

menuSection.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        const name = event.target.dataset.name;
        const price = parseFloat(event.target.dataset.price);
        addToCart(name, price);
    }
});

viewCartBtn.addEventListener('click', function() {
    cartModal.style.display = 'flex';
});

closeCartBtn.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

cartItemsList.addEventListener('click', function(event) {
    const target = event.target;
    const itemName = target.dataset.name;
    
    if (!itemName) return;

    if (target.classList.contains('increase-qty-btn')) {
        const price = cart[itemName].price;
        addToCart(itemName, price);
    } else if (target.classList.contains('decrease-qty-btn')) {
        decreaseQuantity(itemName);
    } else if (target.classList.contains('remove-item-btn')) {
        removeFromCart(itemName);
    }
});

checkoutBtn.addEventListener('click', function() {
    const total = calculateTotal();
    
    const totalItems = calculateTotalItems();
    const prepTime = totalItems * 5;
    
    orderTotalSpan.textContent = '$' + total.toFixed(2);
    prepTimeSpan.textContent = prepTime + ' minutes';

    cartModal.style.display = 'none';
    menuSection.style.display = 'none';
    confirmationSection.style.display = 'flex';
});

newOrderBtn.addEventListener('click', function() {
    confirmationSection.style.display = 'none';
    loginSection.style.display = 'flex';

    cart = {};
    updateCartModal();
    updateCartIndicator();
    loginForm.reset();
});

function addToCart(name, price) {
    if (cart[name]) {
        cart[name].quantity++;
    } else {
        cart[name] = {
            price: price,
            quantity: 1
        };
    }
    updateCartModal();
    updateCartIndicator();
}

function decreaseQuantity(name) {
    if (cart[name] && cart[name].quantity > 1) {
        cart[name].quantity--;
    } else if (cart[name]) {
        delete cart[name];
    }
    updateCartModal();
    updateCartIndicator();
}

function removeFromCart(name) {
    if (cart[name]) {
        delete cart[name];
    }
    updateCartModal();
    updateCartIndicator();
}

function updateCartModal() {
    cartItemsList.innerHTML = '';
    
    const itemNames = Object.keys(cart);
    
    if (itemNames.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: #777;">Your cart is empty.</p>';
    } else {
        itemNames.forEach(name => {
            const item = cart[name];
            const itemTotal = (item.price * item.quantity).toFixed(2);
            
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${name}</h4>
                        <p>$${item.price.toFixed(2)} each (Total: $${itemTotal})</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="decrease-qty-btn" data-name="${name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty-btn" data-name="${name}">+</button>
                        <button class="remove-item-btn" data-name="${name}">&times;</button>
                    </div>
                </div>
            `;
            cartItemsList.insertAdjacentHTML('beforeend', itemHTML);
        });
    }
    
    cartTotalSpan.textContent = '$' + calculateTotal().toFixed(2);
}

function updateCartIndicator() {
    const totalItems = calculateTotalItems();
    
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
}

function calculateTotal() {
    let total = 0;
    const itemNames = Object.keys(cart);
    
    itemNames.forEach(name => {
        const item = cart[name];
        total += item.price * item.quantity;
    });
    
    return total;
}

function calculateTotalItems() {
    let totalItems = 0;
    const itemNames = Object.keys(cart);
    
    itemNames.forEach(name => {
        totalItems += cart[name].quantity;
    });
    
    return totalItems;
}