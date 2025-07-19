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
  Box,
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
    <Card
      className="interactive-card"
      withBorder
      p="md"
      radius="md"
      sx={(theme) => ({
        background: 'rgba(26, 27, 30, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.md,
        },
      })}
    >
      <Group position="apart" mb="xs">
        <Text
          size="xs"
          transform="uppercase"
          weight={700}
          sx={(theme) => ({
            color: theme.colors.gray[5],
          })}
        >
          {title}
        </Text>
        <Box
          sx={(theme) => ({
            background: theme.fn.rgba(theme.colors[color][9], 0.1),
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color: theme.colors[color][4],
          })}
        >
          <Icon size={22} stroke={1.5} />
        </Box>
      </Group>

      <Group align="flex-end" spacing="xs">
        <Text
          size="xl"
          weight={700}
          sx={(theme) => ({
            background: `linear-gradient(45deg, ${theme.colors[color][4]}, ${theme.colors[color][6]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          })}
        >
          {value}
        </Text>
        {subtitle && (
          <Text
            size="sm"
            sx={(theme) => ({
              color: theme.colors.gray[5],
            })}
          >
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
          IPFS Status
        </Title>
        <Group spacing="xs">
          <Badge
            variant="gradient"
            gradient={
              isOnline
                ? { from: '#10B981', to: '#34D399' }
                : { from: '#EF4444', to: '#F87171' }
            }
            size="lg"
            sx={{
              background: isOnline
                ? 'linear-gradient(45deg, #10B981, #34D399)'
                : 'linear-gradient(45deg, #EF4444, #F87171)',
            }}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Tooltip label="Refresh status">
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
          <Card
            withBorder
            padding="lg"
            radius="md"
            sx={(theme) => ({
              background: 'rgba(26, 27, 30, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            })}
          >
            <Title
              order={3}
              mb="md"
              sx={(theme) => ({
                fontSize: '1.5rem',
                fontWeight: 700,
                color: theme.colors.gray[0],
              })}
            >
              Network Activity
            </Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: 'rgba(26, 27, 30, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="upload"
                    stroke="#60A5FA"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="download"
                    stroke="#C084FC"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card
            withBorder
            padding="lg"
            h="100%"
            radius="md"
            sx={(theme) => ({
              background: 'rgba(26, 27, 30, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            })}
          >
            <Stack spacing="md">
              <Title
                order={3}
                sx={(theme) => ({
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: theme.colors.gray[0],
                })}
              >
                System Health
              </Title>
              <Group position="center">
                <RingProgress
                  size={180}
                  thickness={16}
                  sections={[
                    { value: 65, color: '#60A5FA' },
                    { value: 15, color: '#22D3EE' },
                    { value: 10, color: '#FB923C' },
                  ]}
                  label={
                    <Stack align="center" spacing={0}>
                      <Text
                        size="xl"
                        weight={700}
                        sx={(theme) => ({
                          background: 'linear-gradient(45deg, #60A5FA, #22D3EE)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        })}
                      >
                        90%
                      </Text>
                      <Text
                        size="xs"
                        sx={(theme) => ({
                          color: theme.colors.gray[5],
                        })}
                      >
                        Health
                      </Text>
                    </Stack>
                  }
                />
              </Group>
              <Group position="apart" mt="md">
                <Text
                  size="sm"
                  sx={{ color: '#60A5FA' }}
                  weight={500}
                >
                  Storage: 65%
                </Text>
                <Text
                  size="sm"
                  sx={{ color: '#22D3EE' }}
                  weight={500}
                >
                  Network: 15%
                </Text>
                <Text
                  size="sm"
                  sx={{ color: '#FB923C' }}
                  weight={500}
                >
                  CPU: 10%
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Card
        withBorder
        radius="md"
        sx={(theme) => ({
          background: 'rgba(26, 27, 30, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        })}
      >
        <Title
          order={3}
          mb="md"
          sx={(theme) => ({
            fontSize: '1.5rem',
            fontWeight: 700,
            color: theme.colors.gray[0],
          })}
        >
          Recent Pins
        </Title>
        <Table
          sx={(theme) => ({
            'thead tr th': {
              color: theme.colors.gray[5],
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: theme.spacing.md,
            },
            'tbody tr td': {
              color: theme.colors.gray[0],
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              padding: theme.spacing.md,
            },
            'tbody tr': {
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(255,255,255,0.03)',
              },
            },
          })}
        >
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
                  <Text
                    family="monospace"
                    sx={(theme) => ({
                      color: theme.colors.blue[4],
                    })}
                  >
                    {pin.hash}
                  </Text>
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