# Contributing to Calento.space

Thank you for your interest in contributing to Calento.space! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit and push
7. Create a Pull Request

## 📋 Development Setup

1. **Prerequisites**:
   - Node.js (v16+)
   - Docker & Docker Compose
   - Git

2. **Installation**:
   ```bash
   # Clone and setup
   git clone <repository-url>
   cd calento.space
   
   # Copy environment file
   cp .env.example server/.env
   
   # Install dependencies
   make install
   
   # Start services
   make up
   
   # Start development
   make dev
   ```

## 🔧 Development Workflow

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write clear commit messages

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain test coverage above 80%

### Commit Messages

Use conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat(auth): add JWT authentication
fix(api): resolve user registration bug
docs(readme): update installation instructions
```

## 🧪 Testing Guidelines

### Running Tests
```bash
# Run all tests
make test

# Run server tests only
cd server && npm test

# Run client tests only
cd client && npm test

# Run with coverage
npm run test:coverage
```

### Writing Tests
- Unit tests for individual functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Mock external dependencies

## 📝 Code Review Process

1. **Self Review**: Review your own code before submitting
2. **Automated Checks**: Ensure CI passes
3. **Peer Review**: At least one approval required
4. **Testing**: Manual testing if needed

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered

## 🐛 Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots/logs if applicable

## 💡 Feature Requests

For new features:
- Describe the problem you're solving
- Propose a solution
- Consider alternatives
- Discuss implementation approach

## 📚 Documentation

- Update README.md for user-facing changes
- Add inline code comments for complex logic
- Update API documentation
- Include examples where helpful

## 🔒 Security

- Report security issues privately
- Don't commit sensitive data
- Use environment variables for secrets
- Follow security best practices

## 📞 Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join our community chat
- Contact maintainers directly for urgent issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

Thank you for contributing! 🎉
