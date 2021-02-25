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
    destroyDatatable("#tbl_user_btn", "#tbl_user_btn_container");
    $.ajax({
        beforeSend: function () {
            showLoad();
        },
        type: "POST",
        url: BACKEND_URL + "getUser",
        data: "",
        success: function (data) {
            if(role==2){
                document.getElementById('tbl_user_btn').style.display='none';
                data.forEach(function (element) {
                    var tr = "<tr>";
                    tr += "<td >" + element.name + "</td>";
                    tr += "<td >" + element.email + "</td>";
                    if(element.role=="2")
                        tr += "<td >" + "Admin" + "</td>";
                    
                    else  tr += "<td >" + "User" + "</td>";
                    tr += "<td class='alignright'><div class='btn-group'>" +
                        "<button type='button' class='btn btn-info btn-xs' onClick='showUserInfo(" + element.id + ")'>" +
                        "<li class='fas fa-edit'></li></button> ";
                    tr += "<button type='button' class='btn btn-danger btn-xs' onClick=deleteUser(\"" + encodeURIComponent(element.name) + "\"," + element.id + ")><li class='fa fa-trash' ></li ></button ></div ></td > ";
                    tr += "</tr>";
                    $("#tbl_user_container").append(tr);
    
                });
                startDataTable("#tbl_user");
            }else{
                document.getElementById('tbl_user').style.display='none';
                data.forEach(function (element) {
                    var tr = "<tr>";
                    tr += "<td >" + element.name + "</td>";
                    tr += "<td >" + element.email + "</td>";
                    if(element.role=="2")
                        tr += "<td >" + "Admin" + "</td>";
                    
                    else  tr += "<td >" + "User" + "</td>";
                    
                        
                    tr += "</tr>";
                    $("#tbl_user_btn_container").append(tr);
    
                });
                startDataTable("#tbl_user_btn");
            }
            
            timeLoad();
        },
        error:function (message){
            dataMessage(message, "#tbl_user", "#tbl_user_container");
            dataMessage(message, "#tbl_user_btn", "#tbl_user_container_btn");
        }
    });

}
function showUserInfo(userId){
    $("#user_form").attr('action', 'javascript:updateUser()');
    $("#user_id").val(userId);
    $.ajax({
        type: "POST",
        url: BACKEND_URL + "showUserInfo",
        data: "userId="+userId,
        success: function (data) {
                $("#name").val(data.name);
                $("#email").val(data.email);
                $("#selected_role_id").val(data.role);
                $('#user_modal').modal('toggle');
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
            success: function (data) {
                successMessage(data);
                getUser();
            },
            error: function (message) {
                errorMessage(message);
            }
        });
    }
}

