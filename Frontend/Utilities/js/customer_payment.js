// function getCustomer(){
//     destroyDatatable("#tbl_customer", "#tbl_customer_body");
//     $.ajax({
//         beforeSend: function () {
//             showLoad();
//         },
//         type: "POST",
//         url: BACKEND_URL + "getCustomer",
//         data: "",
//         success: function (data) {
//             data.forEach(function (element) {
//                 var tr = "<tr onclick='getPaymentDetail(this)'>";
//                 tr += "<td class='text-center'>" +  + "</td>";
//                 tr += "<td class='text-center'><input type='hidden' value="+element.id+">" + element.name + "</td>";
//                 tr += "<td class='text-center'>" + element.code + "</td>";
//                 tr += "<td class='text-center'>" + element.address + "</td>";
//                 tr += "<td class='text-center'>" + element.phone + "</td>";
//                 tr += "<td class='text-center'>" + element.plan.name + "</td>";
//                 tr += "<td class='text-right'>" + thousands_separators(element.plan.price) + "</td>";
//                 tr += "<td class='text-right'>" + thousands_separators(element.total_price) + "</td>";
//                 tr += "<td class='text-center'><div class='btn-group'>" +
//                         "<button type='button' class='btn btn-primary btn-xs' onClick='addPayment(" + element.id + ")'>" +
//                         "<li class='fas fa-edit fa-sm'></li> payment </button>"+
//                         "<button type='button' class='btn btn-success btn-xs' onClick='printPayment(" + element.id + ")'>" +
//                         "<li class='fas fa-print fa-sm'></li> print </button>"+
//                         // "<button type='button' class='btn btn-warning btn-xs' onClick=getCreditList(\"" + encodeURIComponent(element.reg_date) + "\"," + element.id + ")>" +
//                         // "<li class='fas fa-print fa-sm'></li> credit </button>"
//                         // 
//                         "</div></td> ";
//                 tr += "</tr>";
//                 $("#tbl_customer_body").append(tr);

//             });
//             getIndexNumber('#tbl_customer tr')
//             createDataTable("#tbl_customer");
//             hideLoad();

//         },
//         error:function (message){
//             dataMessage(message, "#tbl_customer", "#tbl_customer_body");
//             hideLoad();
//         }
//     });
// }

function getCreditList(regDate,customerId){
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCreditList",
        data: "regDate="+regDate+"&customerId="+customerId,
        success: function (data) {
            data.forEach(function(element){
                if(element.jan=="1"){
                    var tr = "<tr>";
                    tr += "<td >" +  + "</td>";
                    tr += "<td >" + element.code + "</td>";
                    tr += "</tr>";
                    $("#tbl_credit").append(tr);
                }
               
            })
             $("#creditModal").modal('toggle');
        },
        error: function (message){
            errorMessage(message);
        }
    });
    $("#creditModal").modal('toggle');
}
function addPayment(customerId){
    $("#paymentModal").modal('toggle');
    $("#customerId").val(customerId);
}
function createPayment(){
    let addCharges=$("#charges").val();
    let yrMonth=$("#month").val();
    var month=yrMonth[5]+yrMonth[6];
    let newMonth=(formatMonth(month)+" "+yrMonth.substring(0, 4));
    var payment = "mth="+formatMonth(month)+"&year="+yrMonth.substring(0, 4)+"&month=" + newMonth+"&addCharges=" + addCharges+"&customerId="+$("#customerId").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createPayment",
        data: payment,
        success: function (data) {
            printPaymentDetail($("#customerId").val(),data.payment_detail_id);
            successMessage("Payment Is Successfull!");
            $("#paymentModal").modal('toggle');
            getCustomer();
            getEachPayment($("#customerId").val());
           
        },
        error: function (xhr, message, text){
            if ( xhr.status == 409 ) {
                infoMessage(xhr.responseJSON)
            } else if ( xhr.status == 403 ) {
                infoMessage(xhr.responseJSON)
            } else {
                errorMessage(message)
            }
        }
    });
}
function getPaymentDetail(e){
    let customerId=e.cells[1].children[0].value;
    getEachPayment(customerId);
}
function getEachPayment(customerId){
    destroyDatatable("#tbl_payment", "#tbl_payment_body");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getPaymentDetail",
        data: "customerId="+customerId,
        success: function (data) {
            console.log(data);
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td class='text-center'>" + "</td>";
                tr += "<td class='text-center'>" + element.month + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.add_charges) + "</td>";
                tr += `<td class='text-center'><div class='btn-group'>
                        <button type='button' class='btn btn-danger btn-xs' onClick='deletePaymentDetail(${customerId},${element.id})'> 
                        <i class='far fa-trash-alt'></i></button>
                        <button type='button' class='btn btn-success btn-xs' onClick='printPaymentDetail(${customerId},${element.id})'> 
                        <li class='fas fa-print fa-sm'></li> print </button>
                        </div></td> `;
                tr += "</tr>";
                $("#tbl_payment_body").append(tr);
            });
            getIndexNumber('#tbl_payment tr')
            createDataTable("#tbl_payment");
            hideLoad();
        },
        error:function (message){
            dataMessage(message, "#tbl_payment", "#tbl_payment_body");
        }
    });
}
function printPayment(customerId)
{
    window.open(INVOICE_URL+"payment_invoice.html?customerId="+customerId);

}
function printPaymentDetail(customerId,paymentId)
{
    window.open(INVOICE_URL+"payment_invoice_detail.html?customerId="+customerId+"&paymentId="+paymentId);

}
function loadPayment(){
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var customerId = url.searchParams.get("customerId");
    var paymentId = url.searchParams.get("paymentId");
    var url=window.location.href.split('/');
    var last_array=url[url.length - 1].split('?');
    $("#tbl_invoice_container").html("");
    $('#subtotal').html("");
    $('#name').html("");
    $('#addcharges').html("");
    $('#grandtotal').html("");
    $('#month').html("");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCustomerById",
        data: "customerId=" +customerId,
        success: function (payment) {
            $('#name').append("-"+payment[0].name);
            $('#userId').append(payment[0].code);
            $('#address').append(payment[0].address);
            $('#pon').append(payment[0].pon+'.'+payment[0].sn+'.'+payment[0].dn);
            if (last_array[last_array.length - 2] === 'payment_invoice.html'){
                var array=[];
                var chargers=[];
                $.ajax({
                    type: "POST",
                    url: BACKEND_URL + "getPaymentDetail",
                    data: "customerId=" +customerId,
                    success: function (data) {

                            data.forEach(function(element){
                                var get_month=(element.month).substring(0,3);
                                var tr = "<tr>";
                                tr += "<th class='text-center'>" +  element.month + "</th>";
                                tr += "<th class='text-center'>" + payment[0].plan.name + "</th>";
                                tr += "<th class='text-center'>" + thousands_separators(payment[0].price)+" Baht" + "</th>";
                                tr += "</tr>";
                                $("#tbl_invoice_container").append(tr);
                            });
                            $('#total').append(thousands_separators((payment[0].price*data.length))+" Baht");
                    
                    // $('#month').append(array.join() );
                    // $('#subtotal').append(thousands_separators(payment[0].price*array.length));
                    // var allcharges=chargers.reduce((a, b) => a + b);
                    // $('#addcharges').append(allcharges);
                    // $('#grandtotal').append(thousands_separators((payment[0].price*array.length)+allcharges));
                    },
                    error: function (message) {

                    }
                });
            }else{
                $.ajax({
                type: "POST",
                url: BACKEND_URL + "getPaymentDetailBypaymentId",
                data: "paymentId=" +paymentId,
                success: function (data) {
                    var get_month=(data[0].month).substring(0,3);
                    var tr = "<tr>";
                    tr += "<td class='text-center font-weight-bold'>" + mmmToMmmm(get_month) + "</td>";
                    tr += "<td class='text-center font-weight-bold'>" + payment[0].plan.name + "</td>";
                    tr += "<td class='text-center font-weight-bold'>" + thousands_separators(payment[0].price)+" Baht" + "</td>";
                    tr += "</tr>";
                    $("#tbl_invoice_container").append(tr);
                    // $('#month').append(get_month);
                    // $('#subtotal').append(thousands_separators(payment[0].price));
                    // $('#addcharges').append(data[0].add_charges);
                    // $('#grandtotal').append(thousands_separators(payment[0].price+data[0].add_charges));
                  },
                  error: function (message) {

                  }
              });
            }
            

          },
          error: function (message) {

          }
      });
}
function deletePaymentDetail(customerId,paymentId) {
    var result = confirm("WARNING: Are you sure to delete payment? Press OK to proceed.");
    if (result) {
        $.ajax({
            type: "post",
            url: BACKEND_URL + "delete_payment_detail",
            data: "customerId="+customerId+"&payment_detail_id="+paymentId,
            success: function (data) {
                successMessage(data);
                getCustomer();
                getEachPayment(customerId);
            },
            error: function (message) {
                showErrorMessage('top','center',message.responseText);
            }
        });
    }
}

function getCustomerForPayment() {
    let format = (d) => {
        let extra = `<table class="table" id="extra-info">
            <tr>
                <td>ID: </td>
                <td>${d.code}</td>
            </tr>
            <tr>
                <td>Ip: </td>
                <td>${d.ip}</td>
            </tr>
            <tr>
                <td>Plan: </td>
                <td>${d.plan.name}</td>
            </tr>
            <tr>
                <td>Action: </td>
                <td>${d.action}</td>
            </tr>
        </table>`

        return extra
    }

    let dt = $('#tbl_customer').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        scrollX: true,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'get_customer_for_payment',
        },
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "searchable":     false,
                "data":           null,
                "defaultContent": ''
            },
            { data: 'DT_RowIndex' },
            { data: 'name' },
            { data: 'class.name' },
        ],
        createdRow: function(row, data, dataIndex) {
            row.style.background = data.class.color
        }
    })

    let detailRows = []

    $('#tbl_customer tbody').on('click', 'td.details-control', function() {
        let tr = $(this).closest('tr')
        let row = dt.row(tr)
        let idx = $.inArray( tr.attr('id'), detailRows );

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
 
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format( row.data() ) ).show();
 
            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }

        dt.on( 'draw', function () {
            $.each( detailRows, function ( i, id ) {
                $('#'+id+' td.details-control').trigger( 'click' );
            } );
        } );
    })
}