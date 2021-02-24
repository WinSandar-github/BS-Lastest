function getCustomer(){
    destroyDatatable("#tbl_customer", "#tbl_customer_body");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getCustomer",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getPaymentDetail(this)' id="+element.id+">";
                tr += "<td >" +  + "</td>";
                tr += "<td ><input type='hidden' value="+element.id+">" + element.name + "</td>";
                tr += "<td >" + element.code + "</td>";
                tr += "<td >" + element.address + "</td>";
                tr += "<td >" + element.phone + "</td>";
                tr += "<td >" + element.plan + "</td>";
                tr += "<td >" + element.reg_date + "</td>";
                tr += "<td >" + element.total_price + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                "<button type='button' class='btn btn-info btn-xs' onClick='addPayment(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li> payment </button></div></td> ";
                tr += "</tr>";
                $("#tbl_customer_body").append(tr);

            });
            getIndexNumber('#tbl_customer tr')
            createDataTable("#tbl_customer");
           

        },
        error:function (message){
            dataMessage(message, "#tbl_customer", "#tbl_customer_body");
        }
    });

}
function addPayment(customerId){
    $("#paymentModal").modal('toggle');
    $("#customerId").val(customerId);
}
function createPayment(){
    let payDate=$("#pay_date").val();
    let addCharges=$("#charges").val();
    var payment = "payDate=" + payDate+"&addCharges=" + addCharges+"&customerId="+$("#customerId").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createPayment",
        data: payment,
        success: function (data) {
            successMessage(data);
            $("#paymentModal").modal('toggle');
            document.getElementById("paymentForm").reset();
            getCustomer();
            getEachPayment($("#customerId").val());
        },
        error: function (message){
            errorMessage(message);
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
        type: "POST",
        url: BACKEND_URL + "getPaymentDetail",
        data: "customerId="+customerId,
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" + "</td>";
                tr += "<td >" + element.date + "</td>";
                tr += "<td >" + element.add_charges + "</td>";
                tr += "</tr>";
                $("#tbl_payment_body").append(tr);
            });
            getIndexNumber('#tbl_payment tr')
            createDataTable("#tbl_payment");

        },
        error:function (message){
            dataMessage(message, "#tbl_payment", "#tbl_payment_body");
        }
    });
}
