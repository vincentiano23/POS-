// Display a confirmation alert when logging out
document.addEventListener("DOMContentLoaded", function() {
    const logoutForm = document.getElementById('logout-form');
    
    if (logoutForm) {
        logoutForm.addEventListener('submit', function(event) {
            const confirmLogout = confirm("Are you sure you want to log out?");
            if (!confirmLogout) {
                event.preventDefault();
            }
        });
    }
});

// Alert when adding a new item to inventory
function addToInventory(itemName) {
    alert(itemName + " has been added to inventory!");
}

// Alert when a sale is made
function completeSale(totalAmount) {
    alert("Sale completed! Total amount: $" + totalAmount);
}

// Function to handle custom form validation (example for login)
function validateLoginForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return false;
    }

    return true;
}
