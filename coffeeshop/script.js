// Coffee Menu Items
const menuItems = [
  { name: "Espresso", price: 2.5, description: "A bold shot of coffee.", image: "images/Espresso_0.avif" },
  { name: "Cappuccino", price: 3.0, description: "Espresso + milk foam.", image: "images/capicino.jpg" },
  { name: "Latte", price: 3.5, description: "Smooth espresso with silky milk.", image: "images/latte.jpg" },
  { name: "Mocha", price: 4.0, description: "Coffee + chocolate.", image: "images/mocha.jpg" },
  { name: "Americano", price: 2.0, description: "Espresso with hot water.", image: "images/Americano.jpg" },
  { name: "Caramel Macchiato", price: 4.2, description: "Espresso with caramel drizzle.", image: "images/Caramel Macchiato.jpg" }
];

// --- CART SYSTEM with Local Storage ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Save to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item
function addToCart(item) {
  cart.push(item);
  saveCart();
  renderCart();
}

// Remove item
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Render cart
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartItems || !cartTotal || !cartCount) return;

  cartItems.innerHTML = "";

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)} 
      <button class="remove-btn" onclick="removeFromCart(${index})">x</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.innerText = `Total: $${total.toFixed(2)}`;
  cartCount.innerText = cart.length;
}

// --- PAGE LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart(); // load saved cart

  // Checkout button
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("🛒 Your cart is empty!");
      } else {
        alert("✅ Thank you for your order!");
        cart = [];
        saveCart();
        renderCart();
      }
    });
  }

  // Attach Buy buttons on menu page
  const menuList = document.getElementById("menu-list");
  if (menuList) {
    menuItems.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("menu-item");
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-details">
          <h3>${item.name} <span>$${item.price.toFixed(2)}</span></h3>
          <p>${item.description}</p>
          <button class="buy-btn">Buy Now</button>
        </div>
      `;
      menuList.appendChild(li);

      li.querySelector(".buy-btn").addEventListener("click", () => addToCart(item));
    });
  }

  // Attach Buy buttons on specials page
  document.querySelectorAll(".specials .buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const article = btn.closest("article");
      const name = article.querySelector("h2").childNodes[0].textContent.trim();
      const price = parseFloat(article.querySelector("h2 span").innerText.replace("$", ""));
      const description = article.querySelector("p").innerText;
      const image = article.querySelector("img") ? article.querySelector("img").src : "";

      addToCart({ name, price, description, image });
    });
  });

  // Cart icon toggle
  const cartIcon = document.getElementById("cart-icon");
  const cartSidebar = document.getElementById("cart");
  if (cartIcon && cartSidebar) {
    cartIcon.addEventListener("click", () => {
      cartSidebar.classList.toggle("open");
    });
  }
});

     // --- CART PAGE FUNCTIONALITY ---
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotalPage = document.getElementById("cart-total-page");
  const checkoutForm = document.getElementById("checkout-form");

  if (cartTableBody && cartTotalPage) {
    function renderCartPage() {
      cartTableBody.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        total += item.price;
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${item.image}" alt="${item.name}"></td>
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td><button class="remove-btn" onclick="removeFromCart(${index}); renderCartPage();">x</button></td>
        `;
        cartTableBody.appendChild(row);
      });

      cartTotalPage.innerText = `Total: $${total.toFixed(2)}`;
    }

    renderCartPage();

    // Handle Checkout Form
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (cart.length === 0) {
          alert("🛒 Your cart is empty!");
          return;
        }

        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;
        const email = document.getElementById("email").value;
        const payment = document.getElementById("payment").value;

        alert(`✅ Order placed!\n\nThank you, ${name}.\nYour ${payment} order will be delivered to:\n${address}`);

        // Clear cart after order
        cart = [];
        saveCart();
        renderCart();
        renderCartPage();
        checkoutForm.reset();
      });
    }
  }


  // Handle Checkout Form
if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const payment = document.getElementById("payment").value;

    // --- Build Order Summary ---
    let orderSummary = "🧾 Brew Bliss Coffee - Order Receipt\n\n";
    let total = 0;
    cart.forEach((item, index) => {
      orderSummary += `${index + 1}. ${item.name} - $${item.price.toFixed(2)}\n`;
      total += item.price;
    });
    orderSummary += `\nTotal: $${total.toFixed(2)}\n\n`;
    orderSummary += `👤 Name: ${name}\n📍 Address: ${address}\n📧 Email: ${email}\n💳 Payment: ${payment}\n\n`;
    orderSummary += `☕ Thank you for shopping with Brew Bliss Coffee!`;

    // --- Create downloadable file ---
    const blob = new Blob([orderSummary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    // Create hidden download link
    const a = document.createElement("a");
    a.href = url;
    a.download = "CoffeeShop_Receipt.txt";  // as text file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clear cart after order
    cart = [];
    saveCart();
    renderCart();
    renderCartPage();
    checkoutForm.reset();

    alert("✅ Order placed! Your receipt has been downloaded.");
  });
}


// Counters (About Page)
if (document.getElementById("cups")) {
  document.getElementById("cups").innerText = 12000;
  document.getElementById("customers").innerText = 3500;
  document.getElementById("years").innerText = 10;
}

// Newsletter Form
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    alert(`✅ Thank you for subscribing, ${email}!`);
    newsletterForm.reset();
  });
}


function animateCounter(id, target) {
  let count = 0;
  const step = Math.ceil(target / 100);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) {
      count = target;
      clearInterval(interval);
    }
    document.getElementById(id).innerText = count;
  }, 30);
}

if (document.getElementById("cups")) {
  animateCounter("cups", 12000);
  animateCounter("customers", 3500);
  animateCounter("years", 10);
}
