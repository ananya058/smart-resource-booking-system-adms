import os
import sys

project_home = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_home)

from app import app as application