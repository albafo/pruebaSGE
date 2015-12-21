/**
 * Created by alvarobanofos on 3/11/15.
 */

var addMember = {

    nombreApellidos: "",
    email: "",
    telefono: "",
    puesto: "",
    img: "",
    db: null,

    initialize: function () {
        confDB.initialize();
        this.db = confDB.db;

        $("body").on("click", "#btnAddMember", function (e) {
            e.preventDefault();
            addMember.nombreApellidos = $('#name2b').val();
            addMember.email = $('#inputEmail').val();
            addMember.telefono = $('#telf').val();
            addMember.puesto = $('#puesto').val();
            addMember.img = $('#srcPhoto').val();
            addMember.db.transaction(addMember.addMember, confDB.onErrorTransaction, addMember.querySuccess);

        });

        $('body').on('click', 'a#changePhoto', function() {
            var img = $('<img id="profileImage"  class="profile-thumbnail">');
            $(this).html(img);
            app.getCamera(img, $('#srcPhoto'));
        });
    },

    querySuccess: function () {
        window.location.href = 'index.html';
    },

    addMember: function (tx) {
        var sql = "INSERT INTO usuarios (nombre, telefono, email, puesto, img) VALUES ('" + addMember.nombreApellidos + "', '" + addMember.telefono + "', '" + addMember.email + "', '" + addMember.puesto + "' , '" + addMember.img + "')";
        tx.executeSql(sql);

        //Reseteamos valor 'ultimos' en los items
        sql = "UPDATE usuarios SET ultimos = 0";
        tx.executeSql(sql);
        sql = "UPDATE usuarios SET ultimos = 1 WHERE id IN (SELECT id from usuarios ORDER BY id DESC LIMIT 3)";
        tx.executeSql(sql);
    }



}

$(function() {

    addMember.initialize();
});
