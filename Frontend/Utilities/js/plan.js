function createPlan() {
    var plan = "name=" + $("#name").val()+"&price=" + $("#price").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createPlan",
        data: plan,
        success: function (data) {
            document.getElementById("plan-form").reset();
            successMessage(data);
            getPlan();

        },
        error: function (message){
            errorMessage(message);
        }
    });
}
function getPlan(){
    destroyDatatable("#tbl_plan", "#tbl_plan_body");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getPlan",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var tr = "<tr>";
                tr += "<td >" +  + "</td>";
                tr += "<td >" + element.name + "</td>";
                tr += "<td >" + element.price + "</td>";
                tr += "<td class='alignright'><div class='btn-group'>" +
                "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteCustomer(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";
            
                tr += "</tr>";
                $("#tbl_plan_body").append(tr);

            });
            getIndexNumber('#tbl_plan tr')
            createDataTable("#tbl_plan");
            timeLoad();

        },
        error:function (message){
            dataMessage(message, "#tbl_plan", "#tbl_plan_body");
            timeLoad();
        }
    });
}