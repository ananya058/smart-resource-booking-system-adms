from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta
import threading
import time

app = Flask(__name__)
CORS(app)

# Database configuration
DATABASE = 'fset_booking.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create rooms table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            capacity INTEGER DEFAULT 30,
            type TEXT DEFAULT 'Classroom',
            department TEXT DEFAULT 'General',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create bookings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id INTEGER NOT NULL,
            faculty_name TEXT NOT NULL,
            purpose TEXT NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,
            status TEXT DEFAULT 'confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        )
    ''')
    
    # Create departments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS departments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    
    # Insert default rooms
    default_rooms = [
        ('Room 107', 30, 'Classroom'),
        ('Room 307', 30, 'Classroom'),
        ('Lab 401', 25, 'Laboratory'),
        ('Lab 402', 25, 'Laboratory'),
        ('Lab 403', 25, 'Laboratory'),
        ('Lab 404', 25, 'Laboratory'),
        ('Room 1403', 40, 'Classroom'),
        ('Room 1404', 40, 'Classroom'),
        ('Room 1405', 40, 'Classroom'),
        ('Room 1407', 35, 'Classroom'),
        ('Room 1503', 30, 'Classroom'),
        ('Room 1504', 30, 'Classroom'),
        ('Room 1505', 30, 'Classroom'),
        ('Room 1507', 35, 'Classroom'),
        ('Room 1603', 30, 'Classroom'),
        ('Room 1604', 30, 'Classroom'),
        ('Room 1605', 30, 'Classroom'),
        ('Room 1607', 35, 'Classroom'),
    ]
    
    for name, capacity, room_type in default_rooms:
        cursor.execute(
            'INSERT OR IGNORE INTO rooms (name, capacity, type) VALUES (?, ?, ?)',
            (name, capacity, room_type)
        )
    
    # Insert default departments
    default_departments = [
        ('CSE', 'Computer Science & Engineering'),
        ('EEE', 'Electrical & Electronic Engineering'),
        ('ETE', 'Electronic & Telecommunication Engineering'),
    ]
    
    for code, name in default_departments:
        cursor.execute(
            'INSERT OR IGNORE INTO departments (code, name) VALUES (?, ?)',
            (code, name)
        )
    
    conn.commit()
    conn.close()
    print('✅ Database initialized with default data.')

def cleanup_expired_bookings():
    """Delete bookings older than 12 hours"""
    conn = get_db()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    
    cursor.execute(
        'DELETE FROM bookings WHERE expires_at IS NOT NULL AND expires_at < ?',
        (now,)
    )
    
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted > 0:
        print(f'🗑️  Cleaned {deleted} expired booking(s) from database.')
    
    return deleted

def cleanup_scheduler():
    """Run cleanup task every hour"""
    while True:
        time.sleep(3600)  # Run every 1 hour
        cleanup_expired_bookings()

# Start cleanup scheduler in background thread
cleanup_thread = threading.Thread(target=cleanup_scheduler, daemon=True)
cleanup_thread.start()

# ============ ROOMS API ============

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    """Get all rooms"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM rooms ORDER BY name')
    rooms = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(rooms)

@app.route('/api/rooms/<int:room_id>', methods=['GET'])
def get_room(room_id):
    """Get a specific room"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM rooms WHERE id = ?', (room_id,))
    room = cursor.fetchone()
    conn.close()
    
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    
    return jsonify(dict(room))

@app.route('/api/rooms', methods=['POST'])
def create_room():
    """Create a new room"""
    data = request.get_json()
    
    if not data or 'name' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO rooms (name, capacity, type, department) VALUES (?, ?, ?, ?)',
            (data['name'], data.get('capacity', 30), data.get('type', 'Classroom'), data.get('department', 'General'))
        )
        conn.commit()
        room_id = cursor.lastrowid
        conn.close()
        
        return jsonify({'id': room_id, 'message': 'Room created successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Room name already exists'}), 409

@app.route('/api/rooms/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    """Update a room"""
    data = request.get_json()
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE rooms SET name = ?, capacity = ?, type = ?, department = ? WHERE id = ?',
            (data['name'], data.get('capacity'), data.get('type'), data.get('department'), room_id)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Room updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rooms/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    """Delete a room"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM rooms WHERE id = ?', (room_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Room deleted successfully'})

# ============ BOOKINGS API ============

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, r.name as room_name, r.type as room_type
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        ORDER BY b.start_time DESC
    ''')
    bookings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(bookings)

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get a specific booking"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT b.*, r.name as room_name, r.type as room_type
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.id = ?
    ''', (booking_id,))
    booking = cursor.fetchone()
    conn.close()
    
    if not booking:
        return jsonify({'error': 'Booking not found'}), 404
    
    return jsonify(dict(booking))

def check_conflict(room_id, start_time, end_time, exclude_id=None):
    """Check for booking conflicts"""
    conn = get_db()
    cursor = conn.cursor()
    
    query = '''
        SELECT COUNT(*) as count FROM bookings
        WHERE room_id = ? AND status = 'confirmed'
        AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?))
    '''
    params = [room_id, end_time, start_time, start_time, end_time]
    
    if exclude_id:
        query += ' AND id != ?'
        params.append(exclude_id)
    
    cursor.execute(query, params)
    result = cursor.fetchone()
    conn.close()
    
    return result['count'] > 0

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking"""
    data = request.get_json()
    
    # Validate required fields
    required = ['room_id', 'faculty_name', 'start_time', 'end_time']
    if not data or not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check for conflicts
    if check_conflict(data['room_id'], data['start_time'], data['end_time']):
        return jsonify({'error': 'Time conflict detected for this room'}), 409
    
    try:
        # Calculate expiration time (12 hours from now)
        expires_at = (datetime.now() + timedelta(hours=12)).isoformat()
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO bookings (room_id, faculty_name, purpose, start_time, end_time, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            data['room_id'],
            data['faculty_name'],
            data.get('purpose', 'Class'),
            data['start_time'],
            data['end_time'],
            expires_at
        ))
        conn.commit()
        booking_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'id': booking_id,
            'expires_at': expires_at,
            'message': 'Booking created successfully'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    """Update a booking"""
    data = request.get_json()
    
    # Check for conflicts (excluding current booking)
    if check_conflict(data['room_id'], data['start_time'], data['end_time'], booking_id):
        return jsonify({'error': 'Time conflict detected for this room'}), 409
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE bookings 
            SET room_id = ?, faculty_name = ?, purpose = ?, start_time = ?, end_time = ?, status = ?
            WHERE id = ?
        ''', (
            data['room_id'],
            data['faculty_name'],
            data.get('purpose', 'Class'),
            data['start_time'],
            data['end_time'],
            data.get('status', 'confirmed'),
            booking_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Booking updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Delete a booking"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM bookings WHERE id = ?', (booking_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Booking deleted successfully'})

@app.route('/api/bookings/room/<int:room_id>/date/<date>', methods=['GET'])
def get_bookings_by_date(room_id, date):
    """Get bookings for a specific room and date"""
    conn = get_db()
    cursor = conn.cursor()
    
    start_of_day = f"{date}T00:00:00"
    end_of_day = f"{date}T23:59:59"
    
    cursor.execute('''
        SELECT * FROM bookings
        WHERE room_id = ? AND start_time >= ? AND start_time <= ?
        ORDER BY start_time
    ''', (room_id, start_of_day, end_of_day))
    
    bookings = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(bookings)

# ============ CLEANUP API ============

@app.route('/api/cleanup-bookings', methods=['POST'])
def manual_cleanup():
    """Manually trigger cleanup of expired bookings"""
    deleted = cleanup_expired_bookings()
    return jsonify({'message': f'Cleaned {deleted} expired booking(s).', 'count': deleted})

# ============ DEPARTMENTS API ============

@app.route('/api/departments', methods=['GET'])
def get_departments():
    """Get all departments"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM departments ORDER BY code')
    departments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(departments)

@app.route('/api/departments/<code>', methods=['GET'])
def get_department(code):
    """Get a specific department"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM departments WHERE code = ?', (code,))
    department = cursor.fetchone()
    conn.close()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    return jsonify(dict(department))

# ============ HEALTH CHECK ============

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'OK', 'message': 'FSET Booking System API is running'})

# ============ ROOT ROUTE ============

@app.route('/')
def index():
    """Serve index.html"""
    return open('index.html').read()

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run Flask app
    print('🚀 FSET Booking System server running on http://localhost:8000')
    print('📚 API endpoints available at http://localhost:8000/api/')
    
    app.run(debug=True, port=8000)