import { useState } from 'react'
import {
  Card,
  Title,
  Stack,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Select,
  Grid,
  Tooltip,
  Box,
} from '@mantine/core'
import {
  IconKey,
  IconTrash,
  IconDownload,
  IconCopy,
  IconPlus,
  IconRefresh,
  IconLock,
  IconShieldLock,
} from '@tabler/icons-react'

interface KeyEntry {
  id: string
  name: string
  type: 'rsa' | 'aes' | 'ipfs'
  status: 'active' | 'expired' | 'revoked'
  created: string
  expires: string
}

const sampleKeys: KeyEntry[] = [
  {
    id: 'key_1',
    name: 'Primary RSA Key',
    type: 'rsa',
    status: 'active',
    created: '2024-01-01',
    expires: '2025-01-01',
  },
  {
    id: 'key_2',
    name: 'IPFS Node Key',
    type: 'ipfs',
    status: 'active',
    created: '2024-01-01',
    expires: '2025-01-01',
  },
  {
    id: 'key_3',
    name: 'AES Encryption Key',
    type: 'aes',
    status: 'active',
    created: '2024-01-01',
    expires: '2025-01-01',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'expired':
      return 'red'
    case 'revoked':
      return 'orange'
    default:
      return 'gray'
  }
}

const getStatusGradient = (status: string) => {
  switch (status) {
    case 'active':
      return 'linear-gradient(45deg, #10B981, #34D399)'
    case 'expired':
      return 'linear-gradient(45deg, #EF4444, #F87171)'
    case 'revoked':
      return 'linear-gradient(45deg, #F59E0B, #FBBF24)'
    default:
      return 'linear-gradient(45deg, #6B7280, #9CA3AF)'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'rsa':
      return <IconKey size={16} />
    case 'aes':
      return <IconLock size={16} />
    case 'ipfs':
      return <IconShieldLock size={16} />
    default:
      return <IconKey size={16} />
  }
}

export default function KeyManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    type: 'rsa',
    keySize: '2048',
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
          Key Management
        </Title>
        <Group spacing="xs">
          <Tooltip label="Refresh keys">
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
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={(theme) => ({
              background: 'linear-gradient(45deg, #3B82F6, #60A5FA)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows.md,
              },
            })}
          >
            Create New Key
          </Button>
        </Group>
      </Group>

      <Grid>
        {sampleKeys.map((key) => (
          <Grid.Col key={key.id} span={4}>
            <Card
              withBorder
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
              <Stack spacing="md">
                <Group position="apart">
                  <Group>
                    <Box
                      sx={(theme) => ({
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: theme.spacing.xs,
                        borderRadius: theme.radius.sm,
                        color: theme.colors.blue[4],
                      })}
                    >
                      {getTypeIcon(key.type)}
                    </Box>
                    <Text
                      weight={500}
                      sx={(theme) => ({
                        color: theme.colors.gray[0],
                      })}
                    >
                      {key.name}
                    </Text>
                  </Group>
                  <Badge
                    variant="gradient"
                    gradient={{ from: getStatusColor(key.status), to: getStatusColor(key.status) }}
                    sx={{
                      background: getStatusGradient(key.status),
                    }}
                  >
                    {key.status}
                  </Badge>
                </Group>

                <Stack spacing="xs">
                  <Text
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[5],
                    })}
                  >
                    Type: {key.type.toUpperCase()}
                  </Text>
                  <Text
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[5],
                    })}
                  >
                    Created: {key.created}
                  </Text>
                  <Text
                    size="sm"
                    sx={(theme) => ({
                      color: theme.colors.gray[5],
                    })}
                  >
                    Expires: {key.expires}
                  </Text>
                </Stack>

                <Group position="apart">
                  <Group spacing={8}>
                    <Tooltip label="Download key">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        sx={(theme) => ({
                          background: 'rgba(59, 130, 246, 0.1)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                        })}
                      >
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Copy ID">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        sx={(theme) => ({
                          background: 'rgba(59, 130, 246, 0.1)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: 'rgba(59, 130, 246, 0.2)',
                            transform: 'translateY(-2px)',
                          },
                        })}
                      >
                        <IconCopy size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                  <Tooltip label="Delete key">
                    <ActionIcon
                      variant="light"
                      color="red"
                      sx={(theme) => ({
                        background: 'rgba(239, 68, 68, 0.1)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'rgba(239, 68, 68, 0.2)',
                          transform: 'translateY(-2px)',
                        },
                      })}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Key"
        size="lg"
        styles={(theme) => ({
          header: {
            background: 'rgba(26, 27, 30, 0.5)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          },
          content: {
            background: 'rgba(26, 27, 30, 0.5)',
            backdropFilter: 'blur(10px)',
          },
          title: {
            color: theme.colors.gray[0],
            fontWeight: 600,
          },
        })}
      >
        <Stack spacing="md">
          <TextInput
            label="Key Name"
            placeholder="Enter key name"
            value={newKeyData.name}
            onChange={(e) => setNewKeyData({ ...newKeyData, name: e.currentTarget.value })}
            required
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
                '&::placeholder': {
                  color: theme.colors.gray[5],
                },
              },
              label: {
                color: theme.colors.gray[0],
              },
            })}
          />

          <Select
            label="Key Type"
            value={newKeyData.type}
            onChange={(value) => setNewKeyData({ ...newKeyData, type: value || 'rsa' })}
            data={[
              { value: 'rsa', label: 'RSA Key' },
              { value: 'aes', label: 'AES Key' },
              { value: 'ipfs', label: 'IPFS Key' },
            ]}
            required
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
              },
              label: {
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
            label="Key Size"
            value={newKeyData.keySize}
            onChange={(value) => setNewKeyData({ ...newKeyData, keySize: value || '2048' })}
            data={[
              { value: '1024', label: '1024 bits' },
              { value: '2048', label: '2048 bits' },
              { value: '4096', label: '4096 bits' },
            ]}
            required
            styles={(theme) => ({
              input: {
                background: 'rgba(26, 27, 30, 0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: theme.colors.gray[0],
              },
              label: {
                color: theme.colors.gray[0],
              },
              item: {
                '&[data-selected]': {
                  background: theme.colors.blue[7],
                },
              },
            })}
          />

          <Group position="right" mt="md">
            <Button
              variant="light"
              onClick={() => setIsCreateModalOpen(false)}
              sx={(theme) => ({
                background: 'rgba(59, 130, 246, 0.1)',
                color: theme.colors.gray[0],
                '&:hover': {
                  background: 'rgba(59, 130, 246, 0.2)',
                },
              })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Handle key creation
                setIsCreateModalOpen(false)
              }}
              sx={(theme) => ({
                background: 'linear-gradient(45deg, #3B82F6, #60A5FA)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows.md,
                },
              })}
            >
              Create Key
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
} 