import { Grid, Paper, Text, Title, Group, RingProgress, Stack, Card, Box, useMantineTheme } from '@mantine/core'
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
  const theme = useMantineTheme()
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      sx={(theme) => ({
        background: 'rgba(26, 27, 30, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.md,
        },
      })}
    >
      <Group position="apart">
        <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
          {title}
        </Text>
        <Box
          sx={(theme) => ({
            background: theme.fn.rgba(theme.colors[color][9], 0.1),
            borderRadius: theme.radius.md,
            padding: theme.spacing.xs,
          })}
        >
          <Icon size={22} stroke={1.5} color={theme.colors[color][4]} />
        </Box>
      </Group>

      <Group align="flex-end" spacing="xs" mt={25}>
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
      </Group>
    </Paper>
  )
}

export default function Dashboard() {
  return (
    <Stack spacing="md">
      <Title
        order={2}
        mb="md"
        sx={(theme) => ({
          fontSize: '2rem',
          fontWeight: 800,
          background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        })}
      >
        System Overview
      </Title>
      
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
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(26, 27, 30, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="url(#colorGradient)"
                    fillOpacity={0.2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
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
            <Stack align="center" spacing="xl">
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
              <RingProgress
                size={200}
                thickness={16}
                sections={[
                  { value: 40, color: '#22D3EE' },
                  { value: 25, color: '#FB923C' },
                  { value: 15, color: '#E879F9' },
                ]}
                label={
                  <Text
                    size="xl"
                    align="center"
                    weight={700}
                    sx={(theme) => ({
                      background: 'linear-gradient(45deg, #22D3EE, #E879F9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    })}
                  >
                    80%
                  </Text>
                }
              />
              <Group position="apart" spacing="xl">
                <Text
                  size="sm"
                  sx={{ color: '#22D3EE' }}
                  weight={500}
                >
                  CPU: 40%
                </Text>
                <Text
                  size="sm"
                  sx={{ color: '#FB923C' }}
                  weight={500}
                >
                  Memory: 25%
                </Text>
                <Text
                  size="sm"
                  sx={{ color: '#E879F9' }}
                  weight={500}
                >
                  Storage: 15%
                </Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  )
} 