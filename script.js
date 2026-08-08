"use strict";

/* =========================================
   RAMA MOMO'S
   SIMPLE FINAL JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

if (menuBtn && navMenu) {

    menuBtn.addEventListener("click", function () {

        navMenu.classList.toggle("show");

    });

}


/* =========================================
   CLOSE MOBILE MENU
========================================= */

const navLinks =
    document.querySelectorAll(".nav-menu a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navMenu) {
            navMenu.classList.remove("show");
        }

    });

});


/* =========================================
   DARK MODE
========================================= */

const darkBtn =
    document.getElementById("darkBtn");

if (darkBtn) {

    darkBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

    });

}


/* =========================================
   MENU FILTER
========================================= */

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


/* =========================================
   QUANTITY
========================================= */

foodCards.forEach(function (card) {

    const minus =
        card.querySelector(".qty-minus");

    const plus =
        card.querySelector(".qty-plus");

    const input =
        card.querySelector(".qty-input");


    if (minus && input) {

        minus.addEventListener("click", function () {

            let value =
                Number(input.value) || 1;


            if (value > 1) {
                value--;
            }


            input.value = value;

        });

    }


    if (plus && input) {

        plus.addEventListener("click", function () {

            let value =
                Number(input.value) || 1;


            if (value < 20) {
                value++;
            }


            input.value = value;

        });

    }

});


/* =========================================
   CART
========================================= */

let cart = [];


function updateCartCount() {

    const count =
        document.getElementById("cart-count");


    if (!count) {
        return;
    }


    let total = 0;


    cart.forEach(function (item) {

        total += item.quantity;

    });


    count.textContent = total;

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "ramaCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   TOAST
========================================= */

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

    }, 10);


    setTimeout(function () {

        toast.classList.remove("show");


        setTimeout(function () {

            toast.remove();

        }, 300);


    }, 2000);

}


/* =========================================
   ADD TO CART
========================================= */

const addButtons =
    document.querySelectorAll(".add-cart");


addButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card =
            button.closest(".food-card");


        if (!card) {
            return;
        }


        const nameElement =
            card.querySelector(".food-name");


        const priceElement =
            card.querySelector(".food-price");


        const input =
            card.querySelector(".qty-input");


        if (
            !nameElement ||
            !priceElement
        ) {

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
                Number(input.value) || 1
            );


        const existing =
            cart.find(function (item) {

                return item.name === name;

            });


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

    });

});


/* =========================================
   RENDER CART
========================================= */

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
            '<div class="empty-cart">' +
            '🛒 Your cart is empty' +
            '</div>';

        updateTotals();

        updateCartCount();

        return;

    }


    cart.forEach(function (item, index) {

        const itemTotal =
            item.price *
            item.quantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        const info =
            document.createElement("div");


        const name =
            document.createElement("strong");


        name.textContent =
            item.name;


        const details =
            document.createElement("p");


        details.textContent =
            "₹" +
            item.price +
            " × " +
            item.quantity;


        info.appendChild(name);

        info.appendChild(details);


        const right =
            document.createElement("div");


        const total =
            document.createElement("strong");


        total.textContent =
            "₹" +
            itemTotal;


        const remove =
            document.createElement("button");


        remove.type = "button";

        remove.className =
            "remove-cart";

        remove.textContent =
            "Remove";


        remove.addEventListener(
            "click",
            function () {

                cart.splice(index, 1);

                saveCart();

                renderCart();

                showToast(
                    "Item removed"
                );

            }
        );


        right.appendChild(total);

        right.appendChild(remove);


        cartItem.appendChild(info);

        cartItem.appendChild(right);


        cartItems.appendChild(cartItem);

    });


    updateTotals();

    updateCartCount();

}


/* =========================================
   TOTAL
========================================= */

function updateTotals() {

    let subtotalValue = 0;


    cart.forEach(function (item) {

        subtotalValue +=
            item.price *
            item.quantity;

    });


    let deliveryValue = 0;


    if (subtotalValue > 0) {

        deliveryValue =
            subtotalValue >= 299
                ? 0
                : 20;

    }


    const totalValue =
        subtotalValue +
        deliveryValue;


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
            subtotalValue;

    }


    if (delivery) {

        delivery.textContent =
            deliveryValue === 0 &&
            subtotalValue > 0
                ? "FREE"
                : "₹" +
                  deliveryValue;

    }


    if (discount) {

        discount.textContent =
            "₹0";

    }


    if (grandTotal) {

        grandTotal.textContent =
            "₹" +
            totalValue;

    }

}


/* =========================================
   COUPON
========================================= */

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


            if (code === "RAMA10") {

                let subtotalValue = 0;


                cart.forEach(function (item) {

                    subtotalValue +=
                        item.price *
                        item.quantity;

                });


                const discountValue =
                    Math.round(
                        subtotalValue * 0.10
                    );


                const deliveryValue =
                    subtotalValue >= 299
                        ? 0
                        : 20;


                const totalValue =
                    subtotalValue -
                    discountValue +
                    deliveryValue;


                const discount =
                    document.getElementById(
                        "discount"
                    );


                const total =
                    document.getElementById(
                        "grandTotal"
                    );


                if (discount) {

                    discount.textContent =
                        "₹" +
                        discountValue;

                }


                if (total) {

                    total.textContent =
                        "₹" +
                        totalValue;

                }


                showToast(
                    "10% discount applied 🎉"
                );

            } else {

                showToast(
                    "Invalid coupon code"
                );

            }

        }
    );

}


/* =========================================
   WHATSAPP ORDER
========================================= */

const cartOrderBtn =
    document.getElementById(
        "cartOrderBtn"
    );


if (cartOrderBtn) {

    cartOrderBtn.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {

                showToast(
                    "Your cart is empty 🛒"
                );

                return;

            }


            let message =
                "🥟 RAMA MOMO'S ORDER\n\n";


            let subtotalValue = 0;


            cart.forEach(function (item) {

                const itemTotal =
                    item.price *
                    item.quantity;


                subtotalValue +=
                    itemTotal;


                message +=
                    item.name +
                    " × " +
                    item.quantity +
                    " = ₹" +
                    itemTotal +
                    "\n";

            });


            const delivery =
                subtotalValue >= 299
                    ? 0
                    : 20;


            const total =
                subtotalValue +
                delivery;


            message +=
                "\nSubtotal: ₹" +
                subtotalValue;


            message +=
                "\nDelivery: " +
                (
                    delivery === 0
                        ? "FREE"
                        : "₹" + delivery
                );


            message +=
                "\nTotal: ₹" +
                total;


            const url =
                "https://wa.me/919359874910" +
                "?text=" +
                encodeURIComponent(
                    message
                );


            window.open(
                url,
                "_blank"
            );

        }
    );

}


/* =========================================
   FAVOURITE
========================================= */

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


/* =========================================
   START
========================================= */

renderCart();

updateCartCount();
