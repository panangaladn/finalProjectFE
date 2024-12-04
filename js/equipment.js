$(document).ready(function() {
    getStaffMemberId();
    getFieldCode();
    loadEquipments();
});

function saveEquipment() {
    // Collect vehicle data from form inputs
    let equipmentData = {
        equipmentId:$('#equipmentId').val(),
        name:$('#name').val(),
        equipmentType:$('#equipmentType').val(),
        status:$('#status').val(),
        fieldCode:$('#fieldCode').val(),
        staffMemberId:$('#staffMemberId').val()        
    };

    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/equipments",
        contentType: "application/json", // Specify JSON content type
        data: JSON.stringify(equipmentData), // Convert object to JSON string
        success: function(response) {
            alert("Equipment saved successfully!");
            clearForm();
            loadEquipments();
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
            alert("Failed to save the Equipment: " + errorMessage);
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

function getFieldCode() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/fields/allFields",
        contentType: "application/json",
        success: function (response) {
            let fieldCode = $('#fieldCode');
            fieldCode.empty(); // Clear existing options
            fieldCode.append('<option value="">Select a Field</option>'); // Default option
            
            // Iterate over the response and add options
            response.forEach((field) => {
                let optValue = `<option value="${field.fieldCode}">${field.fieldCode} - ${field.fieldName}</option>`;
                fieldCode.append(optValue);
            });
        },
        error: function (xhr, exception) {
            console.error("Error loading field codes:", xhr.responseText || exception);
            alert("Failed to load field codes.");
        }
    });
}


function loadEquipments() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/equipments/allEquipments",
        contentType: "application/json",
        success: function (response) {
            // Assuming 'response' is an array of vehicle objects
            let tableBody = $('#equipmentsTable tbody');
            tableBody.empty(); // Clear existing rows

            response.forEach((equipment, index) => {
                let row = `
                    <tr data-equipment='${JSON.stringify(equipment)}'>
                        <td>${index + 1}</td>
                        <td>${equipment.equipmentId || "N/A"}</td>
                        <td>${equipment.name || "N/A"}</td>
                        <td>${equipment.equipmentType || "N/A"}</td>
                        <td>${equipment.status || "N/A"}</td>
                        <td>${equipment.fieldCode || "N/A"}</td>
                        <td>${equipment.staffMemberId || "N/A"}</td>
                    </tr>
                `;
                tableBody.append(row);
            });

            // // Attach click event to rows for editing or viewing details
            $('#equipmentsTable tbody').on('click', 'tr', function () {
                const equipmentData = $(this).data('equipment');
                loadFormWithData(equipmentData); // Load data into the form
            });
        },
        error: function (xhr, exception) {
            console.error("Error loading Equipment:", xhr.responseText || exception);
            alert("Failed to load Equipment.");
        }
    });
}

function loadFormWithData(equipment) {
    // Populate form fields with row data
    $('#equipmentId').val(equipment.equipmentId);
    $('#name').val(equipment.name);
    $('#equipmentType').val(equipment.equipmentType);
    $('#status').val(equipment.status);
    $('#fieldCode').val(equipment.fieldCode);
    $('#staffMemberId').val(equipment.staffMemberId);

    $('#vehicleForm').show();
}

function updateEquipment() {
    let equipmentData = {
        equipmentId: $('#equipmentId').val(),
        name: $('#name').val(),
        equipmentType: $('#equipmentType').val(),
        status: $('#status').val(),
        fieldCode: $('#fieldCode').val(),
        staffMemberId: $('#staffMemberId').val()
    };

    // // Debugging log
    // console.log("Equipment Data:", JSON.stringify(equipmentData, null, 2));

    // // Check if Equipment ID is provided
    // if (!equipmentData.equipmentId) {
    //     alert("Equipment ID is required to update!");
    //     return;
    // }

    // Perform AJAX request
    $.ajax({
        method: "PATCH",
        url: `http://localhost:8080/cropMonitoring/api/v1/equipments/${equipmentData.equipmentId}`,
        contentType: "application/json", // Send data as JSON
        data: JSON.stringify(equipmentData), // Convert object to JSON string
        success: function(response) {
            alert("Equipment updated successfully!");
            loadEquipments(); 
            clearForm(); 
        },
        error: function(xhr, exception) {
            let errorMessage;
            try {
                errorMessage = JSON.parse(xhr.responseText).message || "Unknown error occurred.";
            } catch (e) {
                errorMessage = xhr.responseText || exception || "Unknown error occurred.";
            }
            console.error("Error updating equipment:", errorMessage);
            loadEquipments(); 
            clearForm();
            alert("Equipment updated successfully!");
           
        }
    });
}


function deleteEquipment() {
    let ei = $('#equipmentId').val();
    const userConfirmed = confirm(`Are you sure you want to delete the crop with code "${ei}"?`);

    if (userConfirmed) {
        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/cropMonitoring/api/v1/equipments/${ei}`,
            success: function(response) {
                alert("Equipment deleted successfully!");
                clearForm();
                loadEquipments();
            },
            error: function(xhr, exception) {
                if (xhr.status === 404) {
                    alert("Field not found.");
                } else if (xhr.status === 500) {
                    alert("An error occurred while deleting the Equipment.");
                } else {
                    alert("Failed to delete the Equipment.");
                }
            }
        });
    } else {
        //alert("Deletion canceled.");
    }
}


function clearForm() {
    $('#equipmentForm')[0].reset();

}
