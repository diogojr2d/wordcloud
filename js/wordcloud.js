$(document).ready(function(){

$(window).on('resize', function() {
    //updateCloud();
});

var svg;
var circSize = 0,
modSize = 0,
modSpace = 0,
lvlRatio = 1.5,
spcRatio = 1.5,
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
drawStage = {},
rowSize = 0,
colSize = 0,
modules = [],
groups = [],
panel = {},
fatMove1 = 0,
fatMove2 = 0,
fatMove3 = 0,
collMap = { "arr": [],
            "width": 0,
            "height": 0,
            "cSize": 0 },
cModalSize = 0;

/*var myJSON = {};

function loadJSON() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myJSON = JSON.parse(xhttp.responseText);
            console.log("JSON carregado com sucesso.");

            initCloud();

            SetActions();
        }
    };
    xhttp.open("POST", "js/wordcloud.json", false);
    xhttp.send();
};

loadJSON();*/
initCloud();
SetActions();
function initCloud() {
        // Inicialização de variáveis
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        headerHeight = $("header").outerHeight();
        footerHeight = $("footer").outerHeight();
        wrapperHeight = windowHeight-footerHeight-headerHeight;
        windowCenter = {"x": windowWidth/2,
                        "y": headerHeight+wrapperHeight/2 };
        mainScale = (windowHeight>600)?1.0:(windowHeight/600);

        modSize = Math.min((windowWidth/3>>0), (wrapperHeight/3>>0) );
        modSpace = modSize*lvlRatio;
        nModules = myJSON.objetos.length;
        nCols = Math.ceil(nModules/nRows);
        drawStage.width = nCols * (modSize+modSpace);
        drawStage.height = wrapperHeight;
        drawStage.center = {"x": drawStage.width/2,
                            "y": drawStage.height/2 };
        rowSize = wrapperHeight/3>>0;
        colSize = drawStage.width/nCols;
        cModalSize = Math.min(wrapperHeight, windowWidth);

        // Inicializa Collision Map
        collMap.cSize = 10;
        collMap.width = nCols*colSize/collMap.cSize>>0;
        collMap.height = (nRows+1)*rowSize/collMap.cSize>>0;

        for (var i = 0; i < collMap.height; i++) {
            var ic = i*collMap.width;
            for (var j = 0; j < collMap.width; j++) {
                collMap.arr[ic + j] = false; 
            }
        }

        fatMove1 = modSize/8<<0;
        fatMove2 = Math.abs(windowWidth - drawStage.width)/2;
        fatMove3 = Math.abs(windowHeight - drawStage.height)/2;

        // Configura CSS inicial
        $(".content").height(wrapperHeight);
        $("#wrapper").height(wrapperHeight);
        $("#stage").height(wrapperHeight);
        $(".modal-circular").css('padding', cModalSize*0.1>>0 + 'px');
        $(".modal-circular").outerHeight(cModalSize);
        $(".modal-circular").outerWidth(cModalSize);

        svg = SVG('stage').size(drawStage.width, '100%');

        CreateDraw();
};

function CreateDraw() {
    /*
    // background
    svg.rect('100%', '100%').fill('#FFF');

    // Linhas de divisão das celulas
    for (var i = 1; i <= nCols; i++) {
        svg.line(colSize*i, 0, colSize*i, drawStage.height).stroke({width: 1});
    }

    for (var i = 1; i <= nRows; i++) {
        svg.line(0, rowSize*i, drawStage.width, rowSize*i).stroke({width: 1});
    }
   
    svg.line(collMap.cSize/2, collMap.cSize/2, collMap.width*collMap.cSize-collMap.cSize/2, collMap.cSize/2).stroke({width: 2, color: '#f06'});
    */
    // Configura os Grupos
    panel = svg.nested();
    groups[2] = panel.group();
    groups[1] = panel.group();
    groups[0] = panel.group();


    // Loop para criar os Modulos
    for (var i = 0; i < nModules; i++) {
        curRow = i%3;
        curCol = i/3>>0;
        curPosition.x = (curRow%2==0)? ((curCol+0.5)*colSize) : ((curCol+1)*colSize);
        curPosition.y = (curRow+0.5)*rowSize;
        if ((i == nModules-1) && (curRow==1)) {
            curPosition.x -= colSize/2;
            curPosition.y += rowSize;
        }

        DrawModule(myJSON.objetos[i], curPosition, 0, groups[0]);
    }
};

function DrawModule(obj, pos, level, modParent) {
    var id = obj.wcid;

    var actualSize = modSize/Math.pow(lvlRatio, level);

    ShakePosition(pos, actualSize/1.5);

    if (level == 0) {
        var spacingCount = 0;
        while (TestCollision(pos, 0) && (spacingCount < 50) ) {
            ShakePosition(pos, actualSize);
            spacingCount++;
        }
        if (spacingCount>=50) {
            while (TestCollision(pos, 0) && (spacingCount < 200) ) {
                ShakePosition(pos, actualSize*2);
                spacingCount++;
            }
            if (spacingCount>=200)
                console.log("Falhou em espaçar o level 0");
        }
    }

    // Cria grupo do Módulo
    modules[id] = modParent.group();
    modules[id].addClass('svgModule');
    // Cria circulo
    var currentCirc = modules[id].circle(actualSize).cx(pos.x).cy(pos.y);
    currentCirc.addClass(obj.classe+'Circ0');
    // Cria texto (Titulo)
    var currentTxt = modules[id].text(obj.titulo).cx(pos.x).cy(pos.y);
    currentTxt.addClass(obj.classe+'Text0');

    if (obj.tipoAcao == "circular") {
        $(modules[id].node).click(
            function(evt) {
                CriarCircular(obj.titulo, obj.infoID);
            }
        );
    }
    

    SetCollision(pos, level);

    // Chama a criação dos filhos recursivamente
    if (obj.hasOwnProperty('children')) {
        var newPos = DefinePosition(pos, level+1, obj.children.length);
        for (var i = 0; i < obj.children.length; i++) {
            DrawModule(obj.children[i], newPos[i], level+1, groups[level+1]);
        }
    }
};

function DefinePosition(pos_, level_, nChildren_) {
    var radius = modSpace/Math.pow(lvlRatio*1.1, level_);
    var angles = []; // 8 setores possíveis para os filhos
    for (var i = 0; i < 8; i++) {
        angles[i] = Math.PI/8 + Math.PI/4*i;
    }

    var posCalc = [];
    for (var i = 0; i < nChildren_; i++) {
        do {
            var sector = Math.floor((Math.random()*angles.length)); // indice entre 0 e 7
            posCalc[i] = { "x": pos_.x + radius*Math.cos(angles[sector]),
                            "y": pos_.y + radius*Math.sin(angles[sector]) };
            angles.splice(sector, 1);
        } while (TestCollision(posCalc[i], level_));
    }
    return posCalc;
};

function SetCollision(pos, level_) {
    var rad = ((modSize/Math.pow(lvlRatio, level_))/2)/collMap.cSize>>0;
    var posScaled = {"x": pos.x/collMap.cSize>>0,
                     "y": pos.y/collMap.cSize>>0 };

    var sk = posScaled.x - rad,
        ek = posScaled.x + rad,
        sl = posScaled.y - rad,
        el = posScaled.y + rad;

    for (var i = sk; i < ek; i++) {
        var ic = i*collMap.width;
        for (var j = sl; j < el; j++) {
            if (Dist(i, j, posScaled.x, posScaled.y) < rad) {
                collMap.arr[ic+j] = true;
            }
        }
    }
}

function TestCollision(pos, level_) {
    var rad = ((modSize/Math.pow(lvlRatio, level_))/2)/collMap.cSize>>0;
    var posScaled = {"x": pos.x/collMap.cSize>>0,
                     "y": pos.y/collMap.cSize>>0 };

    var sk = posScaled.x - rad,
        ek = posScaled.x + rad,
        sl = posScaled.y - rad,
        el = posScaled.y + rad;

    for (var i = sk; i < ek; i++) {
        var ic = i*collMap.width;
        for (var j = sl; j < el; j++) {
            if (Dist(i, j, posScaled.x, posScaled.y) < rad) {
                if (collMap.arr[ic+j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function Dist(x1, y1, x2, y2) {
    return ( Math.sqrt( Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2) ) );
}

function ShakePositions(intensity, obj_) {
    if (obj_ == undefined) {
        var nCircles = modules.length;
        var shakex = 0;
        var shakey = 0;
        var i = 12;
        for (var i = 0; i < nCircles; i++) {
            var circ = $('g.svgModule:eq('+i+') circle:first-child');
            shakex = Math.floor( (Math.random()*intensity-intensity/2) * circ.attr('r') );
            shakey = Math.floor( (Math.random()*intensity-intensity/2) * circ.attr('r') );
            $('g.svgModule:eq('+i+')').css({'transform': 'translate('+shakex+'px,'+shakey+'px)'});
        }
    }
    else {
        var circ = obj_.first();
        var shakex = Math.floor( (Math.random()*intensity-intensity/2) * circ.attr('r') );
        var shakey = Math.floor( (Math.random()*intensity-intensity/2) * circ.attr('r') );
        obj_.first().attr({'cx': obj_.first().attr('cx')+shakex,
                           'cy': obj_.first().attr('cy')+shakey });
    }
};

function ShakePosition(pos, intensity) {
    pos.x += Math.floor(Math.random()*intensity-intensity/2);
    pos.y += Math.floor(Math.random()*intensity-intensity/2);
}

function MoveCloud(evt) {
    var mouse = { "x": evt.pageX,
                  "y": evt.pageY };
    
    var relMouse = { "x": (mouse.x - windowCenter.x)/(windowWidth/2),
                     "y": (mouse.y - windowCenter.y)/(windowHeight/2) };

    var displacementX = 0;
    var displacementY = 0;
    //var displacementX = -relMouse.x*modSize-(relMouse.x*fatMove2);
    if (drawStage.width > windowWidth) {
        displacementX = -fatMove2-relMouse.x*fatMove2;
    } else {
        displacementX = -relMouse.x*fatMove1;
    }
    
    var displacementY = -relMouse.y*(fatMove3+modSize);

    for (var i = 0; i < groups.length; i++) {
        var id = '#' + (groups[i]).id();
        $(id).css({'transform': 'translate('+displacementX+'px, '+displacementY+'px)' })
    }
};

function Formatter(n_, casas = 6) {
    return parseFloat( n_.toFixed(casas) );
};

function CriarCircular(tit, info) {
    $('.modal-circular h1').text(tit);
    $('.modal-circular .modal-content').html(info);
    $('.modal-circular').css({'transform': 'translate(-50%, -50%) scale(1)'});
    $('.blackout').fadeIn("fast");
    $('.fechar-modal').css({'left': ( parseInt($('.modal-circular').css('left')) + cModalSize/2 ) });
    $('.fechar-modal').fadeIn("fast");
};

function FecharCircular() {
    $('.modal-circular').css({'transform': 'translate(-50%, -50%) scale(0)'});
    $('.blackout').fadeOut("fast");
    $('.fechar-modal').fadeOut("fast");
};

function SetActions() {
    $('#stage').mousemove(function(evt) {
        MoveCloud(evt);
    });

    $('.svgModule').hover(
        function() {
            $(this).children(':first').addClass('circ-in');
        },
        function() {
            $(this).children(':first').removeClass('circ-in');
        }
    );

    $('.fechar-modal').click(
        function() {
            FecharCircular();
        }
    );
};

// end document.ready() 
});

var myJSON = {
    "objetos":
    [
        {
            "wcid": 0,
            "classe": "Big",
            "titulo": "TITULO1",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 1,
                "classe": "Med",
                "titulo": "Titulo1",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                },
                {
                "wcid": 2,
                "classe": "Med",
                "titulo": "Titulo2",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                },
                {
                "wcid": 3,
                "classe": "Med",
                "titulo": "Titulo3",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },
        
        {
            "wcid": 4,
            "classe": "Big",
            "titulo": "TITULO2",
            "tipoAcao": "separada",
            "children": [
                {
                "wcid": 5,
                "classe": "Med",
                "titulo": "Titulo4",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },

        {
            "wcid": 6,
            "classe": "Big",
            "titulo": "TITULO3",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 7,
                "classe": "Med",
                "titulo": "Titulo5",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                },
                {
                "wcid": 8,
                "classe": "Med",
                "titulo": "Titulo6",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },

        {
            "wcid": 9,
            "classe": "Big",
            "titulo": "TITULO4",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 10,
                "classe": "Med",
                "titulo": "Titulo7",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },

        {
            "wcid": 11,
            "classe": "Big",
            "titulo": "TITULO5",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 12,
                "classe": "Med",
                "titulo": "Titulo8",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
                "children": [
                    {
                    "wcid": 19,
                    "classe": "Small",
                    "titulo": "Titulo9",
                    "tipoAcao": "circular",
                    "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                    }
                    ]
                }
            ]
        },

        {
            "wcid": 13,
            "classe": "Big",
            "titulo": "TITULO6",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 14,
                "classe": "Med",
                "titulo": "Titulo10",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },

        {
            "wcid": 15,
            "classe": "Big",
            "titulo": "TITULO7",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 16,
                "classe": "Med",
                "titulo": "Titulo11",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        },

        {
            "wcid": 17,
            "classe": "Big",
            "titulo": "TITULO8",
            "tipoAcao": "circular",
            "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>",
            "children": [
                {
                "wcid": 18,
                "classe": "Med",
                "titulo": "Titulo12",
                "tipoAcao": "circular",
                "infoID": "blablabla<br>Lorem ipsum dolor sit amet.<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>"
                }
            ]
        }
    ]
};

/*
function DrawCollisionBox(pos, level_) {
    var rad = ((modSize/Math.pow(lvlRatio, level_))/2)/collMap.cSize>>0;
    var posScaled = {"x": pos.x/collMap.cSize>>0,
                     "y": pos.y/collMap.cSize>>0 };

    var sk = posScaled.x - rad,
        ek = posScaled.x + rad,
        sl = posScaled.y - rad,
        el = posScaled.y + rad;

    for (var i = sk; i < ek; i++) {
        var ic = i*collMap.width;
        for (var j = sl; j < el; j++) {
            if (Dist(i, j, posScaled.x, posScaled.y) < rad) {
                var xx1 = i*collMap.cSize;
                var yy1 = j*collMap.cSize;
                svg.rect(collMap.cSize, collMap.cSize).move(xx1, yy1).fill('rgba(0,0,0,0.5)');
                collMap.arr[ic+j] = true;
            }
        }
    }
}
*/