// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search orders..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Status filter
    const statusFilter = document.querySelector('select');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            const selectedStatus = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('tbody tr');
            
            if (selectedStatus === 'all') {
                tableRows.forEach(row => row.style.display = '');
                return;
            }

            tableRows.forEach(row => {
                const statusCell = row.querySelector('td:nth-child(3)');
                const status = statusCell.textContent.toLowerCase();
                row.style.display = status.includes(selectedStatus) ? '' : 'none';
            });
        });
    }

    // Form submission
    const orderForm = document.querySelector('form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(orderForm);
            const orderData = Object.fromEntries(formData.entries());

            // Validate form
            if (!validateForm(orderData)) {
                return;
            }

            // Submit order data to backend
            fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save order');
                }
                return response.json();
            })
            .then(data => {
                showNotification('Order created successfully!', 'success');
                orderForm.reset();
            })
            .catch(error => {
                showNotification(error.message, 'error');
            });
        });
    }

    // Edit order buttons
    const editButtons = document.querySelectorAll('button.text-indigo-600');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const row = e.target.closest('tr');
            const orderId = row.querySelector('td:first-child').textContent;
            const customerName = row.querySelector('td:nth-child(2)').textContent;
            const status = row.querySelector('td:nth-child(3) span').textContent;
            const date = row.querySelector('td:nth-child(4)').textContent;
            const orderItems = row.dataset.orderItems || '';
            const additionalNotes = row.dataset.additionalNotes || '';

            // Populate modal form fields
            document.getElementById('editOrderId').value = orderId;
            document.getElementById('editCustomerName').value = customerName;
            document.getElementById('editStatus').value = status;
            document.getElementById('editDate').value = date;
            document.getElementById('editOrderItems').value = orderItems;
            document.getElementById('editAdditionalNotes').value = additionalNotes;

            openEditModal();
        });
    });

    // Delete order buttons
    const deleteButtons = document.querySelectorAll('button.text-red-600');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (confirm('Are you sure you want to delete this order?')) {
                const row = e.target.closest('tr');
                row.remove();
                showNotification('Order deleted successfully!', 'success');
            }
        });
    });

    // Modal form submission
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const orderId = document.getElementById('editOrderId').value;
            const customerName = document.getElementById('editCustomerName').value;
            const status = document.getElementById('editStatus').value;
            const date = document.getElementById('editDate').value;
            const orderItems = document.getElementById('editOrderItems').value;
            const additionalNotes = document.getElementById('editAdditionalNotes').value;

            // Find the order row by orderId
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                if (row.querySelector('td:first-child').textContent === orderId) {
                    row.querySelector('td:nth-child(2)').textContent = customerName;
                    const statusSpan = row.querySelector('td:nth-child(3) span');
                    statusSpan.textContent = status;

                    // Update status badge color
                    statusSpan.className = 'inline-flex rounded-full px-2 text-xs font-semibold leading-5';
                    if (status.toLowerCase() === 'pending') {
