function createIncome() {
    var income = "date=" + $("#income_date").val()+"&income_total=" + removeComma($("#income_amount").val());
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createIncome",
        data: income,
        success: function (data) {
            $("#income_id").val(data.id);
            createIncomeDetail();

        },
        error: function (message){
            errorMessage(message);
        }
    });
}

function getIncome() {
    document.getElementById('income').style.display='block';
    document.getElementById('yearincome').style.display='none';
    destroyDatatable("#tbl_income", "#tbl_income_container");

    $('#tbl_income').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'POST',
            url: BACKEND_URL + 'getIncome',
            data: { 'created_date': ' ' }
        },
        columns: [
            { data: 'date' , class: 'text-center'},
            { data: null, render: function( data, type, row ) {
                return thousands_separators(data.income_total)
            }, class: 'text-right' },
            { data: 'action', class: 'text-center' }
        ],
        createdRow: function(row, data, dataIndex) {
            row.setAttribute('onclick', `getIncomeDetailByIncomeId(${data.id})`)
        }
    })
}

function addIncomeDetailInfo(incomeId) {
    $("#incomeForm").attr('action', 'javascript:updateIncome()');
    $("#income_id").val(incomeId);
    var data = "&income_id=" +incomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showIncomeInfo",
        data: data,
        success: function (data) {
            $("#income_id").val(data.id);
            $('#income_detail_date').val(formatDate(data.date));
            $('#income_total').val(data.income_total);
            $('#income_modal').modal('toggle');
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function showIncomeInfo(incomeId) {
    $("#income_form").attr('action', 'javascript:updateIncome()');
    $("#income_id").val(incomeId);
    var data = "&income_id=" +incomeId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showIncomeInfo",
        data: data,
        success: function (data) {
            $("#income_date").val(formatDate(data.date));
            $('#income_total').val(data.income_total);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateIncome() {
    var income_total=parseInt(removeComma($('#income_total').val()))+parseInt(removeComma($("#income_detail_amount").val()));
    var income = "income_id=" + $("#income_id").val() +"&income_total=" + income_total;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateIncome",
        data: income,
        success: function (data) {
            addIncomeDetail();
        },
        error: function (message) {
            errorMessage(message);
        }
    });
}

function deleteIncome(income_date, incomeId) {
    var result = confirm("WARNING: This will delete " + decodeURIComponent(income_date) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "income_id=" + incomeId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteIncome",
            data: data,
            success: function (data) {
                destroyDatatable("#tbl_income", "#tbl_income_container");
                successMessage(data);
                getIncome();
            },
            error: function (message){
                errorMessage(message);
            }
        });
    }
}

function getIncomeBySelectMonth(select){
    if(select!='Monthly'){
        $('.income-detail').show();
        $('#income_datepicker').attr('disabled',false);
        getIncome();
    }else{
        $('.income-detail').hide();
        $('#income_datepicker').val("");
        $('#income_datepicker').attr('disabled',true);
        getIncomeByMonth();
    }
}

function getIncomeByMonth(){

    document.getElementById('income').style.display='none';
    document.getElementById('yearincome').style.display='block';
    destroyDatatable("#tbl_yearincome", "#tbl_yearincome_container");

    $('#tbl_yearincome').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'post',
            url: BACKEND_URL + 'getIncome',
            data: {monthly : 'allmonth'}
        },
        columns: [ 
                
            { data: 'year' , class: 'text-center'},

            { data: 'month' , class: 'text-center'},

            { data: null, render: function( data, type, row ) {
                return thousands_separators(data.income_total)
            }, class: 'text-right' }
             
        ]
    })

}
