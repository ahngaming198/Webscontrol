# Contributing to Hosting Control Panel

Thank you for your interest in contributing to the Hosting Control Panel! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@hosting-panel.com](mailto:conduct@hosting-panel.com).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/your-username/hosting-control-panel.git
   cd hosting-control-panel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd apps/control-plane && npm install
   cd ../client-portal && npm install
   cd ../helpdesk && npm install
   ```

3. **Set up environment**:
   ```bash
   cp env.example .env
   # Edit .env with your development settings
   ```

4. **Start development environment**:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

5. **Run development servers**:
   ```bash
   # Terminal 1 - Control Plane
   cd apps/control-plane
   npm run start:dev

   # Terminal 2 - Client Portal
   cd apps/client-portal
   npm run dev

   # Terminal 3 - Helpdesk
   cd apps/helpdesk
   npm run dev
   ```

## Contributing Process

### 1. Create an Issue

Before starting work, please create an issue to discuss:
- Bug reports
- Feature requests
- Large changes
- Breaking changes

### 2. Fork and Branch

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### 3. Make Changes

- Follow the coding standards
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Changes

Use conventional commit messages:

```
feat: add new feature
fix: fix bug in authentication
docs: update installation guide
test: add tests for user service
refactor: improve database queries
```

### 5. Push and Create PR

1. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request with:
   - Clear description of changes
   - Reference to related issues
   - Screenshots (if applicable)
   - Testing instructions

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components in React
- Use proper TypeScript types

### Go

- Follow Go standard formatting (`gofmt`)
- Use `golint` and `go vet`
- Write comprehensive tests
- Use meaningful variable names
- Add comments for exported functions

### General

- Write clear, self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Follow the existing code style

## Testing

### Frontend Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Go Testing

```bash
# Run tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run benchmarks
go test -bench=.
```

### Test Requirements

- All new features must have tests
- Maintain or improve test coverage
- Write both unit and integration tests
- Test error conditions and edge cases

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Include examples in documentation
- Keep README files updated

### API Documentation

- Update OpenAPI/Swagger specs
- Document new endpoints
- Include request/response examples
- Document error responses

### User Documentation

- Update user guides for new features
- Add troubleshooting information
- Include screenshots for UI changes
- Keep installation guides current

## Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Steps

1. **Update version numbers**:
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**:
   - Add new features
   - List bug fixes
   - Note breaking changes

3. **Create release PR**:
   - Update documentation
   - Run full test suite
   - Get code review approval

4. **Merge and tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Areas for Contribution

### High Priority

- [ ] Performance optimizations
- [ ] Security improvements
- [ ] Documentation improvements
- [ ] Test coverage improvements
- [ ] Bug fixes

### Medium Priority

- [ ] New features
- [ ] UI/UX improvements
- [ ] API enhancements
- [ ] Monitoring and logging
- [ ] Internationalization

### Low Priority

- [ ] Code refactoring
- [ ] Developer experience improvements
- [ ] Additional integrations
- [ ] Advanced features

## Getting Help

### Community

- [GitHub Discussions](https://github.com/your-org/hosting-control-panel/discussions)
- [Discord Community](https://discord.gg/your-discord)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/hosting-control-panel)

### Maintainers

- [@maintainer1](https://github.com/maintainer1) - Project Lead
- [@maintainer2](https://github.com/maintainer2) - Backend
- [@maintainer3](https://github.com/maintainer3) - Frontend

### Contact

- Email: [contributors@hosting-panel.com](mailto:contributors@hosting-panel.com)
- Issues: [GitHub Issues](https://github.com/your-org/hosting-control-panel/issues)

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation
- Community announcements

Thank you for contributing to the Hosting Control Panel! 🎉
