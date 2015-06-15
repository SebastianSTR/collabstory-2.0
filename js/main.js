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

// smooth scroll
    $(".scroll").click(function(event){     
    	event.preventDefault();
    	$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
    });

// Header Fade Out
    $(window).scroll(function() {
            $(".header").css({
             'opacity' : 1-(($(this).scrollTop())/350)
                });    
        
    }); 

