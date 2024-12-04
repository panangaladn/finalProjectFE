$(document).ready(function() {
    loadCrops();
    getFieldCode()
});
function saveCrop() {
    let formData = new FormData();
    
    // Add text fields
    formData.append("cropCommonName", $('#cropCommonName').val()); // Corrected field name
    formData.append("cropScientificName", $('#cropScientificName').val());
    formData.append("cropImage", $('#cropImage')[0].files[0]);
    formData.append("category", $('#category').val()); // Corrected field name
    formData.append("cropSeason", $('#cropSeason').val());
    formData.append("fieldCode", $('#fieldCode').val());

    // Send the AJAX request
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/crops",
        contentType: false, // Do not set content type, let jQuery handle it
        processData: false, // Prevent jQuery from processing data
        data: formData, // Send the FormData object
        success: function (response) {
            alert("Crop saved successfully!");
            loadCrops();
            clearForm();
        },
        error: function (xhr, exception) {
            let errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).message : exception;
            console.error("Error occurred:", errorMessage);
            alert("Failed to save the crop: " + errorMessage);
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


function loadCrops() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/crops/allCrops",
        contentType: "application/json",
        success: function (response) {
            // Assuming 'response' is an array of field objects
            let tableBody = $('#cropsTable tbody');
            tableBody.empty(); // Clear existing rows

            response.forEach((crop, index) => {
                let row = `
                    <tr data-crop='${JSON.stringify(crop)}'>
                        <td>${index + 1}</td>
                        <td>${crop.cropCode || "N/A"}</td>
                        <td>${crop.cropCommonName}</td>
                        <td>${crop.cropScientificName}</td>
                        <td>${crop.category}</td>fieldCode
                        <td>${crop.cropSeason}</td>
                        <td>${crop.fieldCode}</td>                        
                        <td><img src="data:image/png;base64,${crop.cropImage}" alt="crop Image" width="100"></td>
                    </tr>
                `;
                tableBody.append(row);
            });

              // Attach click event to rows
                $('#cropsTable tbody').on('click', 'tr', function () {
                    const cropData = $(this).data('crop');
                    loadFormWithData(cropData);
                    //console.log(cropData.cropImage1)
                });       
        },
        error: function (xhr, exception) {
            console.error("Error loading crops:", xhr.responseText || exception);
            alert("Failed to load crops.");
        }
    });
}


function loadFormWithData(crop) {
    // Populate form fields with row data
    $('#cropCode').val(crop.cropCode);
    $('#cropCommonName').val(crop.cropCommonName);
    $('#cropScientificName').val(crop.cropScientificName);
    $('#category').val(crop.category);
    $('#cropSeason').val(crop.cropSeason);
    $('#fieldCode').val(crop.fieldCode);

    // Set the image src attributes to display the images
    if (crop.cropImage) {
        $('#uploadedImage1').attr('src', 'data:image/jpeg;base64,' + crop.cropImage); // Assuming base64 encoded image
        $('#uploadedImage1').show(); // Show the image element
    } else {
        $('#uploadedImage1').hide(); // Hide the image element if no image
    }
    // Display the form
    $('#cropForm').show();
}


function updateCrop() {
    // Create FormData object
    let formData = new FormData();

    formData.append("cropCommonName", $('#cropCommonName').val()); // Corrected field name
    formData.append("cropScientificName", $('#cropScientificName').val());
    formData.append("cropImage", $('#cropImage')[0].files[0]);
    formData.append("category", $('#category').val()); // Corrected field name
    formData.append("cropSeason", $('#cropSeason').val());
    formData.append("fieldCode", $('#fieldCode').val());

    const image1 = $('#cropImage')[0].files[0] || $('#uploadedImage1').attr('src');
    if (image1) {
        const imageBlob = image1 instanceof File ? image1 : base64ToBlob(image1);
        formData.append("cropImage", imageBlob, "cropImage.jpg");
    }

    // Send the data via AJAX
    $.ajax({
        method: "PATCH",
        url: `http://localhost:8080/cropMonitoring/api/v1/crops/${$('#cropCode').val()}`,
        
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            alert("Crops updated successfully!");
            loadCrops(); // Reload fields after update
            clearForm();  // Clear form after update
        },
        error: function(xhr, exception) {
            console.error("Error updating Crop:", xhr.responseText || exception);
            alert("Failed to update the Crop.");
        }
    });
}

// Function to convert base64 to Blob
function base64ToBlob(base64Data) {
    const imageType = base64Data.split(';')[0].split(':')[1];
    const base64DataPart = base64Data.split(',')[1];
    const byteCharacters = atob(base64DataPart);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArray], { type: imageType });
}


function deleteCrop() {
    let cc = $('#cropCode').val();
    const userConfirmed = confirm(`Are you sure you want to delete the crop with code "${cc}"?`);

    if (userConfirmed) {
        $.ajax({
            method: "DELETE",
            url: `http://localhost:8080/cropMonitoring/api/v1/crops/${cc}`,
            success: function(response) {
                alert("Crop deleted successfully!");
                clearForm();
                loadCrops();
            },
            error: function(xhr, exception) {
                if (xhr.status === 404) {
                    alert("Field not found.");
                } else if (xhr.status === 500) {
                    alert("An error occurred while deleting the field.");
                } else {
                    alert("Failed to delete the field.");
                }
            }
        });
    } else {
        //alert("Deletion canceled.");
    }
}


function clearForm() {
    $('#cropForm')[0].reset();
    $('#uploadedImage1').hide();
    $('#uploadedImage2').hide();
}
