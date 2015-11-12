//prefixes of implementation that we want to test
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Tu navegador no ofrece soporte para IndexedDB.")
}

var dataBase = null;

function startDB() {

    dataBase = indexedDB.open('pelis_db', 1);

    dataBase.onupgradeneeded = function(e) {

        var active = dataBase.result;
        var object = active.createObjectStore('pelis', {
            keyPath: 'id',
            autoIncrement: true
        });
        object.createIndex('by_realidad', 'realidad', {
            unique: false
        });
        object.createIndex('by_pelicula', 'pelicula', {
            unique: false
        });
        object.createIndex('by_seccion', 'seccion', {
            unique: false
        });
        object.createIndex('by_articulo', 'articulo', {
            unique: false
        });

    };

    dataBase.onsuccess = function(e) {
        loadAll();
    };

    dataBase.onerror = function(e) {
        alert('Ocurrió un error al cargar la base de datos. Por favor, contacte con el administrador de la aplicación.');
    };

}

function addPeli() {

    var active = dataBase.result;
    var data = active.transaction(['pelis'], 'readwrite');
    var object = data.objectStore('pelis');

    if ($("textarea#realidad").val() === "") {
        object = null;
        return;
    } else if ($("textarea#pelicula").val() === "") {
        object = null;
        return;
    } else if ($("#secciones option:selected").text() === "Elige una sección...") {
        object = null;
        return;
    } else if ($("#articulos option:selected").text() === "Elige un artículo...") {
        object = null;
        return;
    } else {
        var request = object.put({
            realidad: document.querySelector('textarea#realidad').value,
            pelicula: document.querySelector('textarea#pelicula').value,
            seccion: document.querySelector('#secciones').value,
            articulo: document.querySelector('#articulos').value
        });
    }

    request.onerror = function(e) {
        alert(request.error.url + '\n\n' + request.error.message);
    };

    data.oncomplete = function(e) {

        document.querySelector('textarea#realidad').value = '';
        document.querySelector('textarea#pelicula').value = '';
        $('#save_btn').removeClass('btn-primary').addClass('btn-success').text('¡PELI GUARDADA!').css('font-weight', 'bold');
        loadAll();

    };

}

function updatePeli(key) {

    var active = dataBase.result;
    var data = active.transaction(['pelis'], 'readwrite');
    var object = data.objectStore('pelis');

    if ($("textarea#realidad").val() === "") {
        object = null;
        return;
    } else if ($("textarea#pelicula").val() === "") {
        object = null;
        return;
    } else if ($("#secciones option:selected").text() === "Elige una sección...") {
        object = null;
        return;
    } else if ($("#articulos option:selected").text() === "Elige un artículo...") {
        object = null;
        return;
    } else {
        var request = object.put({
            realidad: document.querySelector('textarea#realidad').value,
            pelicula: document.querySelector('textarea#pelicula').value,
            seccion: document.querySelector('#secciones').value,
            articulo: document.querySelector('#articulos').value,
            id: key
        });
    }

    request.onerror = function(e) {
        alert(request.error.url + '\n\n' + request.error.message);
    };

    data.oncomplete = function(e) {

        document.querySelector('textarea#realidad').value = '';
        document.querySelector('textarea#pelicula').value = '';
        $('textarea#realidad').css('border', 'none');
        $('textarea#pelicula').css('border', 'none');
        $('#secciones').css('border', 'none');
        $('#articulos').css('border', 'none');
        loadAll();

    };

}

function deletePeli(key) {

    var active = dataBase.result;
    var data = active.transaction(['pelis'], 'readwrite');
    var object = data.objectStore('pelis');
    var request = object.delete(key);

    request.onerror = function(e) {
        alert(request.error.url + '\n\n' + request.error.message);
    };

    data.oncomplete = function(e) {
        loadAll();
    };

}

function loadAll() {

    var active = dataBase.result;
    var data = active.transaction(['pelis'], 'readonly');
    var object = data.objectStore('pelis');

    var pelis = [];

    object.openCursor().onsuccess = function(e) {

        var result = e.target.result;

        if (result === null) {
            return;
        }

        pelis.push(result.value);
        result.continue();

    };

    data.oncomplete = function() {

        var generatedHTML = '';
        var divs = [];
        var empty_section = "<p style='color: #2e6ea5; font-weight: bold; font-size: 1.5em; width: 50%; margin: 0 auto; padding: 50px; text-align: center;'>¡ESTO ESTÁ VACIO! AÑADE UNAS PELIS Y PON A TRABAJAR LA MEMORIA Y LA IMAGINACIÓN.<br><br>¡QUÉ LO DE SER FUNCIONARIO NO VIENE SOLO!</p>"

        for (var key in pelis) {

            generatedHTML = "<div id='" + pelis[key].id + "' class='container " + pelis[key].seccion + "'>" +
                                "<span class='label label-primary label-articulo'>" + pelis[key].articulo.charAt(0).toUpperCase() + pelis[key].articulo.substring(1).replace("-", " ").replace("i", "í") + "</span>" +
                                "<hr style='border-color: white; margin-bottom: 0px; margin-top: 13px;'>" +
                                "<div class='subcontainer panel panel-default'>" +
                                    "<div class='label-realidad panel-heading'>" +
                                        "REALIDAD" +
                                    "</div>" +
                                    "<div class='realidad panel-body'>" +
                                        "<samp>" + pelis[key].realidad + "</samp>" +
                                    "</div>" +
                                    "<div class='edit-icon-container'>" +
                                        "<div class='edit-icon edit-realidad glyphicon glyphicon-pencil' aria-hidden='true'></div>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='subcontainer panel panel-default'>" +
                                    "<div class='label-pelicula panel-heading'>" +
                                        "PELICULA" +
                                    "</div>" +
                                    "<div class='pelicula panel-body'>" +
                                        pelis[key].pelicula +
                                    "</div>" +
                                    "<div class='edit-icon-container'>" +
                                        "<div class='edit-icon edit-pelicula glyphicon glyphicon-pencil' aria-hidden='true'></div>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='hide-realidad-icon-container'>" +
                                    "<div class='hide-realidad-icon glyphicon glyphicon-eye-close' aria-hidden='true'></div>" +
                                "</div>" +
                                "<div class='hide-pelicula-icon-container'>" +
                                    "<div class='hide-pelicula-icon glyphicon glyphicon-eye-close' aria-hidden='true'></div>" +
                                "</div>" +
                                "<div class='delete-icon-container'>" +
                                    "<div class='delete-icon glyphicon glyphicon-trash' aria-hidden='true'></div>" +
                                "</div>" +
                            "</div>";

            divs.push(generatedHTML);

        }

        for (var key in divs) {

            if (divs[key].match(/(titulo\-preliminar)/gm)) {
                $('.tab-pane#titulo-preliminar').append(divs[key]);
            } else if (divs[key].match(/(titulo\-iii\-capitulo\-primero)/gm)) {
                $('.tab-pane#titulo-iii-capitulo-primero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-iii\-capitulo\-segundo)/gm)) {
                $('.tab-pane#titulo-iii-capitulo-segundo').append(divs[key]);
            } else if (divs[key].match(/(titulo\-iii\-capitulo\-tercero)/gm)) {
                $('.tab-pane#titulo-iii-capitulo-tercero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-ii)/gm)) {
                $('.tab-pane#titulo-ii').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-primero)/gm)) {
                $('.tab-pane#titulo-i-capitulo-primero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-segundo\-seccion\-1ª)/gm)) {
                $('.tab-pane#titulo-i-capitulo-segundo-seccion-1ª').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-segundo\-seccion\-2ª)/gm)) {
                $('.tab-pane#titulo-i-capitulo-segundo-seccion-2ª').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-segundo)/gm)) {
                $('.tab-pane#titulo-i-capitulo-segundo').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-tercero)/gm)) {
                $('.tab-pane#titulo-i-capitulo-tercero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-cuarto)/gm)) {
                $('.tab-pane#titulo-i-capitulo-cuarto').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i\-capitulo\-quinto)/gm)) {
                $('.tab-pane#titulo-i-capitulo-quinto').append(divs[key]);
            } else if (divs[key].match(/(titulo\-iv)/gm)) {
                $('.tab-pane#titulo-iv').append(divs[key]);
            } else if (divs[key].match(/(titulo\-ix)/gm)) {
                $('.tab-pane#titulo-ix').append(divs[key]);
            } else if (divs[key].match(/(titulo\-i)/gm)) {
                $('.tab-pane#titulo-i').append(divs[key]);
            } else if (divs[key].match(/(titulo\-viii\-capitulo\-primero)/gm)) {
                $('.tab-pane#titulo-viii-capitulo-primero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-viii\-capitulo\-segundo)/gm)) {
                $('.tab-pane#titulo-viii-capitulo-segundo').append(divs[key]);
            } else if (divs[key].match(/(titulo\-viii\-capitulo\-tercero)/gm)) {
                $('.tab-pane#titulo-viii-capitulo-tercero').append(divs[key]);
            } else if (divs[key].match(/(titulo\-vii)/gm)) {
                $('.tab-pane#titulo-vii').append(divs[key]);
            } else if (divs[key].match(/(titulo\-vi)/gm)) {
                $('.tab-pane#titulo-vi').append(divs[key]);
            } else if (divs[key].match(/(titulo\-v)/gm)) {
                $('.tab-pane#titulo-v').append(divs[key]);
            } else if (divs[key].match(/(titulo\-x)/gm)) {
                $('.tab-pane#titulo-x').append(divs[key]);
            }

        }

        $('.nav-tabs li a').each(function() {
            $(this).append("<span class='label label-primary label-as-badge'></span>");
            var label_id = $(this).attr('href').substring(1);
            $(this).children('.label-as-badge').attr('id', 'label_' + label_id);
        });

        $('.tab-pane').each(function() {

            if ($(this).children().length === 0) {
                $(this).html(empty_section);
            } else {

                if ($(this).find('span.label-articulo').is(':empty')) {
                    $(this).find('span.label-articulo').filter(':empty').parent('.container').addClass('no-label');
                    $(this).find('span.label-articulo').filter(':empty').siblings('hr').remove();
                    $(this).find('span.label-articulo').filter(':empty').remove();
                }

                var pelis_in_tab = $(this).children('.container').length;
                $('.label-as-badge#label_' + $(this).attr('id')).text(pelis_in_tab);

                $(this).prepend("<div class='icon_container pull-right'>" +
                                    "<div class='hide-realidad-all-icon-container'>" +
                                        "<div class='hide-realidad-all-icon-up glyphicon glyphicon-chevron-up' aria-hidden='true'></div>" +
                                        "<div class='hide-realidad-all-icon glyphicon glyphicon-eye-close' aria-hidden='true'></div>" +
                                    "</div>" +
                                    "<div class='hide-pelicula-all-icon-container'>" +
                                        "<div class='hide-pelicula-all-icon glyphicon glyphicon-eye-close' aria-hidden='true'></div>" +
                                        "<div class='hide-pelicula-all-icon-down glyphicon glyphicon-chevron-down' aria-hidden='true'></div>" +
                                    "</div>" +
                                "</div>");

                $(this).find('.hide-realidad-icon').click(function() {

                    div_realidad = $(this).parent('.hide-realidad-icon-container').siblings('.subcontainer').children('.realidad');
                    div_pelicula = $(this).parent('.hide-realidad-icon-container').siblings('.subcontainer').children('.pelicula');

                    div_realidad.css({
                        'background': 'white',
                        'color': 'white',
                        'font-weight': 'bold'
                    });

                    div_realidad
                        .mouseover(function() {
                            $(this).css({
                                'background': 'black',
                                'border-bottom-left-radius': '5px',
                                'border-bottom-right-radius': '5px'
                            });
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                    div_pelicula.css({
                        'background': 'white',
                        'color': '#424243'
                    });

                    div_pelicula
                        .mouseover(function() {
                            $(this).css('background', 'white');
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                });

                $(this).find('div.hide-pelicula-icon').click(function() {

                    div_pelicula = $(this).parent('.hide-pelicula-icon-container').siblings('.subcontainer').children('.pelicula');
                    div_realidad = $(this).parent('.hide-pelicula-icon-container').siblings('.subcontainer').children('.realidad');

                    div_pelicula.css({
                        'background': 'white',
                        'color': 'white',
                    });

                    div_pelicula
                        .mouseover(function() {
                            $(this).css({
                                'background': 'black',
                                'border-bottom-left-radius': '5px',
                                'border-bottom-right-radius': '5px'
                            });
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                    div_realidad.css({
                        'background': 'white',
                        'color': '#232424',
                        'font-weight': 'normal'
                    });

                    div_realidad
                        .mouseover(function() {
                            $(this).css('background', 'white');
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                });

                $(this).children('.icon_container').children('.hide-realidad-all-icon-container').click(function() {

                    div_realidad_all = $(this).parent('.icon_container').siblings('.container').children('.subcontainer').children('.realidad');
                    div_pelicula_all = $(this).parent('.icon_container').siblings('.container').children('.subcontainer').children('.pelicula');

                    div_realidad_all.css({
                        'background': 'white',
                        'color': 'white',
                        'font-weight': 'bold'
                    });

                    div_realidad_all
                        .mouseover(function() {
                            $(this).css({
                                'background': 'black',
                                'border-bottom-left-radius': '5px',
                                'border-bottom-right-radius': '5px'
                            });
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                    div_pelicula_all.css({
                        'background': 'white',
                        'color': '#424243'
                    });

                    div_pelicula_all
                        .mouseover(function() {
                            $(this).css('background', 'white');
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                });

                $(this).children('.icon_container').children('.hide-pelicula-all-icon-container').click(function() {

                    div_pelicula_all = $(this).parent('.icon_container').siblings('.container').children('.subcontainer').children('.pelicula');
                    div_realidad_all = $(this).parent('.icon_container').siblings('.container').children('.subcontainer').children('.realidad');

                    div_pelicula_all.css({
                        'background': 'white',
                        'color': 'white',
                    });

                    div_pelicula_all
                        .mouseover(function() {
                            $(this).css({
                                'background': 'black',
                                'border-bottom-left-radius': '5px',
                                'border-bottom-right-radius': '5px'
                            });
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                    div_realidad_all.css({
                        'background': 'white',
                        'color': '#6a6a6b',
                        'font-weight': 'normal'
                    });

                    div_realidad_all
                        .mouseover(function() {
                            $(this).css('background', 'white');
                        })
                        .mouseout(function() {
                            $(this).css('background', 'white');
                        });

                });

            }

        });

        $('.glyphicon').each(function() {

            $(this)
                .mouseover(function() {
                    $(this).css({
                        '-webkit-transition-property': 'opacity',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'opacity',
                        'transition-duration': '0.5s',
                        'opacity': '1.0',
                        'filter': 'alpha(opacity = 100)',
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#000000'
                    });
                })
                .mouseout(function() {
                    $(this).css({
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#6e7378'
                    });
                });

        });

        $('.icon_container .hide-realidad-all-icon-container').each(function() {

            $(this)
                .mouseover(function() {
                    $('.glyphicon-chevron-up, .icon_container .hide-realidad-all-icon-container.glyphicon-eye-close').css({
                        '-webkit-transition-property': 'opacity',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'opacity',
                        'transition-duration': '0.5s',
                        'opacity': '1.0',
                        'filter': 'alpha(opacity = 100)',
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#000000'
                    });
                })
                .mouseout(function() {
                    $('.glyphicon-chevron-up, .icon_container .hide-realidad-all-icon-container.glyphicon-eye-close').css({
                        '-webkit-transition-property': 'opacity',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'opacity',
                        'transition-duration': '0.5s',
                        'opacity': '1.0',
                        'filter': 'alpha(opacity = 100)',
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#6e7378'
                    });
                });

        });

        $('.icon_container .hide-pelicula-all-icon-container').each(function() {

            $(this)
                .mouseover(function() {
                    $('.glyphicon-chevron-down, .icon_container .hide-pelicula-all-icon-container.glyphicon-eye-close').css({
                        '-webkit-transition-property': 'opacity',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'opacity',
                        'transition-duration': '0.5s',
                        'opacity': '1.0',
                        'filter': 'alpha(opacity = 100)',
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#000000'
                    });
                })
                .mouseout(function() {
                    $('.glyphicon-chevron-down, .icon_container .hide-pelicula-all-icon-container.glyphicon-eye-close').css({
                        '-webkit-transition-property': 'opacity',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'opacity',
                        'transition-duration': '0.5s',
                        'opacity': '1.0',
                        'filter': 'alpha(opacity = 100)',
                        '-webkit-transition-property': 'color',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'color',
                        'transition-duration': '0.5s',
                        'color': '#6e7378'
                    });
                });

        });

        $('.container .subcontainer .edit-icon-container').each(function() {

            $(this)
                .mouseover(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': '#f0ad4e'
                    });
                })
                .mouseout(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': 'none'
                    });
                });

        });

        $('.container .hide-realidad-icon-container, .container .hide-pelicula-icon-container, .icon_container .hide-realidad-all-icon-container, .icon_container .hide-pelicula-all-icon-container').each(function() {

            $(this)
                .mouseover(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': '#5bc0de'
                    });
                })
                .mouseout(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': 'none'
                    });
                });

        });

        $('.container .delete-icon-container').each(function() {

            $(this)
                .mouseover(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': '#d9534f'
                    });
                })
                .mouseout(function() {
                    $(this).css({
                        '-webkit-transition-property': 'background',
                        '-webkit-transition-duration': '0.5s',
                        'transition-property': 'background',
                        'transition-duration': '0.5s',
                        'background': 'none'
                    });
                });

        });

        $('div.edit-realidad').each(function() {

            var edit_realidad = $(this);

            $(this).click(function() {
                if ($('textarea#realidad').attr('readonly', 'readonly')) {
                    $('textarea#realidad').removeAttr('readonly').attr('editable', 'editable');
                } else {
                    $('textarea#realidad').attr('readonly', 'readonly');
                }
                $('textarea#realidad').val(edit_realidad.parent('.edit-icon-container').siblings('.realidad').text());
                $('textarea#realidad').css('border', '3px solid #f0ad4e');
                $('textarea#pelicula').val(edit_realidad.parents('.subcontainer').siblings().children('.pelicula').text());

                if ($('textarea#pelicula').attr('editable')) {
                    $('textarea#pelicula').removeAttr('readonly');
                } else {
                    $('textarea#pelicula').attr('readonly', 'readonly');
                }
                var option_secciones = edit_realidad.parents('.tab-pane').attr('id');
                var option_articulos = edit_realidad.parents('.subcontainer').siblings('.label-articulo').text();

                $('#secciones option').each(function(index, element) {
                    if (element.value === option_secciones) {
                        $(this).attr('selected', 'selected');
                        $('#secciones').css('border', '3px solid #5bc0de');
                    }
                });


                if (!option_articulos) {
                    $('#articulos').html("<option value='' style='background: #e8e8e9;'>Sin artículo</option>");
                } else {
                    $('#articulos').html("<option value='" + option_articulos.toLowerCase().replace(" ", "-").replace("í", "i") + "'>" + option_articulos.charAt(0).toUpperCase() + option_articulos.substring(1).replace("-", " ").replace("i", "í") + "</option>");
                    $('#articulos').append("<option value='' style='background: #e8e8e9;'>Sin artículo</option>");
                }
                $('#articulos').css('border', '3px solid #5bc0de');

                $('#secciones, #articulos')
                    .focus(function() {
                        $(this).css('border', '3px solid #f0ad4e');
                    })
                    .blur(function() {
                        $(this).css('border', '3px solid #5bc0de');
                    });

                $('#save_btn').prop('onclick', null).attr('id', 'update_btn').removeClass('btn-primary').addClass('btn-warning').text('EDITA TU PELI');
                key = edit_realidad.parents('.container').attr('id');
                $('#update_btn').addClass('open-update-confirmation').attr('data-toggle', 'modal').attr('data-target', '#update-confirmation').attr('update-key', key);

            });

        });

        $('div.edit-pelicula').each(function() {

            var edit_pelicula = $(this);

            $(this).click(function() {

                $('textarea#pelicula').attr('editable', 'editable');
                if ($('textarea#pelicula').attr('editable')) {
                    $('textarea#pelicula').removeAttr('readonly');
                }
                $('textarea#pelicula').val(edit_pelicula.parent('.edit-icon-container').siblings('.pelicula').text());
                $('textarea#pelicula').css('border', '3px solid #f0ad4e');
                $('textarea#realidad').val(edit_pelicula.parents('.subcontainer').siblings().children('.realidad').text());
                if ($('textarea#realidad').attr('editable')) {
                    $('textarea#realidad').removeAttr('readonly');
                } else {
                    $('textarea#realidad').attr('readonly', 'readonly');
                }
                var option_secciones = edit_pelicula.parents('.tab-pane').attr('id');
                var option_articulos = edit_pelicula.parents('.subcontainer').siblings('.label-articulo').text();

                $('#secciones option').each(function(index, element) {
                    if (element.value === option_secciones) {
                        $(this).attr('selected', 'selected');
                        $('#secciones').css('border', '3px solid #5bc0de');
                    }
                });

                if (!option_articulos) {
                    $('#articulos').html("<option value='' style='background: #e8e8e9;'>Sin artículo</option>");
                } else {
                    $('#articulos').html("<option value='" + option_articulos.toLowerCase().replace(" ", "-").replace("í", "i") + "'>" + option_articulos.charAt(0).toUpperCase() + option_articulos.substring(1).replace("-", " ").replace("i", "í") + "</option>");
                    $('#articulos').append("<option value='' style='background: #e8e8e9;'>Sin artículo</option>");
                }
                $('#articulos').css('border', '3px solid #5bc0de');

                $('#secciones, #articulos')
                    .focus(function() {
                        $(this).css('border', '3px solid #f0ad4e');
                    })
                    .blur(function() {
                        $(this).css('border', '3px solid #5bc0de');
                    });

                $('#save_btn').prop('onclick', null).attr('id', 'update_btn').removeClass('btn-primary').addClass('btn-warning').text('EDITA TU PELI');
                key = edit_pelicula.parents('.container').attr('id');
                $('#update_btn').addClass('open-update-confirmation').attr('data-toggle', 'modal').attr('data-target', '#update-confirmation').attr('update-key', key);

            });

        });

        $('div.delete-icon').each(function() {
            var delete_pelicula = $(this);
            var key = delete_pelicula.parent('.delete-icon-container').parent('.container').attr('id');
            delete_pelicula.addClass('open-delete-confirmation').attr('id', 'delete_img_' + key).attr('data-toggle', 'modal').attr('data-target', '#delete-confirmation').attr('data-id', key).click(function() {});
        });

        $('span.label-articulo').each(function() {

            var label_articulo = $(this);
            var name_articulo = label_articulo.html();
            var remote_url = label_articulo.parent('.container').parent('.tab-pane').attr('id');

            $('#modal-articulo .modal-dialog .modal-content').css('padding', '20px');

            label_articulo.attr('data-toggle', 'modal').attr('data-target', '#modal-articulo').click(function() {

            label_articulo.removeClass('label-primary').addClass('label-success');
            callContent("../constitucion-española/remote-content/" + remote_url.replace(/\-(capitulo|seccion)\-\S+/gmi, '') + ".html #ART" + name_articulo.substring(20,9));

            });

            $('#modal-articulo').on('hidden.bs.modal', function(){
                label_articulo.removeClass('label-success').addClass('label-primary');
            });

            $('#modal-articulo').on('show.bs.modal', function(){
                $('.icon_container').css('left', '89.3%');
            });

            $('#modal-articulo').on('hide.bs.modal', function(){
                $('.icon_container').css('left', '89.3%');
            });

            $('#modal-articulo').on('hidden.bs.modal', function(){
                $('.icon_container').css('left', '90.1%');
            });

        });

    };

}

function callContent(myurl) {

    $.ajax({
            url: myurl,
            dataType: "html"
        })
         .done(function() {
            $('#modal-articulo .modal-dialog .modal-content').load(myurl);
        })
        .success(function() {

        });

}
