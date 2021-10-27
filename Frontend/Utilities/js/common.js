// BACKEND_URL="https://demo.aggademo.me/bs/Backend/public/";
//BACKEND_URL="http://localhost/bs/Backend/public/";

// let INVOICE_URL="https://iqnet.tech/billing/Frontend/Components/Customer/";
// let BACKEND_URL="https://iqnet.tech/billing/Backend/public/";

// let INVOICE_URL="http://localhost//iqnet/BS/Frontend/Components/Customer/";
// let BACKEND_URL="http://localhost:8000/";

let INVOICE_URL="http://localhost:1234/BS/Frontend/Components/Customer/"
let BACKEND_URL = "http://localhost:1234/BS/Backend/public/"

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
    "timeOut": "0",
    "extendedTimeOut": "0",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
};

function successMessage(message) {
    let imgUrl = $('.toast .toast-success').attr('background-image')
    console.log(imgUrl)
    toastr.options = toastOptions;
    toastr.success(message);
}

function errorMessage(message) {
    toastr.options = toastOptions;
    toastr.error(message);
}

function infoMessage(message) {

    let infoImg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8
    YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAw
    SKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7
    Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6Q
    tBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBt
    cy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVL
    wwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=`

    let imgUrl = $('#toast-container .toast-info:before')

    console.log(imgUrl)
    
    imgUrl.css('background-image', `url(${infoImg})`)

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

function createDataTableForPaymentDetail(table,name,filter) {

    $(table).DataTable({
        'initComplete': function(settings){
            var api = new $.fn.dataTable.Api(settings);

            api.columns().header().each(function(column){
                if(filter != 0){
                    if($(column).text() === 'Collector'){
                        $(column).text("Cancelled By");
                    }
                }else {
                    if($(column).text() === 'Cancelled By'){
                        $(column).text("Collector");
                    }
                }
              
            });
         },
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

$('table').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    }
    else {
        $('table tr.selected').removeClass('selected');
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
    var number_part = parseInt(number.split(',').join(""));
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

  //Form Validation

  (function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();