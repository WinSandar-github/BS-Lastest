function createCustomer(){
    var result = confirm("WARNING: This will Add New User For " + ($("#name").val()) + "! Press OK to proceed.");
    if(result){
        if($("#codeStatus").val()==""){
            let customer = {};
            customer["name"] = $("#name").val();
            customer["regDate"] = $("#registeration_date").val();
            customer["phone"] = $("#phone").val();
            customer["code"] = $("#code").val();
            customer["address"] = $("#address").val();
            customer["code"] = $("#code").val();
            customer["ip"] = $("#ip").val();
            customer["plan"] = $("#selected_plan_id").val();
            customer["customer_class"] = $('input[name="customer-class"]:checked').val()
            customer["initial_payment"] = $('input[name="initital_payment"]:checked').val()
            customer["pon"] = $("#pon").val();
            customer["sn"] = $("#sn").val();
            customer["dn"] = $("#dn").val();
            customer["price"] = $("#price").val();
            customer["desc"] = $("#desc").val();
            $.ajax({
                beforeSend: function () {
                    showLoad();
                },
                type: "POST",
                url: BACKEND_URL + "createCustomer",
                data: JSON.stringify(customer),
                success: function (data) {
                    resetForm("#customerForm");
                    successMessage(data);
                    hideLoad();
                    var today = new Date();
                    var dd = today.getDate();
            
                    var mm = today.getMonth()+1; 
                    var yyyy = today.getFullYear();
                    if(dd<10) 
                    {
                        dd='0'+dd;
                    } 
            
                    if(mm<10) 
                    {
                        mm='0'+mm;
                    } 
                    today =yyyy+"-"+mm+"-"+dd;
                    $("#registeration_date").val(today);
                },
                error: function (message) {
                    errorMessage(message);
                    hideLoad();
                }
            });
        }
        else{
            alert($("#codeStatus").val());
        }
    }
   

}

// function getCustomer(){
//     destroyDatatable("#tbl_customer", "#tbl_customer_body");
//     $.ajax({
//         beforeSend: function () {
//             showLoad();
//         },
//         type: "POST",
//         url: BACKEND_URL + "getCustomer",
//         data: "",
//         success: function (data) {
//             data.forEach(function (element) {
//                 var tr = "<tr>";
//                 tr += "<td >" +  + "</td>";
//                 tr += "<td >" + formatDate(element.reg_date)  + "</td>"
//                 tr += "<td >" + element.name + "</td>";
//                 tr += "<td >" + element.code + "</td>";
//                 tr += "<td >" + element.phone + "</td>";
//                 tr += "<td >" + element.address + "</td>";
//                 tr += "<td >" + element.ip + "</td>";
//                 tr += "<td >" + element.plan.name + "</td>";
//                 tr += "<td >" + thousands_separators(element.price) + "</td>";
//                 tr += "<td >" + element.pon + "</td>";
//                 tr += "<td >" + element.sn + "</td>";
//                 tr += "<td >" + element.dn + "</td>";
//                 var twoWords = (element.desc).split(' ').slice(0,2).join(' ');
//                 tr += "<td class='text-center'><p id='toolip' data-toggle='tooltip' title='"+element.desc+"'>" + twoWords + "</p></td>";
//                 $(function () {
//                     $('[data-toggle="tooltip"]').tooltip();
//                   })
//                 tr += "<td class='text-center'><div class='btn-group'>" +
//                 "<button type='button' class='btn btn-primary btn-xs' onClick='showCustomerInfo(" + element.id + ")'>" +
//                 "<li class='fas fa-edit fa-sm'></li></button> ";
//                 tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteCustomer(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash fa-sm' ></li ></button ></div ></td > ";
            
//                 tr += "</tr>";
//                 $("#tbl_customer_body").append(tr);

//             });
//             $(function () {
//                 $('[data-toggle="tooltip"]').tooltip();
//               })
//             getIndexNumber('#tbl_customer tr')
//             createDataTableForCustomer("#tbl_customer");
//             hideLoad();

//         },
//         error:function (message){
//             dataMessage(message, "#tbl_customer", "#tbl_customer_body");
//             hideLoad();
//         }
//     });

// }

function showCustomerInfo(customerId) {
    $('#customer-class-radio').children().remove()

    $("#updateUserForm").attr('action', 'javascript:updateCustomer()');
    $("#userId").val(customerId);
    var data = "&customerId=" +customerId;

    getCustomerClass()

    setTimeout( function() {
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "showCustomerInfo",
            data: data,
            success: function (data) {            
                $("#userId").val(data.id);
                $('#update_name').val(data.name);
                $('#update_code').val(data.code);
                $('#update_address').val(data.address);
                $('#update_ip').val(data.ip);
                $('#selected_plan_id').val(data.plan);
                $('#update_pon').val(data.pon);
                $('#update_sn').val(data.sn);
                $('#update_dn').val(data.dn);
                $('#update_price').val(data.price);
                $('#update_desc').val(data.desc);    
    
                $('input[name="customer-class"]').each( function() {
                    if ( $(this).val() == data.customer_class ) {
                        $(this).attr('checked', true)
                    }
                }) 
                $('input[name="initital_payment"]').each( function() {
                    if ( $(this).val() == data.payment_plan_id ) {
                        $(this).attr('checked', true)
                    }
                }) 
    
                $('#updateModal').modal('toggle')
            },
            error:function (message){
              errorMessage(message);
            }
        });
    }, 300)
}
function updateCustomer(){
    var customer={};
    customer["customerId"]=$("#userId").val();
    customer["name"]=$("#update_name").val();
    customer["code"]=$("#update_code").val();
    customer["address"]=$("#update_address").val();
    customer["code"]=$("#update_code").val();
    customer["ip"]=$("#update_ip").val();
    customer["plan"]=$("#selected_plan_id").val();
    customer["pon"]=$("#update_pon").val();
    customer["customer_class"] = $('input[name="customer-class"]:checked').val()
    customer["initial_payment"] = $('input[name="initital_payment"]:checked').val()
    customer["sn"]=$("#update_sn").val();
    customer["dn"]=$("#update_dn").val();
    customer["price"]=$("#update_price").val();
    customer["desc"]=$("#update_desc").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateCustomer",
        data: JSON.stringify(customer),
        success: function (data) {
            $("#updateUserForm").attr('action', 'javascript:createUser()');
            $('#updateModal').modal('toggle');
            document.getElementById("updateUserForm").reset();
            successMessage(data);
            getCustomer();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
          errorStatus(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}
function deleteCustomer(customerName, customerId) {
    var result = confirm("WARNING: This will delete the user " + decodeURIComponent(customerName) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "customerId=" + customerId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteCustomer",
            data: data,
            success: function (data) {
                successMessage(data);
                getCustomer();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}
function loadPlan(){
    var select = document.getElementById("selected_plan_id");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getPlan",
        data: "",
        success: function (data) {
            data.forEach(function (element) {
                var option = document.createElement('option');
                option.text = element.name + ' ' + element.plan_class.name
                option.value = element.id;
                select.add(option, 0);

            });
            hideLoad();

        },
        error:function (message){
            hideLoad();
        }
    });
}
function loadPriceByPlan(planId){
    $("#price").html("");
    $("#update_price").html("");
    var data = "&plan_id=" +planId;
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "getPlanByPlanId",
        data: data,
        success: function (data) {
            $("#price").val(data[0].price);
            $("#update_price").val(data[0].price);
        },
        error:function (message){
          errorMessage(message);
        }
    });
}
function matchId(){
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "matchId",
        data: "code="+$("#code").val(),
        success: function (data) {
            if( data == "1"){
                $("#codeStatus").val("Customer ID already exits.");

                $('#code').siblings().text('Customer ID Already Exists')

                $('#code').siblings().show()
            }
            else 
            {
                $("#codeStatus").val("");

                $('#code').siblings().text('Please Add Customer ID')

                $('#code').siblings().hide()
            }
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function getCustomer() {
    $('#tbl_customer').DataTable({
        'destroy': true,
        'processing': true,
        'serverSide': true,
        'scrollX': true,
        'ajax': {
            type: 'POST',
            url: BACKEND_URL + 'getCustomer',
        },
        'columns' : [
                { data: 'DT_RowIndex' },
                { data: 'reg_date' },
                { data: 'name' },
                { data: 'code' },
                { data: 'phone' },
                { data: 'address' },
                { data: 'ip' },
                { data: null, render: function( data, type, row ) {
                    return row.plan.name + ' ' + row.plan.plan_class.name
                }},
                { data: null, render: function( data, type, row ) {
                    return row.initial_payment.month + ' months'
                }},
                { data: 'price' },
                { data: 'pon' },
                { data: 'sn' },
                { data: 'dn' },
                { data: 'desc' },
                { data: 'action'}
        ],
        'createdRow': function( row, data, dataIndex ) {
            row.style.background = data.plan.plan_class.color
        }
    })

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
}

function getCustomerClass() {
    $.ajax({
        type: 'POST',
        url: BACKEND_URL + 'get_customer_class',
        success: function(res, text, xhr) {
            if ( res.length > 0 ) {
                // check page //
                let url = new URL(window.location).pathname

                let filename = url.substring(url.lastIndexOf('/')+1)
                
                if ( filename == 'customer.html' || filename == "customer_payment.html" || filename == "setting.html" ) {
                    res.map( (el) => {
                        let radio_elem = `<div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="customer-class" id=${el.name} value=${el.id}>
                        <label class="form-check-label" for=${el.name}>
                            ${el.name}
                        </label>
                        </div>`
    
                        $('#customer-class-radio').append(radio_elem)
                    })
                    
                    if ( $('#class-color-lists') ) {
                        $('#class-color-lists').children().remove()
                        res.map( (el) => {
                            let elem = `<div class="col-md-2 col-sm-4 col-xs-6 class-status">
                            <div class="color-box" style="background-color: ${el.color};"></div>
                            <span class="explanation">${el.name}</span> 
                        </div>`

                            $('#class-color-lists').append(elem)
                        })

                    }
                    destroyDatatable("#tbl-customer-class", "#tbl-customer-class tbody");

                    res.map( (el, index) => {
                        let json_str = JSON.stringify(el)

                        let tr = `<tr>`
                            tr += `<td>${ index + 1 }</td>`
                            tr += `<td>${ el.name }</td>`
                            tr += `<td>
                                        <button type="button" class="btn btn-primary" data-info=${window.btoa(json_str)} onclick="classEditInit(this)">
                                            <i class="fa fa-cog"></i>
                                        </button>
                                    </td>`
                            tr += `</tr>`

                        $('#tbl-customer-class tbody').append(tr)
                    })

                    $('#tbl-customer-class').DataTable({
                        scrollX: true,
                        searching: false,
                        bPaginate: false,
                        bLengthChange: false,
                        bFilter: true,
                        bInfo: false,
                    })

                }
            }
        }, 
        error: function(err) {
            $('#customer-class-radio').append(err)
        }
    })
}

function getInitialPayment(){
    $.ajax({
        type: 'get',
        url: BACKEND_URL + 'get_initital_payment_month',
        success: function(data) {
            data.map((obj)=> {
                let month = `<div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="initital_payment" id=${obj.month} value=${obj.id}>
                                <label class="form-check-label" for=${obj.month}>
                                    ${obj.month} month
                                </label>
                            </div>`;
                $('#initial-payment-radio').append(month);
            })
        }, 
        error: function(err) {
            $('#initial-payment-radio').append(err);
        }
    })
}

function classEditInit(event) {
    let data_attr = event.dataset.info

    let data = JSON.parse(window.atob(data_attr))

    $('#customer-class-modal').modal('toggle')

    $('#class-id').val(data.id)
    $('#class').val(data.name)
    $('#color').val(data.color)
}

function editClass() {
    let obj = {
        'id': $('#class-id').val(),
        'color': $('#color').val()
    }

    $.ajax({
        type: 'POST',
        url: BACKEND_URL + 'edit_class',
        data: obj,
        beforeSend: function() {
            showLoad()
        },
        success: function(res, text, xhr) {
            if ( xhr.status == 201 ) {
                successMessage(res)

                $('#customer-class-modal').modal('hide')

                $("#customer-class-radio").children().remove();

                getCustomerClass()
            }
        },
        complete: function() {
            hideLoad()
        },
        error: function(err, text, xhr) {
            hideLoad()

            errorMessage(xhr.responseJSON)
        }
    })
}