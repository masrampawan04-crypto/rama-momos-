"use strict";

/* =====================================================
   RAMA MOMO'S — PREMIUM ORDER SYSTEM
   ===================================================== */


/* =====================================================
   SETTINGS
   ===================================================== */

const SELLER_WHATSAPP = "919359874910";
const DELIVERY_CHARGE = 15;
const STORAGE_CART = "rama_momos_cart";
const STORAGE_ORDERS = "rama_momos_orders";
const STORAGE_DARK = "rama_momos_dark";


/* =====================================================
   GLOBAL DATA
   ===================================================== */

let cart = [];
let orders = [];
let appliedCoupon = false;


/* =====================================================
   SAFE LOCAL STORAGE
   ===================================================== */

function loadData() {

    try {

        const savedCart =
            localStorage.getItem(STORAGE_CART);

        const savedOrders =
            localStorage.getItem(STORAGE_ORDERS);

        const savedDark =
            localStorage.getItem(STORAGE_DARK);


        if (savedCart) {
            cart = JSON.parse(savedCart);
        }


        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        }


        if (savedDark === "true") {
            document.body.classList.add("dark");
        }

    } catch (error) {

        console.error(
            "Storage loading error:",
            error
        );

        cart = [];
        orders = [];

    }

}


function saveCart() {

    localStorage.setItem(
        STORAGE_CART,
        JSON.stringify(cart)
    );

}


function saveOrders() {

    localStorage.setItem(
        STORAGE_ORDERS,
        JSON.stringify(orders)
    );

}


/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */

function showToast(message) {

    const container =
        document.getElementById(
            "toast-container"
        );

    if (!container) {
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

    menuBtn.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle("show");

        }
    );

}


document
    .querySelectorAll(".nav-menu a")
    .forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                if (navMenu) {
                    navMenu.classList.remove("show");
                }

            }
        );

    });


/* =====================================================
   DARK MODE
   ===================================================== */

const darkBtn =
    document.getElementById("darkBtn");


if (darkBtn) {

    darkBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark");

            localStorage.setItem(
                STORAGE_DARK,
                document.body.classList.contains(
                    "dark"
                )
            );

            showToast(
                document.body.classList.contains("dark")
                    ? "Dark mode enabled 🌙"
                    : "Light mode enabled ☀️"
            );

        }
    );

}


/* =====================================================
   MENU FILTER
   ===================================================== */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const foodCards =
    document.querySelectorAll(
        ".food-card"
    );


filterButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(
                function (btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            const category =
                button.dataset.category;


            foodCards.forEach(
                function (card) {

                    const cardCategory =
                        card.dataset.category;


                    if (
                        category === "all" ||
                        category === cardCategory
                    ) {

                        card.style.display = "";

                        setTimeout(
                            function () {

                                card.classList.add(
                                    "animate-in"
                                );

                            },
                            20
                        );

                    } else {

                        card.style.display = "none";

                    }

                }
            );

        }
    );

});


/* =====================================================
   QUANTITY BUTTONS
   ===================================================== */

foodCards.forEach(function (card) {

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


    if (!input) {
        return;
    }


    if (minus) {

        minus.addEventListener(
            "click",
            function () {

                let value =
                    Number(input.value) || 1;


                value--;

                if (value < 1) {
                    value = 1;
                }


                input.value = value;

            }
        );

    }


    if (plus) {

        plus.addEventListener(
            "click",
            function () {

                let value =
                    Number(input.value) || 1;


                value++;

                if (value > 20) {
                    value = 20;
                }


                input.value = value;

            }
        );

    }


    input.addEventListener(
        "change",
        function () {

            let value =
                Number(input.value) || 1;


            if (value < 1) {
                value = 1;
            }


            if (value > 20) {
                value = 20;
            }


            input.value = value;

        }
    );

});


/* =====================================================
   FAVOURITE
   ===================================================== */

const favButtons =
    document.querySelectorAll(
        ".fav-btn"
    );


favButtons.forEach(function (button) {

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

const addButtons =
    document.querySelectorAll(
        ".add-cart"
    );


addButtons.forEach(function (button) {

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
                    "Product information missing"
                );

                return;

            }


            const name =
                nameElement.textContent.trim();


            const price =
                Number(
                    priceElement.textContent
                        .replace(/[^\d]/g, "")
                );


            const quantity =
                Math.max(
                    1,
                    Number(
                        quantityInput
                            ? quantityInput.value
                            : 1
                    ) || 1
                );


            const existing =
                cart.find(
                    function (item) {

                        return item.name === name;

                    }
                );


            if (existing) {

                existing.quantity += quantity;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    quantity: quantity

                });

            }


            saveCart();

            renderCart();

            showToast(
                name +
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


    let total = 0;


    cart.forEach(
        function (item) {

            total += Number(
                item.quantity
            ) || 0;

        }
    );


    count.textContent = total;


    if (total > 0) {

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
   CART TOTAL
   ===================================================== */

function calculateTotals() {

    let subtotal = 0;


    cart.forEach(
        function (item) {

            subtotal +=
                Number(item.price) *
                Number(item.quantity);

        }
    );


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


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            `
            <div class="empty-cart">
                🛒 Your cart is empty
            </div>
            `;

        updateTotals();

        updateCartCount();

        return;

    }


    cart.forEach(
        function (item, index) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            const cartItem =
                document.createElement(
                    "div"
                );


            cartItem.className =
                "cart-item";


            cartItem.innerHTML =
                `
                <div>
                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <p>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </p>
                </div>

                <div>

                    <strong>
                        ₹${itemTotal}
                    </strong>

                    <button
                        type="button"
                        class="remove-cart"
                    >
                        Remove
                    </button>

                </div>
                `;


            const removeButton =
                cartItem.querySelector(
                    ".remove-cart"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    cart.splice(
                        index,
                        1
                    );


                    saveCart();

                    renderCart();

                    showToast(
                        "Item removed 🗑️"
                    );

                }
            );


            cartItems.appendChild(
                cartItem
            );

        }
    );


    updateTotals();

    updateCartCount();

}


/* =====================================================
   UPDATE TOTALS
   ===================================================== */

function updateTotals() {

    const totals =
        calculateTotals();


    const subtotal =
        document.getElementById(
            "subtotal"
        );

    const delivery =
        document.getElementById(
            "delivery"
        );

    const discount =
        document.getElementById(
            "discount"
        );

    const grandTotal =
        document.getElementById(
            "grandTotal"
        );


    if (subtotal) {

        subtotal.textContent =
            "₹" +
            totals.subtotal;

    }


    if (delivery) {

        delivery.textContent =
    totals.delivery > 0
        ? "₹" + totals.delivery
        : "₹0";


    if (discount) {

        discount.textContent =
            "₹" +
            totals.discount;

    }


    if (grandTotal) {

        grandTotal.textContent =
            "₹" +
            totals.total;

    }

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


            if (cart.length === 0) {

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

    const address =
        document.getElementById(
            "customerAddress"
        );

    const name =
        document.getElementById(
            "customerName"
        );

    const phone =
        document.getElementById(
            "customerPhone"
        );


    return {

        name: name
            ? name.value.trim()
            : "",

        phone: phone
            ? phone.value.trim()
            : "",

        address: address
            ? address.value.trim()
            : ""

    };

}


/* =====================================================
   CUSTOMER LOCATION
   ===================================================== */

let customerLocation = null;


const locationBtn =
    document.getElementById(
        "getLocationBtn"
    );


if (locationBtn) {

    locationBtn.addEventListener(
        "click",
        function () {

            if (
                !navigator.geolocation
            ) {

                showToast(
                    "Location is not supported"
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


                    const locationStatus =
                        document.getElementById(
                            "locationStatus"
                        );


                    if (locationStatus) {

                        locationStatus.textContent =
                            "📍 Location permission granted";

                    }


                    showToast(
                        "Location captured successfully 📍"
                    );

                },

                function () {

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
    );

}


/* =====================================================
   GOOGLE MAP
   ===================================================== */

const mapFrame =
    document.getElementById(
        "googleMap"
    );


if (mapFrame) {

    /*
       Replace the map URL with your
       actual business location later.
    */

    if (
        !mapFrame.getAttribute(
            "src"
        )
    ) {

        mapFrame.src =
            "https://www.google.com/maps?q=Arvi,Maharashtra&output=embed";

    }

}


/* =====================================================
   ORDER ID
   ===================================================== */

function createOrderID() {

    const now =
        Date.now()
            .toString()
            .slice(-6);


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return "RAMA-" +
        now +
        "-" +
        random;

}


/* =====================================================
   PLACE ORDER
   ===================================================== */

function placeOrder() {

    if (cart.length === 0) {

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


    if (!customer.address) {

        showToast(
            "Please enter delivery address"
        );

        return;

    }


    const totals =
        calculateTotals();


    const order = {

        id: createOrderID(),

        customer: customer,

        items:
            JSON.parse(
                JSON.stringify(cart)
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
            new Date().toLocaleString(
                "en-IN"
            )

    };


    orders.unshift(order);

    saveOrders();


    showSellerNotification(
        order
    );


    sendOrderToWhatsApp(
        order
    );


    cart = [];

    appliedCoupon = false;

    saveCart();

    renderCart();


    showToast(
        "Order placed successfully 🎉"
    );


    setTimeout(
        function () {

            showOrderConfirmation(
                order
            );

        },
        400
    );

}


/* =====================================================
   WHATSAPP ORDER
   ===================================================== */

function sendOrderToWhatsApp(
    order
) {

    let message =
        "🥟 RAMA MOMO'S NEW ORDER\n\n";


    message +=
        "Order ID: " +
        order.id +
        "\n";


    message +=
        "Customer: " +
        order.customer.name +
        "\n";


    message +=
        "Phone: " +
        order.customer.phone +
        "\n";


    message +=
        "Address: " +
        order.customer.address +
        "\n\n";


    message +=
        "ITEMS:\n";


    order.items.forEach(
        function (item) {

            message +=
                item.name +
                " × " +
                item.quantity +
                " = ₹" +
                (
                    item.price *
                    item.quantity
                ) +
                "\n";

        }
    );


    message +=
        "\nSubtotal: ₹" +
        order.subtotal;


    message +=
        "\nDelivery: ₹" +
        order.delivery;


    message +=
        "\nDiscount: ₹" +
        order.discount;


    message +=
        "\nTOTAL: ₹" +
        order.total;


    if (
        order.location &&
        order.location.latitude
    ) {

        const mapLink =
            "https://www.google.com/maps?q=" +
            order.location.latitude +
            "," +
            order.location.longitude;


        message +=
            "\n\n📍 CUSTOMER LOCATION:\n" +
            mapLink;

    }


    message +=
        "\n\nPlease confirm this order.";


    const url =
        "https://wa.me/" +
        SELLER_WHATSAPP +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        url,
        "_blank"
    );

}


/* =====================================================
   SELLER NOTIFICATION
   ===================================================== */

function showSellerNotification(
    order
) {

    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "seller-notification";


    notification.innerHTML =
        `
        <div class="notification-icon">
            🔔
        </div>

        <div>

            <strong>
                New Order Received!
            </strong>

            <p>
                ${escapeHTML(
                    order.id
                )}
                • ₹${order.total}
            </p>

        </div>
        `;


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            notification.classList.add(
                "show"
            );

        },
        50
    );


    setTimeout(
        function () {

            notification.classList.remove(
                "show"
            );


            setTimeout(
                function () {

                    notification.remove();

                },
                400
            );

        },
        5000
    );

}


/* =====================================================
   ORDER CONFIRMATION
   ===================================================== */

function showOrderConfirmation(
    order
) {

    const box =
        document.createElement(
            "div"
        );


    box.className =
        "order-modal";


    box.innerHTML =
        `
        <div class="order-modal-box">

            <div class="success-icon">
                ✓
            </div>

            <h2>
                Order Confirmed 🎉
            </h2>

            <p>
                Your order has been received.
            </p>

            <strong>
                ${escapeHTML(order.id)}
            </strong>

            <div class="order-modal-total">
                Total: ₹${order.total}
            </div>

            <button
                type="button"
                class="main-btn close-order-modal"
            >
                Done
            </button>

        </div>
        `;


    document.body.appendChild(
        box
    );


    const close =
        box.querySelector(
            ".close-order-modal"
        );


    close.addEventListener(
        "click",
        function () {

            box.remove();

        }
    );

}


/* =====================================================
   SELLER ORDER PANEL
   ===================================================== */

function createSellerPanel() {

    if (
        document.getElementById(
            "sellerPanel"
        )
    ) {

        return;

    }


    const panel =
        document.createElement(
            "section"
        );


    panel.id =
        "sellerPanel";


    panel.className =
        "seller-panel";


    panel.innerHTML =
        `
        <div class="section-heading">

            <p>
                SELLER DASHBOARD
            </p>

            <h2>
                📦 Order Panel
            </h2>

            <div class="heading-line"></div>

        </div>

        <div
            id="sellerOrders"
            class="seller-orders"
        ></div>
        `;


    document.body.appendChild(
        panel
    );


    renderSellerOrders();

}


function renderSellerOrders() {

    const container =
        document.getElementById(
            "sellerOrders"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (orders.length === 0) {

        container.innerHTML =
            `
            <div class="empty-cart">
                📦 No orders yet
            </div>
            `;

        return;

    }


    orders.forEach(
        function (order) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "seller-order-card";


            let itemsHTML = "";


            order.items.forEach(
                function (item) {

                    itemsHTML +=
                        `
                        <p>
                            ${escapeHTML(
                                item.name
                            )}
                            × ${item.quantity}
                            — ₹${
                                item.price *
                                item.quantity
                            }
                        </p>
                        `;

                }
            );


            let locationHTML =
                "Location not shared";


            if (
                order.location &&
                order.location.latitude
            ) {

                const link =
                    "https://www.google.com/maps?q=" +
                    order.location.latitude +
                    "," +
                    order.location.longitude;


                locationHTML =
                    `
                    <a
                        href="${link}"
                        target="_blank"
                        rel="noopener"
                    >
                        📍 Open Customer Location
                    </a>
                    `;

            }


            card.innerHTML =
                `
                <div class="seller-order-top">

                    <strong>
                        ${escapeHTML(
                            order.id
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            order.status
                        )}
                    </span>

                </div>

                <h3>
                    👤 ${
                        escapeHTML(
                            order.customer.name
                        )
                    }
                </h3>

                <p>
                    📱 ${
                        escapeHTML(
                            order.customer.phone
                        )
                    }
                </p>

                <p>
                    🏠 ${
                        escapeHTML(
                            order.customer.address
                        )
                    }
                </p>

                <div class="seller-items">
                    ${itemsHTML}
                </div>

                <p>
                    ${locationHTML}
                </p>

                <div class="seller-total">
                    Total: ₹${order.total}
                </div>

                <div class="seller-actions">

                    <button
                        type="button"
                        data-status="Accepted"
                    >
                        Accept
                    </button>

                    <button
                        type="button"
                        data-status="Preparing"
                    >
                        Preparing
                    </button>

                    <button
                        type="button"
                        data-status="Out for Delivery"
                    >
                        Out for Delivery
                    </button>

                    <button
                        type="button"
                        data-status="Delivered"
                    >
                        Delivered
                    </button>

                    <button
                        type="button"
                        data-status="Cancelled"
                    >
                        Cancel
                    </button>

                </div>
                `;


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
                                order.id,
                                button.dataset.status
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
   UPDATE ORDER STATUS
   ===================================================== */

function updateOrderStatus(orderID, status) {

    const order = orders.find(function (item) {
        return item.id === orderID;
    });

    if (!order) {
        showToast("Order not found");
        return;
    }

    order.status = status;

    saveOrders();

    renderSellerOrders();
    renderCustomerOrders();

    showToast(
        "Order " + orderID + " → " + status
    );
}


/* =====================================================
   CUSTOMER CANCEL ORDER
   ===================================================== */

function cancelOrder(
    orderID
) {

    const order =
        orders.find(
            function (item) {

                return item.id === orderID;

            }
        );


    if (!order) {

        showToast(
            "Order not found"
        );

        return;

    }


    if (
        order.status === "Delivered"
    ) {

        showToast(
            "Delivered order cannot be cancelled"
        );

        return;

    }


    if (
        order.status === "Cancelled"
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


    showToast(
        "Order cancelled ❌"
    );

}


/* =====================================================
   CUSTOMER ORDER HISTORY
   ===================================================== */

function createCustomerOrdersSection() {

    if (
        document.getElementById(
            "customerOrders"
        )
    ) {

        return;

    }


    const section =
        document.createElement(
            "section"
        );


    section.id =
        "customerOrders";


    section.className =
        "customer-orders";


    section.innerHTML =
        `
        <div class="section-heading">

            <p>
                MY ORDERS
            </p>

            <h2>
                📦 Order Status
            </h2>

            <div class="heading-line"></div>

        </div>

        <div
            id="customerOrderList"
        ></div>
        `;


    const cartSection =
        document.getElementById(
            "cart"
        );


    if (cartSection) {

        cartSection.after(
            section
        );

    } else {

        document.body.appendChild(
            section
        );

    }


    renderCustomerOrders();

}


function renderCustomerOrders() {

    const container =
        document.getElementById(
            "customerOrderList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (orders.length === 0) {

        container.innerHTML =
            `
            <div class="empty-cart">
                No orders placed yet 📦
            </div>
            `;

        return;

    }


    orders.forEach(
        function (order) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "customer-order-card";


            const cancelButton =
                order.status !== "Delivered" &&
                order.status !== "Cancelled"
                    ? `
                        <button
                            type="button"
                            class="cancel-order-btn"
                            data-id="${order.id}"
                        >
                            ❌ Cancel Order
                        </button>
                    `
                    : "";


            card.innerHTML =
                `
                <div>

                    <strong>
                        ${escapeHTML(
                            order.id
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            order.status
                        )}
                    </span>

                </div>

                <p>
                    🕐 ${escapeHTML(
                        order.createdAt
                    )}
                </p>

                <p>
                    💰 Total: ₹${order.total}
                </p>

                ${cancelButton}
                `;


            const cancel =
                card.querySelector(
                    ".cancel-order-btn"
                );


            if (cancel) {

                cancel.addEventListener(
                    "click",
                    function () {

                        cancelOrder(
                            cancel.dataset.id
                        );

                        renderCustomerOrders();

                    }
                );

            }


            container.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   SCROLL ANIMATIONS
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
   PLACE ORDER BUTTON
   ===================================================== */

const cartOrderBtn =
    document.getElementById(
        "cartOrderBtn"
    );


if (cartOrderBtn) {

    cartOrderBtn.addEventListener(
        "click",
        function () {

            placeOrder();

        }
    );

}


/* =====================================================
   KEYBOARD ENTER SUPPORT
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
   INITIALIZATION
   ===================================================== */

loadData();

renderCart();

updateCartCount();

createCustomerOrdersSection();

createSellerPanel();

setupScrollAnimations();


/* =====================================================
   FINAL MESSAGE
   ===================================================== */

console.log(
    "RAMA MOMO'S Premium System Loaded Successfully ✅"
)