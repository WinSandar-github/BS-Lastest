function loadTotal(){
    destroyDatatable("#tbl_total", "#tbl_total_container");
    $("#total").html("");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getTotal",
        data: "",
        success: function (data) {

            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";
                tr += "<td class='text-right' style='padding-right:50px'><span class='text-primary cursor-css' onClick=getIncomeDetailByIncomeId(" + element.id + ");>" + thousands_separators(element.income_total) + "</span></td>";
                tr+="<td class='text-right' style='padding-right:50px'><span class='text-primary cursor-css' onClick=getOutcomeDetailByOutcomeId(" + element.id + ");>"+ thousands_separators(element.outcome_total) + "</span></td>";
                if(element.outcome_total>element.income_total){
                    tr+="<td class='text-right text-danger' style='padding-right:50px'>"+ thousands_separators(parseInt(element.income_total)-parseInt(element.outcome_total)) + "</td>";
                }else{
                    tr+="<td class='text-right' style='padding-right:50px'>"+ thousands_separators(parseInt(element.income_total)-parseInt(element.outcome_total)) + "</td>";
                }
                tr += "</tr>";
                $("#tbl_total_container").append(tr);

            });
            getTotal();
            startDataTable('#tbl_total');
            timeLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_total", "#tbl_total_container");
        }
    });
}
function getTotal() {
    var total = 0;
    $('#tbl_total tbody tr').each(function () {
        var value = parseInt(removeComma($('td', this).eq(3).text()));
        if (!isNaN(value)) {
            total += value;
        }
    });
    $("#total").html(thousands_separators(total));
}
function getOutcomeDetailByOutcomeId(income_outcome_id) {
    destroyDatatable("#tbl_total_detail", "#tbl_total_detail_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getOutcomeDetailByOutcomeId",
        data: "income_outcome_id=" +income_outcome_id,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";
                tr += "<td class='text-center'>" +  element.reason+ "</td>";
                tr += "<td class='text-right' style='padding-right:200px'>" + thousands_separators( element.unit_amount)+ "</td>";
                tr += "</tr>";
                $('#tbl_total_detail_container').append(tr);
            });
            startDataTable("#tbl_total_detail");
            timeLoad();
        },
        error: function (message) {

            dataMessage(message, "#tbl_total_detail", "#tbl_total_detail_container");
            timeLoad();
        }
    });
}
function getIncomeDetailByIncomeId(income_outcome_id) {
    destroyDatatable("#tbl_total_detail", "#tbl_total_detail_container");
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
                tr += "<td class='text-right' style='padding-right:200px'>" + thousands_separators( element.unit_amount)+ "</td>";
                tr += "</tr>";
                $('#tbl_total_detail_container').append(tr);
            });
            startDataTable("#tbl_total_detail");
            timeLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_total_detail", "#tbl_total_detail_container");
            timeLoad();
        }
    });
}