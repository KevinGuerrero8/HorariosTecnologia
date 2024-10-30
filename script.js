// Esperar hasta que el DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
    // Declara tu Client ID de OAuth 2.0 obtenido en la consola de Google Cloud
    const CLIENT_ID = '766595118524-qvmr87csv5megphl7bssa4goa7l4nvva.apps.googleusercontent.com';
    let tokenClient;
    let isAuthorized = false;
    let gapiInitialized = false;

    // Botones y elementos del DOM
    const authorizeButton = document.getElementById('authorize-button');
    const eventButton = document.getElementById('event-button');
    const eventFutureButton = document.getElementById('eventFuture-button');
    const futureEventForm = document.getElementById('future-event-form');
    const futureDateInput = document.getElementById('future-date');
    const futureTimeInput = document.getElementById('future-time');
    const confirmFutureEventButton = document.getElementById('confirm-future-event');

    // Evento del botón de autorización
    authorizeButton.addEventListener('click', () => {
        console.log("Botón de autorización presionado.");

        // Inicializa el cliente de token cuando el usuario hace clic en "Autorizar"
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: handleAuthResult
        });

        // Solicita el token de acceso OAuth
        console.log("Solicitando acceso OAuth...");
        tokenClient.requestAccessToken();
    });

    // Manejo del resultado de la autenticación
    function handleAuthResult(response) {
        console.log("Resultado de la autenticación recibido.");
        if (response.error) {
            console.error('Error en la autenticación:', response);
            return;
        }

        console.log("Autenticación exitosa.");
        isAuthorized = true;

        // Habilitar los botones de consultar eventos
        eventButton.disabled = false;
        eventFutureButton.disabled = false;
        console.log("Botones de consultar eventos habilitados.");

        // Inicializa el cliente de la API de Google Calendar
        initClient();
    }

    // Inicializar el cliente de Google Calendar
    function initClient() {
        console.log("Inicializando el cliente de la API de Google Calendar...");

        gapi.load('client', () => {
            gapi.client.init({
                apiKey: 'AIzaSyBuPR18yplFLf6lsJxoK3TK22E7ZWwyFfM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
            }).then(function () {
                console.log("Cliente de Google Calendar inicializado.");
                gapiInitialized = true;
            }).catch(function (error) {
                console.error("Error al inicializar el cliente:", error);
            });
        });
    }

    // Evento del botón para consultar el evento actual
    eventButton.addEventListener('click', () => {
        console.log("Botón de consultar evento presionado.");

        if (isAuthorized && gapiInitialized) {
            // Si ya está autorizado y la API está inicializada, consulta el evento actual
            getCurrentEvent();
        } else {
            console.log("Usuario no autorizado o API de Google Calendar no inicializada. No se puede consultar el evento.");
        }
    });

    // Evento del botón para evento futuro
    eventFutureButton.addEventListener('click', () => {
        console.log("Botón de consultar evento futuro presionado.");
        futureEventForm.style.display = 'block';
    });

    // Almacena la fecha y hora seleccionadas al hacer clic en "Confirmar Fecha y Hora"
    confirmFutureEventButton.addEventListener('click', () => {
        const selectedDate = futureDateInput.value;
        const selectedTime = futureTimeInput.value;

        if (selectedDate && selectedTime) {
            console.log("Fecha seleccionada:", selectedDate);
            console.log("Hora seleccionada:", selectedTime);

            // Puedes usar las variables selectedDate y selectedTime para realizar consultas o guardarlas
            futureEventForm.style.display = 'none'; // Oculta el formulario después de confirmar
        } else {
            alert("Por favor selecciona una fecha y hora.");
        }
    });

    // Función para obtener el evento actual
    function getCurrentEvent() {
        const now = new Date().toISOString();
        console.log("Obteniendo eventos a partir de:", now);

        if (!gapi.client || !gapi.client.calendar) {
            console.error("API de Google Calendar no cargada. No se puede obtener el evento.");
            return;
        }

        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            'timeMin': now,
            'maxResults': 1,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            console.log("Respuesta de eventos:", response);

            const event = response.result.items[0];
            if (event) {
                console.log("Evento encontrado:", event);
                const eventTitle = event.summary;

                // Redirige según el título del evento
                if (eventTitle.includes("Kevin")) {
                    window.location.href = "kevin.html";
                } else if (eventTitle.includes("Lizeth")) {
                    window.location.href = "lizeth.html";
                } else if (eventTitle.includes("Benyy")) {
                    window.location.href = "benyy.html";
                } else {
                    window.location.href = "Zzz.html";
                }
            } else {
                console.log("No hay eventos disponibles en este momento.");
            }
        }).catch(function (error) {
            console.error("Error al obtener el evento:", error);
        });
    }
});
