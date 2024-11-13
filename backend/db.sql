CREATE TABLE user_info (
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT, 
    google_id TEXT, 
    facebook_id TEXT 
);

select * from user_info;

CREATE TABLE seller_info (
    id SERIAL PRIMARY KEY,
    shop_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT, 
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_name TEXT,
    category TEXT,
    subcategory TEXT,
    price TEXT,
    img TEXT,
    sizee TEXT,
    seller TEXT,
    quantity integer,
    code TEXT,
    descrip TEXT,
    color TEXT

    BRAND dite bhule gesi
);
