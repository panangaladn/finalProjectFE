$(document).ready(function() {
    loadFields();
});

function saveField() {
    // Create a FormData object to handle form data and file uploads
    let formData = new FormData();

    // Add text fields
    formData.append("fieldName", $('#fieldName').val());
    formData.append("fieldLocation", $('#fieldLocation').val());
    formData.append("fieldSize", $('#fieldSize').val());

    // Add file inputs
    formData.append("fieldImage1", $('#fieldImage1')[0].files[0]); // Access the first file
    formData.append("fieldImage2", $('#fieldImage2')[0].files[0]);
    
    

    // Send the AJAX request
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/cropMonitoring/api/v1/fields",
        contentType: false, // Do not set content type, let jQuery handle it
        processData: false, // Prevent jQuery from processing data
        data: formData, // Send the FormData object
        success: function (response) {
            alert("Field saved successfully!");
            loadFields();
            clearForm();
            // Call another function if needed, e.g., refresh the fields list
            // getAllFields();
        },
        error: function (xhr, exception) {
            // Show error details
            console.error("Error occurred:", xhr.responseText || exception);
            alert("Failed to save the field.");
        }
    });
}


function loadFields() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/fields/allFields",
        contentType: "application/json",
        success: function (response) {
            // Assuming 'response' is an array of field objects
            let tableBody = $('#fieldsTable tbody');
            tableBody.empty(); // Clear existing rows

            response.forEach((field, index) => {
                let row = `
                    <tr data-field='${JSON.stringify(field)}'>
                        <td>${index + 1}</td>
                        <td>${field.fieldCode || "N/A"}</td>
                        <td>${field.fieldName}</td>
                        <td>${field.fieldLocation.x}, ${field.fieldLocation.y}</td>
                        <td>${field.fieldSize}</td>
                        <td><img src="data:image/png;base64,${field.fieldImage1}" alt="Field Image 1" width="100"></td>
                        <td><img src="data:image/png;base64,${field.fieldImage2}" alt="Field Image 2" width="100"></td>
                    </tr>
                `;
                tableBody.append(row);
            });

              // Attach click event to rows
                $('#fieldsTable tbody').on('click', 'tr', function () {
                    const fieldData = $(this).data('field');
                    loadFormWithData(fieldData);
                    //console.log(fieldData.fieldImage1)
                });       
        },
        error: function (xhr, exception) {
            console.error("Error loading fields:", xhr.responseText || exception);
            alert("Failed to load fields.");
        }
    });
}

function loadFormWithData(field) {
    // Populate form fields with row data
    $('#fieldCode').val(field.fieldCode);
    $('#fieldName').val(field.fieldName);
    $('#fieldLocation').val(`${field.fieldLocation.x},${field.fieldLocation.y}`);
    $('#fieldSize').val(field.fieldSize);

    // Set the image src attributes to display the images
    if (field.fieldImage1) {
        $('#uploadedImage1').attr('src', 'data:image/jpeg;base64,' + field.fieldImage1); // Assuming base64 encoded image
        $('#uploadedImage1').show(); // Show the image element
    } else {
        $('#uploadedImage1').hide(); // Hide the image element if no image
    }

    if (field.fieldImage2) {
        $('#uploadedImage2').attr('src', 'data:image/jpeg;base64,' + field.fieldImage2); // Assuming base64 encoded image
        $('#uploadedImage2').show(); // Show the image element
    } else {
        $('#uploadedImage2').hide(); // Hide the image element if no image
    }

    // Display the form
    $('#fieldForm').show();
}
function updateField() {
    // Create FormData object
    let formData = new FormData();

    // Append form fields
    formData.append("fieldCode", $('#fieldCode').val());
    formData.append("fieldName", $('#fieldName').val());
    formData.append("fieldLocation", $('#fieldLocation').val());
    formData.append("fieldSize", $('#fieldSize').val());

    // Handle Image 1
    const image1 = $('#fieldImage1')[0].files[0] || $('#uploadedImage1').attr('src');
    if (image1) {
        const imageBlob = image1 instanceof File ? image1 : base64ToBlob(image1);
        formData.append("fieldImage1", imageBlob, "fieldImage1.jpg");
    }

    // Handle Image 2
    const image2 = $('#fieldImage2')[0].files[0] || $('#uploadedImage2').attr('src');
    if (image2) {
        const imageBlob = image2 instanceof File ? image2 : base64ToBlob(image2);
        formData.append("fieldImage2", imageBlob, "fieldImage2.jpg");
    }

    // Send the data via AJAX
    $.ajax({
        method: "PATCH",
        url: `http://localhost:8080/cropMonitoring/api/v1/fields/${$('#fieldCode').val()}`,
        contentType: false,
        processData: false,
        data: formData,
        success: function(response) {
            alert("Field updated successfully!");
            loadFields(); // Reload fields after update
            clearForm();  // Clear form after update
        },
        error: function(xhr, exception) {
            console.error("Error updating field:", xhr.responseText || exception);
            alert("Failed to update the field.");
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


function deleteField(fieldCode) {
    let fc=$('#fieldCode').val()
    const userConfirmed = confirm(`Are you sure you want to delete the crop with code "${fc}"?`);
if(userConfirmed){
    $.ajax({
        method: "DELETE",
        url: `http://localhost:8080/cropMonitoring/api/v1/fields/`+fc,
        success: function(response) {
            alert("Field deleted successfully!");
            loadFields(); 
            clearForm();
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
}else{

}
   
}

// Clear form function
function clearForm() {
    $('#fieldForm')[0].reset();
    $('#uploadedImage1').hide();
    $('#uploadedImage2').hide();
}
