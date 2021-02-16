function createOutcomeDetail() {
    var outcome_detail = {};
    outcome_detail['outcome_id']=$("#outcome_id").val();
    outcome_detail['outcome_date']=$("#outcome_date").val();
    outcome_detail['outcome_reason']=$("#outcome_reason").val();
    outcome_detail['outcome_unit_amount']=$("#outcome_amount_paid").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOutcomeDetail",
        data: JSON.stringify(outcome_detail),
        success: function (data) {
            document.getElementById("outcome_form").reset();
            destroyDatatable("#tbl_outcome_detail", "#tbl_outcome_detail_container");
            destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
            successMessage(data);
            getOutcome();
            getOutcomeDetailByOutcomeId($("#outcome_id").val());
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function addOutcomeDetail() {
    var outcome_detail = {};
    outcome_detail['outcome_id']=$("#outcome_id").val();
    outcome_detail['outcome_date']=$("#outcome_detail_date").val();
    outcome_detail['outcome_reason']=$("#outcome_detail_reason").val();
    outcome_detail['outcome_unit_amount']=$("#outcome_detail_amount").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOutcomeDetail",
        data: JSON.stringify(outcome_detail),
        success: function (data) {
            $('#outcome_modal').modal('toggle');
            destroyDatatable("#tbl_outcome_detail", "#tbl_outcome_detail_container");
            destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
            successMessage(data);
            getOutcome();
            getOutcomeDetailByOutcomeId($("#outcome_id").val());
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function getOutcomeDetailByOutcomeId(outcome_id) {
    destroyDatatable("#tbl_outcome_detail", "#tbl_outcome_detail_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOutcomeDetailByOutcomeId",
        data: "outcome_id=" +outcome_id,
        success: function (data) {
            data.forEach(function (element) {
                
                var tr = "<tr>";
                tr += "<td >" + element.outcome_date + "</td>";
                tr += "<td >" +  element.outcome_reason+ "</td>";
                tr += "<td >" + thousands_separators( element.outcome_unit_amount)+ "</td>";
                tr += "</tr>";
                $('#tbl_outcome_detail_container').append(tr);
                
            });
            startDataTable("#tbl_outcome_detail");
            
        },
        error: function (message) {
            dataMessage(message,"#tbl_outcome_detail", "#tbl_outcome_detail_container");
        }
    });
}
