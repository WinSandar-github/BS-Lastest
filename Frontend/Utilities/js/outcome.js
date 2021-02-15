function createOutcome() {
    var outcome = "outcome_date=" + $("#outcome_date").val()+"&outcome_total=" + $("#outcome_amount_paid").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOutcome",
        data: outcome,
        success: function (data) {
            $("#outcome_id").val(data.id);
            createOutcomeDetail();
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}

function getOutcome() {
    destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getOutcome",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getOutcomeDetailByOutcomeId(" + element.id + ");'>";
                tr += "<td >" + element.outcome_date + "</td>";
                tr += "<td >" + thousands_separators(element.outcome_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addOutcomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showOutcomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteOutcome(\"" + encodeURIComponent(element.outcome_date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_outcome_container").append(tr);

            });
            startDataTable('#tbl_outcome');
            
        },
        error: function (message) {
            dataMessage(message,"#tbl_outcome", "#tbl_outcome_container");
        }
    });
}

function addOutcomeDetailInfo(outcomeId) {
    $("#outcomeForm").attr('action', 'javascript:updateOutcome()');
    $("#outcome_id").val(outcomeId);
    var data = "&outcome_id=" +outcomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showOutcomeInfo",
        data: data,
        success: function (data) {
            $("#outcome_id").val(data.id);
            var outcome_date=data.outcome_date.split('-');
            $("#outcome_detail_date").val(outcome_date[2]+'/'+outcome_date[1]+'/'+outcome_date[0]);
            $('#outcome_total').val(data.outcome_total);
            $('#outcome_modal').modal('toggle');
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function showOutcomeInfo(outcomeId) {
    $("#outcome_form").attr('action', 'javascript:updateOutcome()');
    $("#outcome_id").val(outcomeId);
    var data = "&outcome_id=" +outcomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showOutcomeInfo",
        data: data,
        success: function (data) {
            var outcome_date=data.outcome_date.split('-');
            $("#outcome_date").val(outcome_date[2]+'/'+outcome_date[1]+'/'+outcome_date[0]);
            $('#outcome_total').val(data.outcome_total);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function updateOutcome() {
    var outcome_total=parseInt(removeComma($('#outcome_total').val()))+parseInt(removeComma($("#outcome_detail_amount").val()));
    var outcome = "outcome_id=" + $("#outcome_id").val() + "&outcome_total=" + outcome_total;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateOutcome",
        data: outcome,
        success: function (data) {
            addOutcomeDetail();
            
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteOutcome(outcome_date, outcomeId) {
    var result = confirm("WARNING: This will delete " + decodeURIComponent(outcome_date) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "outcome_id=" + outcomeId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteOutcome",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
                successMessage(data);
                getOutcome();
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}
