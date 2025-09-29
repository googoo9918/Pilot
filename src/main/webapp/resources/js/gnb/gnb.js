
 function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
$(".nav>ul>li>a").mouseover(function(){
			if($(".nav>ul>li>div").is(":hidden")){
				$(".nav>ul>li").removeClass("on");
				$(this).parent().addClass("on");
				$(".nav>ul>li>div").hide();
				$("+div",this).show();
			}
		});
		$(".nav").mouseleave(function(){
			$(".nav>ul>li").removeClass("on");
			$(".nav>ul>li>div").hide();
		});




$(".naviMenu p").click(function(){
			$(this).parents().find(".sub_navi").slideUp();
			$(this).parents().find(".naviMenu p").removeClass("on");
			if($(this).find("+ul").is(":hidden")){
				$(this).find("+ul").slideDown();
				$(this).addClass("on");
			}
});

/*  20240616 아코디언기능 제거
$(".quickMenu p").click(function(){
			$(this).parents().find(".quick_navi").slideUp();
			$(this).parents().find(".quickMenu p").removeClass("on");
			if($(this).find("+ul").is(":hidden")){
				$(this).find("+ul").slideDown();
				$(this).addClass("on");
			}
})*/;

$(".quick_control").click(function(){
    $(this).parents().find("#quickMenuWrap").toggleClass("on");
	$(this).toggleClass("on");
	$(".contentWrap").toggleClass("full");
			
	window.dispatchEvent( new Event('resize') );
});

$(".naviArea .navi a").click(function(){
	$(".naviArea > div.navi > a").removeClass("on");
	$(this).toggleClass("on");
});	






jQuery(function($){
	$(".to-top-btn").each(function  () {
		if ( $(this).length > 0 ) {
			$(window).scroll(function  () {
				if ( $(window).scrollTop() > 0 ) {
					$(".to-top-btn").addClass("fixed");
				}else {
					$(".to-top-btn").removeClass("fixed");
				}
			});
		}
		$(this).on("click",function  () {
			$("html, body").animate({scrollTop:0},600,"easeInOutExpo");	
			return false;
		});
	});
	
	$(".modal-sitemap-open").click(function () {
		$("#sitemapMenu-popup").css('display', 'flex').show().fadeIn();
		$("html").css('overflow', 'hidden');
	});
	$("#sitemapMenu-close").click(function () {
		modalClosesitemap();
	});
	function modalClosesitemap() {
		$("#sitemapMenu-popup").fadeOut();
		$("html").css('overflow', '');
	}
	
	$(".modal-open").click(function () {
		$("#modal-popup").css('display', 'flex').show().fadeIn();
		$("html").css('overflow', 'hidden');
	});
	$("#modal-close").click(function () {
		modalClose();
	});
	$("#modal-btn-close").click(function () {
		modalClose();
	});
	function modalClose() {
		$("#modal-popup").fadeOut();
		$("html").css('overflow', '');
	}
});
