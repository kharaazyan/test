import { useState, useEffect } from 'react'
import {
  MantineProvider,
  AppShell,
  Group,
  Title,
  UnstyledButton,
  rem,
  Box,
  Text,
  Transition,
  Paper,
} from '@mantine/core'
import {
  IconTerminal2,
  IconFileText,
  IconKey,
  IconNetwork,
  IconDashboard,
} from '@tabler/icons-react'
import Terminal from './components/Terminal'
import LogViewer from './components/LogViewer'
import KeyManagement from './components/KeyManagement'
import IPFSStatus from './components/IPFSStatus'
import Dashboard from './components/Dashboard'
import { useColorScheme } from '@mantine/hooks'

const mainLinks = [
  { icon: IconDashboard, label: 'Dashboard', color: 'blue' },
  { icon: IconTerminal2, label: 'Terminal', color: 'teal' },
  { icon: IconFileText, label: 'Logs', color: 'violet' },
  { icon: IconKey, label: 'Keys', color: 'yellow' },
  { icon: IconNetwork, label: 'IPFS', color: 'orange' },
]

interface MainLinkProps {
  icon: typeof IconDashboard
  label: string
  color: string
  active?: boolean
  onClick?(): void
}

function MainLink({ icon: Icon, label, color, active, onClick }: MainLinkProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        transition: 'all 0.2s ease',
        color: active ? theme.white : theme.colors.gray[0],
        background: active
          ? `linear-gradient(45deg, ${theme.fn.rgba(
              theme.colors[color][9],
              0.8
            )}, ${theme.fn.rgba(theme.colors[color][7], 0.8)})`
          : 'transparent',
        '&:hover': {
          background: active
            ? `linear-gradient(45deg, ${theme.fn.rgba(
                theme.colors[color][9],
                0.8
              )}, ${theme.fn.rgba(theme.colors[color][7], 0.8)})`
            : theme.fn.rgba(theme.colors.dark[6], 0.5),
          transform: 'translateX(6px)',
        },
      })}
    >
      <Group>
        <Icon size={24} stroke={1.5} style={{ transition: 'all 0.2s ease' }} />
        <Text size="sm" fw={500}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [mounted, setMounted] = useState(false)
  const preferredColorScheme = useColorScheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />
      case 'Terminal':
        return <Terminal />
      case 'Logs':
        return <LogViewer />
      case 'Keys':
        return <KeyManagement />
      case 'IPFS':
        return <IPFSStatus />
      default:
        return <Dashboard />
    }
  }

  return (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        primaryColor: 'blue',
        primaryShade: 6,
        fontFamily: 'Inter, sans-serif',
        headings: { fontFamily: 'Inter, sans-serif' },
        components: {
          Button: {
            styles: {
              root: {
                fontWeight: 600,
                transition: 'all 0.2s ease',
              },
            },
          },
          Paper: {
            styles: {
              root: {
                transition: 'all 0.2s ease',
              },
            },
          },
        },
        globalStyles: (theme) => ({
          'body, #root': {
            backgroundColor: '#1A1B1E',
            minHeight: '100vh',
            margin: 0,
            padding: 0,
          },
        }),
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Box className="animated-gradient" />
      <AppShell
        padding="md"
        navbar={{
          width: 280,
          breakpoint: 'sm',
          collapsed: { mobile: false },
        }}
        header={{
          height: 70,
        }}
        styles={(theme) => ({
          main: {
            backgroundColor: 'transparent',
          },
        })}
      >
        <AppShell.Navbar
          p="md"
          style={{
            background: 'rgba(26, 27, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none',
          }}
        >
          <AppShell.Section grow mt="xs">
            <Box mb="xl">
              <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="md">
                Navigation
              </Text>
              {mainLinks.map((link) => (
                <Box mb="xs" key={link.label}>
                  <MainLink
                    {...link}
                    active={activeTab === link.label}
                    onClick={() => setActiveTab(link.label)}
                  />
                </Box>
              ))}
            </Box>
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Header
          p="md"
          style={{
            background: 'rgba(26, 27, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: 'none',
          }}
        >
          <Group justify="space-between" h="100%">
            <Group>
              <Title
                order={3}
                style={{
                  background: 'linear-gradient(45deg, #3B82F6, #60A5FA)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CLI-NetSecTool
              </Title>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Transition
            mounted={mounted}
            transition="fade"
            duration={400}
            timingFunction="ease"
          >
            {(styles) => (
              <Paper
                shadow="md"
                radius="lg"
                p="md"
                style={{
                  ...styles,
                  background: 'rgba(26, 27, 30, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {renderContent()}
              </Paper>
            )}
          </Transition>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
