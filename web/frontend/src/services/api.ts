const API_URL = 'http://localhost:3001/api';

export interface IPFSStats {
  repoSize: number;
  numPeers: number;
  bandwidthUp: number;
  bandwidthDown: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface Key {
  id: string;
  name: string;
  type: 'private' | 'ipns';
  content: string;
  created: string;
}

export const api = {
  ipfs: {
    getStats: async (): Promise<IPFSStats> => {
      const response = await fetch(`${API_URL}/ipfs/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch IPFS stats');
      }
      return response.json();
    }
  },
  
  keys: {
    getAll: async (): Promise<Key[]> => {
      const response = await fetch(`${API_URL}/keys`);
      if (!response.ok) {
        throw new Error('Failed to fetch keys');
      }
      return response.json();
    },
    
    create: async (key: Omit<Key, 'id' | 'created'>) => {
      const response = await fetch(`${API_URL}/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(key)
      });
      if (!response.ok) {
        throw new Error('Failed to create key');
      }
      return response.json();
    },
    
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/keys/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete key');
      }
    }
  }
}; 