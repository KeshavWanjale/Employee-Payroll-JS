document.addEventListener("DOMContentLoaded", function () {
    const empForm = document.getElementById('emp-form');
    const cancelButton = document.querySelector('.cancel');
    const resetButton = document.querySelector('.reset');

    empForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page refresh

        // Capture form data
        const employeeData = {
            name: document.getElementById('name').value,
            profile: document.querySelector('input[name="profile"]:checked')?.value || null,
            gender: document.querySelector('input[name="gender"]:checked')?.value || null,
            department: Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value),
            salary: document.getElementById('salary').value,
            startDate: {
                day: document.getElementById('day').value,
                month: document.getElementById('month').value,
                year: document.getElementById('year').value
            },
            notes: document.getElementById('notes').value
        };

        // Send a request to JSON Server to save/update data
        fetch('http://localhost:3000/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (response.ok) {
                console.log("Employee added successfully");
                window.location.href = './dashboard.html'; // Redirect to dashboard
            } else {
                console.error("Failed to save employee data");
            }
        })
        .catch(error => console.error("Error:", error));
    });


    // Handle cancel button click
    cancelButton.addEventListener('click', function () {
        window.location.href = './dashboard.html'; // Redirect to dashboard
    });

    // Handle reset button click
    resetButton.addEventListener('click', function () {
        empForm.reset();
    });

});
