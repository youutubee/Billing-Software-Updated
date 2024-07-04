document.addEventListener('DOMContentLoaded', function() {
    const searchProduct = document.getElementById('searchProduct');
    const suggestions = document.getElementById('suggestions');
    const productPrice = document.getElementById('productPrice');
    const productQuantity = document.getElementById('productQuantity');
    const productDiscount = document.getElementById('productDiscount');
    const addProductButton = document.getElementById('addProductButton');
    const billTableBody = document.getElementById('billTableBody');
    const printBillButton = document.getElementById('printBillButton');
    const totalItems = document.getElementById('totalItems');
    const totalPrice = document.getElementById('totalPrice');
    
    let selectedProduct = null;
    let categories = JSON.parse(localStorage.getItem('categories')) || [];
    let items = [];

    categories.forEach(category => {
        category.items.forEach(item => {
            items.push(...item.prices.map((price, index) => ({
                name: item.name,
                size: category.sizes[index],
                price: price
            })));
        });
    });

    searchProduct.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        suggestions.innerHTML = '';

        if (query.length > 0) {
            const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
            filteredItems.forEach(item => {
                const div = document.createElement('div');
                div.textContent = `${item.name} (${item.size}) - ${item.price}`;
                div.dataset.name = item.name;
                div.dataset.size = item.size;
                div.dataset.price = item.price;
                div.addEventListener('click', function() {
                    selectedProduct = {
                        name: this.dataset.name,
                        size: this.dataset.size,
                        price: parseFloat(this.dataset.price)
                    };
                    productPrice.value = selectedProduct.price;
                    suggestions.innerHTML = '';
                });
                suggestions.appendChild(div);
            });
        }
    });

    addProductButton.addEventListener('click', function() {
        if (selectedProduct) {
            const quantity = parseInt(productQuantity.value);
            const discountPercent = parseFloat(productDiscount.value);
            const priceAfterDiscount = selectedProduct.price * (1 - discountPercent / 100);
            const totalPrice = priceAfterDiscount * quantity;

            const billRow = document.createElement('tr');
            billRow.innerHTML = `
                <td>${selectedProduct.name}</td>
                <td>${selectedProduct.size}</td>
                <td>${quantity}</td>
                <td>${selectedProduct.price}</td>
                <td>${discountPercent}</td>
                <td>${priceAfterDiscount.toFixed(2)}</td>
                <td>${totalPrice.toFixed(2)}</td>
            `;
            billTableBody.appendChild(billRow);

            updateTotals();

            // Reset form
            selectedProduct = null;
            searchProduct.value = '';
            productPrice.value = '';
            productQuantity.value = '1';
            productDiscount.value = '0';
        } else {
            alert('Please select a product first');
        }
    });

    function updateTotals() {
        let totalItemsCount = 0;
        let totalPriceValue = 0;

        billTableBody.querySelectorAll('tr').forEach(row => {
            const quantity = parseInt(row.cells[2].textContent);
            const totalPrice = parseFloat(row.cells[6].textContent);

            totalItemsCount += quantity;
            totalPriceValue += totalPrice;
        });

        totalItems.textContent = totalItemsCount;
        totalPrice.textContent = totalPriceValue.toFixed(2);
    }

    printBillButton.addEventListener('click', function() {
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const billTableHTML = document.getElementById('billTable').outerHTML;

        if (!customerName || !customerAddress) {
            alert('Please enter customer details');
            return;
        }

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Kashish Enterprises</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                    }
                    .header {
                        text-align: center;
                    }
                    .header .title {
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .header .address {
                        font-size: 18px;
                        font-weight: normal;
                    }
                    .line {
                        margin-top: 20px;
                        border-bottom: 2px solid black;
                    }
                    .details {
                        margin-top: 20px;
                    }
                    .info {
                        display: flex;
                        justify-content: space-between;
                    }
                    .table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        border: 2px solid black;
                    }
                    .table th, .table td {
                        border-right: 2px solid black;
                        padding: 8px;
                        vertical-align: top;
                    }
                    .table th:first-child, .table td:first-child {
                        border-left: 2px solid black; 
                    }
                    .table th:last-child, .table td:last-child {
                        border-right: none;
                    }
                    .col-item {
                        width: 50%;
                        border-top: 2px solid black;
                    }
                    .col-size {
                        width: 10%;
                        border-top: 2px solid black;
                    }
                    .col-quantity {
                        width: 10%;
                        border-top: 2px solid black;
                    }
                    .col-price {
                        width: 10%;
                        border-top: 2px solid black;
                    }
                    .col-discount {
                        width: 10%;
                        border-top: 2px solid black;
                    }
                    .col-price_after_discount {
                        width: 10%;
                        border-top: 2px solid black;
                    }
                    .col-total {
                        width: 10%;
                        border-right: 2px solid black; 
                    }
                    .total-box {
                        height: 800px; 
                        border-top: 2px solid black;
                        border-right: 2px solid black; 
                        border-left: 2px solid black; 
                    }

                    @media print {
                        body {
                            font-family: Arial, sans-serif;
                            margin: 40px;
                        }
                        .header {
                            text-align: center;
                        }
                        .header .title {
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .header .address {
                            font-size: 18px;
                            font-weight: normal;
                        }
                        .line {
                            margin-top: 20px;
                            border-bottom: 2px solid black;
                        }
                        .details {
                            margin-top: 20px;
                        }
                        .info {
                            display: flex;
                            justify-content: space-between;
                        }
                        .table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                            border: 2px solid black;
                        }
                        .table th, .table td {
                            border-right: 2px solid black;
                            padding: 8px;
                            vertical-align: top;
                        }
                        .table th:first-child, .table td:first-child {
                            border-left: 2px solid black; 
                        }
                        .table th:last-child, .table td:last-child {
                            border-right: none;
                        }
                        .col-item {
                            width: 50%;
                            border-top: 2px solid black;
                        }
                        .col-size {
                            width: 10%;
                            border-top: 2px solid black;
                        }
                        .col-quantity {
                            width: 10%;
                            border-top: 2px solid black;
                        }
                        .col-price {
                            width: 10%;
                            border-top: 2px solid black;
                        }
                        .col-discount {
                            width: 10%;
                            border-top: 2px solid black;
                        }
                        .col-price_after_discount {
                            width: 10%;
                            border-top: 2px solid black;
                        }
                        .col-total {
                            width: 10%;
                            border-right: 2px solid black; 
                        }
                        .total-box {
                            height: 800px; 
                            border-top: 2px solid black;
                            border-right: 2px solid black; 
                            border-left: 2px solid black; 
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <p class="title">Kashish Enterprises</p>
                    <p class="address">Shop address here</p>
                </div>
                <div class="info">
                    <div class="details">
                        <p>Customer Name: ${customerName}</p>
                        <p>Customer Address: ${customerAddress}</p>
                    </div>
                    <div class="date">
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="line"></div>
                ${billTableHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });
});
