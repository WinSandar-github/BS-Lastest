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
                document.getElementById("customerForm").reset();
                successMessage(data);
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
                var twoWords = (element.desc).split(' ').slice(0,2).join(' ');
                tr += "<td ><p data-toggle='tooltip' title="+element.desc+">" + twoWords + "</p></td>";
                
                tr += "<td class='alignright'><div class='btn-group'>" +
                "<button type='button' class='btn btn-primary btn-xs' onClick='showUserInfo(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteUser(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";
            
                tr += "</tr>";
                $("#tbl_customer_body").append(tr);

            });
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
              })
            getIndexNumber('#tbl_customer tr')
            createDataTableForCustomer("#tbl_customer");
           

        },
        error:function (message){
            dataMessage(message, "#tbl_customer", "#tbl_customer_body");
        }
    });

}