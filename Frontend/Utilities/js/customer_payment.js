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
function loadPayment(){
    var currentUrl = window.location.href;
    var url = new URL(currentUrl);
    var customerId = url.searchParams.get("customerId");
    $('#name').html("");
    $('#userid').html("");
    $('#address').html("");
    $('#phone').html("");
    $('#pon').html("");
    $('#plan').html("");
    $('#amount').html("");
    $('#total').html("");
    $('#month').html("");
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showCustomerInfo",
        data: "customerId=" +customerId,
        success: function (data) {
            $('#name').append(data.name);
            $('#userid').append(data.code);
            $('#address').append(data.address);
            $('#phone').append(data.phone);
            $('#pon').append(data.pon);
            $('#plan').append(data.plan);
            $('#amount').append(data.price);
            $('#total').append(data.total_price);
            $.ajax({
                type: "POST",
                url: BACKEND_URL + "getPaymentDetail",
                data: "customerId=" +customerId,
                success: function (data) {
                    var array=[];
                    data.forEach(function(element){
                            var get_month=element.date.split('-');
                            array.push(formatMonth(get_month));
                            
                    });
                   $('#month').append(array.join());
                  },
                  error: function (message) {
                    $('#month').append();
                  }
              });
          
          },
          error: function (message) {
             
          }
      });
}