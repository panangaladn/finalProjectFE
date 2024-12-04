$(document).ready(function() {
    getStaffMemberId();
    loadVehicles();
});

function saveVehicle() {
    // Collect vehicle data from form inputs
    let vehicleData = {
        licensePlateNumber: $('#licensePlateNumber').val(),
        vehicleCategory: $('#vehicleCategory').val(),
        fuelType: $('#fuelType').val(),
        status: $('#status').val(),
        remarks: $('#remarks').val(),
        staffMemberId: $('#staffMemberId').val()
    };

    // Perform AJAX POST request to save vehicle
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/vehicles",
        contentType: "application/json", // Specify JSON content type
        data: JSON.stringify(vehicleData), // Convert object to JSON string
        success: function(response) {
            alert("Vehicle saved successfully!");
            clearForm(); // Clear the form after saving
            loadVehicles();
        },
        error: function(xhr, exception) {
            let errorMessage;
            try {
                // Try parsing the error message
                errorMessage = JSON.parse(xhr.responseText).message || "Unknown error occurred.";
            } catch (e) {
                // Fallback to exception message
                errorMessage = exception;
            }
            console.error("Error occurred:", errorMessage);
            alert("Failed to save the vehicle: " + errorMessage);
        }
    });
}

function getStaffMemberId() {
    // Perform AJAX GET request to load staff member IDs
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/staffs/allStaffs",
        contentType: "application/json",
        success: function(response) {
            let staffMemberId = $('#staffMemberId');
            staffMemberId.empty(); // Clear existing options
            staffMemberId.append('<option value="">Select a Staff Member</option>'); // Default option
            
            // Iterate over the response and populate dropdown
            response.forEach((staff) => {
                let optValue = `<option value="${staff.staffMemberId}">${staff.staffMemberId} - ${staff.firstName}</option>`; // Fixed 'fristName' typo
                staffMemberId.append(optValue);
            });
        },
        error: function(xhr, exception) {
            console.error("Error loading staff member IDs:", xhr.responseText || exception);
            alert("Failed to load staff member IDs.");
        }
    });
}


function loadVehicles() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/vehicles/allVehicles",
        contentType: "application/json",
        success: function (response) {
            // Assuming 'response' is an array of vehicle objects
            let tableBody = $('#vehiclesTable tbody');
            tableBody.empty(); // Clear existing rows

            response.forEach((vehicle, index) => {
                let row = `
                    <tr data-vehicle='${JSON.stringify(vehicle)}'>
                        <td>${index + 1}</td>
                        <td>${vehicle.vehicleCode || "N/A"}</td>
                        <td>${vehicle.licensePlateNumber || "N/A"}</td>
                        <td>${vehicle.vehicleCategory || "N/A"}</td>
                        <td>${vehicle.fuelType || "N/A"}</td>
                        <td>${vehicle.status || "N/A"}</td>
                        <td>${vehicle.remarks || "N/A"}</td>
                        <td>${vehicle.staffMemberId || "N/A"}</td>
                    </tr>
                `;
                tableBody.append(row);
            });

            // Attach click event to rows for editing or viewing details
            $('#vehiclesTable tbody').on('click', 'tr', function () {
                const vehicleData = $(this).data('vehicle');
                loadFormWithData(vehicleData); // Load data into the form
            });
        },
        error: function (xhr, exception) {
            console.error("Error loading vehicles:", xhr.responseText || exception);
            alert("Failed to load vehicles.");
        }
    });
}

function loadFormWithData(vehicle) {
    // Populate form fields with row data
    $('#vehicleCode').val(vehicle.vehicleCode);
    $('#licensePlateNumber').val(vehicle.licensePlateNumber);
    $('#vehicleCategory').val(vehicle.vehicleCategory);
    $('#fuelType').val(vehicle.fuelType);
    $('#status').val(vehicle.status);
    $('#remarks').val(vehicle.remarks);
    $('#staffMemberId').val(vehicle.staffMemberId);

    $('#vehicleForm').show();
}

function updateVehicle() {
    let vehicleData = {
        vehicleCode:$('#vehicleCode').val(),
        licensePlateNumber:$('#licensePlateNumber').val(),
        vehicleCategory:$('#vehicleCategory').val(),
        fuelType:$('#fuelType').val(),
        status:$('#status').val(),
        remarks:$('#remarks').val(),
        staffMemberId:$('#staffMemberId').val()  
    };
    console.log(vehicleData.fuelType);

    // Send AJAX PATCH request
    $.ajax({
        method: "PATCH",
        url: `http://localhost:8080/cropMonitoring/api/v1/vehicles/${$('#vehicleCode').val()}`, // Endpoint with staff ID
        contentType: "application/json", // Send data as JSON
        processData: false,             // Prevents processing of the data
        data: JSON.stringify(vehicleData), // Convert object to JSON string
        success: function(response) {
            alert("Vehicle updated successfully!");
            loadVehicles(); // Reload staff list after update
            clearForm();  // Clear form fields after update
        },
        error: function(xhr, exception) {
            let errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).message : exception;
            console.error("Error updating Vehicle:", errorMessage);
            alert("Failed to update the Vehicle: " + errorMessage);
        }
    });
}


function deleteVehicle() {
    let dv = $('#vehicleCode').val();
    const userConfirmed = confirm(`Are you sure you want to delete the crop with code "${dv}"?`);

    if (userConfirmed) {
        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/cropMonitoring/api/v1/vehicles/${dv}`,
            success: function(response) {
                alert("Vehicle deleted successfully!");
                clearForm();
                loadVehicles();
            },
            error: function(xhr, exception) {
                if (xhr.status === 404) {
                    alert("Field not found.");
                } else if (xhr.status === 500) {
                    alert("An error occurred while deleting the Vehicle.");
                } else {
                    alert("Failed to delete the Vehicle.");
                }
            }
        });
    } else {
        //alert("Deletion canceled.");
    }
}


function clearForm() {
    $('#vehicleForm')[0].reset();

}
