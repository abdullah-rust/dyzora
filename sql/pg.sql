CREATE DATABASE dyzoradb;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,                  -- unique user id
    name VARCHAR(100) NOT NULL,             -- full name
    email VARCHAR(150) UNIQUE NOT NULL,     -- login/email (unique)
    password_hash TEXT,                     -- hashed password (NULL if Google/Microsoft)
    provider VARCHAR(50) DEFAULT 'local',   -- 'local', 'google', 'microsoft'
    provider_id VARCHAR(255) DEFAULT '',               -- Google/Microsoft ka user id
    role VARCHAR(20) DEFAULT 'customer',    -- 'customer' ya 'admin'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL,
    fullName VARCHAR(100) NOT NULL,       -- jis naam pe delivery ho
    phoneNumber VARCHAR(20) NOT NULL,     -- contact number
    street VARCHAR(255) NOT NULL,          -- street / house number
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),                    -- province/state
    postalCode VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Pakistan',
    is_default BOOLEAN DEFAULT false,      -- default address ya nahi
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table: high-level order summary
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_status VARCHAR(50) DEFAULT 'pending',       -- pending, confirmed, shipped, delivered, cancelled
    total_amount NUMERIC(10,2) NOT NULL,              -- order ka total
    payment_method VARCHAR(50),                       -- card, cash, paypal, etc.
    payment_status VARCHAR(50) DEFAULT 'unpaid',      -- unpaid, paid, refunded
    shipping_address_id INT REFERENCES addresses(id), -- delivery address
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table: order ke andar products ka breakdown
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE, -- kis order ka part hai
    product_id INT NOT NULL REFERENCES products(id),               -- product ka reference
    product_name VARCHAR(255) NOT NULL,                            -- snapshot name
    variants JSONB DEFAULT '{}'::jsonb,                            -- e.g. {"color": "Red", "size": "XL", "storage": "128GB"}
    quantity INT NOT NULL CHECK (quantity > 0),                    -- qty > 0
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),               -- per unit price
    subtotal NUMERIC(12,2) GENERATED ALWAYS AS (quantity * price) STORED, -- auto subtotal
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  images TEXT[],            
  tags TEXT[], 
  variants JSONB DEFAULT '{}'::jsonb,   -- e.g. {"color":["Red","Blue"], "size":["M","L"], "storage":["128GB","256GB"]}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_comments (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,  -- kis product pe comment hai
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,        -- kisne comment kiya
    rating INT CHECK (rating >= 1 AND rating <= 5),                     -- 1-5 star rating
    comment TEXT,                                                       -- actual comment
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_visible BOOLEAN DEFAULT TRUE                                      -- agar moderation ke liye hide karna ho
);




https://raw.githubusercontent.com/abdullah-rust/dyzora/main/dyzora/public/screenshot.png