"""
FSET Room Booking System - Flask Backend
Manages room bookings, availability checking, and database operations
"""

from flask import Flask, jsonify, request, send_file
import sqlite3
import os
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='.', static_url_path='')

# Database configuration
# On Render/Railway use DATABASE_URL env var pointing to a persistent disk path;
# fall back to the local file for development.
DATABASE = os.environ.get('DATABASE_PATH',
           os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fset_booking.db'))


# ─── CORS ────────────────────────────────────────────────────────────────────

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = jsonify({})
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response


# ─── DATABASE ────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database with required tables and seed data."""
    conn = get_db()
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            id       INTEGER PRIMARY KEY,
            name     TEXT UNIQUE NOT NULL,
            type     TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            icon     TEXT
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id      INTEGER NOT NULL,
            faculty_name TEXT NOT NULL,
            purpose      TEXT NOT NULL,
            start_time   TEXT NOT NULL,
            end_time     TEXT NOT NULL,
            created_at   TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )
    ''')

    c.execute('SELECT COUNT(*) FROM rooms')
    if c.fetchone()[0] == 0:
        rooms = [
            (1,  'Room 107',  'Classroom',  30, '🏫'),
            (2,  'Room 307',  'Classroom',  30, '🏫'),
            (3,  'Lab 401',   'Laboratory', 25, '🔬'),
            (4,  'Lab 402',   'Laboratory', 25, '💻'),
            (5,  'Lab 403',   'Laboratory', 25, '🤖'),
            (6,  'Lab 404',   'Laboratory', 25, '⚡'),
            (7,  'Room 1403', 'Classroom',  40, '📖'),
            (8,  'Room 1404', 'Classroom',  40, '📖'),
            (9,  'Room 1405', 'Classroom',  40, '📖'),
            (10, 'Room 1407', 'Classroom',  35, '🏫'),
            (11, 'Room 1503', 'Classroom',  30, '📖'),
            (12, 'Room 1504', 'Classroom',  30, '📖'),
            (13, 'Room 1505', 'Classroom',  30, '📖'),
            (14, 'Room 1507', 'Classroom',  35, '🏫'),
            (15, 'Room 1603', 'Classroom',  30, '📖'),
            (16, 'Room 1604', 'Classroom',  30, '📖'),
            (17, 'Room 1605', 'Classroom',  30, '📖'),
            (18, 'Room 1607', 'Classroom',  35, '🏫'),
        ]
        c.executemany('INSERT INTO rooms VALUES (?, ?, ?, ?, ?)', rooms)

    conn.commit()
    conn.close()


init_db()


# ─── ROUTES ──────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return send_file(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                  'fset_booking_system.html'))


@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    conn = get_db()
    rooms = conn.execute('SELECT * FROM rooms').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rooms])


@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    cutoff = (datetime.now() - timedelta(hours=24)).strftime('%Y-%m-%d %H:%M:%S')
    conn = get_db()
    conn.execute('DELETE FROM bookings WHERE created_at <= ?', (cutoff,))
    conn.commit()

    rows = conn.execute('''
        SELECT b.id, r.name AS room, b.faculty_name AS faculty,
               b.purpose, b.start_time AS start, b.end_time AS end
        FROM bookings b
        JOIN rooms r ON b.room_id = r.id
        WHERE b.created_at > ?
        ORDER BY b.start_time DESC
    ''', (cutoff,)).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json(silent=True) or {}
    required = ('room_id', 'faculty_name', 'purpose', 'start_time', 'end_time')
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        conn = get_db()
        conflict = conn.execute('''
            SELECT id FROM bookings
            WHERE room_id = ?
              AND NOT (end_time <= ? OR start_time >= ?)
        ''', (data['room_id'], data['start_time'], data['end_time'])).fetchone()

        if conflict:
            conn.close()
            return jsonify({'error': 'Time slot conflicts with existing booking'}), 409

        cur = conn.execute('''
            INSERT INTO bookings (room_id, faculty_name, purpose, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['room_id'], data['faculty_name'], data['purpose'],
              data['start_time'], data['end_time']))
        conn.commit()
        booking_id = cur.lastrowid
        conn.close()
        return jsonify({'id': booking_id, 'success': True}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.get_json(silent=True) or {}
    try:
        conn = get_db()
        conflict = conn.execute('''
            SELECT id FROM bookings
            WHERE room_id = ?
              AND id != ?
              AND NOT (end_time <= ? OR start_time >= ?)
        ''', (data['room_id'], booking_id,
              data['start_time'], data['end_time'])).fetchone()

        if conflict:
            conn.close()
            return jsonify({'error': 'Time slot conflicts with existing booking'}), 409

        conn.execute('''
            UPDATE bookings
            SET faculty_name = ?, purpose = ?, start_time = ?, end_time = ?
            WHERE id = ?
        ''', (data['faculty_name'], data['purpose'],
              data['start_time'], data['end_time'], booking_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    try:
        conn = get_db()
        conn.execute('DELETE FROM bookings WHERE id = ?', (booking_id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/availability', methods=['POST'])
def check_availability():
    data = request.get_json(silent=True) or {}
    conn = get_db()
    count = conn.execute('''
        SELECT COUNT(*) FROM bookings
        WHERE room_id = ?
          AND NOT (end_time <= ? OR start_time >= ?)
    ''', (data['room_id'], data['start_time'], data['end_time'])).fetchone()[0]
    conn.close()
    return jsonify({'available': count == 0})


@app.route('/api/health', methods=['GET'])
def health():
    """Simple health-check endpoint for Render / uptime monitors."""
    return jsonify({'status': 'ok', 'db': DATABASE})


# ─── ENTRY POINT ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    # Dev only — Gunicorn is used in production
    app.run(debug=True, port=5000)