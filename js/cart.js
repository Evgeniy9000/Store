
const cart = () => {
    const cartBtn = document.querySelector('.button-cart')
    const cart = document.getElementById('modal-cart')
    const closeBtn = cart.querySelector('.modal-close')
    const goodsContainer = document.querySelector('.long-goods-list')
    const cartTable = document.querySelector('.cart-table__goods')
    const totalTable = document.querySelector('.card-table__total')
    const modalForm = document.querySelector('.modal-form')
    let nameCustomer = '', phoneCustomer = ''
    document.querySelectorAll('.modal-input').forEach((el) => {
        if (el.name === 'nameCustomer') nameCustomer = el;
        else if (el.name === 'phoneCustomer') phoneCustomer = el;
    })


    const deleteCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.filter(good => {
            return good.id !== id
        })

        localStorage.setItem('cart', JSON.stringify(newCart))

        renderCartGoods(newCart)

    }

    const plusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))
        const newCart = cart.map(good => {
            if (good.id === id) good.count++
            return good
        })


        localStorage.setItem('cart', JSON.stringify(newCart))

        renderCartGoods(newCart)
    }


    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'))

        const newCart = cart.map(good => {
            if (good.id === id) {
                if (good.count > 1) good.count--
            }
            return good
        })


        localStorage.setItem('cart', JSON.stringify(newCart))

        renderCartGoods(newCart)
    }


    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'))
        const clickedGood = goods.find(good => good.id === id)
        const cart = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []


        if (cart.some(good => good.id === clickedGood.id)) {
            cart.map(good => {
                if (good.id === clickedGood.id) good.count++
                return good
            })

        } else {
            clickedGood.count = 1
            cart.push(clickedGood)
        }

        localStorage.setItem('cart', JSON.stringify(cart))

    }


    const renderCartGoods = (goods) => {

        let total = 0;

        cartTable.innerHTML = ''

        goods.forEach(good => {
            const tr = document.createElement('tr')
            let totalLine = +good.price * +good.count
            total += totalLine

            tr.innerHTML = `
        <td>${good.name}</td>
        <td>${good.price}$</td>
        <td><button class="cart-btn-minus"">-</button></td>
        <td>${good.count}</td>
        <td><button class=" cart-btn-plus"">+</button></td>
        <td>${totalLine}$</td>
        <td><button class="cart-btn-delete"">x</button></td>
      `
            cartTable.append(tr)
            tr.addEventListener('click', (e) => {


                if (e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id)

                } else if (e.target.classList.contains('cart-btn-plus')) {
                    plusCartItem(good.id)

                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deleteCartItem(good.id)
                }
            })
        })


        totalTable.innerHTML = total + '$'

    }

    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []
        nameCustomer.value = nameCustomer.value.trim();
        phoneCustomer.value = phoneCustomer.value.trim();

        if (cartArray.length && nameCustomer.value && phoneCustomer.value) {
            fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    cart: cartArray,
                    name: nameCustomer.value,
                    phone: phoneCustomer.value
                })
            }).then(() => {

                cart.style.display = ''
                localStorage.removeItem('cart')

                nameCustomer.value = ''
                phoneCustomer.value = ''
            })
        }

    }


    modalForm.addEventListener('submit', (e) => {
        e.preventDefault()
        sendForm();
    })

    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []

        renderCartGoods(cartArray)
        cart.style.display = "flex";
    })

    closeBtn.addEventListener('click', () => {
        cart.style.display = ''
    })

    cart.addEventListener('click', (e) => {

        if (!event.target.closest('.modal')
            && event.target.classList.contains('overlay')) {
            cart.style.display = ''
        }
    })

    window.addEventListener('keydown', (e) => {
        if (e.key == 'Escape') {
            cart.style.display = ''
        }
    })

    if (goodsContainer) {
        goodsContainer.addEventListener('click', (event) => {

            const buttonToCart = event.target.closest('.add-to-cart')

            if (buttonToCart) {
                const goodId = buttonToCart.dataset.id
                addToCart(goodId)

            }
        })
    }


}
cart()