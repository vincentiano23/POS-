document.addEventListener('DOMContentLoaded', function () {
    const salesForm = document.getElementById('sales-form');
    const saleForm = document.getElementById('sale-form');
    const formTitle = document.getElementById('form-title');
    const saleIdInput = document.getElementById('sale-id');

    const addSaleButton = document.getElementById('add-sale-button');
    const updateSaleButton = document.getElementById('update-sale-button');
    const removeSaleButton = document.getElementById('remove-sale-button');

    // Show the form for adding a sale
    addSaleButton.addEventListener('click', function () {
        formTitle.textContent = 'Add Sale';
        saleIdInput.value = '';  // Clear hidden sale ID
        salesForm.reset();  // Clear form fields
        salesForm.style.display = 'block';  // Show the form
    });

    // Hide form on cancel
    document.getElementById('cancel-button').addEventListener('click', function () {
        salesForm.style.display = 'none';  // Hide the form
    });

    // Handle form submission (Add or Update Sale)
    saleForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const data = {
            productId: document.getElementById('product-id').value,
            quantity: document.getElementById('quantity').value,
            customerId: document.getElementById('customer-id').value,
        };

        const saleId = saleIdInput.value;  // Check if we're updating or adding
        if (saleId) {
            updateSale(saleId, data);  // Update existing sale
        } else {
            addSale(data);  // Add a new sale
        }

        salesForm.style.display = 'none';  // Hide the form after submission
    });

    // Function to add a new sale (AJAX POST request)
    function addSale(data) {
        fetch('/sales/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),  // Include CSRF token
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sale added:', data);
            // Optionally refresh the sales list
            location.reload();  // Reload the page to show new sale
        })
        .catch(error => console.error('Error adding sale:', error));
    }

    // Function to update an existing sale (AJAX PUT request)
    function updateSale(saleId, data) {
        fetch(`/sales/update/${saleId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sale updated:', data);
            location.reload();
        })
        .catch(error => console.error('Error updating sale:', error));
    }

    // Function to remove a sale (AJAX DELETE request)
    removeSaleButton.addEventListener('click', function () {
        const saleId = prompt("Enter the Sale ID to remove:");  // Ask for Sale ID
        if (saleId) {
            fetch(`/sales/remove/${saleId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sale removed:', data);
                location.reload();
            })
            .catch(error => console.error('Error removing sale:', error));
        }
    });

    // Function to get CSRF token (for Django)
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
