function getCreditList(regDate,customerId){
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCreditList",
        data: "regDate="+regDate+"&customerId="+customerId,
        success: function (data) {
            data.forEach(function(element){
                if(element.jan == "1"){
                    let tr = "<tr>";
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
        success: function (res) {
            successMessage(res);
            $("#paymentModal").modal('toggle');           
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
            createDataTableForPaymentDetail("#tbl_payment",data[0].name);
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
                            let grand_total = 0;
                            data.forEach(function(element){
                                var get_month=(element.month).substring(0,3);
                                var tr = "<tr>";
                                tr += "<th class='text-center'>" +  element.month + "</th>";
                                tr += "<th class='text-center'>" + payment[0].plan.name + "</th>";
                                tr += `<th class='text-right'>${thousands_separators(element.add_charges)} ${element.add_charges != 0 ? "Baht" : ""}</th>`;
                                tr += "<th class='text-right'>" + thousands_separators(payment[0].price)+" Baht" + "</th>";
                                tr += `<th class='text-right'>${thousands_separators(Number(payment[0].price) + Number(element.add_charges))} Baht</th>`;
                                tr += "</tr>";
                                $("#tbl_invoice_container").append(tr);
                                grand_total+=Number(payment[0].price)+Number(element.add_charges);
                            });
                            $('#total').append(thousands_separators(grand_total)+" Baht");
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
                    tr += "<th class='text-center font-weight-bold'>" + mmmToMmmm(get_month) + "</th>";
                    tr += "<th class='text-center font-weight-bold'>" + payment[0].plan.name + "</th>";
                    tr += `<th class='text-right'>${thousands_separators(data[0].add_charges)} ${data[0].add_charges != 0 ? "Baht" : ""}</th>`;
                    tr += "<th class='text-right'>" + thousands_separators(payment[0].price)+" Baht" + "</th>";
                    tr += `<th class='text-right'>${thousands_separators(Number(payment[0].price) + Number(data[0].add_charges))} Baht</th>`;
                    tr += "</tr>";
                    $("#tbl_invoice_container").append(tr);
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
    let dt = $('#tbl_customer').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        scrollX: true,
        lengthChange: false,
        pageLength: 5,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'get_customer_for_payment',
            data: { 'filter': $('#filter').val() },
        },
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "searchable":     false,
                "data":           null,
                "defaultContent": ''
            },
            { data: 'code' },
            { data: 'name' },
            { data: null, render: function( data, type, row ) {
                return row.plan.name + ' ' + row.plan.plan_class.name
            }},
        ],
        createdRow: function(row, data, dataIndex) {
            row.style.background = data.plan.plan_class.color
        }
    })

    let detailRows = []

    $('#tbl_customer tbody').off('click').on('click', 'tr td.details-control', function() {

        let tr = $(this).closest('tr')
        let row = dt.row(tr)
        let idx = $.inArray( tr.attr('id'), detailRows )

        if ( row.child.isShown() ) {
            tr.removeClass( 'details' );
            row.child.hide();
 
            // Remove from the 'open' array
            detailRows.splice( idx, 1 );
        }
        else {
            tr.addClass( 'details' );
            row.child( format(row.data()) ).show();
 
            // Add to the 'open' array
            if ( idx === -1 ) {
                detailRows.push( tr.attr('id') );
            }
        }
    });

    dt.on('draw', function () {
        $.each( detailRows, function ( i, id ) {
            $('#'+id+' td.details-control').trigger( 'click' );
        });
    });
}

$('#filter').on('change', function() {
    getCustomerForPayment()
})

let format = (d) => {
    let extra = `<table class="table" id="extra-info">
        <tr>
            <td>Ip: </td>
            <td>${d.ip}</td>
        </tr>
        <tr>
            <td>Address: </td>
            <td>${d.address}</td>
        </tr>
        <tr>
            <td>Action: </td>
            <td>${d.action}</td>
        </tr>
    </table>`

    return extra;
}

function getPaymentDetail(id){
    location.href = '../../Components/Customer/payment_detail.html?customerId=' + id
}

function invoicingPage(id) {
    location.href = '../../Components/Customer/customer_invoicing.html?id=' + id 
}

function getCustomerById() {
    let url = new URL(location.href)
    let id = url.searchParams.get('id')

    $.ajax({
        url: BACKEND_URL + 'get_customer_for_invoicing',
        type: 'POST',
        data: { 'id': id },
        success: function(res, text, xhr) {
            if ( xhr.status == 200 ) {
                let customer = res.customer

                let elem = `<p>${customer.name}</p>
                <p>${customer.address}</p>
                <p>${customer.code}</p>
                <p>${customer.ip}</p>
                <p>${customer.plan.name + ' ' + customer.plan.plan_class.name}</p>
                `
                $('#customer-info').append(elem)

                let credits = res.payment_left

                let inv_list = 0

                credits.map((val, index) => {
                    let tr = `<tr>`
                        tr += `<td style="padding-left: 18px">
                            <input 
                                type="checkbox" 
                                class="check-btn" 
                                id=row_${val.id} 
                                value=${val.id} 
                            ${ val.invoice == 1 ? 'checked' : 'unchecked' }/>
                        </td>`
                        tr += `<td>${index + 1}</td>`
                        tr += `<td name='month'>${val.month}</td>`
                        tr += `</tr>`

                    $('#tbl-credit-body').append(tr)

                    if ( val.invoice == 1 ) {
                        inv_list += 1 
                    }
                })

                $('#tbl-credit').DataTable({
                    "searching": false,
                    "pageLength": 10,
                    "lengthChange": false,
                    "ordering": false
                })

                addToInvoice()

                $('#inv-badge').text(inv_list)
            }
        },
        error: function(res, status, error) {
            errorMessage(res.responseJSON)
        }
    })
}

function addToInvoice() {
    $('.check-btn').on('change', function() {
        let id = this.value
        let checked = this.checked ? 1 : 0

        $.ajax({
            type: 'POST',
            url: BACKEND_URL + 'add_to_invoice',
            data: { 'id': id, 'checked': checked },
            beforeSend: function() {
                showLoad()
            },
            success: function(res, text, xhr) {
                if ( xhr.status == 201 ) {
                    hideLoad()

                    successMessage(res)

                    if ( checked ) {
                        let addList = parseInt($('#inv-badge').text()) + 1

                        $('#inv-badge').text(addList)
                    } else {
                        let removeList = parseInt($('#inv-badge').text()) - 1

                        $('#inv-badge').text(removeList)
                    }
                }
            },
            error: function(res, status, error) {
                hideLoad() 

                errorMessage(res.responseJSON)
            }
        })
    })
}

function toBilling() {
    let inv_list = parseInt($('#inv-badge').text())

    if ( inv_list < 1 ) {
        infoMessage('There is nothing in invoice list!')
    } else {
        let url = new URL(window.location)
        let id = url.searchParams.get('id')

        clearBillingModal()

        $('#billing-modal').modal('show')

        $.ajax({
            type: 'POST',
            url: BACKEND_URL + 'get_customer_for_invoicing',
            data: { 'id': id },
            success: function( res, text, xhr ) {
                if ( xhr.status == 200 ) {
                    let lists = res.payment_left.filter( ({invoice}) => {
                        return invoice == 1
                    })

                    let total = 0

                    let price = res.customer.plan.price

                    lists.map( (val, key) => {
                        let tr = `<tr value="${val.id}">`
                            tr += `<td>${key + 1}</td>`
                            tr += `<td>${val.month}</td>`
                            tr += `<td>${thousands_separators(price)}</td>`
                            tr += `</tr>`

                        $('#item-lists').append(tr)

                        total += parseFloat(price)
                    })

                    $('#total').text(thousands_separators(total))

                    addCharge(total)
                }
            }
        })
    }
}

function clearBillingModal() {
    $('#item-lists tr').remove()

    $('#add-charge').text('')
}

function addCharge(total) {
    $('#add-charge').on('input', function() {
        let charge = this.value

        let final = total + parseFloat(charge)

        if ( charge !== '' ) {
            $('#total').text(final)
        } else {
            $('#total').text(total)
        }
    })
}

function checkAll(e) {
    if ( e.checked == true ) {
        $('#tbl-credit-body tr').each( function() {
            $(this).find('input[type="checkbox"]').prop('checked', true)
        })
    } else {
        $('#tbl-credit-body tr').each( function() {
            $(this).find('input[type="checkbox"]').prop('checked', false)
        })
    }
}