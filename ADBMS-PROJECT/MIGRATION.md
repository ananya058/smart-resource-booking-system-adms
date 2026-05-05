# Migration Summary: Node.js/Express to Python/Flask

## Changes Made

### Backend Migration
- **Removed**: Node.js/Express server (`server.js`)
- **Removed**: Separate database module (`database.js`)
- **Removed**: Node.js package files (`package.json`, `package-lock.json`)
- **Added**: Python Flask backend (`app.py`)
- **Added**: Python requirements file (`requirements.txt`)

### Key Features Maintained
✅ SQLite database with same schema
✅ Auto-expiration of bookings after 12 hours
✅ Conflict detection for room bookings
✅ All CRUD operations for rooms, bookings, departments
✅ RESTful API endpoints
✅ CORS enabled for frontend communication
✅ Database initialization with default data

### API Port Change
- **Old**: `http://localhost:3000/api/`
- **New**: `http://localhost:8000/api/`

### Frontend Updates
- Updated `script.js` to use port 8000
- All API calls remain the same structure
- No changes to HTML or CSS

## Advantages of Python/Flask Backend

1. **Simpler Code**: Python is more readable and concise
2. **Easier for ADBMS**: Direct database operations, no ORM complexity
3. **Better for Learning**: Clear database queries and operations
4. **Built-in Features**: Flask has excellent documentation
5. **Lightweight**: Perfect for development and learning

## Installation & Running

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python3 app.py
```

## Testing the API

```bash
# Get all rooms
curl http://localhost:8000/api/rooms

# Get all bookings
curl http://localhost:8000/api/bookings

# Check health
curl http://localhost:8000/api/health
```

## Database Features

- **Auto-cleanup**: Runs hourly in background thread
- **Manual cleanup**: Available via POST /api/cleanup-bookings
- **Expiration timestamp**: `expires_at` column added automatically on booking creation
- **Conflict detection**: Prevents overlapping bookings for same room