document.addEventListener('DOMContentLoaded', function () {

    let calendarId = '';

    // Set default date to today
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-CA');
    document.getElementById('future-date').value = formattedDate;

    const CLIENT_ID = '766595118524-qvmr87csv5megphl7bssa4goa7l4nvva.apps.googleusercontent.com';
    let tokenClient;
    let isAuthorized = false;
    let gapiInitialized = false;

    // DOM elements
    const authorizeButton      = document.getElementById('authorize-button');
    const eventButton          = document.getElementById('event-button');
    const futureDateInput      = document.getElementById('future-date');
    const confirmFutureButton  = document.getElementById('confirm-future-event');
    const departmentSelector   = document.getElementById('department-selector');
    const querySection         = document.getElementById('query-section');
    const authSection          = document.getElementById('auth-section');
    const eventTecnologia      = document.getElementById('departament-tecnologia');
    const eventCallCenter      = document.getElementById('departament-callcenter');

    // Auth button
    authorizeButton.addEventListener('click', () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: handleAuthResult
        });
        tokenClient.requestAccessToken();
    });

    function handleAuthResult(response) {
        if (response.error) {
            console.error('Error en la autorización:', response.error);
            return;
        }

        isAuthorized = true;
        authSection.style.display = 'none';
        departmentSelector.style.display = '';
        initClient();
    }

    function initClient() {
        gapi.load('client', () => {
            gapi.client.init({
                apiKey: 'AIzaSyBuPR18yplFLf6lsJxoK3TK22E7ZWwyFfM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
            }).then(() => {
                gapiInitialized = true;
            }).catch(err => {
                console.error("Error al inicializar la API:", err);
            });
        });
    }

    function mostrarConsulta() {
        departmentSelector.style.display = 'none';
        querySection.style.display = '';
    }

    eventTecnologia.addEventListener('click', () => {
        // Tecnología calendar — Lizeth is NO LONGER here
        calendarId = 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com';
        mostrarConsulta();
    });

    eventCallCenter.addEventListener('click', () => {
        // Call Center calendar — Lizeth is now here
        calendarId = 'c_a2f10afd1ec87fd3e5c489e3a8a18c548a151b14727e80e18a7ad04d086a6b7b@group.calendar.google.com';
        mostrarConsulta();
    });

    eventButton.addEventListener('click', () => {
        if (isAuthorized && gapiInitialized) {
            getCurrentEvent();
        }
    });

    confirmFutureButton.addEventListener('click', () => {
        const selectedDate = futureDateInput.value;
        if (selectedDate) {
            getFutureEvent(selectedDate);
        } else {
            alert("Por favor selecciona una fecha.");
        }
    });

    // ─── Current event ────────────────────────────────────────────────────────

    function getCurrentEvent() {
        const now = new Date();
        const timeMin = new Date(now);
        timeMin.setMinutes(now.getMinutes() - 1);
        const timeMax = new Date(now);
        timeMax.setMinutes(now.getMinutes() + 1);

        if (!gapi.client || !gapi.client.calendar) {
            console.error("API de Google Calendar no disponible.");
            return;
        }

        gapi.client.calendar.events.list({
            calendarId,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            maxResults: 1,
            singleEvents: true,
            orderBy: 'startTime'
        }).then(response => {
            const event = response.result.items[0];
            if (event) {
                localStorage.setItem('eventTitle', event.summary);
                window.location.href = "evento.html";
            } else {
                localStorage.setItem('eventTitle', 'default');
                window.location.href = "evento.html";
            }
        }).catch(err => {
            console.error("Error al obtener el evento actual:", err);
        });
    }

    // ─── Future / date event ──────────────────────────────────────────────────

    function getFutureEvent(date) {
        const startDate = new Date(`${date}T05:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        gapi.client.calendar.events.list({
            calendarId,
            timeMin: startDate.toISOString(),
            timeMax: endDate.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        }).then(response => {
            const events = response.result.items;

            // Filter events to the selected date in Bogotá timezone
            const filteredEvents = events.filter(event => {
                const eventStart = new Date(event.start.dateTime || event.start.date);
                const eventDate = eventStart.toLocaleString("es-CO", {
                    timeZone: "America/Bogota",
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('/').reverse().join('-');
                return eventDate === date;
            });

            const eventDetails = filteredEvents.map(event => {
                const startTime = new Date(event.start.dateTime || event.start.date);
                const endTime   = new Date(event.end.dateTime   || event.end.date);

                return {
                    title: event.summary,
                    description: event.description || "",
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

            localStorage.setItem("eventDetails", JSON.stringify(eventDetails));
            localStorage.setItem("selectedDate", date);

            if (filteredEvents.length > 0) {
                window.location.href = "eventos.html";
            } else {
                localStorage.setItem('eventTitle', 'default');
                window.location.href = "evento.html";
            }
        }).catch(err => {
            console.error("Error al obtener los eventos:", err);
        });
    }
});
