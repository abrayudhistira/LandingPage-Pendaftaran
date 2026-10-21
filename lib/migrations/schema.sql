-- Ambasan Legal Registration — initial schema
-- Run: mysql -u root -p $DB_NAME < lib/migrations/schema.sql

CREATE TABLE IF NOT EXISTS categories (
  `key`       VARCHAR(64) PRIMARY KEY,
  name         VARCHAR(128) NOT NULL,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (`key`, name, sort_order) VALUES
  ('pendaftaran-baru', 'Pendaftaran Baru', 0),
  ('pendataan-ulang',  'Pendataan Ulang',  1);

CREATE TABLE IF NOT EXISTS programs (
  slug         VARCHAR(128) PRIMARY KEY,
  category_key VARCHAR(64) NOT NULL,
  name         VARCHAR(256) NOT NULL,
  summary      TEXT NOT NULL,
  detail       TEXT NOT NULL,
  audience     TEXT NOT NULL,
  url          VARCHAR(2083) DEFAULT NULL,
  benefit_enabled TINYINT(1) NOT NULL DEFAULT 0,
  benefit_text TEXT DEFAULT NULL,
  benefit_image VARCHAR(512) DEFAULT NULL,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_key) REFERENCES categories(`key`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_accounts (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(256) NOT NULL UNIQUE,
  password_salt  VARCHAR(64) NOT NULL,
  password_hash  VARCHAR(256) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed admin account (lbhambarsan@gmail.com)
-- Password hash was generated via scryptSync from the secret password.
-- The plaintext password is intentionally NOT stored in source control.
INSERT IGNORE INTO admin_accounts (email, password_salt, password_hash) VALUES
  ('lbhambarsan@gmail.com', '296eb483934fe0bda28601caddf84359', 'ef5ceafb71147e417401c48fced3adb76caf6d67402654425dbf3a94c60a4e7e950242bacf1669cbff0e060ca1fca785e841197093e39ccfe09bd1fb4ec55267');

-- Existing installations: add these columns manually if they predate this schema revision.
-- ALTER TABLE programs ADD COLUMN benefit_enabled TINYINT(1) NOT NULL DEFAULT 0;
-- ALTER TABLE programs ADD COLUMN benefit_text TEXT DEFAULT NULL;
-- ALTER TABLE programs ADD COLUMN benefit_image VARCHAR(512) DEFAULT NULL;
