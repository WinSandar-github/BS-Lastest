$(document).ready(function() {
    $("#show_hide_password a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password input').attr("type") == "text"){
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass( "fa-eye-slash" );
            $('#show_hide_password i').removeClass( "fa-eye" );
        }else if($('#show_hide_password input').attr("type") == "password"){
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass( "fa-eye-slash" );
            $('#show_hide_password i').addClass( "fa-eye" );
        }
    });
});

function createUser(){
    var user={};
    user["name"]=$("#name").val();
    user["email"]=$("#email").val();
    user["role"]=$("#selected_role_id").val();
    user["password"]=$("#password").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "createUser",
        data: JSON.stringify(user),
        success: function (data) {
            document.getElementById("user_form").reset();
            $('#user_modal').modal('toggle');
            successMessage(data);
            getUser();
        },
        error: function (message) {
            errorMessage(message);
        }
    });

}

function getUser(){
    destroyDatatable("#tbl_user", "#tbl_user_container");

    $('#tbl_user').DataTable({
        destroy: true,
        processing: true,
        serverSide: true,
        lengthChange: false,
        bAutoWidth: false,
        pageLength: 5,
        ajax: {
            type: 'post',
            url: BACKEND_URL + 'getUser'
        },
        columns: [
                
            { data: 'name' , class: 'text-center'},

            { data: 'email' , class: 'text-center'},

            { data: 'role.role' , class: 'text-center'},

            { data: 'action' , class: 'text-center'}

        ]
    })

}

function showUserInfo(userId){
    $("#user_form").attr('action', 'javascript:updateUser()');
    $("#user_id").val(userId);

    getUserRoles()

    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showUserInfo",
        data: "userId="+userId,
        success: function (data) {
            setTimeout( () => {
                $("#name").val(data.name);
                $("#email").val(data.email);
                $("#selected_role_id").val(data.role);
                $('#user_modal').modal('toggle');
            }, 200)
        },
        error:function (message){
          errorMessage(message);
        }
    });
}

function updateUser(){
    var userData = {};
    userData["userId"]=$("#user_id").val();
    userData["name"]=$("#name").val();
    userData["email"]=$("#email").val();
    userData["role"]=$("#selected_role_id").val();
    userData["password"]=$("#password").val();
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "updateUser",
        data: JSON.stringify(userData),
        success: function (data) {
            $("#user_form").attr('action', 'javascript:createUser()');
            $('#user_modal').modal('toggle');
            document.getElementById("user_form").reset();
            successMessage(data);
            getUser();
        },
        error:function (XMLHttpRequest, textStatus, errorThrown){
          errorStatus(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

function deleteUser(userName, userId) {
    var result = confirm("WARNING: This will delete the user " + decodeURIComponent(userName) + " and all related data! Press OK to proceed.");
    if (result) {
        var data = "userId=" + userId;
        $.ajax({
            type: "POST",
            url: BACKEND_URL + "deleteUser",
            data: data,
            success: function (data, text, xhr) {
                if ( xhr.status == 200 ) {
                    successMessage(data);
                    getUser();
                }
            },
            error: function (xhr, text, msg) {
                errorMessage(xhr.responseJSON);
            }
        });
    }
}

function validateEmail(email){
    const valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (valid_email.test(email)) {
      $("#messageEmail").html("").removeClass('alert alert-danger');
        return false;
    }else{
        $('#messageEmail').text("Email address is invalid!").addClass('alert alert-danger');
        return true;
    }
}

function onShownHideUserModal() {
    $('#user_modal').on('shown.bs.modal', function() {
        if ( $('#user_id').val() == '' || $('#user_id').val() == undefined ) {
            rm_user_roles()
            reset_modal_data()
            getUserRoles()

            $("#user_form").attr('action', 'javascript:createUser()');
        }
    })

    $('#user_modal').on('hidden.bs.modal', function() {
        reset_modal_data()
    })
}

let rm_user_roles = () => {
    $('#selected_role_id').children().not(':first').remove()
}

let reset_modal_data = async () => {
    $('#user_modal').find('input').val('')
    $('#user_modal').find('select').val('')
}

function getUserRoles() {
    $.ajax({
        type: 'GET',
        url: BACKEND_URL + 'get_user_roles',
        beforeSend: function() {
            rm_user_roles()
        },
        success: function( res, text, xhr ) {
            if ( xhr.status == '200' ) {
                res.map( val => {
                    let opt = `<option value=${val.id}>${val.role}</option>`

                    $('#selected_role_id').append(opt)
                })
            }
        },
        error: function ( xhr, text, msg ) {
            let opt_err = `<option disabled>Error Getting User Roles</option>`
            $('#selected__role_id').append(opt_err)
        }
    })
}

onShownHideUserModal()