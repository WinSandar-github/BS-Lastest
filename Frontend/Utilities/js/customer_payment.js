function getCustomer(){
    destroyDatatable("#tbl_customer", "#tbl_customer_body");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getCustomer",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr onclick='getPaymentDetail(this)'>";
                tr += "<td class='text-center'>" +  + "</td>";
                tr += "<td class='text-center'><input type='hidden' value="+element.id+">" + element.name + "</td>";
                tr += "<td class='text-center'>" + element.code + "</td>";
                tr += "<td class='text-center'>" + element.address + "</td>";
                tr += "<td class='text-center'>" + element.phone + "</td>";
                tr += "<td class='text-center'>" + element.plan + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.price) + "</td>";
                tr += "<td class='text-right'>" + thousands_separators(element.total_price) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                        "<button type='button' class='btn btn-primary btn-xs' onClick='addPayment(" + element.id + ")'>" +
                        "<li class='fas fa-edit fa-sm'></li> payment </button>"+
                        "<button type='button' class='btn btn-success btn-xs' onClick='printPayment(" + element.id + ")'>" +
                        "<li class='fas fa-print fa-sm'></li> print </button>"+
                        // "<button type='button' class='btn btn-warning btn-xs' onClick=getCreditList(\"" + encodeURIComponent(element.reg_date) + "\"," + element.id + ")>" +
                        // "<li class='fas fa-print fa-sm'></li> credit </button>"
                        // 
                        "</div></td> ";
                tr += "</tr>";
                $("#tbl_customer_body").append(tr);

            });
            getIndexNumber('#tbl_customer tr')
            createDataTable("#tbl_customer");
            timeLoad();

        },
        error:function (message){
            dataMessage(message, "#tbl_customer", "#tbl_customer_body");
            timeLoad();
        }
    });

}
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
            // successMessage(data);
             $("#creditModal").modal('toggle');
            // document.getElementById("paymentForm").reset();
            // getCustomer();
            // getEachPayment($("#customerId").val());
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
                tr += "<td class='text-right' style='padding-right:250px;'>" + thousands_separators(element.add_charges) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                        "<button type='button' class='btn btn-success btn-xs' onClick='printPaymentDetail(" + customerId +","+element.id +")'>" +
                        "<li class='fas fa-print fa-sm'></li> print </button>"+
                        "</div></td> ";
                tr += "</tr>";
                $("#tbl_payment_body").append(tr);
            });
            getIndexNumber('#tbl_payment tr')
            createDataTable("#tbl_payment");
            timeLoad();
        },
        error:function (message){
            dataMessage(message, "#tbl_payment", "#tbl_payment_body");
        }
    });
}
function printPayment(customerId)
{
    window.open("../../Components/Customer/payment_invoice.html?customerId="+customerId);

}
function printPaymentDetail(customerId,paymentId)
{
    window.open("../../Components/Customer/payment_invoice_detail.html?customerId="+customerId+"&paymentId="+paymentId);

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
        url: BACKEND_URL + "showCustomerInfo",
        data: "customerId=" +customerId,
        success: function (payment) {
            $('#name').append(payment.name);
            if (last_array[last_array.length - 2] === 'payment_invoice.html'){
                var array=[];
                var chargers=[];
                $.ajax({
                    type: "POST",
                    url: BACKEND_URL + "getPaymentDetail",
                    data: "customerId=" +customerId,
                    success: function (data) {

                        data.forEach(function(element){
                                var get_month=element.month;
                                array.push((get_month));
                                chargers.push(element.add_charges);
                        });

                    var tr = "<tr>";
                    tr += "<td class='text-center'>" + payment.code + "</td>";
                    tr += "<td class='text-center'>" + payment.address + "</td>";
                    tr += "<td class='text-center'>" + payment.phone + "</td>";
                    tr += "<td class='text-center'>" + payment.pon+'.'+payment.sn+'.'+payment.dn + "</td>";
                    tr += "<td class='text-center'>" + payment.plan + "</td>";
                    tr += "<td class='text-right'>" +  thousands_separators(payment.price) + "</td>";
                    tr += "</tr>";
                    $("#tbl_invoice_container").append(tr);
                    $('#month').append(array.join() );
                    $('#subtotal').append(thousands_separators(payment.price*array.length));
                    var allcharges=chargers.reduce((a, b) => a + b);
                    $('#addcharges').append(allcharges);
                    $('#grandtotal').append(thousands_separators((payment.price*array.length)+allcharges));
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
                    var get_month=data[0].month;
                    
                    var tr = "<tr>";
                    tr += "<td class='text-center'>" + payment.code + "</td>";
                    tr += "<td class='text-center'>" + payment.address + "</td>";
                    tr += "<td class='text-center'>" + payment.phone + "</td>";
                    tr += "<td class='text-center'>" + payment.pon+'.'+payment.sn+'.'+payment.dn + "</td>";
                    tr += "<td class='text-center'>" + payment.plan + "</td>";
                    tr += "<td class='text-right'>" + thousands_separators(payment.price) + "</td>";
                    tr += "</tr>";
                    $("#tbl_invoice_container").append(tr);
                    $('#month').append(get_month);
                    $('#subtotal').append(thousands_separators(payment.price));
                    $('#addcharges').append(data[0].add_charges);
                    $('#grandtotal').append(thousands_separators(payment.price+data[0].add_charges));
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
