import { useState } from 'react'
import {
  Card,
  Title,
  Stack,
  Group,
  TextInput,
  Select,
  Badge,
  ScrollArea,
  Text,
  ActionIcon,
  Tooltip,
  Button,
} from '@mantine/core'
import { IconSearch, IconFilter, IconDownload, IconRefresh } from '@tabler/icons-react'

interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  source: string
}

const sampleLogs: LogEntry[] = [
  {
    timestamp: '2024-03-20 10:15:23',
    level: 'info',
    message: 'System startup completed successfully',
    source: 'system',
  },
  {
    timestamp: '2024-03-20 10:15:24',
    level: 'debug',
    message: 'Initializing IPFS connection...',
    source: 'ipfs',
  },
  {
    timestamp: '2024-03-20 10:15:25',
    level: 'warning',
    message: 'High memory usage detected (85%)',
    source: 'monitor',
  },
  {
    timestamp: '2024-03-20 10:15:26',
    level: 'error',
    message: 'Failed to connect to remote node: timeout',
    source: 'network',
  },
]

const getLevelColor = (level: string) => {
  switch (level) {
    case 'error':
      return 'red'
    case 'warning':
      return 'yellow'
    case 'info':
      return 'blue'
    case 'debug':
      return 'gray'
    default:
      return 'blue'
  }
}

export default function LogViewer() {
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)

  const filteredLogs = sampleLogs.filter((log) => {
    if (search && !log.message.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (level && log.level !== level) {
      return false
    }
    if (source && log.source !== source) {
      return false
    }
    return true
  })

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Title order={2}>Log Viewer</Title>
        <Group spacing="xs">
          <Tooltip label="Refresh logs">
            <ActionIcon variant="light" color="blue" size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download logs">
            <ActionIcon variant="light" color="blue" size="lg">
              <IconDownload size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Card withBorder>
        <Group spacing="md">
          <TextInput
            icon={<IconSearch size={16} />}
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            icon={<IconFilter size={16} />}
            placeholder="Log level"
            value={level}
            onChange={setLevel}
            data={[
              { value: 'error', label: 'Error' },
              { value: 'warning', label: 'Warning' },
              { value: 'info', label: 'Info' },
              { value: 'debug', label: 'Debug' },
            ]}
            style={{ width: 150 }}
          />
          <Select
            icon={<IconFilter size={16} />}
            placeholder="Source"
            value={source}
            onChange={setSource}
            data={[
              { value: 'system', label: 'System' },
              { value: 'ipfs', label: 'IPFS' },
              { value: 'monitor', label: 'Monitor' },
              { value: 'network', label: 'Network' },
            ]}
            style={{ width: 150 }}
          />
          <Button variant="light" onClick={() => {
            setSearch('')
            setLevel(null)
            setSource(null)
          }}>
            Clear Filters
          </Button>
        </Group>
      </Card>

      <Card withBorder style={{ height: 'calc(100vh - 280px)' }}>
        <ScrollArea h="100%">
          <Stack spacing="xs">
            {filteredLogs.map((log, index) => (
              <Group key={index} position="apart" p="xs" style={{
                borderBottom: index < filteredLogs.length - 1 ? '1px solid #2C2E33' : 'none',
              }}>
                <Group spacing="md">
                  <Text size="sm" color="dimmed">{log.timestamp}</Text>
                  <Badge color={getLevelColor(log.level)} variant="light">
                    {log.level.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{log.source}</Badge>
                  <Text size="sm">{log.message}</Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  )
} 