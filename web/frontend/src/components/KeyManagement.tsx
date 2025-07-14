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
        <Title order={2}>Key Management</Title>
        <Group spacing="xs">
          <Tooltip label="Refresh keys">
            <ActionIcon variant="light" color="blue" size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
          <Button
            leftIcon={<IconPlus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Key
          </Button>
        </Group>
      </Group>

      <Grid>
        {sampleKeys.map((key) => (
          <Grid.Col key={key.id} span={4}>
            <Card withBorder shadow="sm">
              <Stack spacing="md">
                <Group position="apart">
                  <Group>
                    {getTypeIcon(key.type)}
                    <Text weight={500}>{key.name}</Text>
                  </Group>
                  <Badge color={getStatusColor(key.status)} variant="light">
                    {key.status}
                  </Badge>
                </Group>

                <Stack spacing="xs">
                  <Text size="sm" color="dimmed">
                    Type: {key.type.toUpperCase()}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Created: {key.created}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Expires: {key.expires}
                  </Text>
                </Stack>

                <Group position="apart">
                  <Group spacing={8}>
                    <Tooltip label="Download key">
                      <ActionIcon variant="light" color="blue">
                        <IconDownload size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Copy ID">
                      <ActionIcon variant="light" color="blue">
                        <IconCopy size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                  <Tooltip label="Delete key">
                    <ActionIcon variant="light" color="red">
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
      >
        <Stack spacing="md">
          <TextInput
            label="Key Name"
            placeholder="Enter key name"
            value={newKeyData.name}
            onChange={(e) => setNewKeyData({ ...newKeyData, name: e.currentTarget.value })}
            required
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
          />

          <Group position="right" mt="md">
            <Button variant="light" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle key creation
              setIsCreateModalOpen(false)
            }}>
              Create Key
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
} 