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
                tr += "<td >" + element.date + "</td>";
                tr += "<td class='text-right'><span class='text-primary cursor-css' onClick=getIncomeDetailByIncomeId(" + element.id + ");>" + thousands_separators(element.income_total) + "</span></td>";
                tr+="<td class='text-right'><span class='text-primary cursor-css' onClick=getOutcomeDetailByOutcomeId(" + element.id + ");>"+ thousands_separators(element.outcome_total) + "</span></td>";
                tr+="<td class='text-right'>"+ thousands_separators(parseInt(element.income_total)-parseInt(element.outcome_total)) + "</td>";
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
