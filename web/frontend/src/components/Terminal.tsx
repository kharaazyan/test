import { useEffect, useRef } from 'react'
import { Card, Title, Stack, Box } from '@mantine/core'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'
import 'xterm/css/xterm.css'

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)

  useEffect(() => {
    if (!terminalRef.current) return

    // Создаем и настраиваем терминал
    const term = new XTerm({
      theme: {
        background: 'rgba(26, 27, 30, 0.6)',
        foreground: '#E2E8F0',
        cursor: '#60A5FA',
        cursorAccent: '#1A1B1E',
        selection: 'rgba(96, 165, 250, 0.3)',
        black: '#1A1B1E',
        red: '#F87171',
        green: '#34D399',
        yellow: '#FBBF24',
        blue: '#60A5FA',
        magenta: '#E879F9',
        cyan: '#22D3EE',
        white: '#E2E8F0',
        brightBlack: '#4B5563',
        brightRed: '#FCA5A5',
        brightGreen: '#6EE7B7',
        brightYellow: '#FCD34D',
        brightBlue: '#93C5FD',
        brightMagenta: '#F0ABFC',
        brightCyan: '#67E8F9',
        brightWhite: '#F8FAFC',
      },
      fontFamily: 'JetBrains Mono',
      fontSize: 14,
      lineHeight: 1.5,
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
    term.writeln('\x1b[38;2;96;165;250m┌─────────────────────────────────────────────────────────┐\x1b[0m')
    term.writeln('\x1b[38;2;96;165;250m│\x1b[0m              \x1b[1;38;2;52;211;153mCLI-NetSecTool Terminal\x1b[0m              \x1b[38;2;96;165;250m│\x1b[0m')
    term.writeln('\x1b[38;2;96;165;250m└─────────────────────────────────────────────────────────┘\x1b[0m')
    term.writeln('')
    term.writeln('\x1b[38;2;148;163;184mType \x1b[1;38;2;251;191;36mhelp\x1b[0;38;2;148;163;184m for a list of available commands\x1b[0m')
    term.writeln('')
    term.write('\x1b[1;38;2;52;211;153m➜\x1b[0m ')

    // Обработка ввода
    term.onData((data) => {
      // Эхо ввода
      term.write(data)

      // Если нажат Enter
      if (data === '\r') {
        term.writeln('')
        term.write('\x1b[1;38;2;52;211;153m➜\x1b[0m ')
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
        Terminal
      </Title>
      <Card
        withBorder
        padding="xs"
        radius="lg"
        sx={(theme) => ({
          height: 'calc(100vh - 180px)',
          background: 'rgba(26, 27, 30, 0.5)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        })}
      >
        <Box
          ref={terminalRef}
          sx={{
            height: '100%',
            '& .xterm': {
              padding: '1rem',
              height: '100%',
            },
            '& .xterm-viewport': {
              opacity: '0.8 !important',
            },
          }}
        />
      </Card>
    </Stack>
  )
} 