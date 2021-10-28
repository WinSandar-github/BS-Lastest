function createInvoice(){

    var result = confirm("WARNING: This will Add New Payment!. Press OK to proceed.");

    if(result){
        let url = new URL(location.href)
        let id = url.searchParams.get('id')

        let arr = new Array();
        let invoiceArr = new Array();

        arr.push( $("#add-charge").val() );
        arr.push( removeComma($("#total").text()) );
        arr.push( id );
        arr.push( user_id );

        //get all of the values except the header
        $("#tbl_invoice tr:not(:first)").each(function () {
            let tds = $(this).find("td");

            let obj = { 
                        id: $(this).attr('value'),
                        month: $(tds[1]).html(),
                        price: $(tds[2]).html()
                    }
            invoiceArr.push(obj);
        });
        arr.push(invoiceArr);

        $.ajax({
            type: "POST",
            url: BACKEND_URL + "createInvoice",
            data:  JSON.stringify(arr),
            success: function (data) {

                printInvoice(data.invoice_id);

                successMessage("Payment Is Successfull!");

                $("#billing-modal").modal('toggle');   

                destroyDatatable('#tbl-credit','#tbl-credit-body');

                getCustomerById();

                $('#customer-info p').remove()
            },
            error: function (xhr, message, text){
            
            }
        });
    }
    
}

function printInvoice(id) {
    window.open('https://iqnet.tech/billing/Frontend/Components/Invoice/payment_invoice.html?id=' + id );
}

function getPaymentInvoice(){
    let url = new URL(location.href)
    let id = url.searchParams.get('id')

    $.ajax({
        type: "get",
        url: BACKEND_URL + "getPaymentInvoice",
        data: "id=" + id,
        success: function (res) {

            $('#name').append(res.customer[0]['customer_name']);

            $('#userId').append(res.customer[0]['code']);

            $('#address').append(res.customer[0]['address']);

            $('#pon').append(res.customer[0]['pon']+'.'+res.customer[0]['sn']+'.'+res.customer[0]['dn']);

            $('#inv_no').append(res.invoice_detail[0]['invoice_no']);

            let total = 0;

            JSON.parse(res.invoice_detail[0]['desc']).map( (obj) => {

                let tr = `<tr>` ;

                tr += `<td class='text-center'>${obj.month}</td>`;

                tr += `<td class='text-center'>${res.customer[0]['plan_name']} ${ res.customer[0]['class']}</td>`;

                tr += `<td class='text-right'>${thousands_separators(res.customer[0]['price']) } Baht</td>`;

                tr += `</tr>` ;

                $("#tbl_invoice_container").append(tr);

                total += Number(res.customer[0]['price']);
            })

            $("#total").html(`${thousands_separators(total)} Baht`);

            $("#add_charges").html(`${thousands_separators(res.customer[0]['add_charges'])} ${res.customer[0]['add_charges'] != 0 ? "Baht" : ""}`);

            $("#grand_total").html(`${thousands_separators(res.customer[0]['total'])} Baht`);
           
        },
        error: function (xhr, message, text){
            
        }
    });
}

function getAllInvoices(customerId){
    let filter = $('#history-filter').val()

    destroyDatatable('#tbl_payment', '#tbl_payment_body')

    $.ajax({
        type: "get",
        url: BACKEND_URL + "getAllInvoices",
        data: {"id": customerId, "filter": filter},
        success: function (res) {

            let indexNo = 0;
            
            res.data.map( (obj) => {

                let tr = `<tr>` ;

                tr += `<td class='text-center'>${indexNo += 1 }</td>`;

                tr += `<td class='text-center'>${obj.invoice_no}</td>`;

                tr += `<td class='text-right'>${thousands_separators(obj.total)}</td>`;

                tr += `<td class='text-center'>${obj.collector_name}</td>`;

                tr += `<td class='text-center text-nowrap'>
                        
                        ${
                            filter == 0 ?
                            `<button type='button' class='btn btn-primary btn-sm' onClick='showInvoice(${obj.id})'> 
                            <i class="bi bi-pencil-square bi-lg"></i></button>` : ''
                        }
                        <button type='button' class='btn btn-success btn-sm' onClick='printInvoice(${obj.id})'> 
                        <i class='bi bi-printer bi-lg'></i></button>
                        ${
                            filter == 0 ?
                            `<button type="button" class="btn btn-danger btn-sm" onClick='delInvoiceHistory(${customerId}, ${obj.id}, "${obj.invoice_no}")'>
                            <i class="fa fa-trash fa-lg"></i>
                            </button>` : ''
                        }
                    </td> `;
                tr += `</tr>` ;

                $("#tbl_payment_body").append(tr);

            })

            createDataTableForPaymentDetail("#tbl_payment",res.name,filter); 
        },
        error: function (xhr, message, text){
            
        }
    });
}

function showInvoice(id){
    
    clearBillingModal();

    $.ajax({
        type: 'get',
        url: BACKEND_URL + 'showInvoice',
        data: { 'id': id },
        success: function( res, text, xhr ) {
            if ( xhr.status == 200 ) {

                $("#invoice_id").val(id);

                JSON.parse(res[0].desc).map( (val, key) => {

                    let tr = `<tr value='${val.id}'>`

                        tr += `<td>
                        <button type='button' class='btn btn-danger btn-sm'> 
                        <i class="bi bi-x bi-lg"></i></i></button>
                        </td> `;

                        tr += `<td>${key + 1}</td>`

                        tr += `<td>${val.month}</td>`

                        tr += `<td>${thousands_separators(val.price)}</td>`

                       

                        tr += `</tr>`

                    $('#item-lists').append(tr)
                })
                $("#add-charge").val(thousands_separators(res[0].add_charges));

                $('#total').text(thousands_separators(res[0].total))

                $("#invoice-modal").modal('toggle');

                addCharge(res[0].total);

            }
        }
    })
}

$("#tbl_invoice").on('click', '.btn-danger', function () {
    if($("#item-lists tr").length > 1){
        $(this).closest('tr').remove();

        $('#tbl_invoice tr').each(function(){
            $( this ).find( "td" ).eq(1).html( $(this).index() + 1 );
          });

        let total = 0;

        $("#tbl_invoice tr:not(:first)").each(function () {
            let tds = $(this).find("td");

            total += Number(removeComma($(tds[3]).html()) );

        });

        $('#total').text(`${thousands_separators(Number($("#add-charge").val())+Number(total))}`);

        addCharge(total);
    }
    else{
        infoMessage('WARNING: You cannot remove all invoices.');
    }
        
});

function updateInvoice(){

    var result = confirm("WARNING: This will Update Invoice!. Press OK to proceed.");

    if(result){
        let url = new URL(location.href)
        let id = url.searchParams.get('customerId')

        let arr = new Array();
        let invoiceArr = new Array();

        arr.push( $("#add-charge").val() );
        arr.push( removeComma($("#total").text()) );
        arr.push( $("#invoice_id").val() );
        arr.push( id );

        //get all of the values except the header
        $("#tbl_invoice tr:not(:first)").each(function () {
            let tds = $(this).find("td");

            let obj = { 
                        month: $(tds[2]).html(),
                        price: removeComma($(tds[3]).html()),
                        id: $(this).attr('value')
                    }
            invoiceArr.push(obj);
        });
        arr.push(invoiceArr);
        


        $.ajax({
            type: "POST",
            url: BACKEND_URL + "updateInvoice",
            data:  JSON.stringify(arr),
            beforeSend: function() {
                showLoad()
            },
            success: function (data) {
                hideLoad()

                successMessage("Invoice Is Successfully Updated!");

                $("#invoice-modal").modal('toggle');
                
                getAllInvoices(data.customer_id);
           
            },
            error: function (xhr, message, text){
                hideLoad()
            }
        });
    }
}
function delInvoiceHistory(customerId, id, inv) {
    let accept = confirm('Warning! This specific invoice will be cancelled and its related payment tansactions will also be added to outcome list!')

    if ( accept ) {
        $.ajax({
            type: 'POST',
            url: BACKEND_URL + 'del_inv_history',
            data: { 'id': id, 'inv': inv , 'user_id' : user_id },
            beforeSend: function() {
                showLoad()
            },
            success: function( res, text, xhr ) {
                if ( xhr.status == 201 ) {
                    hideLoad()

                    successMessage(xhr.responseJSON)

                    getAllInvoices(customerId)
                }
            },
            error: function( xhr, msg, text ) {
                hideLoad()

                errorMessage(xhr.responseJSON)
            }
        })
    }
}