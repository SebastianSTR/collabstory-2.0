// HIDINGS
    $(".archive-section").hide();

// Show Archive Section

$(".archive-link").click(function(){
    $(".archive-section").show();
})

// Hide Archive Section

$(".archivebox").click(function(){

    setTimeout(function(){ 
            $("#archive").hide();
    }, 600);
});


// Scroll when logo clicked
    $(".headerlogo").click(function(){      
        $('html,body').animate({scrollTop:$("#main-section").offset().top}, 500);
    });

// Header Fade Out
    $(window).scroll(function() {
            $(".header").css({
             'opacity' : 1-(($(this).scrollTop())/350)
                });    
        
    }); 

