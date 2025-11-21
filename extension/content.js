console.log("SyncStream Frame Loaded");

let ws = null;
let video = null;
let isRemoteEvent = false;
let currentRoom = null;
let findVideoInterval = null;
let myTabId = null; 

chrome.runtime.sendMessage({ action: "getTabId" }, (response) => {
    if (response && response.tabId) {
        myTabId = response.tabId;
        console.log("My Tab ID is:", myTabId);
        initContentScript(); 
    }
});

function initContentScript() {
    const storageKey = `room_${myTabId}`;


    chrome.storage.local.get([storageKey], (result) => {
        if (result[storageKey]) {
            startVideoScan(result[storageKey]);
        }
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (changes[storageKey]) {
                const change = changes[storageKey];
                
                if (change.newValue) {
                    console.log(`Tab ${myTabId} connecting to ${change.newValue}`);
                    startVideoScan(change.newValue);
                } 
                else if (!change.newValue) {
                    console.log(`Tab ${myTabId} disconnecting`);
                    disconnectWebSocket();
                }
            }
        }
    });
}


function startVideoScan(roomId) {
    currentRoom = roomId;
    if (ws && ws.readyState === WebSocket.OPEN && video) return;
    if (findVideoInterval) clearInterval(findVideoInterval);

    console.log("Scanning for video element...");
    if (tryConnect(roomId)) return;

    findVideoInterval = setInterval(() => {
        if (tryConnect(roomId)) {
            clearInterval(findVideoInterval);
        }
    }, 1000);
}

function tryConnect(roomId) {
    const v = document.querySelector('video');
    if (v) {
        if (v.duration && v.duration < 5) return false; 
        console.log("Video found, connecting...");
        video = v;
        connectToWebSocket(roomId);
        attachListeners();
        return true;
    }
    return false;
}

function connectToWebSocket(roomId) {
    if (ws) {
        if (ws.url.includes(roomId) && ws.readyState === WebSocket.OPEN) return;
        ws.close();
    }

    ws = new WebSocket(`wss://jaylen-skilful-curmudgeonly.ngrok-free.dev/ws/${roomId}`);

    ws.onopen = () => {
        console.log(`Connected to ${roomId}`);
        if (video) video.style.border = "2px solid #4CAF50"; 
    };

    ws.onmessage = (event) => handleMessage(event.data);
    
    ws.onclose = () => console.log("WebSocket disconnected");
}

function disconnectWebSocket() {
    if (findVideoInterval) clearInterval(findVideoInterval);
    if (ws) {
        ws.close();
        ws = null;
    }
    if (video) {
        video.style.border = "none";
        video.onplay = null;
        video.onpause = null;
        video.onseeked = null;
    }
    currentRoom = null;
}

function attachListeners() {
    if (!video) return;
    video.onplay = null;
    video.onpause = null;
    video.onseeked = null;

    video.onplay = () => sendState("PLAY");
    video.onpause = () => sendState("PAUSE");
    video.onseeked = () => sendState("SEEK:" + video.currentTime);
}

function sendState(action) {
    if (!isRemoteEvent && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(action);
    }
}

function handleMessage(message) {
    if (!video) return;
    isRemoteEvent = true;
    if (message === "PLAY") video.play().catch(e => {});
    else if (message === "PAUSE") video.pause();
    else if (message.startsWith("SEEK:")) {
        const time = parseFloat(message.split(":")[1]);
        if (Math.abs(video.currentTime - time) > 0.5) video.currentTime = time;
    }
    setTimeout(() => { isRemoteEvent = false; }, 300);
}