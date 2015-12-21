/**
 * Created by alvarobanofos on 9/11/15.
 */


var deleteMember = {
    db:null,
    userToDelete:null,
    initialize:function () {
        confDB.initialize();
        this.db = confDB.db;
        $('body').on('click', '#deleteMember', function() {
            navigator.notification.confirm(
                '¡ATENCIÓN!\n' +
                '¿Desea eliminar este usuario?',
                deleteMember.onConfirmDelete,
                'Eliminación de usuario',
                ['Eliminar', 'Cancelar']
            );
        });
    },

    onConfirmDelete:function(confirm) {
        if(confirm == 1) {
            deleteMember.userToDelete = window.localStorage.getItem("user_id");
            deleteMember.db.transaction(deleteMember.deleteFromDB, confDB.onErrorTransaction, deleteMember.onSuccess);
        }
    },

    deleteFromDB:function(tx) {
        var sql = "DELETE FROM usuarios WHERE id = "+deleteMember.userToDelete;
        tx.executeSql(sql);
    },

    onSuccess:function() {
        window.location.href = "index.html";
    }
}

deleteMember.initialize();