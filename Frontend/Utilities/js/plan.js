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
        error: function (xhr){
            if ( xhr.status == 409 ) {
                warningMessage(xhr.responseJSON)
            } else {
                errorMessage(message)
            }
        }
    });
}

function getPlan(){
    destroyDatatable("#tbl_plan", "#tbl_plan_body");

    $('#tbl_plan').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'post',
            url: BACKEND_URL + 'getPlan'
        },
        columns: [
            { data: 'DT_RowIndex' },

            { data: 'name' , class: 'text-center'},

            { data: 'plan_class.name' , class: 'text-center'},

            { data: null, render: function( data, type, row ) {

                return thousands_separators(data.price)

            }, class: 'text-right' },

            { data: 'action' , class: 'text-center'}

        ]
    })

    jQuery('#tbl_plan').wrap('<div class="dataTables_scroll" />');
    
}

function showPlanInfo(planId) {
    $("#plan-form").attr('action', 'javascript:updatePlan()');
    $("#plan-id").val(planId);

    var data = "&planId=" + planId;
    
    $.ajax({
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

        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updatePlan() {
    var planData = "planId=" + $("#plan-id").val() + "&name=" + $("#name").val()+"&price=" + $("#price").val() + "&class=" +  $('input[name="customer-class"]:checked').val()
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
        error:function (xhr){
            if ( xhr.status == 409 ) {
                warningMessage(xhr.responseJSON)
            } else {
                errorMessage(message)
            }
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