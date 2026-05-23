$(document).ready(function() {
    // Form field validation
    $("select[data-field], input[data-field]").on("change input", function() {
        if ($(this).val()) {
            $(this).css("border-color", "#ddd");
            $(this).siblings(".error-message").hide();
        }
    });
    
    // Submit button click handler
    $("#calcSubmitBtn").on("click", function() {
        calculateMechanicFees();
    });
    
    // Close results button
    $("#closeResultsBtn").on("click", function() {
        $("#feeResults").fadeOut(300);
    });
});

function calculateMechanicFees() {
    // Reset error states
    $(".error-message").hide();
    $("select[data-field], input[data-field]").css("border-color", "#ddd");
    
    // Validate all fields
    let isValid = true;
    let formData = new FormData();
    
    $("select[data-field], input[data-field]").each(function() {
        const field = $(this);
        const fieldName = field.attr("data-field");
        const fieldValue = field.val();
        
        if (!fieldValue) {
            field.css("border-color", "#d9534f");
            field.siblings(".error-message").show();
            isValid = false;
        } else {
            formData.append(fieldName, fieldValue);
        }
    });
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    $("#calcSubmitBtn").text("Calculating...").prop("disabled", true);
    
    // Hide previous results
    $("#feeResults").hide();
    $("#feeTableBody").empty();
    $("#noResultsMsg, #errorMsg").hide();
    
    // Add required tokens
    formData.append("_token", "@an*LqFi2pdG8rF67EfQ@BE");
    formData.append("lang", "en");
    
    // Make API request
    $.ajax({
        type: "POST",
        url: "https://isf.gov.lb/api/service-mechanic-fees",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function(response) {
            if (response.months && response.months.length > 0 && 
                response.amount && response.amount.length > 0) {
                
                // Populate table with results
                for (let i = 0; i < response.months.length; i++) {
                    const month = response.months[i] || '';
                    let amount = response.amount[i] || '';
                    
                    if (amount !== '') {
                        amount = parseFloat(amount).toLocaleString('en-US');
                    }
                    
                    $("#feeTableBody").append(`
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 12px 15px;">${month}</td>
                            <td style="padding: 12px 15px; text-align: right;">${amount} L.L.</td>
                        </tr>
                    `);
                }
                
                // Show results
                $("#resultsContent").show();
                $("#feeResults").fadeIn(400);
            } else {
                // Show no results message
                $("#resultsContent").hide();
                $("#noResultsMsg").show();
                $("#feeResults").fadeIn(400);
            }
        },
        error: function(xhr, status, error) {
            // Show error message
            $("#resultsContent").hide();
            $("#errorMsg").show();
            $("#feeResults").fadeIn(400);
        },
        complete: function() {
            // Reset button state
            $("#calcSubmitBtn").text("Calculate Fees").prop("disabled", false);
            
            // Scroll to results if visible
            if ($("#feeResults").is(":visible")) {
                $('html, body').animate({
                    scrollTop: $("#feeResults").offset().top - 100
                }, 500);
            }
        }
    });
}