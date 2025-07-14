import { Grid, Paper, Text, Title, Group, RingProgress, Stack, Card } from '@mantine/core'
import { IconServer, IconKey, IconShieldLock, IconAlertTriangle } from '@tabler/icons-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: '00:00', value: 24 },
  { name: '03:00', value: 35 },
  { name: '06:00', value: 43 },
  { name: '09:00', value: 28 },
  { name: '12:00', value: 52 },
  { name: '15:00', value: 63 },
  { name: '18:00', value: 44 },
  { name: '21:00', value: 37 },
]

interface StatsCardProps {
  title: string
  value: string
  icon: typeof IconServer
  color: string
}

function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group position="apart">
        <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
          {title}
        </Text>
        <Icon size={22} stroke={1.5} color={color} />
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
        <Text size="xl" weight={700}>
          {value}
        </Text>
      </Group>
    </Paper>
  )
}

export default function Dashboard() {
  return (
    <Stack spacing="md">
      <Title order={2} mb="md">System Overview</Title>
      
      <Grid>
        <Grid.Col span={3}>
          <StatsCard
            title="Active Nodes"
            value="23"
            icon={IconServer}
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Active Keys"
            value="12"
            icon={IconKey}
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Security Events"
            value="158"
            icon={IconShieldLock}
            color="teal"
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <StatsCard
            title="Alerts"
            value="2"
            icon={IconAlertTriangle}
            color="red"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={8}>
          <Card withBorder padding="lg">
            <Title order={3} mb="md">Network Activity</Title>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#3182ce" fill="#3182ce" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder padding="lg" h="100%">
            <Stack align="center" spacing="xl">
              <Title order={3}>System Health</Title>
              <RingProgress
                size={200}
                thickness={16}
                sections={[
                  { value: 40, color: 'cyan' },
                  { value: 25, color: 'orange' },
                  { value: 15, color: 'grape' },
                ]}
                label={
                  <Text size="xl" align="center" weight={700}>
                    80%
                  </Text>
                }
              />
              <Group position="apart" spacing="xl">
                <Text size="sm" color="dimmed">CPU: 40%</Text>
                <Text size="sm" color="dimmed">Memory: 25%</Text>
                <Text size="sm" color="dimmed">Storage: 15%</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
} 