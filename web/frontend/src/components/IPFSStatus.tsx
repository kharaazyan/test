import { useState } from 'react'
import {
  Card,
  Title,
  Stack,
  Group,
  Text,
  Badge,
  Grid,
  RingProgress,
  ActionIcon,
  Tooltip,
  Table,
} from '@mantine/core'
import {
  IconRefresh,
  IconDatabase,
  IconNetwork,
  IconCloudUpload,
  IconCloudDownload,
  IconUsers,
} from '@tabler/icons-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const networkData = [
  { time: '00:00', upload: 65, download: 45 },
  { time: '04:00', upload: 75, download: 55 },
  { time: '08:00', upload: 85, download: 65 },
  { time: '12:00', upload: 95, download: 75 },
  { time: '16:00', upload: 85, download: 85 },
  { time: '20:00', upload: 75, download: 65 },
  { time: '24:00', upload: 65, download: 45 },
]

const recentPins = [
  { hash: 'QmX...1a2b', name: 'security_log_2024_03_20.enc', size: '2.5 MB', time: '5 min ago' },
  { hash: 'QmY...3c4d', name: 'config_backup.enc', size: '1.2 MB', time: '15 min ago' },
  { hash: 'QmZ...5e6f', name: 'system_state.enc', size: '3.8 MB', time: '30 min ago' },
]

interface StatCardProps {
  title: string
  value: string
  icon: typeof IconDatabase
  color: string
  subtitle?: string
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <Card withBorder p="md">
      <Group position="apart" mb="xs">
        <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
          {title}
        </Text>
        <Icon size={22} stroke={1.5} color={color} />
      </Group>

      <Group align="flex-end" spacing="xs">
        <Text size="xl" weight={700}>
          {value}
        </Text>
        {subtitle && (
          <Text size="sm" color="dimmed">
            {subtitle}
          </Text>
        )}
      </Group>
    </Card>
  )
}

export default function IPFSStatus() {
  const [isOnline, setIsOnline] = useState(true)

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Title order={2}>IPFS Status</Title>
        <Group spacing="xs">
          <Badge
            variant="dot"
            color={isOnline ? 'green' : 'red'}
            size="lg"
          >
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Tooltip label="Refresh status">
            <ActionIcon variant="light" color="blue" size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Grid>
        <Grid.Col span={3}>
          <StatCard
            title="Storage Used"
            value="128.5 GB"
            icon={IconDatabase}
            color="blue"
            subtitle="of 1 TB"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Peers Connected"
            value="156"
            icon={IconUsers}
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Upload Speed"
            value="2.5 MB/s"
            icon={IconCloudUpload}
            color="cyan"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatCard
            title="Download Speed"
            value="3.8 MB/s"
            icon={IconCloudDownload}
            color="violet"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={8}>
          <Card withBorder padding="lg">
            <Title order={3} mb="md">Network Activity</Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey="upload"
                    stroke="#3182ce"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="download"
                    stroke="#805ad5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder padding="lg" h="100%">
            <Stack spacing="md">
              <Title order={3}>System Health</Title>
              <Group position="center">
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={[
                    { value: 65, color: 'blue' },
                    { value: 15, color: 'cyan' },
                    { value: 10, color: 'orange' },
                  ]}
                  label={
                    <Stack align="center" spacing={0}>
                      <Text size="xl" weight={700}>90%</Text>
                      <Text size="xs" color="dimmed">Health</Text>
                    </Stack>
                  }
                />
              </Group>
              <Group position="apart" mt="md">
                <Text size="sm" color="dimmed">Storage: 65%</Text>
                <Text size="sm" color="dimmed">Network: 15%</Text>
                <Text size="sm" color="dimmed">CPU: 10%</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card withBorder>
        <Title order={3} mb="md">Recent Pins</Title>
        <Table>
          <thead>
            <tr>
              <th>Hash</th>
              <th>Name</th>
              <th>Size</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentPins.map((pin) => (
              <tr key={pin.hash}>
                <td>
                  <Text family="monospace">{pin.hash}</Text>
                </td>
                <td>{pin.name}</td>
                <td>{pin.size}</td>
                <td>{pin.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Stack>
  )
} 