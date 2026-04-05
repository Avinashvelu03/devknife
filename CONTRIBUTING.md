# Contributing to devknife

Thank you for your interest in contributing to devknife!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/devknife.git`
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Run tests: `npm run test`

## Development Workflow

1. Create a branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Ensure all tests pass: `npm run test`
4. Check coverage: `npm run test:coverage`
5. Format code: `npm run format`
6. Lint: `npm run lint`
7. Commit: `git commit -m "Add your feature"`
8. Push: `git push origin feature/your-feature`
9. Open a Pull Request

## Code Standards

- TypeScript strict mode
- 100% test coverage required
- No runtime dependencies (Node.js native modules only)
- Follow existing code style (enforced by ESLint + Prettier)

## Adding a New Tool

1. Create a new file in `src/tools/<category>/<toolname>.ts`
2. Export it from `src/tools/index.ts`
3. Add CLI support in `src/cli.ts`
4. Add tests in `tests/tools/<category>.test.ts`
5. Update README.md with documentation

## Pull Request Process

1. Ensure all tests pass
2. Update documentation
3. Add tests for new features
4. Keep PRs small and focused
