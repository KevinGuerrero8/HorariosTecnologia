# Horarios Domicity

Sistema de consulta de horarios por área para Domicity.

## Estructura del proyecto

```
/
├── index.html          ← Página principal (login + selector de área)
├── evento.html         ← Detalle del evento actual (una persona)
├── eventos.html        ← Lista de eventos para una fecha específica
│
└── assets/
    ├── css/
    │   └── styles.css  ← Todos los estilos
    ├── js/
    │   └── script.js   ← Lógica principal (Google Calendar API)
    └── img/
        ├── logo_domicity.png
        ├── fondo.jpeg
        ├── Icono_Wa.webp
        ├── team_Tecnologia.png
        ├── team_CallCenter.png
        ├── Avatar_Kevin.png
        ├── Avatar_Benyy.png
        ├── Avatar_Lizeth.png
        ├── Avatar_Jhonatan.png
        ├── Avatar_Juan.png
        ├── Avatar_Deiver.png
        └── Avatar_Zzz.png
```

## Archivos que puedes borrar (ya no se usan)

- `kevin.html`   → reemplazado por evento.html
- `lizeth.html`  → reemplazado por evento.html
- `benyy.html`   → reemplazado por evento.html
- `Zzz.html`     → reemplazado por evento.html
- `styles.css`   (raíz) → movido a assets/css/styles.css
- `script.js`    (raíz) → movido a assets/js/script.js
- `json.json`    → solo era un ejemplo de respuesta, no se usa

## Cambios realizados

1. **Estructura de carpetas** — assets/css, assets/js, assets/img
2. **Horarios Domicity** — Nombre central cambiado; selector de área intacto
3. **Nuevo evento "Disponible"** — Agregado para Kevin y Benyy (en evento.html y eventos.html)
4. **Lizeth → Call Center** — Removida de Tecnología, solo aparece en el calendario de Call Center
5. **Diseño moderno** — Light mode con tipografía DM Serif/DM Sans, orbs animados, cards, badges de estado
