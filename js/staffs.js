$(document).ready(function() {
    loadStaffs();
    // getFieldCode()
});
function saveStaff() {
    let staffData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        joinedDate: $('#joinedDate').val(),
        DOB: $('#DOB').val(),
        addressLine1: $('#addressLine1').val(),
        addressLine2: $('#addressLine2').val(),
        addressLine3: $('#addressLine3').val(),
        addressLine4: $('#addressLine4').val(),
        addressLine5: $('#addressLine5').val(),
        contactNo: $('#contactNo').val(),
        email: $('#email').val(),
        role: $('#role').val()
    };

    // Send the AJAX request
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/staffs",
        contentType: "application/json", // Specify JSON content type
        data: JSON.stringify(staffData), // Convert object to JSON string
        success: function (response) {
            alert("Staff saved successfully!");
            loadStaffs();
            clearForm();
        },
        error: function (xhr, exception) {
            let errorMessage;
            try {
                errorMessage = JSON.parse(xhr.responseText).message || "Unknown error";
            } catch (e) {
                errorMessage = exception;
            }
            console.error("Error occurred:", errorMessage);
            alert("Failed to save the Staff: " + errorMessage);
        }
    });
}


function loadStaffs() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/staffs/allStaffs",
        contentType: "application/json",
        success: function (response) {
            // Assuming 'response' is an array of field objects
            let tableBody = $('#staffsTable tbody');
            tableBody.empty(); // Clear existing rows

            response.forEach((staff, index) => {
                let row = `
                    <tr data-staff='${JSON.stringify(staff)}'>
                        <td>${index + 1}</td>
                        <td>${staff.staffMemberId || "N/A"}</td>
                        <td>${staff.firstName}</td>
                        <td>${staff.lastName}</td>
                        <td>${staff.designation}</td>
                        <td>${staff.gender}</td>
                        <td>${staff.joinedDate}</td> 
                        <td>${staff.DOB}</td>
                        <td>${staff.addressLine1}, ${staff.addressLine2}, ${staff.addressLine3}, ${staff.addressLine4}, ${staff.addressLine5},</td>
                        <td>${staff.contactNo}</td>
                        <td>${staff.email}</td>
                         <td>${staff.role}</td>                 
                    </tr>
                `;
                tableBody.append(row);
            });

              // Attach click event to rows
                $('#staffsTable tbody').on('click', 'tr', function () {
                    const staffData = $(this).data('staff');
                    loadFormWithData(staffData);
                });       
        },
        error: function (xhr, exception) {
            console.error("Error loading crops:", xhr.responseText || exception);
            alert("Failed to load crops.");
        }
    });
}

function loadFormWithData(staffData) {
    $('#staffMemberId').val(staffData.staffMemberId);
    $('#firstName').val(staffData.firstName);
    $('#lastName').val(staffData.lastName);
    $('#designation').val(staffData.designation);
    $('#gender').val(staffData.gender);
    $('#joinedDate').val(staffData.joinedDate);
    $('#DOB').val(staffData.DOB);
    $('#addressLine1').val(staffData.addressLine1);
    $('#addressLine2').val(staffData.addressLine2);
    $('#addressLine3').val(staffData.addressLine3);
    $('#addressLine4').val(staffData.addressLine4);
    $('#addressLine5').val(staffData.addressLine5);
    $('#contactNo').val(staffData.contactNo);
    $('#email').val(staffData.email);
    $('#role').val(staffData.role);
    console.log(staffData.joinedDate)
    // Display the form
    $('#staffForm').show();
}


function updateStaff() {
    // Prepare staff data as a JSON object
    let staffData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        designation: $('#designation').val(),
        gender: $('#gender').val(),
        joinedDate: $('#joinedDate').val(),
        DOB: $('#DOB').val(),
        addressLine1: $('#addressLine1').val(),
        addressLine2: $('#addressLine2').val(),
        addressLine3: $('#addressLine3').val(),
        addressLine4: $('#addressLine4').val(),
        addressLine5: $('#addressLine5').val(),
        contactNo: $('#contactNo').val(),
        email: $('#email').val(),
        role: $('#role').val()
    };

    // Send AJAX PATCH request
    $.ajax({
        method: "PATCH",
        url: `http://localhost:8080/cropMonitoring/api/v1/staffs/${$('#staffMemberId').val()}`, // Endpoint with staff ID
        contentType: "application/json", // Send data as JSON
        processData: false,             // Prevents processing of the data
        data: JSON.stringify(staffData), // Convert object to JSON string
        success: function(response) {
            alert("Staff updated successfully!");
            loadStaffs(); // Reload staff list after update
            clearForm();  // Clear form fields after update
        },
        error: function(xhr, exception) {
            let errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).message : exception;
            console.error("Error updating Staff:", errorMessage);
            alert("Failed to update the Staff: " + errorMessage);
        }
    });
}


function deleteStaff() {
    let smi = $('#staffMemberId').val();  // Corrected typo in 'staffMenberId' to 'staffMemberId'
    const userConfirmed = confirm(`Are you sure you want to delete the staff member with ID "${smi}"?`);

    if (userConfirmed) {
        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/cropMonitoring/api/v1/staffs/${smi}`, // Correct URL
            success: function(response) {
                alert("Staff deleted successfully!");  // Corrected alert message
                clearForm(); // Clear the form after successful deletion
                loadStaffs(); // Reload staff list after deletion
            },
            error: function(xhr, exception) {
                // Improved error handling
                if (xhr.status === 404) {
                    alert("Staff member not found.");
                } else if (xhr.status === 500) {
                    alert("An error occurred while deleting the staff member.");
                } else {
                    alert("Failed to delete the staff member.");
                }
            }
        });
    } else {
        // Optionally, log the cancellation or do nothing
        // alert("Deletion canceled.");
    }
}



function clearForm() {
    $('#staffForm')[0].reset();
}
