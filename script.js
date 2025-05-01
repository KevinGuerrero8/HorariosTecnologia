// Esperar hasta que el DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-CA'); // El formato 'en-CA' da el formato YYYY-MM-DD
    document.getElementById('future-date').value = formattedDate;
    console.log("Horale" + "-" + today + "-" +formattedDate);
    

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
            console.log("llega");
            
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

            //futureEventForm.style.display = 'none';
            getFutureEvent(selectedDate); //selectedTime);
        } else {
            alert("Por favor selecciona una fecha y hora.");
        }
    });

    function getCurrentEvent() {
        const now = new Date(); // Hora actual
        const timeMin = new Date(now);
        timeMin.setMinutes(now.getMinutes() - 1); // Un minuto antes de la hora actual
        const timeMax = new Date(now);
        timeMax.setMinutes(now.getMinutes() + 1); // Un minuto después de la hora actual
    
        console.log("Obteniendo eventos entre:", timeMin.toISOString(), "y", timeMax.toISOString());
    
        if (!gapi.client || !gapi.client.calendar) {
            console.error("API de Google Calendar no cargada. No se puede obtener el evento.");
            return;
        }
    
        gapi.client.calendar.events.list({
            'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
            //'calendarId': 'c_5de49617d4b9df985084426fde2b7622b8e7daf4a1e0c6e9e0db3179b9f46ea4@group.calendar.google.com',
            'timeMin': timeMin.toISOString(),
            'timeMax': timeMax.toISOString(),
            'maxResults': 1,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            const event = response.result.items[0];
            console.log("Respuesta completa de eventos actual:", response);
    
            if (event) {
                const eventTitle = event.summary;
                
                // Redirige según el título del evento
                if (event) {
                    const eventTitle = event.summary;
                    localStorage.setItem('eventTitle', eventTitle);
                    window.location.href = "evento.html";
                }/*
                if (eventTitle.includes("Kevin")) {
                    window.location.href = "kevin.html";
                } else if (eventTitle.includes("Lizeth")) {
                    window.location.href = "lizeth.html";
                } else if (eventTitle.includes("Benyy")) {
                    window.location.href = "benyy.html";
                } else {
                    window.location.href = "Zzz.html";
                }
            } */else {
                window.location.href = "Zzz.html";
                console.log("No hay eventos disponibles en este momento.");
            }
        }
        }).catch(function (error) {
            console.error("Error al obtener el evento:", error);
        });
    }
    
    function getFutureEvent(date) {
        // Crear fecha inicial y final usando la zona horaria de Colombia (-5)
        const startDate = new Date(`${date}T05:00:00.000Z`); // 00:00 hora Colombia
        const endDate = new Date(`${date}T04:59:59.999Z`).setDate(startDate.getUTCDate() + 1); // 23:59 hora Colombia
            
        const timeMin = startDate.toISOString();
        const timeMax = new Date(endDate).toISOString();
            
           gapi.client.calendar.events.list({
                'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
                'timeMin': timeMin,
                'timeMax': timeMax,
                'singleEvents': true,
                'orderBy': 'startTime'
            }).then(function (response) {
                const events = response.result.items;               
                
                // Depurar cada evento encontrado
                events.forEach(event => {
                    console.log("Evento encontrado:");
                    console.log("- Título:", event.summary);
                    console.log("- Inicio (original):", event.start.dateTime || event.start.date);
                    console.log("- Inicio (Colombia):", new Date(event.start.dateTime || event.start.date)
                        .toLocaleString("es-CO", {timeZone: "America/Bogota"}));
                    console.log("- Fin (original):", event.end.dateTime || event.end.date);
                    console.log("- Fin (Colombia):", new Date(event.end.dateTime || event.end.date)
                        .toLocaleString("es-CO", {timeZone: "America/Bogota"}));
                });
                
                // Filtrar eventos que realmente pertenecen al día seleccionado en zona horaria Colombia
                const filteredEvents = events.filter(event => {
                    const eventStart = new Date(event.start.dateTime || event.start.date);
                    const eventDate = eventStart.toLocaleString("es-CO", {
                        timeZone: "America/Bogota",
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).split('/').reverse().join('-');
                    console.log("Fecha del evento en Colombia:", eventDate);
                    console.log("¿Coincide con fecha seleccionada?", eventDate === date);
                    return eventDate === date;
                });
                
                const eventDetails = filteredEvents.map((event) => {
                    const eventTitle = event.summary;
                    const eventDescription = event.description;
                    const startTime = new Date(event.start.dateTime || event.start.date);
                    const endTime = new Date(event.end.dateTime || event.end.date);
        
                    return {
                        title: eventTitle,
                        description: eventDescription,
                        start: startTime.toLocaleString("es-CO", {
                            timeZone: "America/Bogota",
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                        end: endTime.toLocaleString("es-CO", {
                            timeZone: "America/Bogota",
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    };
                });
        
                // Guardar los eventos filtrados
                localStorage.setItem("eventDetails", JSON.stringify(eventDetails));
                localStorage.setItem("selectedDate", date);
                localStorage.setItem("filteredEvents", filteredEvents);
                

                // Obtener la hora actual en Colombia
                const currentTime = new Date().toLocaleString("es-CO", {timeZone: "America/Bogota"});
                const currentHour = new Date(currentTime).getHours();

                // Redireccionar basado en los eventos filtrados
                if (filteredEvents.length > 0) {
                    window.location.href = "eventos.html";
                } else if (currentHour >= 7 && currentHour < 22) { // Si la hora está entre las 7:00 AM y las 10:00 PM
                    window.location.href = "kevin.html";
                } else {
                    window.location.href = "Zzz.html";
                    console.log(event);
                }

        
                // // Redireccionar basado en los eventos filtrados
                // if (filteredEvents.length > 0) {
                //     window.location.href = "eventos.html";
                // } else if (eventDetails.eventTitle.includes("Kevin")) {
                //     window.location.href = "kevin.html";
                // } else {
                //     window.location.href = "Zzz.html";
                //     console.log(event);  
                // }
            }).catch(function (error) {
                console.error("Error al obtener los eventos:", error);
            });
        }
});





