function loadTotal(){
    let table = $('#tbl_total').DataTable({
        // dom: 'lBfrtip',
        // buttons: [
        //     { extend:'print',
        //       printOptions: {
        //         modifier: {
        //           page: 'all',
        //           search: 'none'   
        //         }
        //      },
        //     }
        // ],
        destroy: true,
        processing: true,
        serverSide: true,
        scrollX: true,
        lengthChange: false,
        pageLength: 5,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'getTotal',
            data: {'start_date' : $("#start_date").val() , 'end_date' : $("#end_date").val() },
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
            console.log()
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

function getTotalBalance(){

    let url = new URL(location.href)

    let start_date = url.searchParams.get('start_date');

    let end_date = url.searchParams.get('end_date');

    $.ajax({
        beforeSend: function () {
        },
        type: "get",
        url: BACKEND_URL + "getTotalBalance",
        data: "start_date=" + start_date + "&end_date=" + end_date,
        success: function (data) {
            let total = 0;
            
            data.forEach(function (element) {

                let tr = "<tr>";

                tr += "<td class='text-center'>" + formatDate(element.date) + "</td>";

                tr += "<td class='text-right'>" +  thousands_separators(element.income_total) + "</td>";

                tr += "<td class='text-right'>" + thousands_separators(element.outcome_total) + "</td>";

                tr += "<td class='text-right'>" + thousands_separators(element.income_total-element.outcome_total) + "</td>";
                
                tr += "</tr>";

                $('#tbl_invoice_container').append(tr);

                total += element.income_total - element.outcome_total;
            });

            $("#total").html(thousands_separators(total));
        },
        error: function (message) {

            dataMessage(message, "#tbl_total_detail", "#tbl_total_detail_container");
        }
    });
}