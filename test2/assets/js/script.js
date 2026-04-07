document.addEventListener('DOMContentLoaded', function () {

    let calendarId = '';

    // Default date to today
    const today = new Date();
    document.getElementById('future-date').value = today.toLocaleDateString('en-CA');

    const CLIENT_ID = '766595118524-qvmr87csv5megphl7bssa4goa7l4nvva.apps.googleusercontent.com';
    let tokenClient;
    let isAuthorized = false;
    let gapiInitialized = false;

    // DOM elements
    const authSection        = document.getElementById('auth-section');
    const departmentSelector = document.getElementById('department-selector');
    const querySection       = document.getElementById('query-section');
    const authorizeButton    = document.getElementById('authorize-button');
    const eventButton        = document.getElementById('event-button');
    const futureDateInput    = document.getElementById('future-date');
    const confirmFutureBtn   = document.getElementById('confirm-future-event');
    const eventTecnologia    = document.getElementById('departament-tecnologia');
    const eventCallCenter    = document.getElementById('departament-callcenter');
    const backToDeptBtn      = document.getElementById('back-to-dept');

    // ── Restore step if returning from evento/eventos ──────────
    const restoreStep = sessionStorage.getItem('restoreStep');
    const savedCalendar = sessionStorage.getItem('savedCalendarId');

    if (restoreStep === 'query' && savedCalendar) {
        // User was already authorized — skip login and dept steps
        calendarId = savedCalendar;
        isAuthorized = true;
        authSection.style.display = 'none';
        departmentSelector.style.display = 'none';
        querySection.style.display = '';
        sessionStorage.removeItem('restoreStep');
        // Re-init gapi silently
        initGapi();
    } else if (restoreStep === 'dept') {
        isAuthorized = true;
        authSection.style.display = 'none';
        departmentSelector.style.display = '';
        querySection.style.display = 'none';
        sessionStorage.removeItem('restoreStep');
        initGapi();
    }

    // ── Auth ───────────────────────────────────────────────────
    authorizeButton.addEventListener('click', () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly',
            callback: handleAuthResult
        });
        tokenClient.requestAccessToken();
    });

    function handleAuthResult(response) {
        if (response.error) { console.error('Auth error:', response.error); return; }
        isAuthorized = true;
        authSection.style.display = 'none';
        departmentSelector.style.display = '';
        initGapi();
    }

    function initGapi() {
        gapi.load('client', () => {
            gapi.client.init({
                apiKey: 'AIzaSyBuPR18yplFLf6lsJxoK3TK22E7ZWwyFfM',
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
            }).then(() => { gapiInitialized = true; })
              .catch(err => console.error("GAPI init error:", err));
        });
    }

    // ── Department selection ───────────────────────────────────
    function showQuery() {
        departmentSelector.style.display = 'none';
        querySection.style.display = '';
        sessionStorage.setItem('savedCalendarId', calendarId);
    }

    eventTecnologia.addEventListener('click', () => {
        calendarId = 'c_a07edaea67f222d0c08a898c47cec711600c611fcf518be7fb813c6e612dbf9a@group.calendar.google.com';
        showQuery();
    });

    eventCallCenter.addEventListener('click', () => {
        calendarId = 'c_a2f10afd1ec87fd3e5c489e3a8a18c548a151b14727e80e18a7ad04d086a6b7b@group.calendar.google.com';
        showQuery();
    });

    // Back to dept from query
    if (backToDeptBtn) {
        backToDeptBtn.addEventListener('click', () => {
            querySection.style.display = 'none';
            departmentSelector.style.display = '';
        });
    }

    // ── Current event ──────────────────────────────────────────
    eventButton.addEventListener('click', () => {
        if (!isAuthorized || !gapiInitialized) return;
        const now = new Date();
        const tMin = new Date(now); tMin.setMinutes(now.getMinutes() - 1);
        const tMax = new Date(now); tMax.setMinutes(now.getMinutes() + 1);

        gapi.client.calendar.events.list({
            calendarId, singleEvents: true, orderBy: 'startTime', maxResults: 1,
            timeMin: tMin.toISOString(), timeMax: tMax.toISOString()
        }).then(res => {
            const ev = res.result.items[0];
            localStorage.setItem('eventTitle', ev ? ev.summary : 'default');
            window.location.href = 'evento.html';
        }).catch(err => console.error("Error evento actual:", err));
    });

    // ── Future / date event ────────────────────────────────────
    confirmFutureBtn.addEventListener('click', () => {
        const date = futureDateInput.value;
        if (!date) { alert("Por favor selecciona una fecha."); return; }
        getFutureEvent(date);
    });

    function getFutureEvent(date) {
        const startDate = new Date(`${date}T05:00:00.000Z`);
        const endDate   = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        gapi.client.calendar.events.list({
            calendarId, singleEvents: true, orderBy: 'startTime',
            timeMin: startDate.toISOString(), timeMax: endDate.toISOString()
        }).then(res => {
            const events = res.result.items;

            const filtered = events.filter(ev => {
                const d = new Date(ev.start.dateTime || ev.start.date)
                    .toLocaleString("es-CO", { timeZone:"America/Bogota", year:'numeric', month:'2-digit', day:'2-digit' })
                    .split('/').reverse().join('-');
                return d === date;
            });

            const details = filtered.map(ev => {
                const s = new Date(ev.start.dateTime || ev.start.date);
                const e = new Date(ev.end.dateTime   || ev.end.date);
                return {
                    title: ev.summary,
                    start: s.toLocaleString("es-CO", { timeZone:"America/Bogota", hour:'2-digit', minute:'2-digit', hour12:true }),
                    end:   e.toLocaleString("es-CO", { timeZone:"America/Bogota", hour:'2-digit', minute:'2-digit', hour12:true })
                };
            });

            localStorage.setItem("eventDetails", JSON.stringify(details));
            localStorage.setItem("selectedDate", date);

            window.location.href = filtered.length > 0 ? "eventos.html" : "evento.html";
            if (filtered.length === 0) localStorage.setItem('eventTitle', 'default');

        }).catch(err => console.error("Error eventos futuros:", err));
    }
});
