function getCollectorReports() {
    destroyDatatable('#tbl_collector', '#tbl_collector_body')

    let date = $('#filter_date').val()

    $.ajax({
        type: 'GET',
        url: BACKEND_URL + 'get_collector_report',
        data: { 'date': date , 'filter' : $("#filter").val()},
        beforeSend: function() {
            showLoad()
        },
        success: function( res, text, xhr ) {
            if( xhr.status == 200 ) {
                hideLoad()

                res.map( (val, index) => {
                    let tr = `<tr>`
                        tr += `<td>${ index + 1 }</td>`
                        tr += `<td>${val.name}</td>`
                        tr += `<td>${val.role}</td>`
                        tr += `<td class='text-right'>${thousands_separators(val.collected_amount)}</td>`
                        tr += `<td class='text-center'>
                                    <button class='btn btn-primary btn-sm' onclick='viewCollectorDetail(${val.id})'>
                                        <i class='bi bi-eye bi-lg''></i>
                                    </button>
                                </td>`
                        tr += `</tr>`

                    $('#tbl_collector_body').append(tr)
                })

                
                $('#tbl_collector').DataTable({

                    'initComplete': function(settings){
                        
                        var api = new $.fn.dataTable.Api(settings);

                        api.columns().header().each(function(column){

                            if($("#filter").val() == 1){
                                if($(column).text() === 'Cancelled By'){
                                    $(column).text("Collector");
                                }
                               
                            }else {
                                if($(column).text() === 'Collector'){
                                    $(column).text("Cancelled By");
                                }
                               
                            }
              
                        });
                     },
                })
            }
        },
        error: function( xhr, text, msg ) {
            hideLoad()
        }
    })
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

            let collector_info = ` <div class="d-flex justify-content-between">
                                        <div><p class='font-weight-bold'>${status == 1 ? 'Collector' : 'Cancelled By'} : ${res.user_name}</p></div>
                                        <div><p class='font-weight-bold'>Date : ${date}</p></div>
                                    </div>`;

            // let collector_info = `  <span class='d-inline-flex align-items-start flex-column border border-secondary rounded p-2 pl-1 mb-2'>
            //                             <p>Date : ${date}</p>
            //                             <p>${status == 1 ? 'Collector' : 'Cancelled By'} : ${res.user_name}</p>
            //                             <p id='total'>Total Amount : </p>
            //                         </span>`

            $("#collector-info").append(collector_info);
            
            let total = 0;

            res.data.map( (val, index) => {
                let tr = `<tr>`
                    tr += `<td class='text-center'>${ val.customer_name }</td>`
                    tr += `<td class='text-center'>${val.invoice_no}</td>`
                    tr += `<td class='text-right'>${thousands_separators(val.total)}</td>`;
                    tr += `</tr>`

                $('#tbl_invoice_container').append(tr)

                total += val.total ;
            })

            $("#total").append(thousands_separators(total));

        },
        error: function( xhr, text, msg ) {
           
        }
    })
}
