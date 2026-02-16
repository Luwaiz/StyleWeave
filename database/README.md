# StyleWeave Database Documentation - MySQL

## Overview
The StyleWeave database stores fabric images, clothing templates, user data, and visualization combinations using **MySQL**.

## Prerequisites

- MySQL Server 8.0+ installed
- Python 3.8+
- mysql-connector-python package

---

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
cd database
chmod +x setup_mysql.sh
./setup_mysql.sh
```

This script will:
1. Create the database
2. Create a user with proper permissions
3. Generate config.py with your credentials
4. Initialize schema and seed data

### Option 2: Manual Setup

Follow the detailed guide in `MYSQL_SETUP.md`

---

## Database Structure

### Tables

#### 1. **fabrics**
Stores African fabric patterns (primarily Ankara) with color metadata.

| Column | Type | Description |
|--------|------|-------------|
| fabric_id | INT PRIMARY KEY | Unique fabric identifier |
| fabric_name | VARCHAR(100) | Display name (e.g., "Sunset Ankara") |
| fabric_type | VARCHAR(50) | Fabric category (default: "Ankara") |
| description | TEXT | Detailed description |
| image_path | VARCHAR(255) | Path to fabric image file |
| dominant_color | VARCHAR(7) | Primary hex color (e.g., "#FF6B35") |
| color_palette | TEXT | JSON array of extracted colors |
| upload_date | TIMESTAMP | When fabric was added |
| is_active | TINYINT(1) | Soft delete flag (1=active, 0=deleted) |
| created_at | TIMESTAMP | Record creation timestamp |

---

#### 2. **templates**
Stores clothing design templates (gown, skirt, top).

| Column | Type | Description |
|--------|------|-------------|
| template_id | INT PRIMARY KEY | Unique template identifier |
| template_name | VARCHAR(100) | Display name (e.g., "Flared Gown") |
| template_type | VARCHAR(50) | Category: "gown", "skirt", or "top" |
| image_path | VARCHAR(255) | Path to PNG template (with transparency) |
| description | TEXT | Template details |
| is_active | TINYINT(1) | Soft delete flag |
| created_at | TIMESTAMP | Record creation timestamp |

---

#### 3. **users** 
Stores user accounts for authentication and personalization.

| Column | Type | Description |
|--------|------|-------------|
| user_id | INT PRIMARY KEY | Unique user identifier |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| role | VARCHAR(20) | "customer" or "admin" |
| created_at | TIMESTAMP | Account creation date |
| last_login | TIMESTAMP | Last login timestamp |

---

## Using the Database Helper (MySQL)

### Import the Database Module
```python
from services.database import init_db

# Initialize database connection
db = init_db()
```

### Query Examples

#### Get All Active Fabrics
```python
fabrics = db.get_all_fabrics()
for fabric in fabrics:
    print(f"{fabric['fabric_name']} - {fabric['dominant_color']}")
```

#### Get Fabric by ID
```python
fabric = db.get_fabric_by_id(1)
if fabric:
    print(f"Found: {fabric['fabric_name']}")
```

#### Add New Fabric
```python
new_fabric = {
    'fabric_name': 'Ocean Waves',
    'fabric_type': 'Ankara',
    'description': 'Blue waves with white accents',
    'image_path': '/fabrics/ocean_waves.jpg',
    'dominant_color': '#0077BE',
    'color_palette': '["#0077BE", "#FFFFFF", "#005A8C"]'
}
fabric_id = db.add_fabric(new_fabric)
print(f"Added fabric with ID: {fabric_id}")
```

#### Get Templates by Type
```python
gowns = db.get_all_templates(template_type='gown')
print(f"Found {len(gowns)} gown templates")
```

#### Save User Selection
```python
selection_id = db.save_user_selection(
    user_id=1,
    fabric_id=3,
    template_id=5,
    result_path='/results/custom_design_001.png'
)
```

---

## Database Maintenance (MySQL)

### Backup Database
```bash
mysqldump -u styleweave_user -p styleweave_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u styleweave_user -p styleweave_db < backup.sql
```

### Optimize Database
```sql
OPTIMIZE TABLE fabrics, templates, users, user_selections, fabric_features;
```