if (typeof (localStorage) != "undefined")
{
    if (localStorage.getItem("userinfo") == null) {
       // location.href = "../../Components/Auth/login.html";
    }
    else {
        var user = JSON.parse(localStorage.getItem("userinfo"));
        var user_id = user.id;
        var user_name = user.name;
        var api_key = user.api_key;
        var role = user.role;
        

      }
}
else {
    alert('Your browser does not support local storage');
    //location.href = "../../Components/Auth/login.html";
  }
