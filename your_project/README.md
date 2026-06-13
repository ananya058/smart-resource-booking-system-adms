# FSET Room Booking System

**Faculty of Science, Engineering & Technology — USTC Chittagong**

A Flask + SQLite web app for booking classrooms and labs across FSET's 18 rooms. Faculty can reserve rooms, check conflicts in real time, and manage all bookings from a single dashboard.

---

## Project Structure

```
fset_booking/
├── app.py                    # Flask backend (all API routes)
├── fset_booking_system.html  # Frontend HTML
├── script.js                 # Frontend JavaScript
├── style.css                 # Styles
├── fset_booking.db           # SQLite database (auto-created on first run)
├── gunicorn.conf.py          # Production WSGI server config
├── render.yaml               # One-click Render deployment config
├── Procfile                  # Railway / Heroku deployment
├── requirements.txt          # Python dependencies
├── runtime.txt               # Python version pin
└── README.md
```

---

## Run Locally

```bash
# 1. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start development server
python app.py
# → Open http://127.0.0.1:5000
```

---

## Deploy to Production

### Option A — Render (Recommended, Free Tier Available)

Render is the easiest option and has a Singapore region (closest to Chittagong).

1. Push this project to a **GitHub repository**
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` and fill in all settings
5. Click **Deploy** — done ✅

> **Persistent database on Render:**
> The free tier has an ephemeral filesystem (resets on deploy). To keep bookings:
> 1. Add a **Render Disk** (from $1/mo) mounted at `/data`
> 2. Set the environment variable: `DATABASE_PATH=/data/fset_booking.db`

---

### Option B — Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
3. Railway reads the `Procfile` automatically
4. Add env var `DATABASE_PATH=/data/fset_booking.db` and attach a Volume

---

### Option C — PythonAnywhere (Simplest, No GitHub needed)

1. Create a free account at [pythonanywhere.com](https://pythonanywhere.com)
2. Upload all project files via the **Files** tab
3. Open a **Bash console** and run:
   ```bash
   pip install --user -r requirements.txt
   ```
4. Go to **Web** → **Add a new web app** → **Manual configuration** → **Python 3.11**
5. Set the WSGI file path and source directory to your uploaded folder
6. In the WSGI config file, add:
   ```python
   import sys
   sys.path.insert(0, '/home/YOUR_USERNAME/fset_booking')
   from app import app as application
   ```
7. Click **Reload** — your app is live at `yourname.pythonanywhere.com` ✅

---

### Option D — Azure App Service

```bash
# Install Azure CLI, then:
az login
az group create --name fset-rg --location southeastasia
az appservice plan create --name fset-plan --resource-group fset-rg --sku F1 --is-linux
az webapp create --resource-group fset-rg --plan fset-plan \
    --name fset-booking --runtime "PYTHON:3.11"
az webapp config appsettings set --resource-group fset-rg --name fset-booking \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true FLASK_ENV=production
az webapp deploy --resource-group fset-rg --name fset-booking \
    --src-path . --type zip
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List all 18 rooms |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create a booking |
| PUT | `/api/bookings/<id>` | Update a booking |
| DELETE | `/api/bookings/<id>` | Delete a booking |
| POST | `/api/availability` | Check slot availability |
| GET | `/api/health` | Health check (uptime monitors) |

### POST /api/bookings — Request body
```json
{
  "room_id": 4,
  "faculty_name": "Dr. Ahmed",
  "purpose": "Class",
  "start_time": "2026-06-15T09:00",
  "end_time": "2026-06-15T11:00"
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `fset_booking.db` (next to app.py) | Absolute path to SQLite file |
| `FLASK_ENV` | `development` | Set to `production` in prod |
| `PORT` | `5000` | Port (Render/Railway set this automatically) |

---

## Tech Stack

- **Backend:** Python 3.11, Flask 3.1, SQLite 3
- **Production server:** Gunicorn 21
- **Frontend:** Vanilla JS, CSS custom properties
- **Database:** SQLite (zero-config, no separate DB server needed)