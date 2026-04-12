import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Change this to match your actual backend URL when deploying
const SOCKET_URL = 'https://smartcomplaintsystem-qfgg.onrender.com/ws';

class WebSocketClient {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(userId, onNoticeReceived, onComplaintsUpdated) {
    if (this.connected) return;

    // 1. Create the STOMP Client over SockJS
    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      debug: (str) => console.log('STOMP: ' + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 2. What happens when we successfully connect
    this.client.onConnect = () => {
      this.connected = true;
      console.log('✅ Connected to Live Server!');

      // A. Subscribe to Personal Alerts (Notifications)
      if (userId) {
        this.client.subscribe(`/topic/alerts/${userId}`, (message) => {
          if (message.body) {
            const notice = JSON.parse(message.body);
            onNoticeReceived(notice); // Pass the new notice back to the React component
          }
        });
      }

      // B. Subscribe to the Global Complaints Grid (For Admin/Overview updates)
      if (onComplaintsUpdated) {
        this.client.subscribe('/topic/admin/complaints', () => {
          // Whenever ANY complaint changes, tell React to fetch the fresh list
          onComplaintsUpdated(); 
        });
      }
    };

    // 3. Handle Disconnects
    this.client.onStompError = (frame) => {
      console.error('STOMP Error:', frame.headers['message']);
    };

    this.client.onWebSocketClose = () => {
      this.connected = false;
      console.log('❌ Disconnected from Live Server.');
    };

    // 4. Start the connection!
    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }
}

// Export a single instance to use across the app
export const wsClient = new WebSocketClient();