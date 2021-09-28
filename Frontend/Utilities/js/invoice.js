function createInvoice(){
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
            
            location.reload();
           
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

function printInvoice(id) {
    window.open( '../../Components/Invoice/payment_invoice.html?id=' + id  ) ;
}