function getCollectorReports() {
    destroyDatatable('#tbl_collector', '#tbl_collector_body')

    let date = $('#filter_date').val();
    
    let filter = $("#filter").val();

    $('#tbl_collector').DataTable({
        'initComplete': function(settings){
            var api = new $.fn.dataTable.Api(settings);

            api.columns().header().each(function(column){
                if(filter == 2){
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
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'get',
            url: BACKEND_URL + 'get_collector_report',
            data: { 'date': date , 'filter' : $("#filter").val()},
        },
        columns: [

            { data: 'DT_RowIndex' },

            { data: 'name' , class: 'text-center'},

            { data: 'role' , class: 'text-center'},

            { data: null, render: function( data, type, row ) {

                return thousands_separators(data.collected_amount)

            }, class: 'text-center' },

            { data: 'action' , class: 'text-center'}

        ]
    })

    jQuery('#tbl_collector').wrap('<div class="dataTables_scroll" />');

   
}

function onChangeDate() {
    $('#filter_date').on('change', function() {
        getCollectorReports()
    })
}

$('#filter').on('change', function() {
    getCollectorReports()
})

function viewCollectorDetail(id){
    window.open(INVOICE_URL + "collector_detail.html?id=" + id + "&date=" + $("#filter_date").val() + "&status=" + $("#filter").val());
}

function getCollectorDetail(){
    let url = new URL(location.href)

    let user_id = url.searchParams.get('id');

    let date = url.searchParams.get('date');

    let status = url.searchParams.get('status');

    $.ajax({
        type: 'GET',
        url: BACKEND_URL + 'getCollectorDetail',
        data: { 'user_id': user_id , 'date' : date , 'status' : status},
        success: function( res, text, xhr ) {

            let cancel_icon = `<i class="bi bi-exclamation-triangle bi-lg text-danger"></i>`

            if(status != 1){
                $("#cancel_icon").append(cancel_icon);
            }

            // let collector_info = ` <div class="d-flex justify-content-between">
            //                             <div><p class='font-weight-bold'>${status == 1 ? 'Collector' : 'Cancelled By'} : ${res.user_name}</p></div>
            //                             <div><p class='font-weight-bold'>Date : ${date}</p></div>
            //                         </div>`;

            
            let total = 0;

            res.data.map( (val, index) => {
                let tr = `<tr>`
                    tr += `<td class='text-center'>${ val.customer_name }</td>`
                    tr += `<td class='text-center'>${val.invoice_no}</td>`
                    tr += `<td class='text-right'>${thousands_separators(val.total)}</td>`;
                    tr += `</tr>`

                $('#tbl_invoice_container').append(tr)

                total += Number(val.total) ;
            })

            // $("#total").append(thousands_separators(total));

            let collector_info = `<p class='mb-0'>${status == 1 ? 'Collector' : 'Cancelled By'} : 
                                    ${res.user_name}</p>
                                <p class='mb-0'>Total ${status == 1 ? 'Collected' : 'Cancelled'} Amount For (${date}) : 
                                    ${thousands_separators(total)}</p>`

            $("#collector-info").append(collector_info);
            

        },
        error: function( xhr, text, msg ) {
           
        }
    })
}
