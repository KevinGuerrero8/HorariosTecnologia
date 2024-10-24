// Declara tu Client ID de OAuth 2.0 obtenido en la consola de Google Cloud
const CLIENT_ID = '766595118524-qvmr87csv5megphl7bssa4goa7l4nvva.apps.googleusercontent.com';
let tokenClient;
let isAuthorized = false;
let gapiInitialized = false;

// Botones
const authorizeButton = document.getElementById('authorize-button');
const eventButton = document.getElementById('event-button');

// Evento del botón de autorización
authorizeButton.addEventListener('click', () => {
    console.log("Botón de autorización presionado.");

    // Inicializa el cliente de token cuando el usuario hace clic en "Autorizar"
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',  // Permisos de lectura del calendario
        callback: handleAuthResult  // Función que se ejecutará cuando la autenticación sea exitosa
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

    // Habilitar el botón de consultar evento
    eventButton.disabled = false;
    console.log("Botón de consultar evento habilitado.");

    // Inicializa el cliente de la API de Google Calendar
    initClient();
}

// Inicializar el cliente de Google Calendar
function initClient() {
    console.log("Inicializando el cliente de la API de Google Calendar...");

    gapi.load('client', () => {
        gapi.client.init({
            apiKey: 'AIzaSyBuPR18yplFLf6lsJxoK3TK22E7ZWwyFfM',  // Reemplaza con tu API Key de la consola
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
        }).then(function () {
            console.log("Cliente de Google Calendar inicializado.");
            gapiInitialized = true; // Marca la inicialización como exitosa
        }).catch(function (error) {
            console.error("Error al inicializar el cliente:", error);
        });
    });
}

// Evento del botón para consultar el evento
eventButton.addEventListener('click', () => {
    console.log("Botón de consultar evento presionado.");

    if (isAuthorized && gapiInitialized) {
        // Si ya está autorizado y la API está inicializada, consulta el evento
        getCurrentEvent();
    } else {
        console.log("Usuario no autorizado o API de Google Calendar no inicializada. No se puede consultar el evento.");
    }
});

// Función para obtener el evento actual
function getCurrentEvent() {
    const now = new Date().toISOString();  // Convierte a formato ISO
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

            // Verificar si el evento contiene la palabra "Kevin"
            if (eventTitle.includes("Kevin")) {
                document.body.innerHTML = `
                    <div class="contenedor">
                        <div class="seccion1">
                            <h1>Horarios Tecnología</h1>
                            <p id="fecha"></p>
                            <p id="hora"></p>
                        </div>
                        <div class="seccion2">
                            <img src="Avatar2_FondoBlancor.png" alt="Avatar Kevin">
                            <h1>Kevin Guerrero</h1>
                            <p>Tecnologia2@domicity.com.co</p>
                            <div class="info">
                                <img src="Icono_Phone.png" alt="Icono phone" class="icono">
                                <p>3103325067</p>
                            </div>
                        </div>
                        <div class="calendario">
                            <label for="calendario">Selecciona una fecha y hora:</label>
                            <input type="datetime-local" id="calendario" name="calendario">
                            <button id="ver-evento">Ver evento</button>
                            <p id="evento-seleccionado"></p>
                        </div>
                    </div>
                `;

                // Actualiza la fecha y hora actual
                const fechaActual = new Date();
                const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
                const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);
                const horaFormateada = fechaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                document.getElementById('fecha').textContent = fechaFormateada;
                document.getElementById('hora').textContent = horaFormateada;

                // Captura el evento del calendario cuando se selecciona una fecha
                document.getElementById('ver-evento').addEventListener('click', function() {
                    const fechaSeleccionada = document.getElementById('calendario').value;
                    if (fechaSeleccionada) {
                        getEventForSelectedDate(fechaSeleccionada);
                    } else {
                        document.getElementById('evento-seleccionado').textContent = "Por favor selecciona una fecha y hora.";
                    }
                });
            } else {
                document.getElementById('event-title').innerText = eventTitle;
            }
        } else {
            console.log("No hay eventos disponibles en este momento.");
            document.getElementById('event-title').innerText = "No hay eventos en este momento.";
        }
    }).catch(function (error) {
        console.error("Error al obtener el evento:", error);
    });
}

// Función para obtener eventos basados en la fecha seleccionada
function getEventForSelectedDate(fechaSeleccionada) {
    console.log("Obteniendo eventos para la fecha seleccionada:", fechaSeleccionada);

    gapi.client.calendar.events.list({
        'calendarId': 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com',
        'timeMin': new Date(fechaSeleccionada).toISOString(),
        'timeMax': new Date(new Date(fechaSeleccionada).getTime() + 60 * 60 * 1000).toISOString(), // Añade 1 hora
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function (response) {
        const events = response.result.items;
        if (events.length > 0) {
            const event = events[0];
            document.getElementById('evento-seleccionado').textContent = `Evento: ${event.summary} a las ${new Date(event.start.dateTime).toLocaleTimeString()}`;
        } else {
            document.getElementById('evento-seleccionado').textContent = "No hay eventos en la fecha y hora seleccionadas.";
        }
    }).catch(function (error) {
        console.error("Error al obtener los eventos:", error);
    });
}