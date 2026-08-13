/* =====================================================
   RAMA MOMO'S - FINAL SCRIPT
===================================================== */

"use strict";


/* =====================================================
   SETTINGS
===================================================== */

const SELLER_WHATSAPP = "919359874910";

const DELIVERY_CHARGE = 15;

const CART_KEY = "ramaCart";

const ORDERS_KEY = "ramaOrders";

const REVIEWS_KEY = "ramaReviews";

const DARK_KEY = "ramaDarkMode";


/* =====================================================
   DATA
===================================================== */

let cart = [];

let orders = [];

let reviews = [];

let appliedDiscount = 0;


try {

    cart =
        JSON.parse(
            localStorage.getItem(CART_KEY)
        ) || [];

    orders =
        JSON.parse(
            localStorage.getItem(ORDERS_KEY)
        ) || [];

    reviews =
        JSON.parse(
            localStorage.getItem(REVIEWS_KEY)
        ) || [];

} catch (error) {

    cart = [];
    orders = [];
    reviews = [];

}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupMobileMenu();

        setupDarkMode();

        setupFilters();

        setupQuantityButtons();

        setupFavouriteButtons();

        setupCartButtons();

        setupCoupon();

        setupCheckout();

        setupLocation();

        setupReviews();

        setup3DMomo();

        renderCart();

        renderOrders();

        renderReviews();

        renderSellerOrders();

    }
);


/* =====================================================
   HELPERS
===================================================== */

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


function saveOrders() {

    localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(orders)
    );

}


function saveReviews() {

    localStorage.setItem(
        REVIEWS_KEY,
        JSON.stringify(reviews)
    );

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.ramaToastTimer
    );

    window.ramaToastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

}


/* =====================================================
   MOBILE MENU
===================================================== */

function setupMobileMenu() {

    const menuBtn =
        document.getElementById("menuBtn");

    const navMenu =
        document.getElementById("navMenu");

    if (!menuBtn || !navMenu) return;


    menuBtn.addEventListener(
        "click",
        () => {

            navMenu.classList.toggle("show");

        }
    );


    navMenu
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navMenu.classList.remove(
                        "show"
                    );

                }
            );

        });

}


/* =====================================================
   DARK MODE
===================================================== */

function setupDarkMode() {

    const darkBtn =
        document.getElementById("darkBtn");

    if (!darkBtn) return;


    const saved =
        localStorage.getItem(
            DARK_KEY
        );


    if (saved === "true") {

        document.body.classList.add(
            "dark"
        );

        darkBtn.textContent = "☀️";

    }


    darkBtn.addEventListener(
        "click",
        () => {

            const enabled =
                document.body.classList.toggle(
                    "dark"
                );


            localStorage.setItem(
                DARK_KEY,
                enabled
            );


            darkBtn.textContent =
                enabled ? "☀️" : "🌙";

        }
    );

}


/* =====================================================
   FILTERS
===================================================== */

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );

    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                const category =
                    button.dataset.category;


                cards.forEach(card => {

                    const show =
                        category === "all" ||
                        card.dataset.category ===
                            category;


                    card.style.display =
                        show ? "" : "none";

                });

            }
        );

    });

}


/* =====================================================
   QUANTITY
===================================================== */

function setupQuantityButtons() {

    document
        .querySelectorAll(".food-card")
        .forEach(card => {

            const minus =
                card.querySelector(
                    ".qty-minus"
                );

            const plus =
                card.querySelector(
                    ".qty-plus"
                );

            const input =
                card.querySelector(
                    ".qty-input"
                );


            if (!minus || !plus || !input)
                return;


            minus.addEventListener(
                "click",
                () => {

                    let value =
                        parseInt(
                            input.value,
                            10
                        ) || 1;


                    value--;

                    if (value < 1)
                        value = 1;


                    input.value = value;

                }
            );


            plus.addEventListener(
                "click",
                () => {

                    let value =
                        parseInt(
                            input.value,
                            10
                        ) || 1;


                    value++;

                    if (value > 20)
                        value = 20;


                    input.value = value;

                }
            );


            input.addEventListener(
                "input",
                () => {

                    let value =
                        parseInt(
                            input.value,
                            10
                        ) || 1;


                    if (value < 1)
                        value = 1;

                    if (value > 20)
                        value = 20;


                    input.value = value;

                }
            );

        });

}


/* =====================================================
   FAVOURITE
===================================================== */

function setupFavouriteButtons() {

    document
        .querySelectorAll(".fav-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const active =
                        button.classList.toggle(
                            "active"
                        );


                    button.textContent =
                        active ? "♥" : "♡";

                }
            );

        });

}


/* =====================================================
   ADD TO CART
===================================================== */

function setupCartButtons() {

    document
        .querySelectorAll(".food-card")
        .forEach(card => {

            const button =
                card.querySelector(
                    ".add-cart"
                );


            if (!button) return;


            button.addEventListener(
                "click",
                () => {

                    const name =
                        card.dataset.name ||
                        card
                            .querySelector(
                                ".food-name"
                            )
                            ?.textContent
                            .trim();


                    const price =
                        parseInt(
                            card.dataset.price,
                            10
                        ) || 0;


                    const input =
                        card.querySelector(
                            ".qty-input"
                        );


                    const quantity =
                        Math.max(
                            1,
                            Math.min(
                                20,
                                parseInt(
                                    input?.value,
                                    10
                                ) || 1
                            )
                        );


                    addToCart(
                        name,
                        price,
                        quantity
                    );


                    input.value = 1;

                }
            );

        });

}


/* =====================================================
   ADD ITEM
===================================================== */

function addToCart(
    name,
    price,
    quantity
) {

    if (!name || price <= 0)
        return;


    const existing =
        cart.find(
            item =>
                item.name === name
        );


    if (existing) {

        existing.quantity += quantity;

        if (existing.quantity > 20)
            existing.quantity = 20;

    } else {

        cart.push({

            id:
                Date.now() +
                Math.random(),

            name,

            price,

            quantity

        });

    }


    saveCart();

    renderCart();

    showToast(
        `${name} added to cart 🛒`
    );

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const count =
        document.getElementById(
            "cart-count"
        );


    if (!count) return;


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    count.textContent = total;

}


/* =====================================================
   CALCULATE TOTAL
===================================================== */

function calculateTotals() {

    const subtotal =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );


    const delivery =
        subtotal > 0
            ? DELIVERY_CHARGE
            : 0;


    const discount =
        Math.min(
            appliedDiscount,
            subtotal
        );


    const total =
        subtotal +
        delivery -
        discount;


    return {
        subtotal,
        delivery,
        discount,
        total
    };

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    updateCartCount();


    const totals =
        calculateTotals();


    const subtotalEl =
        document.getElementById(
            "subtotal"
        );

    const deliveryEl =
        document.getElementById(
            "delivery"
        );

    const discountEl =
        document.getElementById(
            "discount"
        );

    const totalEl =
        document.getElementById(
            "grandTotal"
        );


    if (subtotalEl)
        subtotalEl.textContent =
            `₹${totals.subtotal}`;


    if (deliveryEl)
        deliveryEl.textContent =
            `₹${totals.delivery}`;


    if (discountEl)
        discountEl.textContent =
            `₹${totals.discount}`;


    if (totalEl)
        totalEl.textContent =
            `₹${totals.total}`;


    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                🛒 Your cart is empty.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    cart.forEach(
        (item, index) => {

            const total =
                item.price *
                item.quantity;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cart-item";


            div.innerHTML = `

                <div>

                    <h3>
                        ${escapeHTML(item.name)}
                    </h3>

                    <p>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </p>

                </div>

                <div class="cart-item-price">

                    <strong>
                        ₹${total}
                    </strong>

                    <br>

                    <button
                        class="remove-cart"
                        type="button"
                        data-index="${index}">
                        Remove
                    </button>

                </div>
            `;


            container.appendChild(div);

        }
    );


    container
        .querySelectorAll(".remove-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        parseInt(
                            button.dataset.index,
                            10
                        );


                    cart.splice(
                        index,
                        1
                    );


                    saveCart();

                    renderCart();

                    showToast(
                        "Item removed ❌"
                    );

                }
            );

        });

}


/* =====================================================
   COUPON
===================================================== */

function setupCoupon() {

    const button =
        document.getElementById(
            "couponBtn"
        );

    const input =
        document.getElementById(
            "coupon"
        );


    if (!button || !input)
        return;


    button.addEventListener(
        "click",
        () => {

            const code =
                input.value
                    .trim()
                    .toUpperCase();


            if (code === "WELCOME") {

                appliedDiscount = 20;

                renderCart();

                showToast(
                    "₹20 discount applied 🎉"
                );

            } else {

                appliedDiscount = 0;

                renderCart();

                showToast(
                    "Invalid coupon code"
                );

            }

        }
    );

}


/* =====================================================
   CHECKOUT
===================================================== */

function setupCheckout() {

    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );

    const checkout =
        document.getElementById(
            "checkout"
        );


    if (checkoutBtn && checkout) {

        checkoutBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    showToast(
                        "Please add items first 🛒"
                    );

                    return;

                }


                checkout.scrollIntoView({
                    behavior: "smooth"
                });

            }
        );

    }


    const form =
        document.getElementById(
            "addressForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            placeOrder
        );

    }

}


/* =====================================================
   LOCATION
===================================================== */

function setupLocation() {

    const button =
        document.getElementById(
            "getLocationBtn"
        );


    const status =
        document.getElementById(
            "locationStatus"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            if (!navigator.geolocation) {

                showToast(
                    "Location is not supported"
                );

                return;

            }


            status.textContent =
                "Getting location...";


            navigator.geolocation.getCurrentPosition(

                position => {

                    const lat =
                        position.coords.latitude;

                    const lng =
                        position.coords.longitude;


                    document.getElementById(
                        "customerLatitude"
                    ).value = lat;


                    document.getElementById(
                        "customerLongitude"
                    ).value = lng;


                    status.textContent =
                        `Location captured: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;


                    showToast(
                        "Location captured 📍"
                    );

                },

                () => {

                    status.textContent =
                        "Unable to get location";

                    showToast(
                        "Please allow location permission"
                    );

                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }

            );

        }
    );

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder(event) {

    event.preventDefault();


    if (cart.length === 0) {

        showToast(
            "Your cart is empty 🛒"
        );

        return;

    }


    const name =
        document
            .getElementById(
                "customerName"
            )
            .value
            .trim();


    const phone =
        document
            .getElementById(
                "customerPhone"
            )
            .value
            .trim();


    const address =
        document
            .getElementById(
                "customerAddress"
            )
            .value
            .trim();


    const landmark =
        document
            .getElementById(
                "customerLandmark"
            )
            .value
            .trim();


    const latitude =
        document
            .getElementById(
                "customerLatitude"
            )
            .value;


    const longitude =
        document
            .getElementById(
                "customerLongitude"
            )
            .value;


    if (!name || !phone || !address) {

        showToast(
            "Please fill all required details"
        );

        return;

    }


    if (!/^\d{10}$/.test(phone)) {

        showToast(
            "Enter valid 10 digit mobile number"
        );

        return;

    }


    const totals =
        calculateTotals();


    const orderId =
        "RM" +
        Date.now()
            .toString()
            .slice(-8);


    const date =
        new Date()
            .toLocaleString("en-IN");


    const order = {

        id: orderId,

        date,

        customer: {

            name,
            phone,
            address,
            landmark

        },

        location: {

            latitude,
            longitude

        },

        items:
            cart.map(item => ({

                name: item.name,

                price: item.price,

                quantity: item.quantity

            })),

        subtotal:
            totals.subtotal,

        delivery:
            totals.delivery,

        discount:
            totals.discount,

        total:
            totals.total,

        status:
            "Confirmed"

    };


    /* SAVE ORDER */

    orders.unshift(order);

    saveOrders();


    /* CREATE WHATSAPP MESSAGE */

    const message =
        createWhatsAppMessage(
            order
        );


    const whatsappURL =
        `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;


    /*
       Open WhatsApp BEFORE clearing cart.
       This ensures all data is already prepared.
    */

    window.open(
        whatsappURL,
        "_blank"
    );


    /* CLEAR CART */

    cart = [];

    appliedDiscount = 0;

    saveCart();

    renderCart();

    renderOrders();

    renderSellerOrders();


    /* RESET FORM */

    document
        .getElementById(
            "addressForm"
        )
        .reset();


    document
        .getElementById(
            "customerLatitude"
        )
        .value = "";


    document
        .getElementById(
            "customerLongitude"
        )
        .value = "";


    document
        .getElementById(
            "locationStatus"
        )
        .textContent =
        "Location not captured";


    showToast(
        `Order ${orderId} created successfully 🎉`
    );

}


/* =====================================================
   WHATSAPP MESSAGE
===================================================== */

function createWhatsAppMessage(order) {

    let message =
        `🥟 *RAMA MOMO'S - NEW ORDER*%0A`;


    message +=
        `%0A🆔 *Order ID:* ${order.id}`;


    message +=
        `%0A📅 *Date:* ${order.date}`;


    message +=
        `%0A%0A👤 *CUSTOMER DETAILS*`;


    message +=
        `%0AName: ${order.customer.name}`;


    message +=
        `%0APhone: ${order.customer.phone}`;


    message +=
        `%0AAddress: ${order.customer.address}`;


    if (order.customer.landmark) {

        message +=
            `%0ALandmark: ${order.customer.landmark}`;

    }


    message +=
        `%0A%0A🥟 *ORDER ITEMS*`;


    order.items.forEach(
        item => {

            const itemTotal =
                item.price *
                item.quantity;


            message +=
                `%0A• ${item.name} × ${item.quantity} = ₹${itemTotal}`;

        }
    );


    message +=
        `%0A%0A💰 *PAYMENT DETAILS*`;


    message +=
        `%0ASubtotal: ₹${order.subtotal}`;


    message +=
        `%0ADelivery: ₹${order.delivery}`;


    message +=
        `%0ADiscount: ₹${order.discount}`;


    message +=
        `%0A*TOTAL: ₹${order.total}*`;


    if (
        order.location.latitude &&
        order.location.longitude
    ) {

        const mapURL =
            `https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`;


        message +=
            `%0A%0A📍 *Customer Location:*%0A${mapURL}`;

    }


    message +=
        `%0A%0A🙏 Thank you!`;


    return message;

}


/* =====================================================
   ORDERS
===================================================== */

function renderOrders() {

    const container =
        document.getElementById(
            "customerOrders"
        );


    if (!container) return;


    if (orders.length === 0) {

        container.innerHTML = `
            <div class="no-orders">
                📦 No orders placed yet.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    orders.forEach(order => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "order-card";


        const items =
            order.items
                .map(item => `
                    <div class="order-item-row">
                        <span>
                            ${escapeHTML(item.name)}
                            × ${item.quantity}
                        </span>

                        <strong>
                            ₹${item.price * item.quantity}
                        </strong>
                    </div>
                `)
                .join("");


        card.innerHTML = `

            <div class="order-card-header">

                <div>

                    <div class="order-id">
                        ${escapeHTML(order.id)}
                    </div>

                    <div class="order-date">
                        ${escapeHTML(order.date)}
                    </div>

                </div>

                <span class="status-badge
                    ${order.status.toLowerCase()}">

                    ${escapeHTML(order.status)}

                </span>

            </div>


            <div class="order-items">

                ${items}

            </div>


            <div class="order-total">

                <span>Total</span>

                <strong>
                    ₹${order.total}
                </strong>

            </div>


            ${
                order.status !== "Cancelled" &&
                order.status !== "Delivered"
                ? `
                    <button
                        class="cancel-order-btn"
                        data-order-id="${escapeHTML(order.id)}">

                        Cancel Order ❌

                    </button>
                `
                : ""
            }

        `;


        container.appendChild(card);

    });


    container
        .querySelectorAll(
            ".cancel-order-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    cancelOrder(
                        button.dataset.orderId
                    );

                }
            );

        });

}


/* =====================================================
   CANCEL ORDER
===================================================== */

function cancelOrder(orderId) {

    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) return;


    if (
        order.status === "Cancelled" ||
        order.status === "Delivered"
    ) {

        showToast(
            "This order cannot be cancelled."
        );

        return;

    }


    const yes =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!yes) return;


    order.status =
        "Cancelled";


    order.cancelledAt =
        new Date()
            .toLocaleString("en-IN");


    saveOrders();

    renderOrders();

    renderSellerOrders();

    showToast(
        "Order cancelled ❌"
    );

}


/* =====================================================
   SELLER PANEL
===================================================== */

function renderSellerOrders() {

    const container =
        document.getElementById(
            "sellerOrders"
        );


    const count =
        document.getElementById(
            "sellerOrderCount"
        );


    if (!container) return;


    if (count) {

        count.textContent =
            `${orders.length} Orders`;

    }


    if (orders.length === 0) {

        container.innerHTML = `
            <div class="no-orders">
                🔔 No orders yet.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    orders.forEach(order => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "seller-order-card";


        if (order.status === "Confirmed") {

            card.classList.add(
                "new-order"
            );

        }


        const items =
            order.items
                .map(item => `
                    <div class="order-item-row">
                        <span>
                            ${escapeHTML(item.name)}
                            × ${item.quantity}
                        </span>

                        <strong>
                            ₹${item.price * item.quantity}
                        </strong>
                    </div>
                `)
                .join("");


        card.innerHTML = `

            <div class="order-card-header">

                <div>

                    <div class="order-id">
                        ${escapeHTML(order.id)}
                    </div>

                    <div class="order-date">
                        ${escapeHTML(order.date)}
                    </div>

                </div>

                <span class="status-badge
                    ${order.status.toLowerCase()}">

                    ${escapeHTML(order.status)}

                </span>

            </div>


            <div class="seller-customer">

                <p>
                    <strong>Customer:</strong>
                    ${escapeHTML(order.customer.name)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(order.customer.phone)}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${escapeHTML(order.customer.address)}
                </p>

                ${
                    order.customer.landmark
                    ? `
                        <p>
                            <strong>Landmark:</strong>
                            ${escapeHTML(
                                order.customer.landmark
                            )}
                        </p>
                    `
                    : ""
                }

            </div>


            <div>
                ${items}
            </div>


            <div class="order-total">

                <span>Total</span>

                <strong>
                    ₹${order.total}
                </strong>

            </div>

        `;


        container.appendChild(card);

    });

}


/* =====================================================
   REVIEWS
===================================================== */

function setupReviews() {

    const form =
        document.getElementById(
            "reviewForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "reviewName"
                    )
                    .value
                    .trim();


            const rating =
                document
                    .getElementById(
                        "reviewRating"
                    )
                    .value;


            const text =
                document
                    .getElementById(
                        "reviewText"
                    )
                    .value
                    .trim();


            if (!name || !rating || !text)
                return;


            reviews.unshift({

                name,

                rating:
                    Number(rating),

                text,

                date:
                    new Date()
                        .toLocaleDateString(
                            "en-IN"
                        )

            });


            saveReviews();

            renderReviews();

            form.reset();

            showToast(
                "Thank you for your review ⭐"
            );

        }
    );

}


function renderReviews() {

    const container =
        document.getElementById(
            "reviewsList"
        );


    if (!container) return;


    if (reviews.length === 0) {

        container.innerHTML = `
            <div class="no-orders">
                ⭐ Be the first to review RAMA MOMO'S.
            </div>
        `;

        return;

    }


    container.innerHTML =
        reviews
            .map(review => {

                const stars =
                    "★".repeat(
                        review.rating
                    ) +
                    "☆".repeat(
                        5 -
                        review.rating
                    );


                return `

                    <div class="review-card">

                        <strong>
                            ${escapeHTML(
                                review.name
                            )}
                        </strong>

                        <div class="review-rating">
                            ${stars}
                        </div>

                        <p>
                            ${escapeHTML(
                                review.text
                            )}
                        </p>

                    </div>

                `;

            })
            .join("");

}


/* =====================================================
   3D MOMO EFFECT
===================================================== */

function setup3DMomo() {

    const area =
        document.getElementById(
            "momo3d"
        );


    const momo =
        document.getElementById(
            "momoObject"
        );


    if (!area || !momo)
        return;


    let targetX = 0;

    let targetY = 0;

    let currentX = 0;

    let currentY = 0;

    let targetScale = 1;

    let currentScale = 1;


    function updateTarget(
        clientX,
        clientY
    ) {

        const rect =
            area.getBoundingClientRect();


        const x =
            clientX -
            rect.left;


        const y =
            clientY -
            rect.top;


        const centerX =
            rect.width / 2;


        const centerY =
            rect.height / 2;


        targetY =
            ((x - centerX) /
                centerX) * 13;


        targetX =
            ((y - centerY) /
                centerY) * -10;


        targetScale = 1.045;

    }


    area.addEventListener(
        "mousemove",
        event => {

            updateTarget(
                event.clientX,
                event.clientY
            );

        }
    );


    area.addEventListener(
        "mouseleave",
        () => {

            targetX = 0;

            targetY = 0;

            targetScale = 1;

        }
    );


    area.addEventListener(
        "touchmove",
        event => {

            if (!event.touches.length)
                return;


            const touch =
                event.touches[0];


            updateTarget(
                touch.clientX,
                touch.clientY
            );

        },
        {
            passive: true
        }
    );


    area.addEventListener(
        "touchend",
        () => {

            targetX = 0;

            targetY = 0;

            targetScale = 1;

        }
    );


    function animate() {

        currentX +=
            (targetX - currentX) *
            .08;


        currentY +=
            (targetY - currentY) *
            .08;


        currentScale +=
            (targetScale - currentScale) *
            .08;


        momo.style.transform = `

            translateY(0)

            rotateX(${currentX}deg)

            rotateY(${currentY}deg)

            scale(${currentScale})

        `;


        requestAnimationFrame(
            animate
        );

    }


    animate();

}


/* =====================================================
   KEYBOARD SAFETY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            event.target.matches(
                ".qty-input"
            )
        ) {

            event.preventDefault();

        }

    }
);