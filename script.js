/* =========================================================
   RAMA MOMO'S - COMPLETE JAVASCRIPT
========================================================= */

"use strict";


/* ================= SETTINGS ================= */

const DELIVERY_CHARGE = 15;

const SELLER_WHATSAPP = "919359874910";


/* ================= DATA ================= */

let cart = JSON.parse(
    localStorage.getItem("ramaCart") || "[]"
);

let orders = JSON.parse(
    localStorage.getItem("ramaOrders") || "[]"
);

let reviews = JSON.parse(
    localStorage.getItem("ramaReviews") || "[]"
);

let appliedCoupon = false;

let selectedRating = 0;

let customerLocation = null;


/* ================= HELPERS ================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function saveCart() {
    localStorage.setItem(
        "ramaCart",
        JSON.stringify(cart)
    );
}

function saveOrders() {
    localStorage.setItem(
        "ramaOrders",
        JSON.stringify(orders)
    );
}

function saveReviews() {
    localStorage.setItem(
        "ramaReviews",
        JSON.stringify(reviews)
    );
}

function money(amount) {
    return "₹" + Number(amount || 0);
}

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ================= MOBILE MENU ================= */

$("#menuBtn")?.addEventListener(
    "click",
    function () {

        $("#navMenu")?.classList.toggle("show");

    }
);


$$(".nav-menu a").forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            $("#navMenu")?.classList.remove("show");

        }
    );

});


/* ================= DARK MODE ================= */

$("#darkBtn")?.addEventListener(
    "click",
    function () {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "ramaDarkMode",
            document.body.classList.contains("dark")
        );

    }
);


if (
    localStorage.getItem("ramaDarkMode") === "true"
) {

    document.body.classList.add("dark");

}


/* ================= FILTER ================= */

$$(".filter-btn").forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            $$(".filter-btn").forEach(
                function (item) {
                    item.classList.remove("active");
                }
            );

            button.classList.add("active");

            const category =
                button.dataset.category;

            $$(".food-card").forEach(
                function (card) {

                    if (
                        category === "all" ||
                        card.dataset.category === category
                    ) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                }
            );

        }
    );

});


/* ================= FAVOURITE ================= */

$$(".fav-btn").forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            button.classList.toggle("active");

            button.textContent =
                button.classList.contains("active")
                    ? "♥"
                    : "♡";

        }
    );

});


/* ================= QUANTITY ================= */

$$(".food-card").forEach(function (card) {

    const minus =
        card.querySelector(".qty-minus");

    const plus =
        card.querySelector(".qty-plus");

    const input =
        card.querySelector(".qty-input");


    minus?.addEventListener(
        "click",
        function () {

            let value =
                Number(input.value) || 1;

            value = Math.max(1, value - 1);

            input.value = value;

        }
    );


    plus?.addEventListener(
        "click",
        function () {

            let value =
                Number(input.value) || 1;

            value = Math.min(20, value + 1);

            input.value = value;

        }
    );

});


/* ================= ADD TO CART ================= */

$$(".add-cart").forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const card =
                button.closest(".food-card");

            if (!card) return;

            const name =
                card.querySelector(".food-name")
                    ?.textContent.trim();

            const priceText =
                card.querySelector(".food-price")
                    ?.textContent
                    .replace(/[^\d]/g, "");

            const price =
                Number(priceText) || 0;

            const quantityInput =
                card.querySelector(".qty-input");

            const quantity =
                Math.max(
                    1,
                    Math.min(
                        20,
                        Number(quantityInput?.value) || 1
                    )
                );


            const existing =
                cart.find(
                    function (item) {
                        return item.name === name;
                    }
                );


            if (existing) {

                existing.quantity =
                    Math.min(
                        20,
                        existing.quantity + quantity
                    );

            } else {

                cart.push({
                    name,
                    price,
                    quantity
                });

            }


            saveCart();

            renderCart();

            updateCartCount();

            updateTotals();

            showToast(
                name + " added to cart 🛒"
            );

        }
    );

});


/* ================= CART COUNT ================= */

function updateCartCount() {

    const count =
        cart.reduce(
            function (total, item) {
                return total +
                    Number(item.quantity || 0);
            },
            0
        );

    const element =
        $("#cart-count");

    if (element) {
        element.textContent = count;
    }

}


/* ================= TOTALS ================= */

function calculateTotals() {

    const subtotal =
        cart.reduce(
            function (total, item) {

                return total +
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

            },
            0
        );


    let discount = 0;

    if (appliedCoupon) {

        discount =
            Math.round(subtotal * 0.10);

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
        subtotal,
        delivery,
        discount,
        total
    };

}


function updateTotals() {

    const totals =
        calculateTotals();

    if ($("#subtotal")) {
        $("#subtotal").textContent =
            money(totals.subtotal);
    }

    if ($("#delivery")) {
        $("#delivery").textContent =
            money(totals.delivery);
    }

    if ($("#discount")) {
        $("#discount").textContent =
            money(totals.discount);
    }

    if ($("#grandTotal")) {
        $("#grandTotal").textContent =
            money(totals.total);
    }

}


/* ================= RENDER CART ================= */

function renderCart() {

    const container =
        $("#cartItems");

    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML =
            '<div class="empty-cart">' +
            '🛒 Your cart is empty' +
            '</div>';

        return;

    }


    container.innerHTML = "";


    cart.forEach(
        function (item, index) {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);


            const div =
                document.createElement("div");

            div.className = "cart-item";


            div.innerHTML =

                "<div>" +

                "<strong>" +
                escapeHTML(item.name) +
                "</strong>" +

                "<p>" +
                money(item.price) +
                " × " +
                item.quantity +
                " = " +
                money(itemTotal) +
                "</p>" +

                "</div>" +


                "<div>" +

                "<button " +
                'class="qty-minus cart-minus" ' +
                'data-index="' + index + '"' +
                ">−</button>" +

                "<strong>" +
                item.quantity +
                "</strong>" +

                "<button " +
                'class="qty-plus cart-plus" ' +
                'data-index="' + index + '"' +
                ">+</button>" +

                "<button " +
                'class="remove-cart" ' +
                'data-index="' + index + '"' +
                ">" +
                "Remove" +
                "</button>" +

                "</div>";


            container.appendChild(div);

        }
    );


    $$(".cart-minus").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    if (
                        cart[index] &&
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }

                    saveCart();

                    renderCart();

                    updateCartCount();

                    updateTotals();

                }
            );

        }
    );


    $$(".cart-plus").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    if (cart[index]) {

                        cart[index].quantity =
                            Math.min(
                                20,
                                cart[index].quantity + 1
                            );

                    }

                    saveCart();

                    renderCart();

                    updateCartCount();

                    updateTotals();

                }
            );

        }
    );


    $$(".remove-cart").forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(button.dataset.index);

                    cart.splice(index, 1);

                    saveCart();

                    renderCart();

                    updateCartCount();

                    updateTotals();

                    showToast(
                        "Item removed"
                    );

                }
            );

        }
    );

}


/* ================= COUPON ================= */

$("#couponBtn")?.addEventListener(
    "click",
    function () {

        const code =
            $("#coupon")?.value
                .trim()
                .toUpperCase();


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
                "Invalid coupon ❌"
            );

        }

    }
);


/* ================= CHECKOUT BUTTON ================= */

$("#checkoutBtn")?.addEventListener(
    "click",
    function () {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty 🛒"
            );

            return;

        }

        document
            .querySelector("#checkout")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* ================= LOCATION ================= */

function getLocation() {

    if (!navigator.geolocation) {

        showToast(
            "GPS is not supported ❌"
        );

        return;

    }


    showToast(
        "Getting your location 📍"
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            customerLocation = {
                latitude,
                longitude
            };


            if ($("#customerLatitude")) {
                $("#customerLatitude").value =
                    latitude;
            }

            if ($("#customerLongitude")) {
                $("#customerLongitude").value =
                    longitude;
            }

            if ($("#mapLatitude")) {
                $("#mapLatitude").textContent =
                    latitude.toFixed(6);
            }

            if ($("#mapLongitude")) {
                $("#mapLongitude").textContent =
                    longitude.toFixed(6);
            }

            if ($("#locationStatus")) {
                $("#locationStatus").textContent =
                    "Location selected successfully 📍";
            }


            showToast(
                "Location selected 📍"
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


$("#locationBtn")?.addEventListener(
    "click",
    getLocation
);

$("#mapLocationBtn")?.addEventListener(
    "click",
    getLocation
);


/* ================= CUSTOMER DETAILS ================= */

function getCustomerDetails() {

    return {

        name:
            $("#customerName")
                ?.value.trim() || "",

        phone:
            $("#customerPhone")
                ?.value.trim() || "",

        address:
            $("#customerAddress")
                ?.value.trim() || "",

        landmark:
            $("#customerLandmark")
                ?.value.trim() || ""

    };

}


/* ================= ORDER ID ================= */

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

    return "RAMA-" +
        time +
        "-" +
        random;

}


/* ================= PLACE ORDER ================= */

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

        id: createOrderID(),

        customer: {

            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            landmark: customer.landmark

        },

        items: cart.map(
            function (item) {

                return {

                    name: item.name,

                    price:
                        Number(item.price) || 0,

                    quantity:
                        Number(item.quantity) || 1

                };

            }
        ),

        subtotal: totals.subtotal,

        delivery: totals.delivery,

        discount: totals.discount,

        total: totals.total,

        location: customerLocation,

        status: "Confirmed",

        createdAt:
            new Date()
                .toLocaleString("en-IN")

    };


    orders.unshift(order);

    saveOrders();


    /* =========================================
       IMPORTANT:
       WhatsApp is NOT opened here.
       ========================================= */


    cart = [];

    appliedCoupon = false;

    saveCart();


    renderCart();

    updateCartCount();

    updateTotals();

    renderCustomerOrders();


    showOrderConfirmation(order);

}


/* ================= ADDRESS FORM ================= */

$("#addressForm")?.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        placeOrder();

    }
);


/* ================= ORDER CONFIRMATION ================= */

function showOrderConfirmation(order) {

    const box =
        document.createElement("div");

    box.className =
        "order-modal";


    const modal =
        document.createElement("div");

    modal.className =
        "order-modal-box";


    modal.innerHTML =

        '<div class="success-icon">✓</div>' +

        "<h2>Order Confirmed 🎉</h2>" +

        "<p>Your order is confirmed successfully.</p>" +

        "<strong>" +
        escapeHTML(order.id) +
        "</strong>" +

        '<div class="order-modal-total">' +
        "Total: " +
        money(order.total) +
        "</div>" +

        '<p class="confirmation-note">' +
        "Thank you for ordering from RAMA MOMO'S ❤️" +
        "</p>" +

        '<button ' +
        'type="button" ' +
        'class="main-btn close-order-modal">' +
        "Done" +
        "</button>";


    box.appendChild(modal);

    document.body.appendChild(box);


    modal
        .querySelector(".close-order-modal")
        ?.addEventListener(
            "click",
            function () {

                box.remove();

                document
                    .querySelector("#orders")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

}


/* ================= CUSTOMER ORDERS ================= */

function renderCustomerOrders() {

    const container =
        $("#customerOrders");

    if (!container) return;


    if (orders.length === 0) {

        container.innerHTML =
            '<div class="no-orders">' +
            "📦 No orders placed yet." +
            "</div>";

        return;

    }


    container.innerHTML = "";


    orders.forEach(
        function (order) {

            const card =
                document.createElement("div");

            card.className =
                "order-card";


            let itemsHTML = "";


            order.items.forEach(
                function (item) {

                    itemsHTML +=

                        '<div class="order-item-row">' +

                        "<span>" +
                        escapeHTML(item.name) +
                        " × " +
                        item.quantity +
                        "</span>" +

                        "<strong>" +
                        money(
                            item.price *
                            item.quantity
                        ) +
                        "</strong>" +

                        "</div>";

                }
            );


            card.innerHTML =

                '<div class="order-card-header">' +

                "<div>" +

                '<div class="order-id">' +
                escapeHTML(order.id) +
                "</div>" +

                '<div class="order-date">' +
                escapeHTML(order.createdAt) +
                "</div>" +

                "</div>" +

                '<span class="status-badge">' +
                escapeHTML(order.status) +
                "</span>" +

                "</div>" +


                '<div class="order-items">' +
                itemsHTML +
                "</div>" +


                '<div class="order-total">' +

                "<span>Total</span>" +

                "<strong>" +
                money(order.total) +
                "</strong>" +

                "</div>" +

                "<p>" +
                escapeHTML(order.customer.address) +
                "</p>";


            container.appendChild(card);

        }
    );

}


/* ================= REVIEWS ================= */

$$(".review-star").forEach(
    function (star) {

        star.addEventListener(
            "click",
            function () {

                selectedRating =
                    Number(
                        star.dataset.rating
                    );


                $$(".review-star")
                    .forEach(
                        function (item) {

                            item.classList.toggle(
                                "active",
                                Number(
                                    item.dataset.rating
                                ) <= selectedRating
                            );

                        }
                    );

            }
        );

    }
);


/* ================= SUBMIT REVIEW ================= */

$("#reviewForm")?.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            $("#reviewName")
                ?.value.trim() || "";

        const text =
            $("#reviewText")
                ?.value.trim() || "";


        if (!name) {

            showToast(
                "Please enter your name"
            );

            return;

        }


        if (!selectedRating) {

            showToast(
                "Please select stars ⭐"
            );

            return;

        }


        if (!text) {

            showToast(
                "Please write your review"
            );

            return;

        }


        const review = {

            id:
                Date.now(),

            name,

            rating:
                selectedRating,

            text,

            date:
                new Date()
                    .toLocaleDateString("en-IN")

        };


        reviews.unshift(review);

        saveReviews();

        renderReviews();


        $("#reviewForm").reset();

        selectedRating = 0;


        $$(".review-star")
            .forEach(
                function (star) {
                    star.classList.remove(
                        "active"
                    );
                }
            );


        showToast(
            "Thank you for your review ❤️"
        );

    }
);


/* ================= RENDER REVIEWS ================= */

function renderReviews() {

    const container =
        $("#reviewsList");

    if (!container) return;


    if (reviews.length === 0) {

        container.innerHTML =
            '<div class="no-orders">' +
            "⭐ No reviews yet. Be the first!" +
            "</div>";

        return;

    }


    container.innerHTML = "";


    reviews.forEach(
        function (review) {

            const card =
                document.createElement("div");

            card.className =
                "review-card";


            const stars =
                "★".repeat(
                    Number(review.rating)
                ) +
                "☆".repeat(
                    5 -
                    Number(review.rating)
                );


            card.innerHTML =

                "<h4>" +
                escapeHTML(review.name) +
                "</h4>" +

                '<div class="review-stars">' +
                stars +
                "</div>" +

                "<p>" +
                escapeHTML(review.text) +
                "</p>" +

                "<small>" +
                escapeHTML(review.date) +
                "</small>";


            container.appendChild(card);

        }
    );

}


/* ================= TOAST ================= */

function showToast(message) {

    const container =
        $("#toast-container");

    if (!container) return;


    const toast =
        document.createElement("div");

    toast.className =
        "toast";

    toast.textContent =
        message;


    container.appendChild(toast);


    setTimeout(
        function () {
            toast.remove();
        },
        3000
    );

}


/* ================= START ================= */

renderCart();

updateCartCount();

updateTotals();

renderCustomerOrders();

renderReviews();