# ConVozJugator · SILABOS

Juego de conjugación verbal por voz, migrado a **React + Vite** y vestido con la
identidad visual neón de SILABOS.

## Cómo arrancar

```bash
npm install     # instala dependencias (necesita conexión a internet)
npm run dev     # abre el servidor de desarrollo en http://localhost:5173
```

Para compilar de cara a producción:

```bash
npm run build   # genera la carpeta dist/
npm run preview # sirve la build para revisarla en local
```

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores cuando lleguemos a la Fase 4
(chat con IA). El `.env` está en `.gitignore` y **nunca** se sube al repositorio.

## Estado: FASE 3 — Juego (completada)

App navegable entre las 4 pantallas, con la identidad SILABOS aplicada:

- ✅ Estructura React + Vite, JavaScript/JSX
- ✅ Tokens arcade (paleta neón heredada + Orbitron para marcador/títulos, DM Sans para texto)
- ✅ Fondo de rejilla synthwave (estática, ligera en móvil)
- ✅ Sello SILABOS (insignia de Orión discreta al pie): el guiño de marca
- ✅ Dock de navegación arcade + micrófono protagonista en Juego
- ✅ 4 pantallas con identidad visual (Inicio funcional; Ajustes, Juego y Chat
      como maquetas a la espera de su lógica)

- ✅ **Fase 2**: Ajustes funcional — selección de verbos y tiempos, toggle de voz,
      bloqueados con candado (desbloqueo por progreso pendiente de Fase 3), y
      persistencia de la selección entre sesiones (localStorage).

- ✅ **Fase 3**: Juego funcional — motor de preguntas (verbo+pronombre+tiempo al
      azar), reconocimiento de voz (Chrome/Edge/Android), TTS para "Escuchar",
      verificación tolerante a tildes, puntos (voz +1, escrito 0), rachas
      visuales, insignias y desbloqueo escalonado de verbos/tiempos. Todo persiste.

## Próximas fases

- **Fase 4 — Chat + extras**: integración con IA (Gemini ahora, Claude después,
  vía función serverless), modales, sonidos, estado persistente.

## Estructura

```
src/
  components/   Starfield, Insignia, Logo, Dock
  screens/      HomeScreen, GameScreen, ChatScreen, SettingsScreen
  styles/       tokens.js (paleta/fuentes), global.css (animaciones)
  data/         (vacío — el diccionario de conjugaciones llega en Fase 3)
  hooks/        (vacío — hooks de voz/estado en fases siguientes)
  App.jsx       orquesta pantallas + fondo + dock
  main.jsx      punto de entrada
```

## Nota técnica

El diccionario de conjugaciones del HTML original (cientos de verbos) y la
lógica de voz se incorporarán en la Fase 3, en `src/data/` y `src/hooks/`
respectivamente. El bug latente del HTML original (referencia a un `hint-btn`
inexistente) no se ha portado: el botón de pista se reconstruirá correctamente.
