// BACKEND_URL="https://demo.aggademo.me/bs/Backend/public/";
//BACKEND_URL="http://localhost/bs/Backend/public/";
let INVOICE_URL="https://iqnet.tech/billing/Frontend/Components/Customer/";
let BACKEND_URL="https://iqnet.tech/billing/Backend/public/";
// let INVOICE_URL="http://localhost//iqnet/BS/Frontend/Components/Customer/";
// let BACKEND_URL="http://localhost:8000/";

// let INVOICE_URL="http://localhost:1234/BS/Frontend/Components/Customer/"
// let BACKEND_URL = "http://localhost:1234/BS/Backend/public/"

var toastOptions = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "3000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
};

function successMessage(message) {
    toastr.options = toastOptions;
    toastr.success(message);
}

function errorMessage(message) {
    toastr.options = toastOptions;
    toastr.error(message);
}

function infoMessage(message) {
    toastr.options = toastOptions
    toastr.info(message)
}

function getIndexNumber(table){
    $(table).each(function(){
        $( this ).find( "td" ).first().html( $(this).index() + 1 );
      });
}
function createDataTableForCustomer(table){
    $(table).DataTable({
        'columnDefs' : [     // see https://datatables.net/reference/option/columns.searchable
            { 
               'searchable'    : false, 
               'targets'       : [0,4,6,7,8,9,10] 
            },
        ],

        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "scrollX": true,
        'select': true
        // "order": [[0, "desc"]]
    });
    $('a[data-toggle="pill"]').on('shown.bs.tab', function(e){
        $($.fn.dataTable.tables(true)).DataTable()
           .columns.adjust();
     });
     jQuery(table).wrap('<div class="dataTables_scroll" />');

}
function createDataTable(table) {

    $(table).DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "scrollX": true,
        'select': true,
        // "order": [[0, "desc"]]
    });
    jQuery(table).wrap('<div class="dataTables_scroll" />');

}

function createDataTableForPaymentDetail(table,name) {

    $(table).DataTable({
        "dom": '<"toolbar">frtip',
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': true,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "scrollX": true,
        'select': true,
        // "order": [[0, "desc"]]
    });
    jQuery(table).wrap('<div class="dataTables_scroll" />');
     $("div.toolbar").html("<span class='font-weight-bold'>Name - "+name+"</span>");

}
function destroyDatatable(table, tableBody) {
    if ($.fn.DataTable.isDataTable(table)) {
        $(table).DataTable().destroy();
    }
    $(tableBody).empty();
}
$('table tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    }
    else {
        $('table tbody tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
function countColumn(table) {
    var numCols = $(table).find('tr')[0].cells.length;
    return numCols;
}
function dataMessage(message, table, tableBody) {
    var dataMsg = message.responseText;
    var noOfColumn = countColumn(table);
    var tr = "<tr>";
    tr += "<td class='text-center' colspan='" + noOfColumn + "'>"+dataMsg+"</td>";
    tr += "</tr>";
    $(tableBody).append(tr);
    if(noOfColumn>=11){
      $(table).addClass('table-responsive');
    }
    hideLoad();

}
function numberRows() {
    $('table tbody tr').each(function (idx) {
        $(this).children(":eq(0)").html(idx + 1);
    });
}
function thousands_separators(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}
function removeComma(number){
    var number_part=parseInt(number.split(',').join(""));
    return number_part;
}
function startDataTable(table) {

    $(table).DataTable({
        'destroy': true,
        'paging': true,
        'lengthChange': false,
        "pageLength": 5,
        'searching': false,
        'ordering': true,
        'info': false,
        'autoWidth': false,
        "scrollX": true,
        'select': true,
        "order": [[0, "desc"]],

    });
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        $($.fn.dataTable.tables(true)).DataTable()
           .columns.adjust();
     });

}
function logout() {
    (localStorage.getItem("userinfo")) && localStorage.removeItem("userinfo");
    location.href = "../../Components/Auth/auth-login.html";
}
function showLoad() {
    $('body').css({
        overflow: 'hidden'
    });
    document.getElementById("overlay").style.display = "block";

}
function hideLoad() {
    $('body').css({
        overflow: 'auto'
    });
    document.getElementById("overlay").style.display = "none";
}
function formatDate(date){
    var income_date=date.split('-');
    var date=income_date[2]+'/'+income_date[1]+'/'+income_date[0];
    return date;
}
function formatMonth(month){
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[new Date(month).getMonth()];
}
function hideLoad(){
    $('body').css({
        overflow: 'auto'
    });
    document.getElementById("overlay").style.display = "none";
}
function formatDatepicer(date){
    var income_date=date.split('/');
    var date=income_date[2]+'-'+income_date[0]+'-'+income_date[1];
    return date;
}
function loadUser(){
    $("#user_name").html("");
    $("#user_name").append(user_name);
}
function mmmToMmmm(month){
    console.log(month);
    let fullMonth = null;
    switch(month) {
      case "Jan":
        fullMonth = "January";
          break;
      case "Feb":
        fullMonth = "Febuary";
          break;
      case "Mar":
        fullMonth = "March";
          break;
      case "Apr":
        fullMonth = "April";
          break;
      case "May":
        fullMonth = "May";
          break;
      case "Jun":
        fullMonth = "June";
          break;
      case "Jul":
        fullMonth = "July";
          break;
      case "Aug":
        fullMonth = "August";
          break;
      case "Sep":
        fullMonth = "September";
          break;
      case "Oct":
        fullMonth = "October";
          break;
      case "Nov":
        fullMonth = "November";
          break;
      case "Dec":
        fullMonth = "December";
          break;
     default:
         break;
    }
    return fullMonth;
  }
  function resetForm(form){
    var form = $(form)[0];
    $(form).removeClass('was-validated');
    form.reset();
  }