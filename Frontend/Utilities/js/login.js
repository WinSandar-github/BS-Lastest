function login(e)
{
    e.preventDefault();
    var email = $('#email').val();
    var password = $('#password').val();
    var data = {};
    data["email"] = email;
    data["password"] = password;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText.trim() ==0) {
                errorMessage("Authentication Failed!");
            }
            else {

                if (typeof (localStorage) !== "undefined") {

                    localStorage.setItem('userinfo', xhttp.responseText);

                    showLoad();

                    res = JSON.parse(xhttp.responseText);

                    if(res.role == 1){

                        location.href = '../../Components/Customer/customer_registration.html';

                    }
                    else{

                        location.href = '../../Components/Customer/customer.html';
                    
                    }  
                  }
                }
        }
        if (xhttp.readyState == 4 && xhttp.status == 500) {
            document.write(xhttp.responseText);
        }
    };
    xhttp.open('POST', BACKEND_URL + 'loginValidate');
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(JSON.stringify(data));
}
