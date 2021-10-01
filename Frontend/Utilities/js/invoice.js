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
            },
            error: function (xhr, message, text){
            
            }
        });
    }
    
}

function printInvoice(id) {
    location.href = '../../Components/Invoice/payment_invoice.html?id=' + id
}

function getPaymentInvoice(){
    let url = new URL(location.href)
    let id = url.searchParams.get('id')

    $.ajax({
        type: "get",
        url: BACKEND_URL + "getPaymentInvoice",
        data: "id=" + id,
        success: function (res) {

            $('#name').append("-"+res.customer[0]['customer_name']);

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

                tr += `<td class='text-center'>
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

            createDataTableForPaymentDetail("#tbl_payment",res.name); 
        },
        error: function (xhr, message, text){
            
        }
    });
}

function delInvoiceHistory(customerId, id, inv) {
    let accept = confirm('Warning! This specific invoice will be cancelled and its related payment tansactions will also be added to outcome list!')

    if ( accept ) {
        $.ajax({
            type: 'POST',
            url: BACKEND_URL + 'del_inv_history',
            data: { 'id': id, 'inv': inv },
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