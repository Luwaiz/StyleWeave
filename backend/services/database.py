"""
StyleWeave Database Helper - MySQL Version
Handles MySQL database connections and common operations
"""

import mysql.connector
from mysql.connector import pooling, Error
import os
import sys
from contextlib import contextmanager
from typing import List, Dict, Any, Optional

# Import configuration
try:
    from config import DB_CONFIG
except ImportError:
    # Fallback configuration if config.py doesn't exist
    print("⚠️  Warning: config.py not found. Using default configuration.")
    print("   Copy config.example.py to config.py and update credentials.\n")
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': 'password',  # CHANGE THIS!
        'database': 'styleweave_db',
        'port': 3306,
        'charset': 'utf8mb4'
    }

# Database file paths
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'schema.sql')
SEED_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'seed_data.sql')


class Database:
    """MySQL Database connection and operations manager"""
    
    def __init__(self, config: dict = None):
        """Initialize database connection pool"""
        self.config = config or DB_CONFIG
        self.connection_pool = None
        self._create_connection_pool()
    
    def _create_connection_pool(self):
        """Create a connection pool for better performance"""
        try:
            self.connection_pool = pooling.MySQLConnectionPool(
                pool_name="styleweave_pool",
                pool_size=5,
                pool_reset_session=True,
                **self.config
            )
            print("✅ MySQL connection pool created successfully")
        except Error as e:
            print(f"❌ Error creating connection pool: {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = None
        try:
            conn = self.connection_pool.get_connection()
            cursor = conn.cursor(dictionary=True)  # Return rows as dictionaries
            yield conn, cursor
            conn.commit()
        except Error as e:
            if conn:
                conn.rollback()
            print(f"❌ Database error: {e}")
            raise e
        finally:
            if conn and conn.is_connected():
                cursor.close()
                conn.close()
    
    def test_connection(self):
        """Test database connection"""
        try:
            with self.get_connection() as (conn, cursor):
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                if result:
                    print("✅ Database connection successful!")
                    return True
        except Error as e:
            print(f"❌ Connection failed: {e}")
            return False
    
    def execute_script(self, script_path: str):
        """Execute a SQL script file"""
        with open(script_path, 'r', encoding='utf-8') as f:
            script = f.read()
        
        # Split script into individual statements
        statements = [stmt.strip() for stmt in script.split(';') if stmt.strip()]
        
        with self.get_connection() as (conn, cursor):
            for statement in statements:
                if statement and not statement.startswith('--'):
                    try:
                        cursor.execute(statement)
                    except Error as e:
                        print(f"⚠️  Error executing statement: {e}")
                        print(f"Statement: {statement[:100]}...")
        
        print(f"✅ Executed script: {os.path.basename(script_path)}")
    
    def create_database(self):
        """Create the database if it doesn't exist"""
        temp_config = self.config.copy()
        db_name = temp_config.pop('database')
        
        try:
            conn = mysql.connector.connect(**temp_config)
            cursor = conn.cursor()
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{db_name}' created/verified")
            cursor.close()
            conn.close()
        except Error as e:
            print(f"❌ Error creating database: {e}")
            raise
    
    def init_database(self):
        """Initialize database with schema"""
        print("📊 Initializing database schema...")
        self.create_database()
        self.execute_script(SCHEMA_PATH)
        print("✅ Database schema created successfully!")
    
    def seed_database(self):
        """Populate database with initial data"""
        print("🌱 Seeding database with initial data...")
        self.execute_script(SEED_DATA_PATH)
        print("✅ Database seeded successfully!")
    
    def reset_database(self):
        """Drop all tables and reinitialize"""
        print("⚠️  Resetting database...")
        
        with self.get_connection() as (conn, cursor):
            # Disable foreign key checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
            
            # Drop all tables
            tables = ['user_selections', 'fabric_features', 'users', 'templates', 'fabrics']
            for table in tables:
                try:
                    cursor.execute(f"DROP TABLE IF EXISTS {table}")
                    print(f"   Dropped table: {table}")
                except Error as e:
                    print(f"   Warning: Could not drop {table}: {e}")
            
            # Re-enable foreign key checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        
        self.init_database()
        self.seed_database()
        print("✅ Database reset complete!")
    
    # ==========================================
    # Query Helper Functions
    # ==========================================
    
    def fetch_one(self, query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        """Execute query and return one result as dictionary"""
        with self.get_connection() as (conn, cursor):
            cursor.execute(query, params)
            return cursor.fetchone()
    
    def fetch_all(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Execute query and return all results as list of dictionaries"""
        with self.get_connection() as (conn, cursor):
            cursor.execute(query, params)
            return cursor.fetchall()
    
    def execute_query(self, query: str, params: tuple = ()) -> int:
        """Execute INSERT/UPDATE/DELETE query and return affected rows"""
        with self.get_connection() as (conn, cursor):
            cursor.execute(query, params)
            return cursor.rowcount
    
    def insert_and_get_id(self, query: str, params: tuple = ()) -> int:
        """Execute INSERT query and return the last inserted row ID"""
        with self.get_connection() as (conn, cursor):
            cursor.execute(query, params)
            return cursor.lastrowid
    
    # ==========================================
    # Fabric Operations
    # ==========================================
    
    def get_all_fabrics(self, active_only: bool = True) -> List[Dict[str, Any]]:
        """Retrieve all fabrics"""
        query = "SELECT * FROM fabrics"
        if active_only:
            query += " WHERE is_active = 1"
        query += " ORDER BY upload_date DESC"
        return self.fetch_all(query)
    
    def get_fabric_by_id(self, fabric_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a single fabric by ID"""
        query = "SELECT * FROM fabrics WHERE fabric_id = %s"
        return self.fetch_one(query, (fabric_id,))
    
    def add_fabric(self, fabric_data: Dict[str, Any]) -> int:
        """Add a new fabric to the database"""
        query = """
        INSERT INTO fabrics (fabric_name, fabric_type, description, image_path, 
                           dominant_color, color_palette)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (
            fabric_data['fabric_name'],
            fabric_data.get('fabric_type', 'Ankara'),
            fabric_data.get('description', ''),
            fabric_data['image_path'],
            fabric_data.get('dominant_color', ''),
            fabric_data.get('color_palette', '[]')
        )
        return self.insert_and_get_id(query, params)
    
    def update_fabric(self, fabric_id: int, fabric_data: Dict[str, Any]) -> int:
        """Update an existing fabric"""
        query = """
        UPDATE fabrics 
        SET fabric_name = %s, fabric_type = %s, description = %s, 
            dominant_color = %s, color_palette = %s
        WHERE fabric_id = %s
        """
        params = (
            fabric_data['fabric_name'],
            fabric_data.get('fabric_type', 'Ankara'),
            fabric_data.get('description', ''),
            fabric_data.get('dominant_color', ''),
            fabric_data.get('color_palette', '[]'),
            fabric_id
        )
        return self.execute_query(query, params)
    
    def delete_fabric(self, fabric_id: int, soft_delete: bool = True) -> int:
        """Delete or deactivate a fabric"""
        if soft_delete:
            query = "UPDATE fabrics SET is_active = 0 WHERE fabric_id = %s"
        else:
            query = "DELETE FROM fabrics WHERE fabric_id = %s"
        return self.execute_query(query, (fabric_id,))
    
    # ==========================================
    # Template Operations
    # ==========================================
    
    def get_all_templates(self, template_type: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve all templates, optionally filtered by type"""
        query = "SELECT * FROM templates WHERE is_active = 1"
        params = ()
        
        if template_type:
            query += " AND template_type = %s"
            params = (template_type,)
        
        query += " ORDER BY template_type, template_name"
        return self.fetch_all(query, params)
    
    def get_template_by_id(self, template_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a single template by ID"""
        query = "SELECT * FROM templates WHERE template_id = %s"
        return self.fetch_one(query, (template_id,))
    
    def add_template(self, template_data: Dict[str, Any]) -> int:
        """Add a new template to the database"""
        query = """
        INSERT INTO templates (template_name, template_type, image_path, description)
        VALUES (%s, %s, %s, %s)
        """
        params = (
            template_data['template_name'],
            template_data['template_type'],
            template_data['image_path'],
            template_data.get('description', '')
        )
        return self.insert_and_get_id(query, params)
    
    # ==========================================
    # User Selection Operations
    # ==========================================
    
    def save_user_selection(self, user_id: Optional[int], fabric_id: int, 
                          template_id: int, result_path: str) -> int:
        """Save a user's fabric-template combination"""
        query = """
        INSERT INTO user_selections (user_id, fabric_id, template_id, result_image_path)
        VALUES (%s, %s, %s, %s)
        """
        return self.insert_and_get_id(query, (user_id, fabric_id, template_id, result_path))
    
    def get_user_selections(self, user_id: int) -> List[Dict[str, Any]]:
        """Get all selections for a specific user"""
        query = """
        SELECT us.*, f.fabric_name, t.template_name 
        FROM user_selections us
        JOIN fabrics f ON us.fabric_id = f.fabric_id
        JOIN templates t ON us.template_id = t.template_id
        WHERE us.user_id = %s
        ORDER BY us.created_at DESC
        """
        return self.fetch_all(query, (user_id,))


# Singleton instance
db = None

def init_db(config=None):
    """Initialize database singleton"""
    global db
    db = Database(config)
    return db


if __name__ == "__main__":
    """Test database operations"""
    print("=== StyleWeave MySQL Database Helper ===\n")
    
    # Initialize database
    db = init_db()
    
    # Test connection
    if not db.test_connection():
        print("\n❌ Cannot connect to MySQL. Please check:")
        print("   1. MySQL server is running")
        print("   2. Credentials in config.py are correct")
        print("   3. Database exists or user has CREATE DATABASE permission")
        sys.exit(1)
    
    # Ask user what to do
    print("\nWhat would you like to do?")
    print("1. Initialize database (create tables)")
    print("2. Reset database (drop & recreate everything)")
    print("3. Test queries")
    print("4. Exit")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == '1':
        db.init_database()
    elif choice == '2':
        confirm = input("⚠️  This will delete ALL data. Continue? (yes/no): ")
        if confirm.lower() == 'yes':
            db.reset_database()
    elif choice == '3':
        print("\n--- Testing Fabric Queries ---")
        fabrics = db.get_all_fabrics()
        print(f"Total fabrics: {len(fabrics)}")
        if fabrics:
            print(f"First fabric: {fabrics[0]['fabric_name']}")
        
        print("\n--- Testing Template Queries ---")
        templates = db.get_all_templates()
        print(f"Total templates: {len(templates)}")
        
        if templates:
            gown_templates = db.get_all_templates(template_type='gown')
            print(f"Gown templates: {len(gown_templates)}")
    
    print("\n✅ Done!")