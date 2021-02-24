function login()
{
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
                var obj = JSON.parse((xhttp.responseText));
                if (typeof (localStorage) !== "undefined") {
                      localStorage.setItem('userinfo', xhttp.responseText);
                      showLoad();
                      location.href='../../Components/Home/index.html';
                      
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
