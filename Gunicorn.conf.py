# Gunicorn production configuration
# https://docs.gunicorn.org/en/stable/configure.html

import multiprocessing

# Server socket
bind = "0.0.0.0:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = "-"       # stdout
errorlog = "-"        # stderr
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "fset_booking"

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190