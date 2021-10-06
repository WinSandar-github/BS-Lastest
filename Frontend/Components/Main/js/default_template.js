if( role == 1 ){
    $('.main-sidebar').load('../../Components/Main/html/sidebar.html').trigger("create");
}else if( role == 2 ){
    $('.main-sidebar').load('../../Components/Main/html/recpt_sidebar.html').trigger("create");
}else if( role == 3 ){
    $('.main-sidebar').load('../../Components/Main/html/coltr_sidebar.html').trigger("create");
}
