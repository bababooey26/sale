let cartItems = [];
const goToCartButton = document.getElementById('goToCartButton');
const cart = document.getElementById('cart');
const orderForm = document.getElementById('orderForm');
const totalPriceElement = document.getElementById('totalPrice');

document.querySelectorAll('.addToCartButton').forEach(button => {
    button.addEventListener('click', function() {
        const productDiv = this.parentElement;
        const productName = productDiv.getAttribute('data-product');
        const productPrice = parseFloat(productDiv.getAttribute('data-price'));
        const duration = productDiv.querySelector('.duration-select').value;

        const item = {
            product: productName,
            price: productPrice * duration,
            duration: duration
        };

        cartItems.push(item);
        updateCartButton();
    });
});

function updateCartButton() {
    if (cartItems.length > 0) {
        goToCartButton.classList.remove('hidden');
    } else {
        goToCartButton.classList.add('hidden');
    }
}

function updateTotalPrice() {
    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
    totalPriceElement.textContent = `سعر إجمالي: ${totalPrice} دج`;
}

goToCartButton.addEventListener('click', () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    cart.classList.remove('hidden');
    updateTotalPrice();
});

orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    const cartItemsText = cartItems.map(item =>
        `${item.product} - ${item.duration} شهر(s): ${item.price} دج`
    ).join('\n');

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('4m-U-xBQkEJpjnIiO')
        },
        body: JSON.stringify({
            service_id: 'service_4r8f3ru',
            template_id: 'template_6y0y3ph',
            user_id: '4m-U-xBQkEJpjnIiO',
            template_params: {
                'items': cartItemsText,
                'name': name,
                'phone': phone,
                'total_price': totalPriceElement.textContent
            }
        })
    });

    if (response.ok) {
        alert('تم إرسال الطلب بنجاح!');
        cart.classList.add('hidden');
        goToCartButton.classList.add('hidden');
        cartItems = [];
        orderForm.reset();
    } else {
        alert('حدث خطأ أثناء إرسال الطلب.');
    }
});
