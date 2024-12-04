$(document).ready(function() {
    loadFieldCodes();
    loadCropCodes();
    loadStaffMemberIds();
    loadLogs();
});

function saveLog() {
    let formData = new FormData();

    // Add single value fields
    formData.append("logObservation", $('#logObservation').val());
    formData.append("logCode", $('#logCode').val());

    // Add multiple values for fieldCodes, cropCodes, and staffMemberIds
    const fieldCodes = $('#fieldCodes').val() || [];
    const cropCodes = $('#cropCodes').val() || [];
    const staffMemberIds = $('#staffMemberIds').val() || [];

    // Append each value separately to match Postman behavior
    fieldCodes.forEach(code => formData.append("fieldCodes", code));
    cropCodes.forEach(code => formData.append("cropCodes", code));
    staffMemberIds.forEach(id => formData.append("staffMemberIds", id));

    // Add file field
    const observedImage = $('#observedImage')[0].files[0];
    if (observedImage) {
        formData.append("observedImage", observedImage);
    }

    // Send AJAX request
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/monitoringlogs",
        contentType: false, // Important for FormData
        processData: false, // Prevent jQuery from processing FormData
        data: formData,
        success: function(response) {
            alert("Monitoring log saved successfully!");
            loadLogs();
            clearForm();
        },
        error: function(xhr) {
            alert("Error: " + (xhr.responseJSON?.message || "Unknown error occurred."));
        }
    });
}





function loadFieldCodes() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/fields/allFields",
        success: function(response) {
            let fieldSelect = $('#fieldCodes');
            fieldSelect.empty().append('<option value="" >Select Fields</option>');
            response.forEach(field => fieldSelect.append(`<option value="${field.fieldCode}">${field.fieldCode}</option>`));
        }
    });
}

function loadCropCodes() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/crops/allCrops",
        success: function(response) {
            let cropSelect = $('#cropCodes');
            cropSelect.empty().append('<option value="">Select Crops</option>');
            response.forEach(crop => cropSelect.append(`<option value="${crop.cropCode}">${crop.cropCode}</option>`));
        }
    });
}

function loadStaffMemberIds() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/staffs/allStaffs",
        success: function(response) {
            let staffSelect = $('#staffMemberIds');
            staffSelect.empty().append('<option value="">Select Staff Members</option>');
            response.forEach(staff => staffSelect.append(`<option value="${staff.staffMemberId}">${staff.staffMemberId}</option>`));
        }
    });
}

function loadLogs() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/monitoringlogs/allMonitoringLogs",
        success: function(response) {
            let tableBody = $('#logsTable tbody');
            tableBody.empty();
            response.forEach((log, index) => {
                tableBody.append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${log.logCode}</td>
                        <td>${log.logObservation}</td>
                        <td>${log.fieldCodes.join(', ')}</td>
                        <td>${log.cropCodes.join(', ')}</td>
                        <td>${log.staffMemberIds.join(', ')}</td>
                        <td><img src="data:image/png;base64,${log.observedImage}" width="100"></td>
                    </tr>
                `);
            });
        }
    });
}


function clearForm() {
    $('#logForm')[0].reset();

}
