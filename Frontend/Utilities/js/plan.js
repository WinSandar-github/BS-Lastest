function createPlan() {
    let plan = "name=" + $("#name").val() +  "&price=" + $("#price").val() + "&class=" + $('input[name="customer-class"]:checked').val()

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
                tr += "<td class='text-center'>" +  + "</td>";
                tr += "<td class='text-center'>" + element.name + "</td>";
                tr += `<td class="text-center">${element.plan_class.name}</td>`
                tr += "<td class='text-right'>" + thousands_separators(element.price) + "</td>";
                tr += "<td class='text-center'><div class='btn-group'>" +
                "<button type='button' class='btn btn-primary btn-xs' onClick='showPlanInfo(" + element.id + ")'>" +
                "<li class='fas fa-edit fa-sm'></li></button> ";
                tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deletePlan(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";
            
                tr += "</tr>";
                $("#tbl_plan_body").append(tr);

            });
            getIndexNumber('#tbl_plan tr')
            createDataTable("#tbl_plan");
            hideLoad();

        },
        error:function (message){
            dataMessage(message, "#tbl_plan", "#tbl_plan_body");
            hideLoad();
        }
    });
}

function showPlanInfo(planId) {
    $("#plan-form").attr('action', 'javascript:updatePlan()');
    $("#plan-id").val(planId);

    var data = "&planId=" + planId;
    
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "showPlanInfo",
        data: data,
        success: function (data) {
            $("#name").val(data.name);
            $("#price").val(data.price);

            $('input[name="customer-class"]').each( function() {
                if ( $(this).val() == data.class ) {
                    $(this).prop('checked', true)
                }
            })

            hideLoad();
        },
        error:function (message){
          errorMessage(message);
          hideLoad();
        }
    });
}

function updatePlan() {
    var planData = "planId=" + $("#plan-id").val() + "&name=" + $("#name").val()+"&price=" + $("#price").val() + "&class" + $('input[name="customer-class"]')
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updatePlan",
        data: planData,
        success: function (data) {
            $("#plan-form").attr('action', 'javascript:createPlan()');
            document.getElementById("plan-form").reset();
            successMessage(data);
            getPlan();
        },
        error:function (message){
            errorMessage(message);
        }
    });
}

function deletePlan(planName, planId) {
    var result = confirm("WARNING: This will delete the plan " + decodeURIComponent(planName) + " and all related stocks! Press OK to proceed.");
    if (result) {
        var data = "planId=" + planId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deletePlan",
            data: data,
            success: function (data) {
                successMessage(data);
                getPlan();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}