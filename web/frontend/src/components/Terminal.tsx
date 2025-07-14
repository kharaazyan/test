import { useEffect, useRef } from 'react'
import { Card, Title, Stack } from '@mantine/core'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import 'xterm/css/xterm.css'

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Создаем и настраиваем терминал
    const term = new XTerm({
      theme: {
        background: '#1A1B1E',
        foreground: '#C1C2C5',
        cursor: '#C1C2C5',
        cursorAccent: '#1A1B1E',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#1A1B1E',
        red: '#FF6B6B',
        green: '#4CAF50',
        yellow: '#FFA726',
        blue: '#2196F3',
        magenta: '#E91E63',
        cyan: '#00BCD4',
        white: '#C1C2C5',
        brightBlack: '#4A4B4D',
        brightRed: '#FF8A8A',
        brightGreen: '#69DB7C',
        brightYellow: '#FFB74D',
        brightBlue: '#42A5F5',
        brightMagenta: '#EC407A',
        brightCyan: '#26C6DA',
        brightWhite: '#FFFFFF',
      },
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'bar',
      allowTransparency: true,
    })

    // Добавляем аддоны
    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)

    // Открываем терминал
    term.open(terminalRef.current)
    fitAddon.fit()

    // Приветственное сообщение
    term.writeln('\x1b[1;34m╔════════════════════════════════════════════════════════════╗\x1b[0m')
    term.writeln('\x1b[1;34m║\x1b[0m                \x1b[1;32mCLI-NetSecTool Terminal\x1b[0m                \x1b[1;34m║\x1b[0m')
    term.writeln('\x1b[1;34m╚════════════════════════════════════════════════════════════╝\x1b[0m')
    term.writeln('')
    term.writeln('\x1b[90mType \x1b[1;33mhelp\x1b[0;90m for a list of available commands\x1b[0m')
    term.writeln('')
    term.write('\x1b[1;32m➜\x1b[0m ')

    // Обработка ввода
    term.onData((data) => {
      // Эхо ввода
      term.write(data)

      // Если нажат Enter
      if (data === '\r') {
        term.writeln('')
        term.write('\x1b[1;32m➜\x1b[0m ')
      }
    })

    // Сохраняем ссылку на терминал
    xtermRef.current = term

    // Обработчик изменения размера окна
    const handleResize = () => {
      fitAddon.fit()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      term.dispose()
    }
  }, [])

  return (
    <Stack spacing="md">
      <Title order={2}>Terminal</Title>
      <Card withBorder padding="xs" style={{ height: 'calc(100vh - 180px)' }}>
        <div ref={terminalRef} style={{ height: '100%' }} />
      </Card>
    </Stack>
  )
} 