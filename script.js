"use strict";

/* =====================================================
   RAMA MOMO'S — COMPLETE ORDER SYSTEM
   ===================================================== */

const SELLER_WHATSAPP = "919359874910";
const DELIVERY_CHARGE = 15;

const STORAGE_CART = "rama_momos_cart";
const STORAGE_ORDERS = "rama_momos_orders";
const STORAGE_DARK = "rama_momos_dark";

let cart = [];
let orders = [];
let appliedCoupon = false;
let customerLocation = null;

/* =====================================================
   STORAGE
===================================================== */

function loadData() {
    try {
        const savedCart = localStorage.getItem(STORAGE_CART);
        const savedOrders = localStorage.getItem(STORAGE_ORDERS);
        const savedDark = localStorage.getItem(STORAGE_DARK);

        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            }
        }

        if (savedOrders) {
            const parsedOrders = JSON.parse(savedOrders);
            if (Array.isArray(parsedOrders)) {
                orders = parsedOrders;
            }
        }

        if (savedDark === "true") {
            document.body.classList.add("dark");
        }
    } catch (error) {
        console.error("Storage loading error:", error);
        cart = [];
        orders = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(
            STORAGE_CART,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Cart save error:", error);
    }
}

function saveOrders() {
    try {
        localStorage.setItem(
            STORAGE_ORDERS,
            JSON.stringify(orders)
        );
    } catch (error) {
        console.error("Orders save error:", error);
    }
}

/* =====================================================
   HELPERS
===================================================== */

function escapeHTML(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(message) {
    const container =
        document.getElementById("toast-container");

    if (!container) {
        alert(message);
        return;
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(function () {
        toast.classList.add("show");
    }, 20);

    setTimeout(function () {
        toast.classList.remove("show");

        setTimeout(function () {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 350);
    }, 2500);
}

/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn =
    document.getElementById("menuBtn");

const navMenu =
    document.getElementById("navMenu");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });
}

document
    .querySelectorAll(".nav-menu a")
    .forEach(function (link) {

        link.addEventListener("click", function () {

            if (navMenu) {
                navMenu.classList.remove("show");
            }

        });

    });

/* =====================================================
   DARK MODE
===================================================== */

const darkBtn =
    document.getElementById("darkBtn");

if (darkBtn) {

    darkBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        const enabled =
            document.body.classList.contains("dark");

        try {

            localStorage.setItem(
                STORAGE_DARK,
                enabled ? "true" : "false"
            );

        } catch (error) {

            console.error(
                "Dark mode save error:",
                error
            );

        }

        showToast(
            enabled
                ? "Dark mode enabled 🌙"
                : "Light mode enabled ☀️"
        );

    });

}

/* =====================================================
   MENU FILTER
===================================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const foodCards =
    document.querySelectorAll(".food-card");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const category =
            button.getAttribute("data-category");

        foodCards.forEach(function (card) {

            const cardCategory =
                card.getAttribute("data-category");

            if (
                category === "all" ||
                category === cardCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});

/* =====================================================
   QUANTITY BUTTONS
===================================================== */

document.addEventListener("click", function (event) {

    const plus =
        event.target.closest(".qty-plus");

    const minus =
        event.target.closest(".qty-minus");

    if (!plus && !minus) {
        return;
    }

    const card =
        event.target.closest(".food-card");

    if (!card) {
        return;
    }

    const input =
        card.querySelector(".qty-input");

    if (!input) {
        return;
    }

    let value =
        parseInt(input.value, 10);

    if (isNaN(value)) {
        value = 1;
    }

    if (plus) {
        value++;
    }

    if (minus) {
        value--;
    }

    if (value < 1) {
        value = 1;
    }

    if (value > 20) {
        value = 20;
    }

    input.value = value;

});

document.addEventListener("change", function (event) {

    if (
        !event.target.classList.contains(
            "qty-input"
        )
    ) {
        return;
    }

    let value =
        parseInt(
            event.target.value,
            10
        );

    if (isNaN(value)) {
        value = 1;
    }

    if (value < 1) {
        value = 1;
    }

    if (value > 20) {
        value = 20;
    }

    event.target.value = value;

});

/* =====================================================
   FAVOURITE BUTTONS
===================================================== */

document
    .querySelectorAll(".fav-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                button.classList.toggle(
                    "active"
                );

                if (
                    button.classList.contains(
                        "active"
                    )
                ) {

                    button.textContent = "♥";

                    showToast(
                        "Added to favourites ❤️"
                    );

                } else {

                    button.textContent = "♡";

                    showToast(
                        "Removed from favourites"
                    );

                }

            }
        );

    });

/* =====================================================
   ADD TO CART
===================================================== */

document
    .querySelectorAll(".add-cart")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const card =
                    button.closest(
                        ".food-card"
                    );

                if (!card) {
                    return;
                }

                const nameElement =
                    card.querySelector(
                        ".food-name"
                    );

                const priceElement =
                    card.querySelector(
                        ".food-price"
                    );

                const quantityInput =
                    card.querySelector(
                        ".qty-input"
                    );

                if (
                    !nameElement ||
                    !priceElement
                ) {

                    showToast(
                        "Product information missing ❌"
                    );

                    return;
                }

                const name =
                    nameElement.textContent.trim();

                const price =
                    parseInt(
                        priceElement.textContent
                            .replace(/[^\d]/g, ""),
                        10
                    );

                if (
                    isNaN(price) ||
                    price <= 0
                ) {

                    showToast(
                        "Invalid product price ❌"
                    );

                    return;
                }

                let quantity =
                    quantityInput
                        ? parseInt(
                            quantityInput.value,
                            10
                        )
                        : 1;

                if (
                    isNaN(quantity) ||
                    quantity < 1
                ) {
                    quantity = 1;
                }

                if (quantity > 20) {
                    quantity = 20;
                }

                const existing =
                    cart.find(
                        function (item) {

                            return (
                                item.name === name
                            );

                        }
                    );

                if (existing) {

                    existing.quantity =
                        Number(
                            existing.quantity || 0
                        ) + quantity;

                    if (
                        existing.quantity > 20
                    ) {
                        existing.quantity = 20;
                    }

                } else {

                    cart.push({

                        name: name,

                        price: price,

                        quantity: quantity

                    });

                }

                saveCart();

                renderCart();

                updateCartCount();

                updateTotals();

                showToast(
                    name +
                    " × " +
                    quantity +
                    " added to cart 🛒"
                );

                button.classList.add(
                    "added"
                );

                setTimeout(
                    function () {

                        button.classList.remove(
                            "added"
                        );

                    },
                    600
                );

            }
        );

    });

/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const count =
        document.getElementById(
            "cart-count"
        );

    if (!count) {
        return;
    }

    let totalQuantity = 0;

    if (Array.isArray(cart)) {

        cart.forEach(
            function (item) {

                const quantity =
                    Number(
                        item.quantity
                    );

                if (!isNaN(quantity)) {

                    totalQuantity +=
                        quantity;

                }

            }
        );

    }

    count.textContent =
        totalQuantity;

    if (totalQuantity > 0) {

        count.classList.add(
            "cart-bounce"
        );

        setTimeout(
            function () {

                count.classList.remove(
                    "cart-bounce"
                );

            },
            500
        );

    }

}

/* =====================================================
   CALCULATE TOTALS
===================================================== */

function calculateTotals() {

    let subtotal = 0;

    if (Array.isArray(cart)) {

        cart.forEach(
            function (item) {

                const price =
                    Number(item.price) || 0;

                const quantity =
                    Number(item.quantity) || 0;

                subtotal +=
                    price * quantity;

            }
        );

    }

    let discount = 0;

    if (
        appliedCoupon &&
        subtotal > 0
    ) {

        discount =
            Math.round(
                subtotal * 0.10
            );

    }

    const delivery =
        subtotal > 0
            ? DELIVERY_CHARGE
            : 0;

    const total =
        subtotal -
        discount +
        delivery;

    return {

        subtotal: subtotal,

        discount: discount,

        delivery: delivery,

        total: total

    };

}

/* =====================================================
   UPDATE TOTALS
===================================================== */

function updateTotals() {

    const totals =
        calculateTotals();

    const subtotalElement =
        document.getElementById(
            "subtotal"
        );

    const deliveryElement =
        document.getElementById(
            "delivery"
        );

    const discountElement =
        document.getElementById(
            "discount"
        );

    const grandTotalElement =
        document.getElementById(
            "grandTotal"
        );

    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            totals.subtotal;

    }

    if (deliveryElement) {

        deliveryElement.textContent =
            "₹" +
            totals.delivery;

    }

    if (discountElement) {

        discountElement.textContent =
            "₹" +
            totals.discount;

    }

    if (grandTotalElement) {

        grandTotalElement.textContent =
            "₹" +
            totals.total;

    }

}

/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    if (!cartItems) {
        return;
    }

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        cartItems.innerHTML =
            '<div class="empty-cart">' +
            '🛒 Your cart is empty' +
            '</div>';

        updateTotals();
        updateCartCount();

        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(
        function (item, index) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            const itemTotal =
                price * quantity;

            const cartItem =
                document.createElement(
                    "div"
                );

            cartItem.className =
                "cart-item";

            const left =
                document.createElement(
                    "div"
                );

            const right =
                document.createElement(
                    "div"
                );

            const name =
                document.createElement(
                    "strong"
                );

            name.textContent =
                item.name || "Item";

            const details =
                document.createElement(
                    "p"
                );

            details.textContent =
                "₹" +
                price +
                " × " +
                quantity;

            const total =
                document.createElement(
                    "strong"
                );

            total.textContent =
                "₹" +
                itemTotal;

            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.type =
                "button";

            removeButton.className =
                "remove-cart";

            removeButton.textContent =
                "Remove";

            removeButton.addEventListener(
                "click",
                function () {

                    cart.splice(
                        index,
                        1
                    );

                    saveCart();

                    renderCart();

                    updateCartCount();

                    updateTotals();

                    showToast(
                        "Item removed 🗑️"
                    );

                }
            );

            left.appendChild(name);
            left.appendChild(details);

            right.appendChild(total);

            right.appendChild(
                removeButton
            );

            cartItem.appendChild(left);
            cartItem.appendChild(right);

            cartItems.appendChild(
                cartItem
            );

        }
    );

    updateTotals();
    updateCartCount();

}

/* =====================================================
   COUPON
===================================================== */

const couponBtn =
    document.getElementById(
        "couponBtn"
    );

if (couponBtn) {

    couponBtn.addEventListener(
        "click",
        function () {

            const coupon =
                document.getElementById(
                    "coupon"
                );

            if (!coupon) {
                return;
            }

            const code =
                coupon.value
                    .trim()
                    .toUpperCase();

            if (
                !Array.isArray(cart) ||
                cart.length === 0
            ) {

                showToast(
                    "Add items to cart first 🛒"
                );

                return;
            }

            if (code === "RAMA10") {

                appliedCoupon = true;

                updateTotals();

                showToast(
                    "10% discount applied 🎉"
                );

            } else {

                appliedCoupon = false;

                updateTotals();

                showToast(
                    "Invalid coupon code ❌"
                );

            }

        }
    );

}

/* =====================================================
   CUSTOMER DETAILS
===================================================== */

function getCustomerDetails() {

    const name =
        document.getElementById(
            "customerName"
        );

    const phone =
        document.getElementById(
            "customerPhone"
        );

    const address =
        document.getElementById(
            "customerAddress"
        );

    const landmark =
        document.getElementById(
            "customerLandmark"
        );

    return {

        name:
            name
                ? name.value.trim()
                : "",

        phone:
            phone
                ? phone.value.trim()
                : "",

        address:
            address
                ? address.value.trim()
                : "",

        landmark:
            landmark
                ? landmark.value.trim()
                : ""

    };

}

/* =====================================================
   LOCATION
===================================================== */

function getCustomerLocation() {

    if (!navigator.geolocation) {

        showToast(
            "Location is not supported ❌"
        );

        return;
    }

    showToast(
        "Requesting location permission 📍"
    );

    navigator.geolocation.getCurrentPosition(

        function (position) {

            customerLocation = {

                latitude:
                    position.coords.latitude,

                longitude:
                    position.coords.longitude

            };

            const latitude =
                document.getElementById(
                    "customerLatitude"
                );

            const longitude =
                document.getElementById(
                    "customerLongitude"
                );

            const mapLatitude =
                document.getElementById(
                    "mapLatitude"
                );

            const mapLongitude =
                document.getElementById(
                    "mapLongitude"
                );

            const status =
                document.getElementById(
                    "locationStatus"
                );

            if (latitude) {

                latitude.value =
                    position.coords.latitude;

            }

            if (longitude) {

                longitude.value =
                    position.coords.longitude;

            }

            if (mapLatitude) {

                mapLatitude.textContent =
                    position.coords.latitude;

            }

            if (mapLongitude) {

                mapLongitude.textContent =
                    position.coords.longitude;

            }

            if (status) {

                status.textContent =
                    "📍 Location captured successfully";

            }

            showToast(
                "Location captured successfully 📍"
            );

        },

        function (error) {

            console.error(
                "Location error:",
                error
            );

            showToast(
                "Location permission denied ❌"
            );

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}

/* =====================================================
   LOCATION BUTTONS
===================================================== */

const locationBtn =
    document.getElementById(
        "locationBtn"
    );

const mapLocationBtn =
    document.getElementById(
        "mapLocationBtn"
    );

if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        getCustomerLocation
    );

}

if (mapLocationBtn) {

    mapLocationBtn.addEventListener(
        "click",
        getCustomerLocation
    );

}

/* =====================================================
   ORDER ID
===================================================== */

function createOrderID() {

    const time =
        Date.now()
            .toString()
            .slice(-6);

    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );

    return (
        "RAMA-" +
        time +
        "-" +
        random
    );

}

/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty 🛒"
        );

        return;
    }

    const customer =
        getCustomerDetails();

    if (!customer.name) {

        showToast(
            "Please enter your name"
        );

        return;
    }

    if (!customer.phone) {

        showToast(
            "Please enter mobile number"
        );

        return;
    }

    if (
        !/^[0-9]{10}$/.test(
            customer.phone
        )
    ) {

        showToast(
            "Please enter valid 10 digit mobile number"
        );

        return;
    }

    if (!customer.address) {

        showToast(
            "Please enter delivery address"
        );

        return;
    }

    const totals =
        calculateTotals();

    const order = {

        id:
            createOrderID(),

        customer: {

            name:
                customer.name,

            phone:
                customer.phone,

            address:
                customer.address,

            landmark:
                customer.landmark

        },

        items:
            cart.map(
                function (item) {

                    return {

                        name:
                            item.name,

                        price:
                            Number(
                                item.price
                            ) || 0,

                        quantity:
                            Number(
                                item.quantity
                            ) || 1

                    };

                }
            ),

        subtotal:
            totals.subtotal,

        delivery:
            totals.delivery,

        discount:
            totals.discount,

        total:
            totals.total,

        location:
            customerLocation,

        status:
            "New Order",

        createdAt:
            new Date()
                .toLocaleString(
                    "en-IN"
                )

    };

    orders.unshift(order);

    saveOrders();

    sendOrderToWhatsApp(order);

    cart = [];

    appliedCoupon = false;

    saveCart();

    renderCart();

    updateCartCount();

    renderCustomerOrders();

    renderSellerOrders();

    showToast(
        "Order sent to WhatsApp successfully 🎉"
    );

    setTimeout(
        function () {

            showOrderConfirmation(
                order
            );

        },
        500
    );

}

/* =====================================================
   WHATSAPP ORDER
===================================================== */

function sendOrderToWhatsApp(order) {

    let message = "";

    message +=
        "🥟 *RAMA MOMO'S NEW ORDER* 🥟\n";

    message +=
        "━━━━━━━━━━━━━━━━━━\n\n";

    message +=
        "🆔 Order ID: " +
        order.id +
        "\n";

    message +=
        "👤 Customer: " +
        order.customer.name +
        "\n";

    message +=
        "📱 Phone: " +
        order.customer.phone +
        "\n";

    message +=
        "🏠 Address: " +
        order.customer.address +
        "\n";

    if (
        order.customer.landmark
    ) {

        message +=
            "📍 Landmark: " +
            order.customer.landmark +
            "\n";

    }

    message += "\n";

    message +=
        "🛒 *ORDER ITEMS*\n";

    message +=
        "━━━━━━━━━━━━━━━━━━\n";

    order.items.forEach(
        function (item, index) {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 1;

            const itemTotal =
                price * quantity;

            message +=
                (index + 1) +
                ". " +
                item.name +
                "\n";

            message +=
                "   Quantity: " +
                quantity +
                "\n";

            message +=
                "   Price: ₹" +
                price +
                " × " +
                quantity +
                " = ₹" +
                itemTotal +
                "\n\n";

        }
    );

    message +=
        "━━━━━━━━━━━━━━━━━━\n";

    message +=
        "Subtotal: ₹" +
        order.subtotal +
        "\n";

    message +=
        "Delivery: ₹" +
        order.delivery +
        "\n";

    message +=
        "Discount: ₹" +
        order.discount +
        "\n";

    message +=
        "💰 *TOTAL: ₹" +
        order.total +
        "*\n";

    if (
        order.location &&
        order.location.latitude != null &&
        order.location.longitude != null
    ) {

        const mapLink =
            "https://www.google.com/maps?q=" +
            order.location.latitude +
            "," +
            order.location.longitude;

        message +=
            "\n📍 *Customer Location:*\n";

        message +=
            mapLink +
            "\n";

    }

    message +=
        "\n🕐 Order Time: " +
        order.createdAt +
        "\n";

    message +=
        "\n✅ Please confirm this order.";

    const whatsappURL =
        "https://wa.me/" +
        SELLER_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            message
        );

    window.open(
        whatsappURL,
        "_blank"
    );

}

/* =====================================================
   ORDER CONFIRMATION
===================================================== */

function showOrderConfirmation(order) {

    const box =
        document.createElement(
            "div"
        );

    box.className =
        "order-modal";

    const modalBox =
        document.createElement(
            "div"
        );

    modalBox.className =
        "order-modal-box";

    modalBox.innerHTML =
        '<div class="success-icon">✓</div>' +

        '<h2>Order Confirmed 🎉</h2>' +

        '<p>Your order has been received.</p>' +

        "<strong>" +
        escapeHTML(
            order.id
        ) +
        "</strong>" +

        '<div class="order-modal-total">' +
        "Total: ₹" +
        (Number(order.total) || 0) +
        "</div>" +

        '<button type="button" class="main-btn close-order-modal">' +
        "Done" +
        "</button>";

    box.appendChild(
        modalBox
    );

    document.body.appendChild(
        box
    );

    const closeButton =
        box.querySelector(
            ".close-order-modal"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                box.remove();

            }
        );

    }

}

/* =====================================================
   ORDER STATUS
===================================================== */

function updateOrderStatus(
    orderID,
    status
) {

    const order =
        orders.find(
            function (item) {

                return (
                    item.id === orderID
                );

            }
        );

    if (!order) {

        showToast(
            "Order not found ❌"
        );

        return;
    }

    order.status =
        status;

    saveOrders();

    renderSellerOrders();

    renderCustomerOrders();

    showToast(
        "Order " +
        orderID +
        " → " +
        status
    );

}

/* =====================================================
   CANCEL ORDER
===================================================== */

function cancelOrder(
    orderID
) {

    const order =
        orders.find(
            function (item) {

                return (
                    item.id === orderID
                );

            }
        );

    if (!order) {

        showToast(
            "Order not found"
        );

        return;
    }

    if (
        order.status ===
        "Delivered"
    ) {

        showToast(
            "Delivered order cannot be cancelled"
        );

        return;
    }

    if (
        order.status ===
        "Cancelled"
    ) {

        showToast(
            "Order already cancelled"
        );

        return;
    }

    const confirmed =
        window.confirm(
            "Cancel order " +
            orderID +
            "?"
        );

    if (!confirmed) {
        return;
    }

    order.status =
        "Cancelled";

    saveOrders();

    renderSellerOrders();

    renderCustomerOrders();

    showToast(
        "Order cancelled ❌"
    );

}

/* =====================================================
   CUSTOMER ORDERS
===================================================== */

function renderCustomerOrders() {

    const container =
        document.getElementById(
            "customerOrders"
        );

    if (!container) {
        return;
    }

    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        container.innerHTML =
            '<div class="no-orders">' +
            '📦 No orders placed yet.' +
            "</div>";

        return;
    }

    container.innerHTML = "";

    orders.forEach(
        function (order) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "customer-order-card";

            const orderId =
                order.id ||
                "Unknown";

            const status =
                order.status ||
                "New Order";

            const createdAt =
                order.createdAt ||
                "";

            const total =
                Number(
                    order.total
                ) || 0;

            card.innerHTML =
                '<div class="customer-order-top">' +

                "<strong>" +
                escapeHTML(
                    orderId
                ) +
                "</strong>" +

                "<span>" +
                escapeHTML(
                    status
                ) +
                "</span>" +

                "</div>" +

                "<p>🕐 " +
                escapeHTML(
                    createdAt
                ) +
                "</p>" +

                "<p>💰 Total: ₹" +
                total +
                "</p>";

            if (
                status !==
                    "Delivered" &&
                status !==
                    "Cancelled"
            ) {

                const cancelButton =
                    document.createElement(
                        "button"
                    );

                cancelButton.type =
                    "button";

                cancelButton.className =
                    "cancel-order-btn";

                cancelButton.textContent =
                    "❌ Cancel Order";

                cancelButton.addEventListener(
                    "click",
                    function () {

                        cancelOrder(
                            orderId
                        );

                    }
                );

                card.appendChild(
                    cancelButton
                );

            }

            container.appendChild(
                card
            );

        }
    );

}

/* =====================================================
   SELLER ORDERS
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

    const totalOrders =
        Array.isArray(orders)
            ? orders.length
            : 0;

    if (count) {

        count.textContent =
            totalOrders +
            (
                totalOrders === 1
                    ? " Order"
                    : " Orders"
            );

    }

    if (!container) {
        return;
    }

    if (
        !Array.isArray(orders) ||
        orders.length === 0
    ) {

        container.innerHTML =
            '<div class="no-orders">' +
            '🔔 No new orders.' +
            "</div>";

        return;
    }

    container.innerHTML = "";

    orders.forEach(
        function (order) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "seller-order-card";

            const customer =
                order.customer ||
                {};

            const customerName =
                customer.name ||
                "Customer";

            const customerPhone =
                customer.phone ||
                "Not provided";

            const customerAddress =
                customer.address ||
                "Not provided";

            const landmark =
                customer.landmark ||
                "";

            const orderId =
                order.id ||
                "Unknown";

            const status =
                order.status ||
                "New Order";

            const total =
                Number(
                    order.total
                ) || 0;

            let itemsHTML = "";

            if (
                Array.isArray(
                    order.items
                ) &&
                order.items.length > 0
            ) {

                order.items.forEach(
                    function (item) {

                        const itemName =
                            item.name ||
                            "Item";

                        const itemPrice =
                            Number(
                                item.price
                            ) || 0;

                        const itemQuantity =
                            Number(
                                item.quantity
                            ) || 1;

                        const itemTotal =
                            itemPrice *
                            itemQuantity;

                        itemsHTML +=
                            "<p>" +
                            escapeHTML(
                                itemName
                            ) +
                            " × " +
                            itemQuantity +
                            " — ₹" +
                            itemTotal +
                            "</p>";

                    }
                );

            } else {

                itemsHTML =
                    "<p>" +
                    "No item information available." +
                    "</p>";

            }

            card.innerHTML =
                '<div class="seller-order-top">' +

                "<strong>" +
                escapeHTML(
                    orderId
                ) +
                "</strong>" +

                "<span>" +
                escapeHTML(
                    status
                ) +
                "</span>" +

                "</div>" +

                "<h3>👤 " +
                escapeHTML(
                    customerName
                ) +
                "</h3>" +

                "<p>📱 " +
                escapeHTML(
                    customerPhone
                ) +
                "</p>" +

                "<p>🏠 " +
                escapeHTML(
                    customerAddress
                ) +
                "</p>" +

                (
                    landmark
                        ? "<p>📍 " +
                          escapeHTML(
                              landmark
                          ) +
                          "</p>"
                        : ""
                ) +

                '<div class="seller-items">' +
                itemsHTML +
                "</div>" +

                '<div class="seller-total">' +
                "Total: ₹" +
                total +
                "</div>" +

                '<div class="seller-actions">' +

                '<button type="button" data-status="Accepted">' +
                "Accept" +
                "</button>" +

                '<button type="button" data-status="Preparing">' +
                "Preparing" +
                "</button>" +

                '<button type="button" data-status="Out for Delivery">' +
                "Out for Delivery" +
                "</button>" +

                '<button type="button" data-status="Delivered">' +
                "Delivered" +
                "</button>" +

                '<button type="button" data-status="Cancelled">' +
                "Cancel" +
                "</button>" +

                "</div>";

            const actionButtons =
                card.querySelectorAll(
                    ".seller-actions button"
                );

            actionButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            updateOrderStatus(
                                orderId,
                                button.getAttribute(
                                    "data-status"
                                )
                            );

                        }
                    );

                }
            );

            container.appendChild(
                card
            );

        }
    );

}

/* =====================================================
   CHECKOUT BUTTON
===================================================== */

const checkoutBtn =
    document.getElementById(
        "checkoutBtn"
    );

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        function () {

            if (
                !Array.isArray(cart) ||
                cart.length === 0
            ) {

                showToast(
                    "Your cart is empty 🛒"
                );

                return;
            }

            const checkout =
                document.getElementById(
                    "checkout"
                );

            if (checkout) {

                checkout.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}

/* =====================================================
   ADDRESS FORM
===================================================== */

const addressForm =
    document.getElementById(
        "addressForm"
    );

if (addressForm) {

    addressForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            placeOrder();

        }
    );

}

/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            navMenu
        ) {

            navMenu.classList.remove(
                "show"
            );

        }

    }
);

/* =====================================================
   SCROLL ANIMATION
===================================================== */

function setupScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".food-card, .about-box, .contact-box, .section-heading"
        );

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "animate-in"
                );

            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "animate-in"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );

    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}

/* =====================================================
   INITIALIZATION
===================================================== */

loadData();

renderCart();

updateCartCount();

updateTotals();

renderCustomerOrders();

renderSellerOrders();

setupScrollAnimations();

console.log(
    "RAMA MOMO'S - System Loaded Successfully"
);