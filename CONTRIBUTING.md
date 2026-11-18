# Contributing to FitoGlobe

Thanks for helping improve FitoGlobe! Contributions to the React frontend, Express backend, documentation, accessibility, and translations are welcome.

Please keep pull requests focused and explain the user-facing impact of your change.

## Before you start

1. Check the [existing issues](https://github.com/ayushcmd/fitoglobe/issues) to avoid duplicating work.
2. For a large feature or breaking change, open an issue to discuss the approach before investing substantial time.
3. For a vulnerability, **do not open a public issue**. Follow [SECURITY.md](SECURITY.md) for private reporting.
4. Be respectful and constructive when discussing proposed changes.

## Repository layout

- `frontend/`: React 19 application, Vite tooling, and UI assets.
- `backend/`: Node.js / Express API, PostgreSQL data access through Prisma, and authentication.
- `backend/prisma/`: Prisma schema and database migrations.

The root [README](README.md) includes an overview and additional setup information.

## Set up a development environment

Install Node.js and npm, and have a PostgreSQL instance available for backend work. Optional integrations (such as Groq and Google OAuth) need your own credentials.

```bash
git clone https://github.com/ayushcmd/fitoglobe.git
cd fitoglobe
```

### Backend

```bash
cd backend
npm install
```

Create a local `backend/.env` with the necessary environment values described in [README.md](README.md#environment-variables). In particular, configure the database connection and your own `JWT_SECRET`. Never commit `.env` files or live credentials.

```bash
npm run build
npm run db:migrate
npm run dev
```

The scripts generate the Prisma client, run development database migrations, and start the server with nodemon. The optional `npm run db:seed` script modifies the configured database: use a disposable development database and inspect seed data first.

### Frontend

In another terminal, from the repository root:

```bash
cd frontend
npm install
```

Set `VITE_API_URL` in a local `frontend/.env` to the URL of your running API, then:

```bash
npm run dev
```

Open the local address printed by Vite. Features backed by third-party services may not work without their credentials.

## Make a change

1. Create a descriptive branch from the latest `main` (for example, `fix/workout-form-validation` or `docs/improve-setup`).
2. Make one logically related change per pull request.
3. Follow the conventions in the surrounding files; avoid unrelated formatting changes.
4. Update documentation when behavior, configuration, or setup steps change.
5. If possible, include a clear manual verification path or an automated test for functional changes.
6. Avoid committing secrets, private user data, generated dependencies, or production environment files.

## Check your work

For frontend changes, run from `frontend/`:

```bash
npm run lint
npm run build
```

For backend changes, run from `backend/`:

```bash
npm run build
```

That backend build script runs `prisma generate`; it is **not** a complete automated backend test suite. The repository does not currently define `npm test` scripts in either package. Please describe any manual API or UI checks performed and do not claim tests were run if they were not.

Database migrations should be tested against a local or disposable development database rather than production.

## Open a pull request

Target the repository's `main` branch. In the PR description, include:

- **What changed:** a concise summary and motivation.
- **Related issue:** link one if applicable.
- **Validation:** commands run, results, and any testing limitations.
- **Screenshots or recordings:** for meaningful UI changes, when helpful.
- **Configuration or migration notes:** if a maintainer must take action.

Keep the PR reviewable and address feedback collaboratively. Do not add a `Co-authored-by` trailer unless another person or account genuinely contributed to the commit; use an email associated with their GitHub account when crediting them.

## Reporting problems

- **Bugs and feature requests:** [GitHub issues](https://github.com/ayushcmd/fitoglobe/issues).
- **Security vulnerabilities:** follow [SECURITY.md](SECURITY.md) and avoid public disclosure of sensitive details.

## Licensing

By contributing, you agree that your contributions may be distributed under the repository's [MIT License](LICENSE). Confirm you have the rights to submit any code, images, or other materials you contribute.
