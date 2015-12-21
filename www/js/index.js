/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var confDB = {

    existe_db:null,
    db:null,
    initialize: function() {


        // Comprobacion de la existencia de la base de datos
        this.existe_db = window.localStorage.getItem("existe_db");
        this.db = openDatabase('miniCRM', '1.0', 'database for miniCRM', 2 * 1024 * 1024);

        if (typeof this.existe_db == 'undefined' || this.existe_db == null)
            this.confirmaCreacionBBDD()
    },

    //lanza el dialogs de confirmación y retorna su resultado
    confirmaCreacionBBDD:function() {
        var confirm = false;
        navigator.notification.confirm(
            'La base de datos no existe.\n' +
            '¿Desea crear una nueva?',
            this.onConfirm,
            'Base de datos',
            ['Crear', 'Salir']
        );


    },

    //genera la base de datos
    creaBBDD:function() {
        this.db.transaction(this.throwDBcreation, this.onErrorTransaction, this.onSuccessTransaction);
    },

    //Maneja el resultado del dialogo de confirmación.
    //En caso de darle a salir sale de la aplicación.
    onConfirm:function(confirm) {
        if(confirm == 1) {
            confDB.creaBBDD();
        }
        else navigator.app.exitApp();

    },

    //Método que lanza las querys de creación y datos de ejemplo.
    throwDBcreation:function(tx) {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS usuarios ("+
                "id INTEGER PRIMARY KEY AUTOINCREMENT, "+
                "nombre CHAR(255)  NOT NULL, "+
                "telefono CHAR(50)  NOT NULL, "+
                "email CHAR(100)  NOT NULL, "+
                "puesto CHAR(20) NOT NULL, "+
                "valoracion INT,"+
                "img CHAR(255)"+
            ")"
        );




    },

    //Método que se lanza en caso de error de la transacción
    onErrorTransaction:function(err) {
        console.log("Error en la base de datos: " + err.message);
    },

    //Método que se lanza en caso de éxito de la transacción
    onSuccessTransaction:function() {

        console.log("Generada base de datos");
        window.localStorage.setItem("existe_db", 1);
        muestraResultados.initialize();
        muestraResultados.mostrarListado();


    }



};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        confDB.initialize();
    },

    getCamera:function(imgDOM, hiddenDOM) {
        navigator.camera.getPicture(function(imageURI){
            imgDOM.attr('src', imageURI).enhanceWithin();
            hiddenDOM.val(imageURI);
        }, function(){}, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URI });
    }


};

app.initialize();