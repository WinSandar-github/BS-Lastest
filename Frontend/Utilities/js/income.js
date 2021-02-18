function createIncome() {
    var income = "income_date=" + formatDate($("#income_date").val())+"&income_total=" + removeComma($("#income_amount").val());
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createIncome",
        data: income,
        success: function (data) {
            $("#income_id").val(data.id);
            createIncomeDetail();
            
        },
        error: function (message){
            errorMessage(message);
        }
    });
}

function getIncome() {
    destroyDatatable("#tbl_income", "#tbl_income_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getIncomeDetailByIncomeId(" + element.id + ");'>";
                tr += "<td >" + new Date(element.income_date).getFullYear() + "</td>";
                tr += "<td >" + formatMonth(element.income_date) + "</td>";
                tr += "<td >" + formatDate(element.income_date) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.income_date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_income_container").append(tr);

            });
            customDataTable('#tbl_income');
            
        },
        error: function (message) {
            dataMessage(message,"#tbl_income", "#tbl_income_container");
        }
    });
}

function addIncomeDetailInfo(incomeId) {
    $("#incomeForm").attr('action', 'javascript:updateIncome()');
    $("#income_id").val(incomeId);
    var data = "&income_id=" +incomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showIncomeInfo",
        data: data,
        success: function (data) {
            $("#income_id").val(data.id);
            //var income_date=data.income_date.split('-');
            //$("#income_detail_date").val(income_date[2]+'/'+income_date[1]+'/'+income_date[0]);
            $('#income_detail_date').val(formatDate(data.income_date));
            $('#income_total').val(data.income_total);
            $('#income_modal').modal('toggle');
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function showIncomeInfo(incomeId) {
    $("#income_form").attr('action', 'javascript:updateIncome()');
    $("#income_id").val(incomeId);
    var data = "&income_id=" +incomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showIncomeInfo",
        data: data,
        success: function (data) {
            $("#income_date").val(formatDate(data.income_date));
            $('#income_total').val(data.income_total);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function updateIncome() {
    var income_total=parseInt(removeComma($('#income_total').val()))+parseInt(removeComma($("#income_detail_amount").val()));
    var income = "income_id=" + $("#income_id").val() +"&income_total=" + income_total;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateIncome",
        data: income,
        success: function (data) {
            addIncomeDetail();
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteIncome(income_date, incomeId) {
    var result = confirm("WARNING: This will delete " + decodeURIComponent(income_date) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "income_id=" + incomeId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteIncome",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_income", "#tbl_income_container");
                successMessage(data);
                getIncome();
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}
function getIncomeBySelectMonth(select){
    if(select!='Monthly'){
        $('.datetimepicker-input').attr('disabled',false);
        getIncome();
    }else{
        $('.datetimepicker-input').val("");
        $('.datetimepicker-input').attr('disabled',true);
        getIncomeByMonth();
    }
}
function getIncomeByDate(date){
    destroyDatatable("#tbl_income", "#tbl_income_container");
    destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "create_date="+formatDate(date),
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getIncomeDetailByIncomeId(" + element.id + ");'>";
                tr += "<td >" + new Date(element.income_date).getFullYear() + "</td>";
                tr += "<td >" + formatMonth(element.income_date) + "</td>";
                tr += "<td >" + formatDate(element.income_date) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.income_date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_income_container").append(tr);

            });
            customDataTable('#tbl_income');
            
        },
        error: function (message) {
            dataMessage(message,"#tbl_income", "#tbl_income_container");
        }
    });
}
function getIncomeByMonth(){
    destroyDatatable("#tbl_income", "#tbl_income_container");
    destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getIncomeDetailByIncomeId(" + element.id + ");'>";
                tr += "<td >" + new Date(element.income_date).getFullYear() + "</td>";
                tr += "<td >" + formatMonth(element.income_date) + "</td>";
                tr += "<td >" + formatDate(element.income_date) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-sm btn-space' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.income_date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_income_container").append(tr);

            });
            startDataTable('#tbl_income');
            
        },
        error: function (message) {
            dataMessage(message,"#tbl_income", "#tbl_income_container");
        }
    });
}
