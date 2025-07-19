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
  Box,
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

const getLevelGradient = (level: string) => {
  switch (level) {
    case 'error':
      return 'linear-gradient(45deg, #EF4444, #F87171)'
    case 'warning':
      return 'linear-gradient(45deg, #F59E0B, #FBBF24)'
    case 'info':
      return 'linear-gradient(45deg, #3B82F6, #60A5FA)'
    case 'debug':
      return 'linear-gradient(45deg, #6B7280, #9CA3AF)'
    default:
      return 'linear-gradient(45deg, #3B82F6, #60A5FA)'
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
        <Title
          order={2}
          sx={(theme) => ({
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.7))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        >
          Log Viewer
        </Title>
        <Group spacing="xs">
          <Tooltip label="Refresh logs">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              sx={(theme) => ({
                background: 'rgba(59, 130, 246, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.2)',
                  transform: 'translateY(-2px)',
                },
              })}
            >
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Download logs">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              sx={(theme) => ({
                background: 'rgba(59, 130, 246, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.2)',
                  transform: 'translateY(-2px)',
                },
              })}
            >
              <IconDownload size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Card
        withBorder
        radius="md"
        sx={(theme) => ({
          background: 'rgba(26, 27, 30, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        })}
      >
        <Group spacing="md">
          <TextInput
            icon={<IconSearch size={16} />}
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
                '&::placeholder': {
                  color: theme.colors.gray[5],
                },
              },
            })}
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
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
              },
              item: {
                '&[data-selected]': {
                  background: theme.colors.blue[7],
                },
              },
            })}
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
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
              },
              item: {
                '&[data-selected]': {
                  background: theme.colors.blue[7],
                },
              },
            })}
          />
          <Button
            variant="light"
            onClick={() => {
              setSearch('')
              setLevel(null)
              setSource(null)
            }}
            sx={(theme) => ({
              background: 'rgba(59, 130, 246, 0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(59, 130, 246, 0.2)',
                transform: 'translateY(-2px)',
              },
            })}
          >
            Clear Filters
          </Button>
        </Group>
      </Card>

      <Card
        withBorder
        radius="md"
        sx={(theme) => ({
          height: 'calc(100vh - 280px)',
          background: 'rgba(26, 27, 30, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        })}
      >
        <ScrollArea h="100%">
          <Stack spacing="xs">
            {filteredLogs.map((log, index) => (
              <Box
                key={index}
                sx={(theme) => ({
                  padding: theme.spacing.md,
                  borderBottom: index < filteredLogs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.03)',
                  },
                })}
              >
                <Group position="apart">
                  <Group spacing="md">
                    <Text size="sm" color="dimmed" sx={{ fontFamily: 'JetBrains Mono' }}>
                      {log.timestamp}
                    </Text>
                    <Badge
                      variant="gradient"
                      gradient={{ from: getLevelColor(log.level), to: getLevelColor(log.level) }}
                      sx={{
                        background: getLevelGradient(log.level),
                      }}
                    >
                      {log.level.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      sx={(theme) => ({
                        borderColor: 'rgba(255,255,255,0.1)',
                        color: theme.colors.gray[0],
                      })}
                    >
                      {log.source}
                    </Badge>
                    <Text size="sm" sx={{ color: theme.colors.gray[0] }}>
                      {log.message}
                    </Text>
                  </Group>
                </Group>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  )
} 