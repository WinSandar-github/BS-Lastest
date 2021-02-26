function createIncomeDetail() {
    var income_detail = {};
    income_detail['income_id']=$("#income_id").val();
    income_detail['income_date']=$("#income_date").val();
    income_detail['income_reason']=$("#income_reason").val();
    income_detail['income_unit_amount']=removeComma($("#income_amount").val());
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createIncomeDetail",
        data: JSON.stringify(income_detail),
        success: function (data) {
            document.getElementById("income_form").reset();
            $('#incometotal_modal').modal('toggle');
            destroyDatatable("#tbl_income", "#tbl_income_container");
            destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
            successMessage(data);
            getIncome();
            getIncomeDetailByIncomeId($("#income_id").val());
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function addIncomeDetail() {
    var income_detail = {};
    income_detail['income_id']=$("#income_id").val();
    income_detail['income_date']=$("#income_detail_date").val();
    income_detail['income_reason']=$("#income_detail_reason").val();
    income_detail['income_unit_amount']=removeComma($("#income_detail_amount").val());
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createIncomeDetail",
        data: JSON.stringify(income_detail),
        success: function (data) {
            $('#income_modal').modal('toggle');
            destroyDatatable("#tbl_income", "#tbl_income_container");
            destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
            successMessage(data);
            getIncome();
            getIncomeDetailByIncomeId($("#income_id").val());
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function getIncomeDetailByIncomeId(income_outcome_id) {
    destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getIncomeDetailByIncomeId",
        data: "income_outcome_id=" +income_outcome_id,
        success: function (data) {
            data.forEach(function (element) {
                
                var tr = "<tr>";
                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";
                tr += "<td class='text-center'>" +  element.reason+ "</td>";
                tr += "<td class='text-right' style='padding-right:250px'>" + thousands_separators( element.unit_amount)+ "</td>";
                tr += "</tr>";
                $('#tbl_income_detail_container').append(tr);
               
            });
            startDataTable("#tbl_income_detail");
            timeLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_income_detail", "#tbl_income_detail_container");
            timeLoad();
        }
    });
}
