document.addEventListener('DOMContentLoaded', function () {
    const inventory = JSON.parse(localStorage.getItem('categories')) || [];
    const inventoryDiv = document.getElementById('inventory');
    const saveBtn = document.getElementById('saveBtn');

    function renderInventory() {
        inventoryDiv.innerHTML = '';
        inventory.forEach((category, catIndex) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');
            const categoryTitle = document.createElement('h3');
            categoryTitle.innerText = `${category.name} `;
            const removeCategoryBtn = document.createElement('button');
            removeCategoryBtn.innerText = 'Remove Category';
            removeCategoryBtn.onclick = () => removeCategory(catIndex);
            categoryTitle.appendChild(removeCategoryBtn);
            categoryDiv.appendChild(categoryTitle);
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `<th>Item Name</th><th>Remove</th>${category.sizes.map(size => `<th>${size}</th>`).join('')}`;
            thead.appendChild(headerRow);
            table.appendChild(thead);
            category.items.forEach((item, itemIndex) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td><button onclick="removeItem(${catIndex}, ${itemIndex})">Remove</button></td>
                    ${item.prices.map((price, index) => `<td><input type="number" value="${price}" onchange="updatePrice(${catIndex}, ${itemIndex}, ${index}, this.value)"></td>`).join('')}
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            categoryDiv.appendChild(table);
            inventoryDiv.appendChild(categoryDiv);
        });
    }

    function removeCategory(catIndex) {
        inventory.splice(catIndex, 1);
        localStorage.setItem('categories', JSON.stringify(inventory));
        renderInventory();
    }

    window.removeItem = (catIndex, itemIndex) => {
        inventory[catIndex].items.splice(itemIndex, 1);
        localStorage.setItem('categories', JSON.stringify(inventory));
        renderInventory();
    };

    window.updatePrice = (catIndex, itemIndex, priceIndex, value) => {
        inventory[catIndex].items[itemIndex].prices[priceIndex] = parseInt(value, 10);
    };

    saveBtn.addEventListener('click', () => {
        localStorage.setItem('categories', JSON.stringify(inventory));
        alert('Prices updated successfully!');
    });

    renderInventory();
});
