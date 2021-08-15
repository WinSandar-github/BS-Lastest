function createOutcome() {
    var outcome = "date=" + $("#outcome_date").val()+"&outcome_total=" + removeComma($("#outcome_amount_paid").val());
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
    document.getElementById('outcome').style.display='block';
    document.getElementById('yearoutcome').style.display='none';
    destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getOutcome",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getOutcomeDetailByOutcomeId(" + element.id + ");'>";
                tr += "<td >" + formatDate(element.date) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.outcome_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addOutcomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showOutcomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteOutcome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_outcome_container").append(tr);

            });
            startDataTable('#tbl_outcome');
            hideLoad();
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
            $("#outcome_detail_date").val(formatDate(data.date));
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
            $("#outcome_date").val(formatDate(data.date));
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
function getOutcomeBySelectMonth(select){
    if(select!='Monthly'){
        $('.datetimepicker-input').attr('disabled',false);
        getOutcome();
    }else{
        $('.datetimepicker-input').val("");
        $('.datetimepicker-input').attr('disabled',true);
        getOutcomeByMonth();
    }
}
function getOutcomeByDate(date){
    destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
    destroyDatatable("#tbl_outcome_detail", "#tbl_outcome_detail_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getOutcome",
        data: "create_date="+formatDatepicer(date),
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getOutcomeDetailByOutcomeId(" + element.id + ");'>";
                tr += "<td >" + formatDate(element.date) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.outcome_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addOutcomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteOutcome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_outcome_container").append(tr);

            });
            startDataTable('#tbl_outcome');
            hideLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_outcome", "#tbl_outcome_container");
            hideLoad();
        }
    });
}
function getOutcomeByMonth(){
    document.getElementById('outcome').style.display='none';
    document.getElementById('yearoutcome').style.display='block';
    destroyDatatable("#tbl_yearoutcome", "#tbl_yearoutcome_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getOutcome",
        data: "monthly=allmonth",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + element.year + "</td>";
                tr += "<td >" + element.month + "</td>";
                tr += "<td >" + element.status + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.outcome_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addOutcomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteOutcome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_yearoutcome_container").append(tr);

            });
            startDataTable('#tbl_yearoutcome');
            hideLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_yearoutcome", "#tbl_yearoutcome_container");
        }
    });
}
