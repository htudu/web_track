# Web Track

A learning project with an Angular frontend and a Flask authentication API.
Users can register, sign in, and open a placeholder dashboard. The backend
stores users in SQLite and issues JWTs on login.

## Project structure

```text
web_track/
  backend/                    Flask API and SQLite models
  demo/                       Angular application
    src/app/login/            Login page
    src/app/register/         Registration page
    src/app/dashboard/        Dashboard page
  FRONTEND_INTEGRATION.md     Frontend and API integration guide
  ANGULAR_INTERVIEW_GUIDE.md   Angular learning resources
```

## Prerequisites

- Git
- Python 3.12 recommended, with `pip` and virtual environment support
- Node.js and npm. The installed Angular 21 dependencies require Node.js
  `^20.19.0`, `^22.12.0`, or `>=24.0.0`.

No global Angular CLI installation is required; the project uses its local CLI.
Check your versions with `python --version`, `node --version`, and
`npm --version`.

## Get the code

```powershell
git clone https://github.com/htudu/web_track.git
Set-Location web_track
```

The commands below use Windows PowerShell. Run the backend and frontend in
separate terminals.

## 1. Set up and start the backend

From the project root:

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

The API runs at `http://localhost:8000`. Check it in a browser at
`http://localhost:8000/health`, or run in another PowerShell terminal:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

SQLite creates `backend\users.db` on the first request when the server is
started from `backend`. The database and `.env` files are ignored by Git.

### Backend configuration

For local development, the backend has default values for `SECRET_KEY` and
`JWT_SECRET`. You can supply your own as environment variables before starting
the server, or put them in `backend\.env` for `python-dotenv` to load.
Use unique, strong secrets; never commit them.

The optional `DATABASE` environment variable selects a different SQLite file.
Set it in the shell **before starting Python**; a value in `.env` is not read
early enough by the database module. For example:

```powershell
$env:DATABASE = "my-local-users.db"
.\.venv\Scripts\python.exe app.py
```

The Flask development server runs in debug mode and listens on all interfaces.
Use it only in a trusted development environment, not as a production server.

## 2. Set up and start the frontend

In a second terminal, from the project root:

```powershell
Set-Location demo
npm.cmd ci
npm.cmd start
```

Open `http://localhost:4200`. The app uses `http://localhost:8000` for the
backend; if the API runs elsewhere, update the URLs in the login and
registration components.

## Try the application

1. Select **Create an account**, fill in the form, and submit it.
2. Sign in with the username and password you registered.
3. A successful login opens the dashboard. Select **Log out** to return to login.

The backend rejects duplicate usernames or email addresses. Registration does
not automatically sign the user in.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Create a user with `username`, `email`, and `password` |
| `POST` | `/login` | Authenticate and return a JWT and user details |
| `GET` | `/protected` | Validate a token in the `Authorization: Bearer <token>` header |
| `GET` | `/health` | Check whether the API is responding |

See the [backend README](backend/README.md) for request and response examples
and the [frontend integration guide](FRONTEND_INTEGRATION.md) for details.

## Build and test the frontend

From `demo`:

```powershell
npm.cmd run build
npm.cmd run test -- --watch=false
```

The Angular tests mock HTTP requests; they do not require a running backend.
The production build is written to `demo\dist`.

## Development security notes

- This is a learning project, not a production-ready authentication system.
  The backend enables CORS for all origins and uses development defaults.
- The frontend stores the JWT in `localStorage`, which is accessible to
  JavaScript and can be stolen through XSS. Use HTTPS and evaluate secure,
  HttpOnly cookie-based sessions and CSRF protection for production.
- The dashboard route guard checks only for the presence of a token; it does
  not verify its validity or expiry. Protected backend endpoints must validate
  tokens independently.

## Troubleshooting

- **Cannot connect to the API:** ensure Flask is running on port 8000, and
  check the browser's Network and Console tabs for connection or CORS errors.
- **Registration fails:** use a new username and email; usernames need at
  least 3 characters and passwords at least 6. The page displays backend errors.
- **Port already in use:** stop the process using the port or configure another
  port. If you change the backend port, update both frontend API URLs.
- **Node version errors:** check the Node.js version against the requirements
  above, then reinstall frontend dependencies with `npm.cmd ci`.
