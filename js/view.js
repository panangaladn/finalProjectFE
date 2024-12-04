$(document).ready(function() {
    loadFields();
});

function loadFields() {
    $.ajax({
        method: "GET",
        url: "http://localhost:8080/cropMonitoring/api/v1/fields/allFields",
        contentType: "application/json",
        success: function(response) {
            let selectElement = document.getElementById("selectFieldIds");
            selectElement.innerHTML = '<option value="" disabled selected>Select a field</option>'; 

            response.forEach(field => {
                let option = document.createElement("option");
                option.value = field.fieldCode || "N/A"; 
                option.textContent = field.fieldCode || "N/A"; 
                selectElement.appendChild(option);
            });

            selectElement.addEventListener("change", function() {
                let selectedValue = this.value;
                if (selectedValue) {
                    loadFieldById(selectedValue);
                } else {
                    console.warn("No field selected.");
                }
            });
        },
        error: function(xhr, exception) {
            console.error("Error loading fields:", xhr.responseText || exception);
            alert("Failed to load fields. Please try again later.");
        }
    });
}

function loadFieldById(selectedValue) {
    let fieldName=document.getElementById("fieldName");
    let location=document.getElementById("location");
    let size=document.getElementById("size");
    $.ajax({
        method: "GET",
        url: `http://localhost:8080/cropMonitoring/api/v1/fields/${selectedValue}`,
        contentType: "application/json",
        success: function(response) {
            if (response) {
                console.log(response)
                fieldName.innerHTML=response.fieldName;
                location.innerHTML=response.fieldLocation.x+"-"+response.fieldLocation.y;
                size.innerHTML=response.fieldSize;               
                $('#fieldImage1').attr('src', 'data:image/jpeg;base64,' + response.fieldImage1); 
                $('#fieldImage2').attr('src', 'data:image/jpeg;base64,' + response.fieldImage2);
                //crops
                $('#cropsList').html(response.cropCodes.join(", "));
            } else {
                console.warn("Field not found for the selected ID:", selectedValue);
                alert("Field not found. Please select another.");
            }
        },
        error: function(xhr, exception) {
            console.error("Error loading field by ID:", xhr.responseText || exception);
            alert("Failed to load field details. Please try again later.");
        }
    });
}


