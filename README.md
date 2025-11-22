# SyncStream Pro 🍿

**SyncStream Pro** is a full-stack Chrome Extension that enables real-time video synchronization between multiple users ("Watch Party"). 
It allows friends to watch movies or videos together remotely, ensuring that Play, Pause, and Seek events happen simultaneously for everyone in the room.

## 🚀 Features

- **Real-Time Synchronization:** Uses WebSockets for low-latency bidirectional communication.
- **Universal Support:** Works on YouTube, Netflix, and most HTML5 video players (e.g., anime/movie streaming sites).
- **Tab Isolation:** Smart state management allows users to be in different rooms in different tabs simultaneously.
- **Auto-Reconnection:** Robust error handling and connection recovery logic.
- **Dark Mode UI:** sleek, user-friendly popup interface.

## 🛠 Tech Stack

**Backend:**
- **Python** (3.13+)
- **FastAPI** (High-performance Async Framework)
- **WebSockets** (Real-time event handling)
- **Uvicorn** (ASGI Server)

**Frontend (Extension):**
- **JavaScript (ES6+)**
- **Chrome Extension API** (Manifest V3)
- **HTML5 & CSS3**

**DevOps & Tools:**
- **Ngrok** (Secure tunneling for local development)
- **Git**
==============================================================================================

## 🟢 Part 1: Installation (For Friends / Viewers)
*If you just want to join a watch party, read this section.*

1.  **Get the Extension:** Download the `SyncStream` ZIP file from the host.
2.  **Extract:** Right-click the ZIP and select **"Extract All"**. You must have a normal folder.
3.  **Open Chrome Extensions:**
    * Open Google Chrome.
    * Type `chrome://extensions` in the address bar and press Enter.
4.  **Enable Developer Mode:**
    * Switch on **"Developer mode"** (top-right corner).
5.  **Load the Extension:**
    * Click **"Load unpacked"**.
    * Select the folder you extracted in step 2.
    * Done! The 🍿 icon should appear.

## 🔴 Part 2: Server Setup (For Developers / Hosting Only)
*Read this ONLY if you want to host your own server. Friends do NOT need to do this.*

### Prerequisites
* Python 3.10+
* Ngrok (for public access)

### 📂 Project Structure
The project is divided into two folders:
* `/server`: Contains the Python Backend (`main.py`).
* `/extension`: Contains the Chrome Extension files.

### 🚀 How to Run the Server
You need to open **two** terminal windows.

**Window 1: The Backend**
Navigate to the server folder and run the app:
`cd server
uvicorn main:app --reload`

Window 2: The Tunnel (Ngrok) Expose port 8000 to the internet:

# If you have a static domain (Recommended):
ngrok http --domain=your-domain-name.ngrok-free.app 8000

# OR if you are using a random domain:
ngrok http 8000
Important Configuration: After Ngrok gives you a forwarding address (e.g., https://random.ngrok-free.app), you must update the extension code:

*Open extension/content.js.
*Find the WebSocket line and update it: ws = new WebSocket('wss://your-ngrok-address.ngrok-free.app/ws/' + roomId);
*Save the file and reload the extension in Chrome.

🎮 **Part 3: How to Use (Everyone)**:
*Open a Video: Go to YouTube, Netflix, or your favorite streaming site.
*Open the Extension: Click the SyncStream icon (🍿).

Connect:
*Enter a room name (e.g., movie_night).
*Click CONNECT.

Sync: When the status is Green, hitting Play/Pause will sync for everyone in the room!







