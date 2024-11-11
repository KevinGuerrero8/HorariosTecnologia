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
    const Oauthorizebutton = document.getElementById('authorize-button');

    eventButton.style.display = 'none'; // Oculta el botón de consultar evento actual
    //eventFutureButton.style.display = 'none'; // Oculta el botón de consultar evento futuro


    // Evento del botón de autorización
    authorizeButton.addEventListener('click', () => {
        console.log("Botón de autorización presionado.");

        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: handleAuthResult
        });

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
    
        // Mostrar y habilitar los botones de consultar evento
        eventButton.style.display = 'inline'; // Muestra el botón de consultar evento actual
        //eventFutureButton.style.display = 'inline'; // Muestra el botón de consultar evento futuro
        futureEventForm.style.display = 'flex';
        Oauthorizebutton.style.display = 'none';
        eventButton.disabled = false; // Habilita el botón de consultar evento actual
        //eventFutureButton.disabled = false; // Habilita el botón de consultar evento futuro
        console.log("Botones de consultar evento habilitados.");
        
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

    // Evento para consultar el evento actual
    eventButton.addEventListener('click', () => {
        console.log("Botón de consultar evento presionado.");
        if (isAuthorized && gapiInitialized) {
            getCurrentEvent();
        } else {
            console.log("Usuario no autorizado o API no inicializada.");
        }
    });

    // Evento para consultar evento futuro
    // eventFutureButton.addEventListener('click', () => {
    //     console.log("Botón de consultar evento futuro presionado.");
    //     futureEventForm.style.display = 'flex';
    // });

    confirmFutureEventButton.addEventListener('click', () => {
        const selectedDate = futureDateInput.value;
        //const selectedTime = futureTimeInput.value;

        if (selectedDate) {
            console.log("Fecha seleccionada:", selectedDate);
            //console.log("Hora seleccionada:", selectedTime);

            futureEventForm.style.display = 'none';
            getFutureEvent(selectedDate); //selectedTime);
        } else {
            alert("Por favor selecciona una fecha y hora.");
        }
    });

    // Función para obtener el evento actual
    function getCurrentEvent() {
        const now = new Date().toISOString();
        console.log("Obteniendo eventos a partir de:", now);

        if (!gapi.client || !gapi.client.calendar) {
            console.error("API de Google Calendar no cargada.");
            return;
        }

        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            'timeMin': now,
            'maxResults': 1,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            const event = response.result.items[0];
            if (event) {
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
                window.location.href = "Zzz.html";
                console.log("No hay eventos disponibles en este momento.");
            }
        }).catch(function (error) {
            console.error("Error al obtener el evento:", error);
        });
    }

    // Función para consultar eventos futuros
    /*
    function getFutureEvent(date, time) {
        const selectedDateTime = new Date(`${date}T${time}:00`).toISOString();
        const endDateTime = new Date(new Date(selectedDateTime).getTime() + (60 * 60 * 1000)).toISOString();

        console.log("Obteniendo eventos entre:", selectedDateTime, "y", endDateTime);

        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            'timeMin': selectedDateTime,
            'timeMax': endDateTime,
            //'maxResults': 5, 
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            const event = response.result.items[0];
            if (event) {
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
                window.location.href = "Zzz.html";
                 console.log("No hay eventos disponibles en este momento.");
             }
         }).catch(function (error) {
             console.error("Error al obtener el evento:", error);
         });
     }
    */
    

     /*
    function getFutureEvent(date) {
        // Establece el inicio y fin del día en UTC
        const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
        const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
    
        console.log("Obteniendo eventos del día:", date);
    
        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            'timeMin': timeMin,
            'timeMax': timeMax,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            const events = response.result.items;
            console.log("Respuesta completa de eventos:", response);
            if (events && events.length > 0) {
                // Construye un mensaje con los nombres y duración de cada evento
                let eventDetails = "";
                events.forEach(event => {
                    const eventTitle = event.summary;
                    const startTime = new Date(event.start.dateTime || event.start.date);
                    const endTime = new Date(event.end.dateTime || event.end.date);
                    
                    // Formateamos las horas de inicio y fin
                    const startHour = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endHour = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    eventDetails += `${eventTitle}: desde las ${startHour} a las ${endHour}\n`;
                    
                });
                
                // Crea el h1 con los detalles de los eventos
                const h1Element = document.createElement('h1');
                h1Element.textContent = eventDetails;
                document.body.appendChild(h1Element);
            } else {
                console.log("No hay eventos disponibles para esta fecha.");
                const h1Element = document.createElement('h1');
                h1Element.textContent = "No hay eventos disponibles para esta fecha.";
                document.body.appendChild(h1Element);
            }
        }).catch(function (error) {
            console.error("Error al obtener los eventos:", error);
        });
    }
    */

    function getFutureEvent(date) {
        // Establece el inicio y fin del día en UTC
        const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
        const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
    
        console.log("Obteniendo eventos del día:", date);
    
        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            'timeMin': timeMin,
            'timeMax': timeMax,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            const events = response.result.items;
    
            // Muestra toda la respuesta de eventos en la consola
            console.log("Respuesta completa de eventos:", response);
    
            if (events && events.length > 0) {
                // Ordena los eventos según la cantidad y genera el texto para cada evento
                let eventDetails = "";
                events.forEach((event, index) => {
                    const eventTitle = event.summary;
                    const startTime = new Date(event.start.dateTime || event.start.date);
                    const endTime = new Date(event.end.dateTime || event.end.date);
    
                    const startHour = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endHour = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                    eventDetails += `Evento ${index + 1}: ${eventTitle} - desde las ${startHour} a las ${endHour}\n`;
                });
    
                // Guarda los detalles de eventos en localStorage para usarlos en la otra página
                localStorage.setItem("eventDetails", eventDetails);
    
                // Redirecciona según la cantidad de eventos
                if (events.length === 1) {
                    window.location.href = "un-evento.html";
                } else if (events.length === 2) {
                    window.location.href = "dos-eventos.html";
                } else if (events.length >= 3) {
                    window.location.href = "tres-eventos.html";
                }
            } else {
                console.log("No hay eventos disponibles para esta fecha.");
                const h1Element = document.createElement('h1');
                h1Element.textContent = "No hay eventos disponibles para esta fecha.";
                document.body.appendChild(h1Element);
            }
        }).catch(function (error) {
            console.error("Error al obtener los eventos:", error);
        });
    }
    
    


    }
);





