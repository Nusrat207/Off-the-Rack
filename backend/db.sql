CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT
);


CREATE TABLE seller_info (
    id SERIAL PRIMARY KEY,
    shop_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT, 
    address text
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    category TEXT,
    subcategory TEXT,
    base_price TEXT,
    img TEXT,
    seller TEXT,
    code TEXT,
    descrip TEXT,
    color TEXT,
    brand text,
    discount DOUBLE PRECISION
);

CREATE TABLE product_size(
    product_id text,
    product_name TEXT,
	seller text,
    sizee TEXT,
    quantity TEXT
);