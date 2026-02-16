# StyleWeave MySQL Setup Guide

## Step 1: Install MySQL

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### On macOS:
```bash
brew install mysql
brew services start mysql
```

### On Windows:
Download and install from: https://dev.mysql.com/downloads/installer/

---

## Step 2: Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

Follow the prompts to:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database

---

## Step 3: Create Database and User

Login to MySQL:
```bash
sudo mysql -u root -p
```

Run these commands:
```sql
-- Create database
CREATE DATABASE styleweave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (change password!)
CREATE USER 'styleweave_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON styleweave_db.* TO 'styleweave_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT user, host FROM mysql.user WHERE user = 'styleweave_user';

-- Exit
EXIT;
```

---

## Step 4: Install Python MySQL Connector
```bash
pip install mysql-connector-python
```

---

## Step 5: Configure StyleWeave

1. **Copy the config file:**
```bash
cd backend
cp config.example.py config.py
```

2. **Edit config.py with your credentials:**
```python
DB_CONFIG = {
    'host': 'localhost',
    'user': 'styleweave_user',
    'password': 'your_secure_password',  # CHANGE THIS!
    'database': 'styleweave_db',
    'port': 3306,
    'charset': 'utf8mb4'
}
```

---

## Step 6: Initialize the Database
```bash
cd backend
python3 services/database.py
```

Select option **2** to reset and seed the database.

---

## Step 7: Verify Installation
```bash
python3 db_manager.py stats
```

You should see:
```
📊 STYLEWEAVE DATABASE STATISTICS
==================================================

✨ Fabrics: 15
👗 Templates: 9

Template breakdown:
  • Gown: 3
  • Skirt: 3
  • Top: 3
```

---

## Troubleshooting

### Cannot connect to MySQL
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

### Access denied for user
```sql
-- Login as root
sudo mysql -u root -p

-- Verify user exists
SELECT user, host FROM mysql.user WHERE user = 'styleweave_user';

-- Reset password if needed
ALTER USER 'styleweave_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Database doesn't exist
```sql
-- Create it manually
CREATE DATABASE styleweave_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```