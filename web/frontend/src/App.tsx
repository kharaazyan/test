import { useState } from 'react'
import { MantineProvider, AppShell, Group, Title, UnstyledButton, rem } from '@mantine/core'
import { IconTerminal2, IconFileText, IconKey, IconNetwork, IconDashboard } from '@tabler/icons-react'
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
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: active ? theme.white : theme.colors.dark[0],
        backgroundColor: active ? theme.fn.variant({ variant: 'light', color }).background : 'transparent',
        '&:hover': {
          backgroundColor: active ? theme.fn.variant({ variant: 'light', color }).background : theme.colors.dark[6],
        },
      })}
    >
      <Group>
        <Icon size={24} stroke={1.5} />
        <span style={{ fontSize: rem(14) }}>{label}</span>
      </Group>
    </UnstyledButton>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const preferredColorScheme = useColorScheme()

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
        fontFamily: 'JetBrains Mono, monospace',
        headings: { fontFamily: 'JetBrains Mono, monospace' },
        components: {
          Button: {
            styles: {
              root: {
                fontWeight: 600,
              },
            },
          },
        },
        globalStyles: (theme) => ({
          body: {
            backgroundColor: theme.colors.dark[8],
          },
        }),
      }}
    >
      <AppShell
        padding="md"
        navbar={{
          width: 250,
          breakpoint: 'sm',
          collapsed: { mobile: false },
        }}
        header={{
          height: 60,
        }}
      >
        <AppShell.Navbar p="xs">
          <AppShell.Section grow mt="xs">
            {mainLinks.map((link) => (
              <MainLink
                {...link}
                key={link.label}
                active={activeTab === link.label}
                onClick={() => setActiveTab(link.label)}
              />
            ))}
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Header p="xs" style={{ backdropFilter: 'blur(10px)' }}>
          <Group justify="space-between" h="100%">
            <Group>
              <Title order={3} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                CLI-NetSecTool
              </Title>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-dark-8)' }}>
          {renderContent()}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
