/**
 * Created by alvarobanofos on 2/11/15.
 */

var muestraResultados = {
    db:null,

    initialize:function () {
        confDB.initialize();
        this.db = confDB.db;
    },

    mostrarListado:function() {
        this.db.transaction(this.throwUsersList, confDB.onErrorTransaction);
    },




    throwUsersList:function(tx) {
        var sql = "SELECT * FROM usuarios ORDER BY id DESC";
        tx.executeSql(
            sql,
            [],
            muestraResultados.showUserList,
            confDB.onErrorTransaction
        );
    },


    /*Generamos el hmtl de cada fila y lo insertamos en cada lista*/
    showUserList:function(tx, result){
        if(result.rows.length > 0)
        {

            var htmlLasts = '';
            var htmlRest = '';
            for(var i=0; i<result.rows.length; i++)
            {
                var item = result.rows.item(i);
                var html = '<li>\
                    <a data-transition="slide" href="profile.html" data-ajax="false" class="linkToProfile" data-id="'+item.id+'">\
                        <img src="'+item.img+'"  class="ui-thumbnail ui-thumbnail-circular" />\
                        <h2>'+item.nombre+'</h2>\
                        <p>'+item.puesto+'</p>\
                    </a>\
                 </li>';

                /*Separamos entre mas recientes y menos*/
                if(item.ultimos == 1)
                    htmlLasts += html;
                else
                    htmlRest += html;
                $('#lastsAdded').html('<ul data-role="listview" data-icon="false" id="UsersList">'+htmlLasts+'</ul><hr/>').enhanceWithin();
                $('#restAdded').html('<ul data-role="listview" data-icon="false" id="UsersList">'+htmlRest+'</ul><hr/>').enhanceWithin();
            }
        }

        else {
            $('#UsersList').html('<a data-transition="slide" href="nuevo.html" data-ajax="false" class="ui-btn ui-btn-raised clr-primary">Añade un miembro</a>');
        }

        $('body').on('click', '#UsersList a', function() {
            window.localStorage.setItem("user_id", $(this).attr('data-id'));
        });
    },

    /*Rellena la ventana detalle de un item*/
    mostrarPerfil:function()
    {
        this.db.transaction(this.throwShowProfile, confDB.onErrorTransaction);

    },

    /*Recibimos el id del usuario y lanzamos query para rellenar datos*/
    //YA ESTABA IMPLEMENTADO ANTES
    throwShowProfile:function(tx)
    {
        var user_id = window.localStorage.getItem("user_id");
        if(user_id != null) {
            var sql = "SELECT * FROM usuarios where id = "+user_id;
            tx.executeSql(
                sql,
                [],
                muestraResultados.showProfile,
                confDB.onErrorTransaction
            );
        }

    },



    showProfile:function(tx, result)
    {

        if(result.rows.length > 0) {
            var item = result.rows.item(0);

            $('#profileName').text(item.nombre);
            $('#profileEmail').text(item.email);
            $('#profilePhone').text(item.telefono);
            $('#profileEmployment').text(item.puesto);

            if(item.valoracion == null)
                $('#profileValoration').text('?/5');
            else  $('#profileValoration').text(item.valoracion+'/5');

            $('#titleName').text(item.nombre);
            $('#profileImage').attr('src', item.img);
        }
    },

    rellenarForm:function() {
        this.db.transaction(this.throwFillForm, confDB.onErrorTransaction);
        $('body').on('click', 'a#changePhoto', function() {
            app.getCamera($(this).find('img'),  $('#formSrc'));
        });
    },

    throwFillForm:function(tx) {
        var user_id = window.localStorage.getItem("user_id");
        if(user_id != null) {
            var sql = "SELECT * FROM usuarios where id = "+user_id;
            tx.executeSql(
                sql,
                [],
                muestraResultados.fillForm,
                confDB.onErrorTransaction
            );
        }
    },

    fillForm:function(tx, result) {
        if(result.rows.length > 0) {
            var item = result.rows.item(0);
            $('#formName').val(item.nombre);
            $('#formEmail').val(item.email);
            $('#formPhone').val(item.telefono);
            $('#formEmployment').val(item.puesto).selectmenu('refresh');
            $('#formValoration').val(item.valoracion);
            $('#formValoration').slider('refresh');
            $('#profileImage').attr('src', item.img).enhanceWithin();
            $('#formSrc').val(item.img);

        }
    }







}