-- StyleWeave Database Schema - MySQL Version
-- Make sure to create database first: CREATE DATABASE styleweave_db;

-- ============================================
-- TABLE: fabrics
-- Stores fabric information and metadata
-- ============================================
CREATE TABLE IF NOT EXISTS fabrics (
    fabric_id INT AUTO_INCREMENT PRIMARY KEY,
    fabric_name VARCHAR(100) NOT NULL,
    fabric_type VARCHAR(50) DEFAULT 'Ankara',     -- e.g., Ankara, Kente, Adire
    description TEXT,
    image_path VARCHAR(255) NOT NULL,              -- Path to fabric image
    dominant_color VARCHAR(7),                     -- Hex color code (e.g., #FF5733)
    color_palette TEXT,                            -- JSON array of extracted colors
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT(1) DEFAULT 1,                -- Soft delete flag (0=deleted, 1=active)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: templates
-- Stores clothing template designs
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
    template_id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,           -- e.g., "Flared Gown", "Pencil Skirt"
    template_type VARCHAR(50) NOT NULL,            -- e.g., "gown", "skirt", "top"
    image_path VARCHAR(255) NOT NULL,              -- Path to template image (PNG with transparency)
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: users (Optional - for future expansion)
-- Stores user information
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),                    -- Store hashed passwords only
    role VARCHAR(20) DEFAULT 'customer',           -- 'customer' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: user_selections
-- Stores user's fabric-template combinations
-- ============================================
CREATE TABLE IF NOT EXISTS user_selections (
    selection_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,                                   -- NULL for guest users
    fabric_id INT NOT NULL,
    template_id INT NOT NULL,
    result_image_path VARCHAR(255),                -- Path to generated overlay image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (fabric_id) REFERENCES fabrics(fabric_id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(template_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: fabric_features (For KNN recommendations)
-- Stores extracted color features for ML
-- ============================================
CREATE TABLE IF NOT EXISTS fabric_features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    fabric_id INT NOT NULL UNIQUE,
    feature_vector TEXT NOT NULL,                  -- JSON array of color features
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fabric_id) REFERENCES fabrics(fabric_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX idx_fabrics_active ON fabrics(is_active);
CREATE INDEX idx_templates_type ON templates(template_type);
CREATE INDEX idx_user_selections_user ON user_selections(user_id);
CREATE INDEX idx_user_selections_fabric ON user_selections(fabric_id);