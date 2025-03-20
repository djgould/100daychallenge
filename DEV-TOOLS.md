# Development Tools for 100 Day Fitness Challenge

This project includes some helpful tools to manage your development workflow and prevent issues with multiple instances of the development server running at the same time.

## Next.js Development Server Management

### Smart Start Script

The `start-dev.sh` script checks if a Next.js server is already running before starting a new one. If it detects a running server, it will show information about it instead of starting a duplicate.

To use it:

```bash
./start-dev.sh
```

### VSCode Tasks

Three tasks have been configured in `.vscode/tasks.json`:

1. **Start Next.js Development Server**: Runs the smart start script
2. **Check Running Next.js Instances**: Lists all running Next.js servers on the standard ports
3. **Kill All Next.js Instances**: Terminates all running Next.js development servers

To run these tasks:

- **Menu**: Terminal > Run Task... > [Select task]
- **Command Palette**: Ctrl+Shift+P, then type "Tasks: Run Task"

### Keyboard Shortcuts

For convenience, keyboard shortcuts have been configured in `.vscode/keybindings.json`:

- **Cmd+Shift+D**: Start the development server (if not already running)
- **Cmd+Shift+K**: Kill all running Next.js instances
- **Cmd+Shift+C**: Check for running Next.js instances

## Troubleshooting

If you're seeing errors about ports being in use:

1. Use `Cmd+Shift+C` to check for running instances
2. Use `Cmd+Shift+K` to kill all running instances
3. Restart the server with `Cmd+Shift+D`

Sometimes, instances may continue running in the background after Cursor is closed. Use these tools to manage them.
