function SetCSS() {
    // Inicialização de variáveis
    windowWidth = $(window).width();
    windowHeight = $(window).height();
    headerHeight = $("header").outerHeight();
    footerHeight = $("footer").outerHeight();
    contentHeight = windowHeight-footerHeight-headerHeight;

    // Configura CSS inicial
    $(".content").height(contentHeight);
};

function SetForm() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myJSON = JSON.parse(xhttp.responseText);

            // Seta Predecessores
            var obj = {};
            for (var i = 0; i < myJSON.objetos.length; i++) {
                obj = myJSON.objetos[i];
                $('select#fparent').append(
                    '<option value='+obj.wcid+'>('+obj.wcid+') '+obj.titulo+'</option>'
                );
                
                if (obj.hasOwnProperty('children')) {
                    for (var j = 0; j < obj.children.length; j++) {
                        $('select#fparent').append(
                            '<option value='+obj.children[j].wcid+'>('+obj.children[j].wcid+') '+obj.children[j].titulo+'</option>'
                        );
                    }
                }
            }

            /*// Seta Classes
            for (var i = 0; i < myJSON.config.classes.length; i++) {
                $('select#fclass').append(
                    '<option value='+myJSON.config.classes[i]+'>'+myJSON.config.classes[i]+'</option>'
                );
            }*/
        }
    };
    xhttp.open("POST", "js/wordcloud.json", true);
    xhttp.send();
};