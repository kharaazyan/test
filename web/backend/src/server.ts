import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import path from 'path';
import { Server } from 'http';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// CLI путь относительно корня проекта
const CLI_PATH = path.join(__dirname, '../../../CLI-NetSecTool');

// REST API endpoints
app.get('/api/ipfs/stats', async (req, res) => {
  try {
    // Здесь будет реальная логика получения статистики IPFS
    const mockStats = {
      repoSize: 1024 * 1024 * 500,
      numPeers: 25,
      bandwidthUp: 1024 * 1024 * 2,
      bandwidthDown: 1024 * 1024 * 3,
      cpuUsage: 35,
      memoryUsage: 45
    };
    res.json(mockStats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IPFS stats' });
  }
});

app.get('/api/keys', async (req, res) => {
  try {
    // Здесь будет реальная логика получения ключей
    const mockKeys = [
      {
        id: 'key_1',
        name: 'private_key.pem',
        type: 'private',
        content: '-----BEGIN PRIVATE KEY-----\n[Encrypted Content]\n-----END PRIVATE KEY-----',
        created: '2024-03-20T10:00:00Z'
      },
      {
        id: 'key_2',
        name: 'ipns_key.txt',
        type: 'ipns',
        content: 'k51qzi5uqu5dkknju17wd8pj8q99fbn99pqm0750rm6qq0jrre1tt8yf648pz2',
        created: '2024-03-20T10:00:00Z'
      }
    ];
    res.json(mockKeys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch keys' });
  }
});

// Запуск HTTP сервера
const server = new Server(app);

// Настройка WebSocket сервера
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Создаем процесс CLI при подключении
  const cli = spawn('./CLI-NetSecTool', [], { cwd: CLI_PATH });

  // Отправляем вывод CLI клиенту
  cli.stdout.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
  });

  cli.stderr.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'error', data: data.toString() }));
  });

  // Обрабатываем команды от клиента
  ws.on('message', (message) => {
    try {
      const { command } = JSON.parse(message.toString());
      cli.stdin.write(command + '\n');
    } catch (error) {
      console.error('Failed to process command:', error);
    }
  });

  // Очистка при отключении
  ws.on('close', () => {
    console.log('Client disconnected');
    cli.kill();
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 