
// ==========================================
// BRIGHTSTAR ELECTRONICS
// COMPLETE JAVASCRIPT
// ==========================================


// 1. PRODUCT DATABASE

const products = [
    {
        id: 1,
        name: "Smartphone X",
        category: "Phones",
        price: 28500,
        description: "A modern smartphone for everyday use.",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
        label: "POPULAR"
    },
    {
        id: 2,
        name: "Premium Laptop",
        category: "Computers",
        price: 75000,
        description: "A laptop for work, study and productivity.",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
        label: "FEATURED"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        category: "Audio",
        price: 6500,
        description: "Enjoy music with a comfortable wireless design.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        label: "POPULAR"
    },
    {
        id: 4,
        name: "Digital Smart Watch",
        category: "Accessories",
        price: 4500,
        description: "A smart accessory for your daily routine.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        label: "NEW"
    },
    {
        id: 5,
        name: "Modern Tablet",
        category: "Phones",
        price: 22000,
        description: "A versatile device for reading and browsing.",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80",
        label: "FEATURED"
    },
    {
        id: 6,
        name: "Wireless Speaker",
        category: "Audio",
        price: 5500,
        description: "Compact speaker for your favourite music.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
        label: "POPULAR"
    },
    {
        id: 7,
        name: "Computer Keyboard",
        category: "Accessories",
        price: 2800,
        description: "A practical keyboard for your workspace.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        label: "NEW"
    },
    {
        id: 8,
        name: "Desktop Computer",
        category: "Computers",
        price: 68000,
        description: "A desktop setup for productivity and work.",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&auto=format&fit=crop&q=80",
        label: "FEATURED"
    }
];


// 2. CART DATA

function loadCart() {
    try {
        const saved = localStorage.getItem("brightstar_cart");
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        return [];
    }
}

let cart = loadCart();
let selectedCategory = "All";

function saveCart() {
    localStorage.setItem("brightstar_cart", JSON.stringify(cart));
}


// 3. HELPER FUNCTIONS

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function money(amount) {
    return "KSh " + Number(amount).toLocaleString("en-KE");
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


// 4. DISPLAY PRODUCTS

function displayProducts() {
    const productGrid = document.getElementById("productGrid");
    const search = document.getElementById("productSearch")
        .value.trim().toLowerCase();

    const filtered = products.filter(function (product) {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                No products match your search.
            </div>
        `;
        return;
    }

    productGrid.innerHTML = filtered.map(function (product) {
        return `
            <article class="product-card">

                <div class="product-image">
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy">

                    <span class="product-label">
                        ${escapeHTML(product.label)}
                    </span>
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3>${escapeHTML(product.name)}</h3>

                    <p class="product-description">
                        ${escapeHTML(product.description)}
                    </p>

                    <div class="product-bottom">
                        <span class="product-price">
                            ${money(product.price)}
                        </span>

                        <button
                            class="add-button"
                            data-add="${product.id}">
                            + Add
                        </button>
                    </div>

                </div>
            </article>
        `;
    }).join("");
}


// 5. CATEGORY FILTERS

document.getElementById("categories").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest("[data-category]");

        if (!button) return;

        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category").forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        displayProducts();
    }
);


// 6. PRODUCT SEARCH

document.getElementById("productSearch").addEventListener(
    "input",
    displayProducts
);


// 7. ADD PRODUCT TO CART

document.getElementById("productGrid").addEventListener(
    "click",
    function (event) {
        const button = event.target.closest("[data-add]");

        if (!button) return;

        const productId = Number(button.dataset.add);

        const product = products.find(function (item) {
            return item.id === productId;
        });

        if (!product) return;

        const existingItem = cart.find(function (item) {
            return item.id === productId;
        });

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                quantity: 1
            });
        }

        saveCart();
        renderCart();

        showToast(product.name + " added to cart.");
    }
);


// 8. CART DRAWER

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
}

document.getElementById("openCart").addEventListener(
    "click",
    openCart
);

document.getElementById("closeCart").addEventListener(
    "click",
    closeCart
);

cartOverlay.addEventListener("click", closeCart);


// 9. DISPLAY CART

function renderCart() {
    const cartItems = document.getElementById("cartItems");

    let totalItems = 0;
    let totalAmount = 0;

    const validCart = cart.filter(function (item) {
        return products.some(function (product) {
            return product.id === item.id;
        });
    });

    if (validCart.length !== cart.length) {
        cart = validCart;
        saveCart();
    }

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is currently empty.
            </p>
        `;
    } else {
        cartItems.innerHTML = cart.map(function (item) {
            const product = products.find(function (product) {
                return product.id === item.id;
            });

            if (!product) return "";

            totalItems += item.quantity;
            totalAmount += product.price * item.quantity;

            return `
                <div class="cart-item">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}">

                    <div>
                        <h4>${escapeHTML(product.name)}</h4>

                        <p>${money(product.price)}</p>

                        <div class="quantity-controls">
                            <button
                                data-decrease="${product.id}"
                                aria-label="Decrease quantity">−</button>

                            <span>${item.quantity}</span>

                            <button
                                data-increase="${product.id}"
                                aria-label="Increase quantity">+</button>
                        </div>
                    </div>

                    <button
                        class="remove-item"
                        data-remove="${product.id}">
                        Remove
                    </button>

                </div>
            `;
        }).join("");
    }

    document.getElementById("cartCount").textContent = totalItems;
    document.getElementById("cartTotal").textContent =
        money(totalAmount);
}


// 10. CART QUANTITY AND REMOVAL

document.getElementById("cartItems").addEventListener(
    "click",
    function (event) {
        const increase = event.target.closest("[data-increase]");
        const decrease = event.target.closest("[data-decrease]");
        const remove = event.target.closest("[data-remove]");

        if (increase) {
            const id = Number(increase.dataset.increase);

            const item = cart.find(function (product) {
                return product.id === id;
            });

            if (item) item.quantity += 1;
        }

        if (decrease) {
            const id = Number(decrease.dataset.decrease);

            const item = cart.find(function (product) {
                return product.id === id;
            });

            if (item) {
                item.quantity -= 1;

                if (item.quantity <= 0) {
                    cart = cart.filter(function (product) {
                        return product.id !== id;
                    });
                }
            }
        }

        if (remove) {
            const id = Number(remove.dataset.remove);

            cart = cart.filter(function (product) {
                return product.id !== id;
            });

            showToast("Product removed from cart.");
        }

        saveCart();
        renderCart();
    }
);


// 11. PREPARE A PRODUCT ENQUIRY

document.getElementById("enquiryButton").addEventListener(
    "click",
    function () {
        if (cart.length === 0) {
            showToast("Your cart is empty.");
            return;
        }

        const lines = cart.map(function (item) {
            const product = products.find(function (product) {
                return product.id === item.id;
            });

            return (
                product.name +
                " x " + item.quantity +
                " = " + money(product.price * item.quantity)
            );
        });

        const total = cart.reduce(function (sum, item) {
            const product = products.find(function (product) {
                return product.id === item.id;
            });

            return sum + (product.price * item.quantity);
        }, 0);

        const message =
            "Hello BrightStar Electronics. I would like to enquire about:\n\n" +
            lines.join("\n") +
            "\n\nEstimated total: " + money(total) +
            "\n\nPlease confirm product availability and details.";

        const whatsappNumber = "254700000000";

        const whatsappURL =
            "https://wa.me/" +
            whatsappNumber +
            "?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank");
    }
);


// 12. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navigation.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// 13. FOOTER YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// 14. INITIALISE WEBSITE

function initialiseStore() {
    displayProducts();
    renderCart();
}

initialiseStore();
