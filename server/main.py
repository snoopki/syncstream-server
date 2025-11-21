from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        # מילון: המפתח הוא שם החדר, הערך הוא רשימת המחוברים לחדר
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)
        print(f"User connected to room: {room_id}")

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]: # אם החדר ריק, נמחק אותו
                del self.rooms[room_id]
        print(f"User disconnected from room: {room_id}")

    async def broadcast(self, message: str, sender: WebSocket, room_id: str):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                if connection != sender:
                    await connection.send_text(message)

manager = ConnectionManager()

# הכתובת השתנתה! עכשיו מקבלים גם room_id
@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            # שולח רק לאנשים באותו חדר
            await manager.broadcast(data, websocket, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)