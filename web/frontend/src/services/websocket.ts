type MessageCallback = (data: string, type: 'output' | 'error') => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private messageCallback: MessageCallback | null = null;

  connect() {
    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (this.messageCallback) {
          this.messageCallback(data, type);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      // Попытка переподключения через 5 секунд
      setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendCommand(command: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ command }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(callback: MessageCallback) {
    this.messageCallback = callback;
  }
}

export const websocketService = new WebSocketService(); 