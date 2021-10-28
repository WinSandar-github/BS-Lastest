function createOutcome() {
    var outcome = "date=" + $("#outcome_date").val()+"&outcome_total=" + removeComma($("#outcome_amount_paid").val());
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createOutcome",
        data: outcome,
        success: function (data) {
            $("#outcome_id").val(data.id);
            createOutcomeDetail();

        },
        error: function (message){
            errorMessage(message);
        }
    });
}

function getOutcome() {
    document.getElementById('outcome').style.display='block';
    document.getElementById('yearoutcome').style.display='none';
    destroyDatatable("#tbl_outcome", "#tbl_outcome_container");

    $('#tbl_outcome').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        pageLength: 5,
        bAutoWidth: false,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'getOutcome',
            data: { 'created_date': ' ' }
        },
        columns: [
            { data: 'date' , class: 'text-center' },
            { data: null, render: function( data, type, row ) {
                return thousands_separators(data.outcome_total)
            }, class: 'text-right' },
            { data: 'action' ,  class: 'text-center' }
        ],
        createdRow: function(row, data, dataIndex) {
            row.setAttribute('onclick', `getOutcomeDetailByOutcomeId(${data.id})`)
        }
    })

    $('#tbl_outcome').css('display','table') ;
}

function addOutcomeDetailInfo(outcomeId) {
    $("#outcomeForm").attr('action', 'javascript:updateOutcome()');
    $("#outcome_id").val(outcomeId);
    var data = "&outcome_id=" +outcomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showOutcomeInfo",
        data: data,
        success: function (data) {
            $("#outcome_id").val(data.id);
            $("#outcome_detail_date").val(formatDate(data.date));
            $('#outcome_total').val(data.outcome_total);
            $('#outcome_modal').modal('toggle');
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function showOutcomeInfo(outcomeId) {
    $("#outcome_form").attr('action', 'javascript:updateOutcome()');
    $("#outcome_id").val(outcomeId);
    var data = "&outcome_id=" +outcomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showOutcomeInfo",
        data: data,
        success: function (data) {
            $("#outcome_date").val(formatDate(data.date));
            $('#outcome_total').val(data.outcome_total);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateOutcome() {
    var outcome_total=parseInt(removeComma($('#outcome_total').val()))+parseInt(removeComma($("#outcome_detail_amount").val()));
    var outcome = "outcome_id=" + $("#outcome_id").val() + "&outcome_total=" + outcome_total;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateOutcome",
        data: outcome,
        success: function (data) {
            addOutcomeDetail();

        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteOutcome(outcome_date, outcomeId) {
    var result = confirm("WARNING: This will delete " + decodeURIComponent(outcome_date) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "outcome_id=" + outcomeId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteOutcome",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_outcome", "#tbl_outcome_container");
                successMessage(data);
                getOutcome();
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}

function getOutcomeBySelectMonth(select){
    
    if(select!='Monthly'){
        $('.outcome-detail').show();
        $('#outcome_datepicker').attr('disabled',false);
        getOutcome();
    }else{
        $('.outcome-detail').hide();
        $('#outcome_datepicker').val("");
        $('#outcome_datepicker').attr('disabled',true);
        getOutcomeByMonth();
    }
}

function getOutcomeByMonth(){
    document.getElementById('outcome').style.display='none';
    document.getElementById('yearoutcome').style.display='block';
    destroyDatatable("#tbl_yearoutcome", "#tbl_yearoutcome_container");

    $('#tbl_yearoutcome').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'post',
            url: BACKEND_URL + 'getOutcome',
            data: {monthly : 'allmonth'}
        },
        columns: [ 
                
            { data: 'year' , class: 'text-center'},

            { data: 'month' , class: 'text-center'},

            { data: null, render: function( data, type, row ) {
                return thousands_separators(data.outcome_total)
            }, class: 'text-right' }
             
        ]
    })
}
