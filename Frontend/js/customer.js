function createCustomer(){
    var result = confirm("WARNING: This will Add New User For " + ($("#name").val()) + "! Press OK to proceed.");
    if(result){
        var customer={};
        customer["name"]=$("#name").val();
        customer["regDate"]=$("#registeration_date").val();
        customer["phone"]=$("#phone").val();
        customer["code"]=$("#code").val();
        customer["address"]=$("#address").val();
        customer["code"]=$("#code").val();
        customer["ip"]=$("#ip").val();
        customer["plan"]=$("#plan").val();
        customer["pon"]=$("#pon").val();
        customer["sn"]=$("#sn").val();
        customer["dn"]=$("#dn").val();
        customer["price"]=$("#price").val();
        customer["desc"]=$("#desc").val();
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "createCustomer",
            data: JSON.stringify(customer),
            success: function (data) {
                $('#insertModal').modal('hide')
                document.getElementById("customerForm").reset();
                successMessage(data);
                getCustomer();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }


}
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
                var tr = "<tr>";
                tr += "<td >" +  + "</td>";
                tr += "<td >" + element.name + "</td>";
                tr += "<td >" + element.code + "</td>";
                tr += "<td >" + element.phone + "</td>";
                tr += "<td >" + element.address + "</td>";
                tr += "<td >" + element.ip + "</td>";
                tr += "<td >" + element.plan + "</td>";
                tr += "<td >" + element.pon + "</td>";
                tr += "<td >" + element.sn + "</td>";
                tr += "<td >" + element.dn + "</td>";
                tr += "<td >" + element.price + "</td>";
                tr += "<td >" + element.desc + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteCustomer(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";

                tr += "</tr>";
                $("#tbl_customer_body").append(tr);

            });
            getIndexNumber('#tbl_customer tr')
            createDataTableForCustomer("#tbl_customer");
            timeLoad();

        },
        error:function (message){
            dataMessage(message, "#tbl_customer", "#tbl_customer_body");
            timeLoad();
        }
    });

}
function showCustomerInfo(customerId) {
    $("#updateUserForm").attr('action', 'javascript:updateCustomer()');
    $("#userId").val(customerId);
    var data = "&customerId=" +customerId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showCustomerInfo",
        data: data,
        success: function (data) {
            $("#userId").val(data.id);
            $('#update_name').val(data.name);
            $('#update_code').val(data.code);
            $('#update_address').val(data.address);
            $('#update_ip').val(data.ip);
            $('#update_plan').val(data.plan);
            $('#update_pon').val(data.pon);
            $('#update_sn').val(data.sn);
            $('#update_dn').val(data.dn);
            $('#update_price').val(data.price);
            $('#update_desc').val(data.desc);
            $('#updateModal').modal('toggle');
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function updateCustomer(){
    var customer={};
    customer["customerId"]=$("#userId").val();
    customer["name"]=$("#update_name").val();
    customer["code"]=$("#update_code").val();
    customer["address"]=$("#update_address").val();
    customer["code"]=$("#update_code").val();
    customer["ip"]=$("#update_ip").val();
    customer["plan"]=$("#update_plan").val();
    customer["pon"]=$("#update_pon").val();
    customer["sn"]=$("#update_sn").val();
    customer["dn"]=$("#update_dn").val();
    customer["price"]=$("#update_price").val();
    customer["desc"]=$("#update_desc").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCustomer",
        data: JSON.stringify(customer),
        success: function (data) {
            $("#updateUserForm").attr('action', 'javascript:createUser()');
            $('#updateModal').modal('toggle');
            document.getElementById("updateUserForm").reset();
            successMessage(data);
            getCustomer();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
          errorStatus(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}
function deleteCustomer(customerName, customerId) {
    var result = confirm("WARNING: This will delete the user " + decodeURIComponent(customerName) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "customerId=" + customerId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteCustomer",
            data: data,
            success: function (data) {
                successMessage(data);
                getCustomer();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
