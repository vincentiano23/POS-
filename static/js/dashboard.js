document.addEventListener('DOMContentLoaded', function() {
    const salesList = document.getElementById('sales-list');
    const salesForm = document.getElementById('sales-form');
    const formTitle = document.getElementById('form-title');
    const saleIdInput = document.getElementById('sale-id');

    // Show the add sale form
    document.getElementById('add-sale-button').addEventListener('click', function() {
        formTitle.textContent = 'Add Sale';
        saleIdInput.value = ''; // Clear the hidden input for new sale
        salesForm.reset();
        toggleSalesForm(true);
    });

    // Handle form submission
    salesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const data = {
            productId: document.getElementById('product-id').value,
            quantity: document.getElementById('quantity').value,
            customerId: document.getElementById('customer-id').value,
        };

        // Check if saleId is present for update or not for add
        const saleId = saleIdInput.value;
        if (saleId) {
            updateSale(saleId, data); // Update existing sale
        } else {
            addSale(data); // Add new sale
        }
    });

    // Function to toggle visibility of the sales form
    function toggleSalesForm(show) {
        document.getElementById('sales-form').style.display = show ? 'block' : 'none';
    }

    // Function to add a sale (this could be an AJAX call)
    function addSale(data) {
        fetch('/sales/add/', { // Ensure the URL matches your Django URL configuration
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // CSRF token for security
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Sale added:', data);
            updateSalesList(); // Refresh the sales list
            toggleSalesForm(false); // Hide form after submission
        })
        .catch((error) => {
            console.error('Error adding sale:', error);
        });
    }

    // Function to update an existing sale (you need to implement the backend for this)
    function updateSale(saleId, data) {
        fetch(`/sales/update/${saleId}/`, { // Ensure the URL matches your Django URL configuration
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // CSRF token for security
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Sale updated:', data);
            updateSalesList(); // Refresh the sales list
            toggleSalesForm(false); // Hide form after submission
        })
        .catch((error) => {
            console.error('Error updating sale:', error);
        });
    }

    // Function to remove a sale (this could be an AJAX call)
    function removeSale(saleId) {
        fetch(`/sales/remove/${saleId}/`, { // Ensure the URL matches your Django URL configuration
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), // CSRF token for security
            },
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Sale removed:', data);
            updateSalesList(); // Refresh the sales list
        })
        .catch((error) => {
            console.error('Error removing sale:', error);
        });
    }

    // Function to get CSRF token (if using Django)
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

    // Function to update the sales list display (fetch from the server)
    function updateSalesList() {
        fetch('/sales/list/') // Ensure this URL returns the current sales data
            .then(response => response.json())
            .then(data => {
                salesList.innerHTML = ''; // Clear current sales list
                data.forEach(sale => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center';
                    li.textContent = `Sale ID: ${sale.id} - Product ID: ${sale.productId} - Quantity: ${sale.quantity}`;
                    
                    // Add remove button
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    removeButton.className = 'btn btn-danger btn-sm ms-2';
                    removeButton.addEventListener('click', function() {
                        removeSale(sale.id);
                    });

                    li.appendChild(removeButton);
                    salesList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching sales list:', error);
            });
    }

    // Initial fetch to populate the sales list
    updateSalesList();
});






document.addEventListener('DOMContentLoaded', function() {
    // Simple alert when the dashboard loads
    

    // Example: Function to update a chart (placeholder for actual implementation)
    function updateSalesChart(data) {
        // Use your charting library (like Chart.js or Google Charts) to render data
        console.log('Updating sales chart with data:', data);
    }

    // Example of using AJAX to fetch data (if applicable)
    fetch('/api/sales-data/')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched sales data:', data);
            updateSalesChart(data);
        })
        .catch(error => console.error('Error fetching sales data:', error));

    // Ensure that the canvas element exists before initializing the chart
    const chartElement = document.getElementById('myChart');
    if (chartElement) {
        const ctx = chartElement.getContext('2d');
        
        // Check if the context is available
        if (ctx) {
            const myChart = new Chart(ctx, {
                type: 'line', // 'bar', 'pie', etc.
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [{
                        label: 'Sales',
                        data: [12, 19, 3, 5, 2, 3, 7], // Replace with your actual sales data
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } else {
            console.error('Failed to get context for the chart.');
        }
    } else {
        console.error('Canvas element with ID "myChart" not found.');
    }
});

