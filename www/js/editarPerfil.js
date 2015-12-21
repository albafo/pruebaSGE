/**
 * Created by alvarobanofos on 9/11/15.
 */


var editarPerfil = {
    nombreApellidos: "",
    email: "",
    telefono: "",
    puesto: "",
    img: "",
    valoracion: "",
    db:null,
    userToEdit:null,
    initialize:function () {
        confDB.initialize();
        this.db = confDB.db;
        $('body').on('click', '#guardarPerfil', function(e) {
            e.preventDefault();
            navigator.notification.confirm(
                '¡ATENCIÓN!\n' +
                '¿Desea modificar este usuario?',
                editarPerfil.onConfirmSave,
                'Modificación de usuario',
                ['Guardar', 'Cancelar']
            );
        });
    },

    onConfirmSave:function(confirm) {
        if(confirm == 1) {
            editarPerfil.userToEdit = window.localStorage.getItem("user_id");
            editarPerfil.nombreApellidos = $('#formName').val();
            editarPerfil.email = $('#formEmail').val();
            editarPerfil.telefono = $('#formPhone').val();
            editarPerfil.puesto = $('#formEmployment').val();
            editarPerfil.img = $('#formSrc').val();
            editarPerfil.valoracion = $('#formValoration').val();
            editarPerfil.db.transaction(editarPerfil.editOnDB, confDB.onErrorTransaction, editarPerfil.onSuccess);
        }
    },

    editOnDB:function(tx) {
        var sql = "UPDATE usuarios SET " +
            "nombre='" + editarPerfil.nombreApellidos + "', " +
            "telefono='" + editarPerfil.telefono + "', " +
            "email='" + editarPerfil.email + "', " +
            "puesto='" + editarPerfil.puesto + "', " +
            "img='" + editarPerfil.img + "', " +
            "valoracion='" + editarPerfil.valoracion + "' " +
            "WHERE id ="+editarPerfil.userToEdit;
        console.log(sql);
        tx.executeSql(sql);
    },

    onSuccess: function () {
        window.location.href = 'index.html';
    },


    onSuccess:function() {
        window.location.href = "index.html";
    }
}

editarPerfil.initialize()