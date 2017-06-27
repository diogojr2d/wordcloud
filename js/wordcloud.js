$(function () {
	$("#bg-wrapper").load("NuvemExemplo.svg", function(response) {
		$(this).addClass("svgLoaded");
		if (!response) {
			alert("Error loading svg.");
		}
	});
});

$(window).on('resize', function() {
	initBackground();
});

$(document).ready(function() {
	initBackground();

	//detect mouse movement
	$('#bg-wrapper').on('mousemove', function(event){
		window.requestAnimationFrame(function(){
				moveBackground(event);
			});
	});
});

function initBackground() {
		// Inicialização de variáveis
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var headerHeight = $("header").height();
		var footerHeight = $("footer").height();
		var contentHeight = windowHeight-footerHeight-headerHeight;
		var windowCenter = [windowWidth/2, headerHeight+contentHeight/2];
		var mainScale = (windowHeight>800)?1.0:(windowHeight/800);
		
		// Configura CSS inicial
		$(".content").css("height", contentHeight );
		$(".bg-wrapper").css("height", contentHeight );
		// Ponto central apenas para Debugging
		$("#centro").css({
			"display": "block",
			"position": "fixed",
			"top": windowCenter[1],
			"left": windowCenter[0]
		});
};

function moveBackground(event) {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var headerHeight = $("header").height();
	var footerHeight = $("footer").height();
	var contentHeight = windowHeight-footerHeight-headerHeight;
	var windowCenter = [windowWidth/2, headerHeight+contentHeight/2];
	var mainScale = (windowHeight>800)?1.0:(windowHeight/800);
	
	var halfW = windowWidth/2;
	var halfH = windowHeight/2;

	var rotateX = (event.pageX/halfW - 1);
	var rotateY = (event.pageY/halfH - 1);

	console.log("pageX: " + event.pageX);
	console.log("pageY: " + event.pageY);
	console.log("RotateX: " + rotateX);
	console.log("RotateY: " + rotateY);
};