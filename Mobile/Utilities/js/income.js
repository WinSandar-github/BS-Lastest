function createIncome() {
    var income = "date=" + $("#income_date").val()+"&income_total=" + removeComma($("#income_amount").val());
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
    document.getElementById('income').style.display='block';
    document.getElementById('yearincome').style.display='none';
    destroyDatatable("#tbl_income", "#tbl_income_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getIncomeDetailByIncomeId(" + element.id + ");'>";
                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";
                tr += "<td class='text-right' style='padding-right:50px'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-xs' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_income_container").append(tr);

            });
            startDataTable('#tbl_income');
            hideLoad();
        },
        error: function (message) {
            // dataMessage(message,"#tbl_income", "#tbl_income_container");
            startDataTable('#tbl_income');
            hideLoad();
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
            $('#income_detail_date').val(formatDate(data.date));
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
            $("#income_date").val(formatDate(data.date));
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
        $('#income_datepicer').attr('disabled',false);
        getIncome();
    }else{
        $('#income_datepicer').val("");
        $('#income_datepicer').attr('disabled',true);
        getIncomeByMonth();
    }
}
function getIncomeByDate(date){
    destroyDatatable("#tbl_income", "#tbl_income_container");
    destroyDatatable("#tbl_income_detail", "#tbl_income_detail_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "create_date="+date,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr  onclick='getIncomeDetailByIncomeId(" + element.id + ");'>";
                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";
                tr += "<td class='text-right' style='padding-right:50px'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-xs' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_income_container").append(tr);

            });
            startDataTable('#tbl_income');
            hideLoad();
        },
        error: function (message) {
            // dataMessage(message,"#tbl_income", "#tbl_income_container");
            startDataTable('#tbl_income');
            hideLoad();
        }
    });
}
function getIncomeByMonth(){
    document.getElementById('income').style.display='none';
    document.getElementById('yearincome').style.display='block';
    destroyDatatable("#tbl_yearincome", "#tbl_yearincome_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getIncome",
        data: "monthly=allmonth",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td class='text-center'>" + element.year + "</td>";
                tr += "<td class='text-center'>" + element.month + "</td>";
                //tr += "<td class='text-center'>" + element.status + "</td>";
                tr += "<td class='text-right' style='padding-right:50px'>" + thousands_separators(element.income_total) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                    "<button type='button' class='btn btn-primary btn-xs' onClick='addIncomeDetailInfo(" + element.id + ")'>" +
                    "<li class='fas fa-hand-holding-usd'></li></button> ";
                // tr +="<button type='button' class='btn btn-info btn-xs' onClick='showIncomeInfo(" + element.id + ")'>" +
                //     "<li class='fas fa-pencil-alt'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteIncome(\"" + encodeURIComponent(element.date) + "\"," + element.id + ")><li class='far fa-trash-alt' ></li ></button ></div ></td > ";
                tr += "</tr>";
                $("#tbl_yearincome_container").append(tr);

            });
            startDataTable('#tbl_yearincome');
            hideLoad();
        },
        error: function (message) {
            startDataTable('#tbl_yearincome');
            hideLoad();
            // dataMessage(message,"#tbl_yearincome", "#tbl_yearincome_container");
        }
    });
}
