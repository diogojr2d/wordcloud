$(document).ready(function(){

$(window).on('resize', function() {
    initBackground();
});

var svg;
var circSize = 0,
modSize = 0,
modSpace = 0,
curPosition = {},
nCols = 0,
nRows = 3,
nModules = 0,
windowWidth = 0,
windowHeight = 0,
headerHeight = 0,
footerHeight = 0,
windowCenter = {},
mainScale = 0,
drawStage = {};
modules = [];

var doggo = false;

initBackground();

function initBackground() {
        // Inicialização de variáveis
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        headerHeight = $("header").outerHeight();
        footerHeight = $("footer").outerHeight();
        contentHeight = windowHeight-footerHeight-headerHeight;
        windowCenter = {"x": windowWidth/2,
                        "y": headerHeight+contentHeight/2 };
        mainScale = (windowHeight>600)?1.0:(windowHeight/600);

        modSize = Math.min((windowWidth/4>>0), (contentHeight/nRows>>0) );
        modSize = (modSize/12>>0)*12;
        console.log(modSize);
        modSpace = modSize;
        nModules = myJSON.objetos.length;
        nCols = Math.ceil(nModules/nRows);
        drawStage.width = nCols * (modSize+modSpace);
        drawStage.height = contentHeight;
        drawStage.center = {"x": drawStage.width/2,
                            "y": drawStage.height/2 };
        
        if (doggo == true) {
            console.log(modSize);
            console.log(nModules);
            console.log(nCols);
            console.log(drawStage.width);
        }
                
        // Configura CSS inicial
        $(".content").height(contentHeight);
        $("#stage").height(contentHeight);

        svg = SVG('stage').size(drawStage.width, '100%');

        CreateDraw();

};

function CreateDraw() {
    for (i = 0; i < nModules; i++) {
        curRow = i%3;
        curCol = i/3>>0;
        curPosition.x = (curRow%2==0)?((curCol*2+1)*modSize):((curCol*2+1)*modSize+modSpace);
        curPosition.y = (curRow+0.5)*modSize;

        DrawModule(myJSON.objetos[i], curPosition);
    }
};

function DrawModule(obj, pos) {
    var id = obj.wcid;
    modules[id] = svg.circle(modSize).cx(pos.x).cy(pos.y);
    modules[id].fill('#37B');
};

});

var myJSON = {
    "objetos":
    [
        {
            "wcid": 0,
            "classe": "big",
            "titulo": "EDUCAÇÃO",
            "children": [
                {
                "wcid": 1,
                "classe": "med",
                "titulo": "Mídia"
                },
                {
                "wcid": 2,
                "classe": "med",
                "titulo": "Aloha"
                },
                {
                "wcid": 3,
                "classe": "med",
                "titulo": "Outra"
                },
            ]
        },
        
        {
            "wcid": 4,
            "classe": "big",
            "titulo": "COMUNICAÇÃO",
            "children": [
                {
                "wcid": 5,
                "classe": "med",
                "titulo": "Cima"
                }
            ]
        },

        {
            "wcid": 6,
            "classe": "big",
            "titulo": "FORMAÇÃO",
            "children": [
                {
                "wcid": 7,
                "classe": "med",
                "titulo": "Esquerda"
                },
                {
                "wcid": 8,
                "classe": "med",
                "titulo": "Baixo"
                },
            ]
        },

        {
            "wcid": 9,
            "classe": "big",
            "titulo": "DISTÂNCIA",
            "children": [
                {
                "wcid": 10,
                "classe": "med",
                "titulo": "Lado"
                }
            ]
        },

        {
            "wcid": 11,
            "classe": "big",
            "titulo": "DISTÂNCIA",
            "children": [
                {
                "wcid": 12,
                "classe": "med",
                "titulo": "Lado"
                }
            ]
        },

        {
            "wcid": 13,
            "classe": "big",
            "titulo": "DISTÂNCIA",
            "children": [
                {
                "wcid": 14,
                "classe": "med",
                "titulo": "Lado"
                }
            ]
        },

        {
            "wcid": 15,
            "classe": "big",
            "titulo": "DISTÂNCIA",
            "children": [
                {
                "wcid": 16,
                "classe": "med",
                "titulo": "Lado"
                }
            ]
        },

        {
            "wcid": 17,
            "classe": "big",
            "titulo": "DISTÂNCIA",
            "children": [
                {
                "wcid": 18,
                "classe": "med",
                "titulo": "Lado"
                }
            ]
        },
    ]
};