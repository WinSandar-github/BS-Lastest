BACKEND_URL="http://localhost/bs/Backend/public/";
//BACKEND_URL="http://localhost:8000/";

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
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
function successMessage(message) {
    toastr.options = toastOptions;
    toastr.success(message);
}
function errorMessage(message) {
    toastr.options = toastOptions;
    toastr.error(message);
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
               'targets'       : [0,2,4,5,6,7,8,9,10] 
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
        'select': true,
        "order": [[0, "desc"]]
    });
    $('a[data-toggle="pill"]').on('shown.bs.tab', function(e){
        $($.fn.dataTable.tables(true)).DataTable()
           .columns.adjust();
     });
    
}
function createDataTable(table) {

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
        "order": [[0, "desc"]]
    });
    
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
    $('a[data-toggle="pill"]').on('shown.bs.tab', function(e){
        $($.fn.dataTable.tables(true)).DataTable()
           .columns.adjust();
     });
     
}
function logout() {
    (localStorage.getItem("userinfo")) && localStorage.removeItem("userinfo");
    location.href = "../../Components/Auth/login.html";
}
function showLoad() {
    document.getElementById("overlay").style.display = "block";
    
    
}
function hideLoad() {
    document.getElementById("overlay").style.display = "none";
    
}
function formatDate(date){
    var income_date=date.split('-');
    var date=income_date[2]+'-'+income_date[1]+'-'+income_date[0];
    return date;
}
function formatMonth(month){
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return months[new Date(month).getMonth()];
}
function timeLoad(){
    setTimeout(() => {
        hideLoad();
      }, 1000);
}
