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

SELECT 
    p.id, 
    p.product_name, 
    p.category, 
    p.subcategory, 
    p.base_price, 
    p.img, 
    p.seller, 
    p.code, 
    p.descrip, 
    p.color, 
    p.brand, 
    p.discount, 
    json_agg(json_build_object('size', ps.sizee, 'stock', ps.quantity)) AS sizes
FROM products p
LEFT JOIN product_size ps ON p.id::TEXT = ps.product_id
WHERE p.category ILIKE 'Clothes' AND p.subcategory ILIKE 'T-shirt'
GROUP BY p.id;


ALTER TABLE product_size ADD CONSTRAINT unique_product_size UNIQUE (product_id, sizee);
