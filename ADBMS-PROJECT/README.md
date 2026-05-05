# FSET Resource Booking System

A comprehensive database-driven room booking system for the Faculty of Science, Engineering & Technology (FSET) at University of Science & Technology Chattogram.

## Tech Stack

- **Backend**: Python Flask
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **API Style**: RESTful JSON APIs

## Features

- **Database Backend**: SQLite database with proper schema for rooms, bookings, and departments
- **Room Management**: Add, view, update, and delete rooms
- **Booking System**: Create bookings with conflict detection
- **Auto-Expiration**: Bookings automatically expire and are deleted after 12 hours
- **Department Information**: View course offerings for CSE, EEE, and ETE departments
- **Real-time Updates**: All data persists across browser sessions
- **Responsive Design**: Bootstrap-based UI that works on all devices

## Database Schema

### Tables
- **rooms**: Stores room information (id, name, capacity, type, department)
- **bookings**: Stores booking records (id, room_id, faculty_name, purpose, start_time, end_time, status, created_at, expires_at)
- **departments**: Stores department information (id, code, name)

### Auto-Expiration Feature
- Each booking automatically expires 12 hours after creation
- Expired bookings are automatically deleted from the database
- The server runs a cleanup task every hour to remove expired bookings
- Manual cleanup can be triggered via the API endpoint: `POST /api/cleanup-bookings`

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the server:**
   ```bash
   python3 app.py
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:8000
   ```

## Project Structure

```
fset-booking-system/
├── index.html          # Main HTML page
├── style.css           # CSS styles
├── script.js           # Frontend JavaScript
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── fset_booking.db     # SQLite database (created automatically)
└── README.md           # This file
```

## API Endpoints

All endpoints return JSON responses. Base URL: `http://localhost:8000/api`

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get a specific booking
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking
- `GET /api/bookings/room/:roomId/date/:date` - Get bookings for specific room and date
- `POST /api/cleanup-bookings` - Manually clean expired bookings (12+ hours old)

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:code` - Get a specific department

### Health Check
- `GET /api/health` - Server health status

## Usage

1. **Home Page**: Overview of the booking system
2. **Room Booking**: Select a room, enter faculty name, purpose, and time slot
3. **Department**: View course offerings for different departments
4. **About**: System information

## Database Features

- **Conflict Detection**: Prevents double-booking of rooms at the same time
- **Auto-Expiration**: Bookings automatically expire and are deleted after 12 hours
- **Data Persistence**: All bookings are stored in SQLite database
- **Automatic Cleanup**: Server runs cleanup task every hour
- **Manual Cleanup**: Can be triggered via API endpoint
- **Default Data**: System comes pre-loaded with rooms and departments
- **CRUD Operations**: Full Create, Read, Update, Delete functionality

## Technologies Used

- **Backend**: Python 3, Flask
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome
- **HTTP**: RESTful APIs with JSON

## Project Structure

```
fset-booking-system/
├── index.html          # Main HTML page
├── style.css           # CSS styles
├── script.js           # Frontend JavaScript
├── app.py              # Flask backend server
├── requirements.txt    # Python dependencies
├── fset_booking.db     # SQLite database (created automatically)
└── README.md           # This file
```

## Development

To modify the system:

1. **Frontend Changes**: Edit `index.html`, `style.css`, or `script.js`
2. **Backend Changes**: Modify `app.py` (Flask routes and database operations)
3. **Database Schema**: Update table definitions in `app.py` (init_db function)
4. **Port Configuration**: Edit the port in `app.py` (currently: 8000) and update `script.js` API_BASE accordingly

## Running in Production

For production deployment:

```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:8000 app:app
```

## Future Enhancements

- User authentication and authorization
- Admin panel for managing rooms and users
- Email notifications for bookings
- Calendar view for bookings
- Room capacity management
- Advanced search and filtering
- Booking history and audit logs

## License

This project is created for educational purposes as part of the ADBMS (Advanced Database Management System) course.