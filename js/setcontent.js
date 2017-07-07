$(document).ready(function() {
		// Inicialização de variáveis
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        headerHeight = $("header").outerHeight();
        footerHeight = $("footer").outerHeight();
        contentHeight = windowHeight-footerHeight-headerHeight;
        
        // Configura CSS inicial
        $(".content").height(contentHeight);
});