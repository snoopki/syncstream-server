const roomIdInput = document.getElementById('roomId');
const actionBtn = document.getElementById('actionBtn');
const statusText = document.getElementById('status');
const indicator = document.getElementById('indicator');

let currentTabId = null;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTabId = tabs[0].id;
    checkConnectionStatus();
});

function checkConnectionStatus() {
    const storageKey = `room_${currentTabId}`;
    
    chrome.storage.local.get([storageKey], (result) => {
        const savedRoom = result[storageKey];
        if (savedRoom) {
            setConnectedState(savedRoom);
        } else {
            setDisconnectedState();
        }
    });
}

actionBtn.addEventListener('click', () => {
    if (!currentTabId) return;
    const storageKey = `room_${currentTabId}`;

    if (actionBtn.classList.contains('btn-disconnect')) {
        chrome.storage.local.remove(storageKey, () => {
            setDisconnectedState();
        });
    } 
    else {
        const room = roomIdInput.value.trim();
        if (!room) return;

        let data = {};
        data[storageKey] = room;

        chrome.storage.local.set(data, () => {
            setConnectedState(room);
        });
    }
});

function setConnectedState(roomName) {
    roomIdInput.value = roomName;
    roomIdInput.disabled = true;
    actionBtn.innerText = "DISCONNECT";
    actionBtn.classList.remove('btn-connect');
    actionBtn.classList.add('btn-disconnect');
    statusText.innerText = `Connected to: ${roomName}`;
    indicator.classList.remove('disconnected');
    indicator.classList.add('active');
}

function setDisconnectedState() {
    roomIdInput.disabled = false;
    actionBtn.innerText = "CONNECT & SYNC";
    actionBtn.classList.remove('btn-disconnect');
    actionBtn.classList.add('btn-connect');
    statusText.innerText = "Not connected";
    indicator.classList.remove('active');
    indicator.classList.add('disconnected');
}