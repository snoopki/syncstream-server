**Purpose**: Brief, actionable guidance for AI coding agents working on SyncStream.

- **Project root:** `.`
- **Main components:** `server/` (FastAPI WebSocket server), `extension/` (browser/VS Code extension code — currently empty)

**Big Picture**:
- `server/main.py` implements a lightweight WebSocket broadcast server using FastAPI.
- Clients connect to the single WebSocket endpoint: `/ws` and send short text messages representing playback events (Play / Pause / Time). The server rebroadcasts received text messages to all other connected clients.
- There is no persistence, auth, or message schema enforcement in the codebase — messages are plain UTF-8 text and the server intentionally avoids echoing a sender's message back to them.

**Key files to inspect**:
- `server/main.py` — ConnectionManager class, `connect`, `disconnect`, and `broadcast` logic; websocket route is `@app.websocket("/ws")`.
- `extension/` — integration point: clients/extensions are expected to implement a WebSocket client that connects to `/ws`. (Folder is currently empty.)

**Important patterns & conventions (do not break these)**
- Use the existing `ConnectionManager` pattern for tracking connections. It stores `active_connections: List[WebSocket]` and appends/removes connections directly.
- Broadcasting must skip the sender to avoid infinite loops. See `ConnectionManager.broadcast(message, sender)` for the exact behavior.
- Messages are plain text; code and comments reference Play/Pause/Time events — continue treating messages as simple strings unless adding a clear, global message schema and migration.
- Logging is done via `print()` statements. If you replace them with structured logging, do so project-wide and keep output readable during development.
- Comments and a few inline notes are in Hebrew — preserve context if editing those lines.

**Developer workflows / run commands**
- To run the server locally (recommended):

```
python -m pip install fastapi uvicorn
python -m uvicorn server.main:app --reload --host 127.0.0.1 --port 8000
```

- The WebSocket endpoint will then be available at `ws://127.0.0.1:8000/ws`.
- Tests: none present. If adding tests, place them under a `tests/` directory and use `pytest`.

**Integration points / external dependencies**
- Runtime dependency: `fastapi` and an ASGI server (e.g., `uvicorn`).
- External integration: any browser extension or client that connects to `/ws` over WebSocket and exchanges plaintext playback events.

**When making changes, prefer small, observable steps**
- Maintain the single `/ws` endpoint unless adding a clear reasoned design for multiple channels.
- If introducing a message schema (JSON payloads), add a migration plan and keep backwards compatibility or a versioned endpoint.
- If adding authentication or origin checks, document the change and update `extension/` clients accordingly.

**Examples from codebase**
- Broadcast loop (do not change semantic behavior):

```
for connection in self.active_connections:
    if connection != sender:
        await connection.send_text(message)
```

**Helpful next steps for contributors**
- If you need to add a client, implement a WebSocket client that connects to `/ws` and sends/receives plain text playback commands.
- Add a `requirements.txt` if you intend to lock dependencies for CI or reproducible setup.

If any section is unclear or you want the doc to include CI/test/run examples for a specific environment, tell me which environment and I'll iterate.
