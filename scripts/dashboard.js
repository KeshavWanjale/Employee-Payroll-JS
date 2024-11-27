document.addEventListener("DOMContentLoaded", () => {
    const employeeTableBody = document.getElementById("employeeTableBody");

    // Fetch and display employees
    fetchEmployees();

    const getDepartmentHtml = (departmentList) => {
        let departmentHtml = "";
        for (let department of departmentList) {
            departmentHtml += `<div class="dept-label">${department}</div>`;
        }
        return departmentHtml;
    };

    function fetchEmployees() {
        fetch('http://localhost:3000/employees')
            .then(response => response.json())
            .then(employees => {
                console.log("Fetched employees:", employees); // Debug
                populateTable(employees);
            })
            .catch(error => console.error("Error fetching employees:", error));
    }

    function populateTable(employees) {
        employeeTableBody.innerHTML = ""; // Clear existing rows

        if (Array.isArray(employees) && employees.length > 0) {
            employees.forEach(employee => {
                console.log("Adding employee to table:", employee); // Debug
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${employee.profile}" alt="Profile" class="profile-pic"></td>
                    <td>${employee.name || "N/A"}</td>
                    <td>${employee.gender || "N/A"}</td>
                    <td>${getDepartmentHtml(employee.department)}</td>
                    <td>${employee.salary || "N/A"}</td>
                    <td>${employee.startDate ? `${employee.startDate.day}-${employee.startDate.month}-${employee.startDate.year}` : "N/A"}</td>
                    <td>
                        <button class="edit-btn" id="edit-${employee.id}" title="Edit">
                            <img src="../assets/edit_icon.png" alt="Edit" class="icon">
                        </button>
                        <button class="delete-btn" id="del-${employee.id}" title="Delete">
                            <img src="../assets/delete_icon.png" alt="Delete" class="icon">
                        </button>
                    </td>
                `;
                employeeTableBody.appendChild(row);

                // to handle delete and update
                addEventListeners(employee.id)

            });
        } else {
            console.warn("No employees found or invalid data format");
        }
    }

    function addEventListeners(id) {

        document.getElementById(`del-${id}`).addEventListener('click', () => {
            const confirmDelete = confirm("Are you sure you want to delete this employee?");
            if (confirmDelete) {
                fetch(`http://localhost:3000/employees/${id}`,
                    { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            console.log("Employee deleted successfully");
                            fetchEmployees(); // Refresh the table
                        } else {
                            console.error("Failed to delete employee");
                        }
                    }).catch(error => console.error("Error deleting employee:", error));
            }
        });

    }


    
});