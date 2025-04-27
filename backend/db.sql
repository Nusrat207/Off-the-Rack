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

CREATE TABLE favorites (
    f_id SERIAL PRIMARY KEY,
    product_id text,
    product_name TEXT,
    base_price TEXT,
    img TEXT,
    seller TEXT,
    user_mail text
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

CREATE TABLE cart (
    user_mail TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    sizee TEXT,
    quantity INTEGER NOT NULL,
    img TEXT,
    price double precision,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table customer_order(
	order_id text,
	product_id text,
    product_name text,
	user_mail text,
	sizee text,
	quantity text,
	price text,
	img text,
	seller text,
    status text,
    order_time text 
);

create table delivery_info(
    order_id text,
    fullName text,
    phone text,
    address text,
    payment text,
    trxID text
);

create table order_notif(
    order_id text,
    seller text,
    order_time text,
    status text 
);

create table review(
    review_id serial,
    product_id text,
    seller text,
    user text,
    comment text,
    stars text,
    datee text,
    reply text,
    verified BOOLEAN DEFAULT FALSE
);

--1
CREATE OR REPLACE FUNCTION delete_cart_items_after_checkout()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM cart WHERE user_mail = NEW.user_mail;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_checkout_delete_cart_items
AFTER insert ON customer_order
FOR EACH ROW
EXECUTE FUNCTION delete_cart_items_after_checkout();


--2
CREATE OR REPLACE FUNCTION decrease_product_quantity_after_checkout()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_size
    SET quantity = CAST(quantity AS INTEGER) - CAST(NEW.quantity AS INTEGER)
    WHERE product_id = NEW.product_id AND sizee = NEW.sizee;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No matching product_size entry found for Product ID: %, Size: %', NEW.product_id, NEW.sizee;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_checkout_remove_cart_item
AFTER INSERT ON customer_order
FOR EACH ROW
EXECUTE FUNCTION decrease_product_quantity_after_checkout();

--3 (no)
CREATE OR REPLACE FUNCTION insert_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_notif (order_id, seller, order_time, status)
    VALUES (NEW.order_id, NEW.seller, NEW.order_time, 'not checked');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER after_order_insert_notif
AFTER INSERT ON customer_order
FOR EACH ROW
EXECUTE FUNCTION insert_order_notification();


--3
CREATE OR REPLACE FUNCTION insert_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM order_notif WHERE order_id = NEW.order_id
    ) THEN
        INSERT INTO order_notif (order_id, seller, order_time, status)
        VALUES (NEW.order_id, NEW.seller, NEW.order_time, 'not checked');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_order_notification()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM order_notif 
        WHERE order_id = NEW.order_id AND seller = NEW.seller
    ) THEN
        INSERT INTO order_notif (order_id, seller, order_time, status)
        VALUES (NEW.order_id, NEW.seller, NEW.order_time, 'not checked');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER after_order_insert_notif
AFTER INSERT ON customer_order
FOR EACH ROW
EXECUTE FUNCTION insert_order_notification();


--4

CREATE OR REPLACE FUNCTION get_status_counts(seller_param TEXT)
RETURNS TABLE(pending INT, shipped INT, completed INT) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::INT AS pending,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END)::INT AS shipped,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INT AS completed
    FROM customer_order
    WHERE seller = seller_param;
END;
$$ LANGUAGE plpgsql;


--5

CREATE OR REPLACE FUNCTION get_seller_orders(seller_param TEXT)
RETURNS TABLE(
    fullname TEXT,
    order_id TEXT,
    order_time TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY 
    SELECT DISTINCT ON (d.order_id) 
        d.fullname, 
        d.order_id, 
        o.order_time, 
        o.status
    FROM delivery_info d 
    JOIN customer_order o ON d.order_id = o.order_id
    WHERE o.seller = seller_param;
    
END;
$$ LANGUAGE plpgsql;

--6

CREATE OR REPLACE FUNCTION get_ratings(input_product_id text)
RETURNS TABLE (
    avg_stars numeric,
    star_1_count bigint,
    star_2_count bigint,
    star_3_count bigint,
    star_4_count bigint,
    star_5_count bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
		ROUND(AVG(CAST(stars AS INTEGER)), 1) AS avg_stars, 
        COUNT(CASE WHEN stars = '1' THEN 1 END) AS star_1_count,
        COUNT(CASE WHEN stars = '2' THEN 1 END) AS star_2_count,
        COUNT(CASE WHEN stars = '3' THEN 1 END) AS star_3_count,
        COUNT(CASE WHEN stars = '4' THEN 1 END) AS star_4_count,
        COUNT(CASE WHEN stars = '5' THEN 1 END) AS star_5_count
    FROM review
    WHERE product_id = input_product_id;
END;
$$ LANGUAGE plpgsql;

--7

CREATE OR REPLACE FUNCTION ratingsCount(input_product_id text)
RETURNS TABLE (
    avg_stars numeric,
    total numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(CAST(stars AS INTEGER)), 1) AS avg_stars, 
        COUNT(*)::numeric AS total
    FROM review
    WHERE product_id = input_product_id;
END;
$$ LANGUAGE plpgsql;


--8

CREATE OR REPLACE FUNCTION get_orders(user_param TEXT)
RETURNS TABLE(
    fullname TEXT,
    order_id TEXT,
    order_time TEXT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY 
    SELECT DISTINCT ON (d.order_id) 
        d.fullname, 
        d.order_id, 
        o.order_time, 
        o.status
    FROM delivery_info d 
    JOIN customer_order o ON d.order_id = o.order_id
    WHERE o.user_mail = user_param;
    
END;
$$ LANGUAGE plpgsql;
