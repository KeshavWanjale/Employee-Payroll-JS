document.addEventListener("DOMContentLoaded", function () {
    const empForm = document.getElementById('emp-form');
    const cancelButton = document.querySelector('.cancel');
    const resetButton = document.querySelector('.reset');

    // Check if it's edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    const employeeId = urlParams.get('id');

    if (isEditMode && employeeId) {
        fetch(`http://localhost:3000/employees/${employeeId}`)
            .then(response => response.json())
            .then(employee => {
                console.log("Fetched employee for editing:", employee);
                document.getElementById('name').value = employee.name || '';
                document.querySelector(`input[name="profile"][value="${employee.profile}"]`).checked = true;
                document.querySelector(`input[name="gender"][value="${employee.gender}"]`).checked = true;

                // Precheck department checkboxes
                if (employee.department) {
                    employee.department.forEach(dept => {
                        const checkbox = document.querySelector(`input[type="checkbox"][value="${dept}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }

                document.getElementById('salary').value = employee.salary || '';
                if (employee.startDate) {
                    document.getElementById('day').value = employee.startDate.day || '';
                    document.getElementById('month').value = employee.startDate.month || '';
                    document.getElementById('year').value = employee.startDate.year || '';
                }
                document.getElementById('notes').value = employee.notes || '';
            })
            .catch(error => console.error("Error fetching employee for editing:", error));
    }

    empForm.addEventListener('submit', function (event) {
        event.preventDefault();

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

        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode
            ? `http://localhost:3000/employees/${employeeId}`
            : 'http://localhost:3000/employees';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        })
            .then(response => {
                if (response.ok) {
                    console.log(`Employee ${isEditMode ? 'updated' : 'added'} successfully`);
                    window.location.href = './dashboard.html';
                } else {
                    console.error(`Failed to ${isEditMode ? 'update' : 'save'} employee data`);
                }
            })
            .catch(error => console.error("Error:", error));
    });

    cancelButton.addEventListener('click', function () {
        window.location.href = './dashboard.html';
    });

    resetButton.addEventListener('click', function () {
        empForm.reset();
    });
});
