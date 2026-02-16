-- StyleWeave Seed Data
-- Initial data for testing and development

-- ============================================
-- SEED DATA: Templates
-- ============================================
INSERT INTO templates (template_name, template_type, image_path, description) VALUES
('Classic Flared Gown', 'gown', '/templates/gown_flared.png', 'Elegant ankle-length flared gown with fitted bodice'),
('Mermaid Gown', 'gown', '/templates/gown_mermaid.png', 'Sophisticated mermaid-style gown with dramatic flare'),
('A-Line Gown', 'gown', '/templates/gown_aline.png', 'Timeless A-line gown with flowing silhouette'),

('Pencil Skirt', 'skirt', '/templates/skirt_pencil.png', 'Sleek knee-length pencil skirt'),
('Wrap Skirt', 'skirt', '/templates/skirt_wrap.png', 'Traditional wrap skirt with side tie'),
('High-Waist Skirt', 'skirt', '/templates/skirt_highwaist.png', 'Fashionable high-waist flared skirt'),

('Off-Shoulder Top', 'top', '/templates/top_offshoulder.png', 'Trendy off-shoulder blouse with bell sleeves'),
('Peplum Top', 'top', '/templates/top_peplum.png', 'Fitted peplum top with waist emphasis'),
('Crop Top', 'top', '/templates/top_crop.png', 'Modern crop top with short sleeves');

-- ============================================
-- SEED DATA: Fabrics (Sample Ankara patterns)
-- ============================================
INSERT INTO fabrics (fabric_name, fabric_type, description, image_path, dominant_color, color_palette) VALUES
('Sunset Ankara', 'Ankara', 'Vibrant orange and yellow geometric patterns', '/fabrics/ankara_sunset.jpg', '#FF6B35', '["#FF6B35", "#FFD23F", "#8B4513", "#FFA500"]'),
('Royal Blue Damask', 'Ankara', 'Deep blue with gold circular motifs', '/fabrics/ankara_royal.jpg', '#1E3A8A', '["#1E3A8A", "#FFD700", "#FFFFFF", "#4169E1"]'),
('Emerald Garden', 'Ankara', 'Rich green with floral elements', '/fabrics/ankara_emerald.jpg', '#059669', '["#059669", "#FCD34D", "#134E4A", "#10B981"]'),
('Burgundy Elegance', 'Ankara', 'Deep red with black and gold accents', '/fabrics/ankara_burgundy.jpg', '#9F1239', '["#9F1239", "#000000", "#FFD700", "#DC2626"]'),
('Purple Majesty', 'Ankara', 'Royal purple with pink geometric designs', '/fabrics/ankara_purple.jpg', '#7C3AED', '["#7C3AED", "#EC4899", "#FFFFFF", "#A855F7"]'),
('Turquoise Wave', 'Ankara', 'Bright turquoise with white wave patterns', '/fabrics/ankara_turquoise.jpg', '#06B6D4', '["#06B6D4", "#FFFFFF", "#0E7490", "#67E8F9"]'),
('Golden Sunset', 'Ankara', 'Warm gold with brown tribal patterns', '/fabrics/ankara_golden.jpg', '#F59E0B', '["#F59E0B", "#92400E", "#FBBF24", "#78350F"]'),
('Coral Bloom', 'Ankara', 'Coral pink with cream floral motifs', '/fabrics/ankara_coral.jpg', '#FB7185', '["#FB7185", "#FEF3C7", "#F472B6", "#FFFFFF"]'),
('Midnight Blue', 'Ankara', 'Navy blue with silver star patterns', '/fabrics/ankara_midnight.jpg', '#1E40AF', '["#1E40AF", "#94A3B8", "#3B82F6", "#000000"]'),
('Forest Green', 'Ankara', 'Deep forest green with yellow tribal prints', '/fabrics/ankara_forest.jpg', '#166534', '["#166534", "#FDE047", "#14532D", "#4ADE80"]'),
('Crimson Fire', 'Ankara', 'Bright red with black geometric patterns', '/fabrics/ankara_crimson.jpg', '#DC2626', '["#DC2626", "#000000", "#FEF2F2", "#991B1B"]'),
('Sky Blue', 'Ankara', 'Light blue with white cloud-like designs', '/fabrics/ankara_sky.jpg', '#38BDF8', '["#38BDF8", "#FFFFFF", "#0284C7", "#BAE6FD"]'),
('Chocolate Brown', 'Ankara', 'Rich brown with cream paisley patterns', '/fabrics/ankara_chocolate.jpg', '#78350F', '["#78350F", "#FEF3C7", "#92400E", "#D97706"]'),
('Lavender Dream', 'Ankara', 'Soft lavender with purple floral designs', '/fabrics/ankara_lavender.jpg', '#C084FC', '["#C084FC", "#7C3AED", "#F3E8FF", "#A855F7"]'),
('Mustard Spice', 'Ankara', 'Bright mustard yellow with red accents', '/fabrics/ankara_mustard.jpg', '#EAB308', '["#EAB308", "#DC2626", "#CA8A04", "#FEF3C7"]');

-- ============================================
-- SEED DATA: Admin User (Optional)
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@styleweave.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5A5myj7BFeZcS', 'admin'),
('demo_user', 'demo@styleweave.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5A5myj7BFeZcS', 'customer');

-- ============================================
-- SEED DATA: Sample User Selections
-- ============================================
INSERT INTO user_selections (user_id, fabric_id, template_id, result_image_path) VALUES
(2, 1, 1, '/results/sunset_gown_flared.png'),
(2, 3, 5, '/results/emerald_skirt_wrap.png'),
(2, 5, 7, '/results/purple_top_offshoulder.png');