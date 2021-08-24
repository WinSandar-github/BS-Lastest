function createCustomer(){
    var result = confirm("WARNING: This will Add New User For " + ($("#name").val()) + "! Press OK to proceed.");
    if(result){
        if($("#codeStatus").val()==""){
            var customer={};
            customer["name"]=$("#name").val();
            customer["regDate"]=$("#registeration_date").val();
            customer["phone"]=$("#phone").val();
            customer["code"]=$("#code").val();
            customer["address"]=$("#address").val();
            customer["code"]=$("#code").val();
            customer["ip"]=$("#ip").val();
            customer["plan"]=$("#selected_plan_id").val();
            customer["pon"]=$("#pon").val();
            customer["sn"]=$("#sn").val();
            customer["dn"]=$("#dn").val();
            customer["price"]=$("#price").val();
            customer["desc"]=$("#desc").val();
            $.ajax({
                beforeSend: function () {
                    showLoad();
                },
                type: "POST",
                url: BACKEND_URL + "createCustomer",
                data: JSON.stringify(customer),
                success: function (data) {
                    resetForm("#customerForm");
                    successMessage(data);
                    hideLoad();
                    var today = new Date();
                    var dd = today.getDate();
            
                    var mm = today.getMonth()+1; 
                    var yyyy = today.getFullYear();
                    if(dd<10) 
                    {
                        dd='0'+dd;
                    } 
            
                    if(mm<10) 
                    {
                        mm='0'+mm;
                    } 
                    today =yyyy+"-"+mm+"-"+dd;
                    $("#registeration_date").val(today);
                },
                error: function (message) {
                    errorMessage(message);
                    hideLoad();
                }
            });
        }
        else{
            alert($("#codeStatus").val());
        }
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
                tr += "<td >" + formatDate(element.reg_date)  + "</td>"
                tr += "<td >" + element.name + "</td>";
                tr += "<td >" + element.code + "</td>";
                tr += "<td >" + element.phone + "</td>";
                tr += "<td >" + element.address + "</td>";
                tr += "<td >" + element.ip + "</td>";
                tr += "<td >" + element.plan.name + "</td>";
                tr += "<td >" + thousands_separators(element.price) + "</td>";
                tr += "<td >" + element.pon + "</td>";
                tr += "<td >" + element.sn + "</td>";
                tr += "<td >" + element.dn + "</td>";
                var twoWords = (element.desc).split(' ').slice(0,2).join(' ');
                tr += "<td class='text-center'><p id='toolip' data-toggle='tooltip' title='"+element.desc+"'>" + twoWords + "</p></td>";
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                  })
                tr += "<td class='text-center'><div class='btn-group'>" +
                "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteCustomer(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";
            
                tr += "</tr>";
                $("#tbl_customer_body").append(tr);

            });
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
              })
            getIndexNumber('#tbl_customer tr')
            createDataTableForCustomer("#tbl_customer");
            hideLoad();

        },
        error:function (message){
            // dataMessage(message, "#tbl_customer", "#tbl_customer_body");
            createDataTableForCustomer("#tbl_customer");
            hideLoad();
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
            $('#selected_plan_id').val(data.plan);
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
    customer["plan"]=$("#selected_plan_id").val();
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
function loadPlan(){
    var select = document.getElementById("selected_plan_id");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getPlan",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var option = document.createElement('option');
                option.text = element.name;
                option.value = element.id;
                select.add(option, 0);

            });
            hideLoad();

        },
        error:function (message){
            hideLoad();
        }
    });
}
function loadPriceByPlan(planId){
    $("#price").html("");
    $("#update_price").html("");
    var data = "&plan_id=" +planId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getPlanByPlanId",
        data: data,
        success: function (data) {
            $("#price").val(data[0].price);
            $("#update_price").val(data[0].price);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function matchId(){
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "matchId",
        data: "code="+$("#code").val(),
        success: function (data) {
            if(data=="1"){
                $("#codeStatus").val("Customer ID already exits.");
            }
            else $("#codeStatus").val("");
        },
        error:function (message){
          errorMessage(message);
        }
    });
}