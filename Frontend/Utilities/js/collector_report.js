function getCollectorReports() {
    destroyDatatable('#tbl_collector', '#tbl_collector_body')

    let date = $('#filter_date').val()

    $.ajax({
        type: 'GET',
        url: BACKEND_URL + 'get_collector_report',
        data: { 'date': date },
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
                        tr += `</tr>`

                    $('#tbl_collector_body').append(tr)
                })

                $('#tbl_collector').DataTable()
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