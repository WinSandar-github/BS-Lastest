function loadTotal(){

    let table = $('#tbl_total').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        scrollX: true,
        lengthChange: false,
        pageLength: 5,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'getTotal',
        },
        columns: [
           { data: 'date' , class : "text-center" },
           { data: null, 
                render: function( data, type, row ) {

                    let income_total = `${data.income_total}`;
                    
                    return thousands_separators(income_total);

                }, class : "text-right"
            },
            { data: null, 
                render: function( data, type, row ) {

                    let outcome_total = `${data.outcome_total}`;

                    return thousands_separators(outcome_total);

                }, class : "text-right"
            },
            { data: null, 
                render: function( data, type, row ) {

                    let bal_sheet = `${data.total}`;
                    
                    return thousands_separators(bal_sheet);

                }, class : "text-right"
            }
        ],

        createdRow: function(row, data, dataIndex) {

            $('td', row).eq(1).css('color','blue');
            $('td', row).eq(2).css('color','blue');
            $('td', row).eq(1).css('cursor','pointer');
            $('td', row).eq(2).css('cursor','pointer');

            $('td', row).eq(1).click(function(){
                getIncomeDetailByIncomeId(data.id);
            });

            $('td', row).eq(2).click(function(){
                getOutcomeDetailByOutcomeId(data.id);
            });
        },
        "fnDrawCallback": function() {
            let api = this.api()
            let json = api.ajax.json();
            $(api.column(3).footer()).html(thousands_separators(json.bal_sheet));
        }
    });

}
function getTotal() {
    var total = 0;
    $("#tbl_total tr:not(:first)").each(function () {
        alert("Aa");
        let tds = $(this).find("td");
        let value =  parseInt(removeComma($(tds[3]).html())); 
        total += value;
        console.log($(tds[3]).html())
    });
    //     var value = parseInt(removeComma($('td', this).eq(3).text()));
    //     if (!isNaN(value)) {
    //         total += value;
    //     }
    // });
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
            hideLoad();
        },
        error: function (message) {

            dataMessage(message, "#tbl_total_detail", "#tbl_total_detail_container");
            hideLoad();
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
                tr += "<td class='text-right'>" + thousands_separators( element.unit_amount)+ "</td>";
                tr += "</tr>";
                $('#tbl_total_detail_container').append(tr);
            });
            startDataTable("#tbl_total_detail");
            hideLoad();
        },
        error: function (message) {
            dataMessage(message,"#tbl_total_detail", "#tbl_total_detail_container");
            hideLoad();
        }
    });
}