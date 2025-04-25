const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'abcd12',
  port: '5432',
  database: 'ecom1'
});

app.use(bodyParser.json());
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.post('/api/signup', async (req, res) => {
  const { email, username, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    const client = await pool.connect();

    const queryText1 = 'SELECT * FROM user_info WHERE email = $1';
    const values1 = [email];

    const result = await client.query(queryText1, values1);

    if (result.rows.length === 1) {
      client.release();
      return res.status(400).json({ success: false, message: "acc with this mail exists" });
    }

    const queryText = 'INSERT INTO user_info (email, username, phone, password) VALUES ($1, $2, $3, $4)';
    const values = [email, username, phone, hashedPassword];
    await client.query(queryText, values);

    client.release();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});


app.post('/api/googleSignup', async (req, res) => {
  const { name, email } = req.body;
  try {

    const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    const client = await pool.connect();

    const queryText1 = 'SELECT * FROM user_info WHERE email = $1';
    const values1 = [email];

    const result = await client.query(queryText1, values1);

    if (result.rows.length === 1) {
      client.release();
      return res.status(200).json({ success: true, message: "user already exists. signed in" });
    }

    const queryText = 'INSERT INTO user_info (email, username) VALUES ($1, $2)';
    const values = [email, name];
    await client.query(queryText, values);

    client.release();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/login', async (req, res) => {
  const { email1, password1 } = req.body;

  try {
    const client = await pool.connect();
    const queryText = 'SELECT * FROM user_info WHERE email = $1';
    const values = [email1];

    const result = await client.query(queryText, values);

    if (result.rows.length === 0) {
      client.release();
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password1, user.password);

    if (!isMatch) {
      client.release();
      return res.status(400).json({ success: false, error: 'Wrong password' });
    }

    const token = jwt.sign({ email1 }, 'your_jwt_secret_key', { expiresIn: '1h' });

    client.release();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});



app.post('/api/seller_register', async (req, res) => {
  const { email, username, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    const client = await pool.connect();

    const queryText1 = 'SELECT * FROM seller_info WHERE email = $1';
    const values1 = [email];

    const result = await client.query(queryText1, values1);

    if (result.rows.length === 1) {
      client.release();
      return res.status(400).json({ success: false, message: "acc with this mail exists" });
    }

    const queryText = 'INSERT INTO seller_info (email, shop_name, phone, password) VALUES ($1, $2, $3, $4)';
    const values = [email, username, phone, hashedPassword];
    await client.query(queryText, values);

    client.release();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error during register:', error);
    res.status(500).json({ success: false, error: 'Register failed' });
  }
});



app.post('/api/seller_login', async (req, res) => {
  const { email1, password1 } = req.body;

  try {
    const client = await pool.connect();
    const queryText = 'SELECT * FROM seller_info WHERE email = $1';
    const values = [email1];

    const result = await client.query(queryText, values);

    if (result.rows.length === 0) {
      client.release();
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password1, user.password);

    if (!isMatch) {
      client.release();
      return res.status(400).json({ success: false, error: 'Wrong password' });
    }

    const token = jwt.sign({ email1 }, 'your_jwt_secret_key', { expiresIn: '1h' });

    client.release();

    res.status(200).json({ success: true, token, shop_name: user.shop_name });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});



app.post('/getUserData', async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM user_info WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ name: user.username, phone: user.phone });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/updateProfile', async (req, res) => {
  const { user_email, current_password, updates } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM user_info WHERE email = $1', [user_email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(current_password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    if (updates.email) {
      const emailCheckResult = await pool.query('SELECT * FROM user_info WHERE email = $1', [updates.email]);
      if (emailCheckResult.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Email is already in use' });
      }
    }


    const updateFields = [];
    const updateValues = [];
    let index = 1;

    for (const key in updates) {
      updateFields.push(`${key} = $${index++}`);
      updateValues.push(key === 'password' ? await bcrypt.hash(updates[key], 10) : updates[key]);
    }

    updateValues.push(user_email);

    const updateQuery = `UPDATE user_info SET ${updateFields.join(', ')} WHERE email = $${index}`;
    await pool.query(updateQuery, updateValues);

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating your profile' });
  }
});

const { v4: uuidv4 } = require('uuid');

app.post('/addproduct', async (req, res) => {
  const {
    product_name,
    category,
    subcategory,
    price,
    img,
    sizee,
    quantity,

    descrip,
    color
  } = req.body;

  const seller_email = req.body.seller_email;

  try {

    const sellerResult = await pool.query('SELECT shop_name FROM seller_info WHERE email = $1', [seller_email]);

    if (sellerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = sellerResult.rows[0].shop_name;
    const productCode = uuidv4();

    const insertQuery = `
          INSERT INTO products (product_name, category, subcategory, price, img, sizee, quantity, code, descrip, color, seller)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

    await pool.query(insertQuery, [
      product_name,
      category,
      subcategory,
      price,
      img,
      sizee,
      quantity,
      productCode,
      descrip,
      color,
      seller
    ]);

    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.get('/products', async (req, res) => {
  const { category, subcategory } = req.query;

  console.log("Received category:", category);
  console.log("Received subcategory:", subcategory);

  try {
    const query = `
      SELECT product_name, category, subcategory, base_price, img, seller, code, descrip, color, brand, discount 
      FROM products 
      WHERE category = $1 AND subcategory = $2
    `;
    const result = await pool.query(query, [category, subcategory]);
    console.log("Query result:", result.rows); // Log the result

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/all-products', async (req, res) => {
  try {
    const productsResult = await pool.query('SELECT * FROM products');
    const productSizeResult = await pool.query('SELECT * FROM product_size');

    const data = {
      products: productsResult.rows,
      product_size_qty: productSizeResult.rows,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/all-favProducts', async (req, res) => {
  const userMail = req.query.user_mail;
  try {
    const productsResult = await pool.query('SELECT * FROM favorites f join products p on f.product_id=p.id::text where f.user_mail=$1', [userMail]);
    const productSizeResult = await pool.query('SELECT * FROM product_size');

    const data = {
      products: productsResult.rows,
      product_size_qty: productSizeResult.rows,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/addproductz', async (req, res) => {
  const { product_name, category, subcategory, base_price, img, seller, discount, descrip, color, sizee, quantity, brand, bagJewelryQuantity } = req.body;

  const productQuery = 'INSERT INTO products (product_name, category, subcategory, base_price, img, seller, code, discount, descrip, color, brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id';

  try {
    const seller_email = req.body.seller;
    const sellerResult = await pool.query('SELECT shop_name FROM seller_info WHERE email = $1', [seller_email]);

    if (sellerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = sellerResult.rows[0].shop_name;
    const productCode = uuidv4();

    const productResult = await pool.query(productQuery, [
      product_name, category, subcategory, base_price, img, seller, productCode, discount, descrip, color, brand
    ]);
    const productId = productResult.rows[0].id;

    if (category === 'bags' || category === 'jewellery') {
      const qty = bagJewelryQuantity || 0;
      await pool.query(
        'INSERT INTO product_size (product_id, product_name, seller, sizee, quantity) VALUES ($1, $2, $3, $4, $5)',
        [productId, product_name, seller, 'N/A', qty]
      );
    } else {
      const sizeInsertQueries = sizee.map((size, index) => {
        const qty = quantity[index]?.quantity || '0';
        return pool.query(
          'INSERT INTO product_size (product_id, product_name, seller, sizee, quantity) VALUES ($1, $2, $3, $4, $5)',
          [productId, product_name, seller, size, qty]
        );
      });

      await Promise.all(sizeInsertQueries);
    }

    res.status(200).json({ message: 'Product and sizes added successfully!' });
  } catch (err) {
    console.error('Error inserting product and size data:', err);
    res.status(500).json({ message: 'Error inserting product or size data', error: err });
  }
});


app.get('/seller-info', async (req, res) => {
  const email = req.query.email;

  try {
    const result = await pool.query(
      'SELECT shop_name, email, phone, address FROM seller_info WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching seller info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/update-seller-info', async (req, res) => {
  const { email, currentPassword, newPassword, phone, address, shopName } = req.body;

  try {

    const result = await pool.query('SELECT password FROM seller_info WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const storedPassword = result.rows[0].password;

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const updateQuery = `
          UPDATE seller_info 
          SET phone = $1, address = $2, shop_name = $3, password = $4 
          WHERE email = $5
      `;

    await pool.query(updateQuery, [phone, address, shopName, newPassword || storedPassword, email]);

    res.status(200).json({ message: 'Seller info updated successfully' });
  } catch (error) {
    console.error('Error updating seller info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get("/seller_products", async (req, res) => {
  const { category, subcategory, shop_name } = req.query;

  const query = `
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
    WHERE p.category ILIKE $1 AND p.subcategory ILIKE $2 AND p.seller=$3
    GROUP BY p.id;
  `;

  try {
    // console.log("Received category:", category);
    // console.log("Received subcategory:", subcategory);

    const { rows } = await pool.query(query, [category, subcategory, shop_name]);

    //console.log("Query result:", rows);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Error fetching products" });
  }
});


app.post('/add-sizes', async (req, res) => {
  const { sizes, discount } = req.body;

  try {
    if (discount >= 0 && discount <= 100) {
      console.log(discount);
      await pool.query(
        'UPDATE products SET discount = $1 WHERE id = $2',
        [discount, sizes[0]?.product_id]
      );
    }
    for (const sizeData of sizes) {
      const { product_id, product_name, seller, sizee, quantity } = sizeData;

      await pool.query(
        `INSERT INTO product_size (product_id, product_name, seller, sizee, quantity) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id, sizee) 
         DO UPDATE SET quantity = EXCLUDED.quantity`,
        [product_id, product_name, seller, sizee, quantity]
      );
    }

    res.status(200).json({ message: 'Sizes added/updated successfully' });
  } catch (error) {
    console.error('Error adding/updating sizes:', error);
    res.status(500).json({ message: 'Error adding/updating sizes to database' });
  }
});


app.post('/update-stock', async (req, res) => {
  const { sizes, discount } = req.body;

  try {
    if (discount >= 0 && discount <= 100) {
      await pool.query(
        'UPDATE products SET discount = $1 WHERE id = $2',
        [discount, sizes[0]?.product_id]
      );
    }

    for (const sizeData of sizes) {
      const { product_id, product_name, seller, sizee, quantity } = sizeData;

      await pool.query(
        `INSERT INTO product_size (product_id, product_name, seller, sizee, quantity) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (product_id, sizee) 
         DO UPDATE SET quantity = EXCLUDED.quantity`,
        [product_id, product_name, seller, sizee, quantity]
      );
    }

    res.status(200).json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Error updating stock in database' });
  }
});


app.post('/updateDiscount', async (req, res) => {
  const { discount, product_id } = req.body;

  try {
    if (discount >= 0 && discount <= 100) {
      await pool.query(
        'UPDATE products SET discount = $1 WHERE id = $2',
        [discount, product_id]
      );
    }

    res.status(200).json({ message: 'discount updated successfully' });
  } catch (error) {
    console.error('Error updating discount', error);
    res.status(500).json({ message: 'Error updating discount in database' });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  console.log("products/id called, id ", id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    //console.log(product, "xx");
    res.json(product.rows[0]);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/add-to-cart', async (req, res) => {
  const { user_mail, product_id, product_name, size, quantity, img, price, seller, timestamp } = req.body;

  if (!user_mail || !product_id || !product_name || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO cart (user_mail, product_id, product_name, sizee, quantity, img, price,seller, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;

    const values = [user_mail, product_id, product_name, size, quantity, img, price, seller, timestamp];

    const result = await pool.query(query, values);


    res.status(200).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/add-to-fav', async (req, res) => {
  const { user_mail, product_id, product_name, img, price, seller } = req.body;

  if (!user_mail || !product_id || !product_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO favorites (user_mail, product_id, product_name, img, base_price, seller)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    const values = [user_mail, product_id, product_name, img, price, seller];

    const result = await pool.query(query, values);

    res.status(200).json({ message: 'Item added to favs' });
  } catch (error) {
    console.error("Error adding to favs:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/checkFavorite', async (req, res) => {
  const { user_mail, product_id } = req.body;

  if (!user_mail || !product_id) {
    return res.status(400).send({ message: 'user_mail and product_id are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_mail = $1 AND product_id = $2',
      [user_mail, product_id]
    );

    if (result.rows.length > 0) {
      return res.json({ isFavorite: true });
    } else {
      return res.json({ isFavorite: false });
    }
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).send({ message: 'Error checking favorite status' });
  }
});

app.get('/cart', async (req, res) => {
  const userMail = req.query.user_mail;

  if (!userMail) {
    return res.status(400).json({ error: 'User email is required' });
  }

  try {
    const query = 'SELECT * FROM cart WHERE user_mail = $1';
    const result = await pool.query(query, [userMail]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/cart/:timestamp', async (req, res) => {
  const { timestamp } = req.params;

  try {
    const query = 'DELETE FROM cart WHERE timestamp = $1';
    const result = await pool.query(query, [timestamp]);
    //console.log("deleting");
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    //console.log("done");
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/checkoutt', async (req, res) => {
  const userMail = req.body.user_mail;
  try {
    // handle the checkout logic (saving the order to the order table, etc.)
    await pool.query('DELETE FROM cart WHERE user_mail = $1', [userMail]);

    res.status(200).json({ message: 'Checkout successful, cart cleared, and quantities updated.' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/productByCat', async (req, res) => {
  let { subcategory } = req.query;

  try {
    // Normalize subcategory: replace hyphens with spaces and trim
    if (subcategory) {
      subcategory = subcategory.replace(/-/g, ' ').trim();
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE subcategory ILIKE $1',
      [subcategory]
    );

    const productSizeResult = await pool.query('SELECT * FROM product_size');

    const data = {
      products: result.rows,
      product_size_qty: productSizeResult.rows,
    };

    res.json(data);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});


app.post("/checkout", async (req, res) => {
  const { cartItems, customerDetails } = req.body;

  if (!cartItems || !customerDetails) {
    return res.status(400).json({ error: "Cart items and customer details are required" });
  }
  try {
    //const order_id = uuidv4();
    const order_id= Math.random().toString(36).substring(2, 10).toLowerCase();
   

    const bdTimeOffset = 6 * 60 * 60 * 1000; 
    const order_time = new Date(Date.now() + bdTimeOffset)
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    await pool.query("BEGIN");

    const deliveryInfoQuery = `
      INSERT INTO delivery_info (order_id, fullName, phone, address, payment, trxID)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(deliveryInfoQuery, [
      order_id,
      customerDetails.fullName,
      customerDetails.phoneNumber,
      customerDetails.address,
      customerDetails.paymentMethod,
      customerDetails.trxId || null,
    ]);

    const customerOrderQuery = `
      INSERT INTO customer_order (order_id, product_id, product_name, user_mail, sizee, quantity, price, img, seller, status, order_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    for (const item of cartItems) {
      await pool.query(customerOrderQuery, [
        order_id,
        item.product_id,
        item.product_name,
        item.user_mail,
        item.sizee,
        item.quantity,
        item.price,
        item.img,
        item.seller,
        "pending",
        order_time,
      ]);
    }

    await pool.query("COMMIT");

    res.status(200).json({ message: "Order placed successfully", order_id });
  } catch (error) {
    console.error("Error processing checkout:", error);

    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/getNotif', async (req, res) => {
  const { seller } = req.body;
  try {
      const result = await pool.query(
          "SELECT order_id, order_time, status FROM order_notif WHERE seller = $1",
          [seller]
      );
      res.json(result.rows);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching notifications");
  }
});

app.post('/removeNotif', async (req, res) => {
  const { order_id } = req.body;
  try {
    console.log(order_id);
      await pool.query("DELETE FROM order_notif WHERE order_id = $1", [order_id]);
      res.send("Notification removed successfully");
  } catch (error) {
      console.error(error);
      res.status(500).send("Error removing notification");
  }
});

app.post('/update-status', async (req, res) => {
  const { order_id, status } = req.body;
  try {
      await pool.query('UPDATE order_notif SET status = $1 WHERE order_id = $2', [status, order_id]);
      res.status(200).send({ message: "Status updated successfully" });
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to update status" });
  }
});


app.post('/update_seller', async (req, res) => {
  const { shop_name, sellerInfo } = req.body;

  if (!shop_name || !sellerInfo) {
      return res.status(400).json({ message: 'Shop name and seller info are required' });
  }

  try {
      
    console.log("here");
      const fields = [];
      const values = [];
      let index = 1;

      for (const key in sellerInfo) {
          if (sellerInfo[key] !== '' && sellerInfo[key] !== null && key!="name") {
              fields.push(`${key} = $${index}`);
              values.push(sellerInfo[key]);
              index++;
          }
      }

      if (fields.length === 0) {
          return res.status(400).json({ message: 'No fields to update' });
      }

      values.push(shop_name);

      const query = `
          UPDATE seller_info
          SET ${fields.join(', ')}
          WHERE shop_name = $${index}
          RETURNING *`;

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Seller not found' });
      }

      res.status(200).json({ 
          message: 'Seller info updated successfully', 
          updatedSeller: result.rows[0] 
      });
  } catch (error) {
      console.error('Error updating seller info:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/statusCounts', async (req, res) => {
  const { seller } = req.body;

  if (!seller) {
      return res.status(400).json({ error: 'Seller is required' });
  }
  try {
      //console.log("calling func")
      const query = 'SELECT * FROM get_status_counts($1)';
      const result = await pool.query(query, [seller]);

      const counts = result.rows[0]; 
      res.json(counts);
  } catch (error) {
      console.error('Error fetching status counts:', error);
      res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/sellerOrders', async (req, res) => {
  const { seller } = req.body;
  if (!seller) {
      return res.status(400).json({ error: 'Seller is required' });
  }
  try {
      const query = 'SELECT * FROM get_seller_orders($1)';
      const result = await pool.query(query, [seller]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching seller orders:', error);
      res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { user } = req.body;
  if (!user) {
      return res.status(400).json({ error: 'user is required' });
  }
  try {
      const query = 'SELECT * FROM get_orders($1)';
      const result = await pool.query(query, [user]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/orderDetails', async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const productQuery = `
    SELECT img, product_name, sizee, quantity, price 
    FROM customer_order 
    WHERE order_id = $1;
  `;

  const deliveryQuery = `
    SELECT d.payment, d.phone, d.address, d.fullname
    FROM delivery_info d
    WHERE d.order_id = $1;
  `;

  try {
    const productResult = await pool.query(productQuery, [order_id]);
    const deliveryResult = await pool.query(deliveryQuery, [order_id]);

    if (productResult.rows.length === 0 || deliveryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const totalPrice = productResult.rows.reduce((sum, row) => sum + parseFloat(row.price), 0);

    res.json({
      products: productResult.rows,
      delivery: deliveryResult.rows[0],
      totalPrice,
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/update-order-status', async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    await pool.query(
      'UPDATE customer_order SET status = $1 WHERE order_id = $2',
      [newStatus, orderId]
    );
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadimg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, 
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Upload failed' });
        }
        const imageUrl = result.secure_url;

        // Store the image URL in PostgreSQL
      //  const query = 'INSERT INTO imgURL (url) VALUES ($1) RETURNING *';
      //  const values = [imageUrl];
      //  const response = await pool.query(query, values);

        // Respond with the image URL and success message
        return res.status(200).json({ message: 'Image uploaded successfully', imageUrl: imageUrl });
      }
    ).end(req.file.buffer);  // Send the image buffer to Cloudinary
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});


app.get('/api/getReviews', async (req, res) => {
 // console.log("here");
  const product_id = req.query.product_id;  
  //console.log(product_id);
  if (!product_id) {
    return res.status(400).send('Product ID is required');
  }

  try {
    const reviews = await pool.query(
      'SELECT * FROM review WHERE product_id = $1',
      [product_id]
    );
    res.json(reviews.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Server error');
  }
});

app.post('/api/postReviews', async (req, res) => {
  const { product_id, seller, user_mail, comment, stars,datee } = req.body;
  //console.log('here', product_id, seller, user_mail, comment, stars );
  if (!product_id || !seller || !user_mail || !comment || !stars) {
    return res.status(400).send('All fields are required');
  }

  try {
    const q=await pool.query('select username from user_info where email=$1',[user_mail]);

    const user = q.rows[0].username; 

    //console.log(user);

    const newReview = await pool.query(
      'INSERT INTO review (product_id, seller, userr, comment, stars, datee) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [product_id, seller, user, comment, stars, datee]
    );
    res.json(newReview.rows[0]);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/ratings/:product_id', async (req, res) => {
  const productId = req.params.product_id;

  try {
      const result = await pool.query('SELECT * FROM get_ratings($1)', [productId]);
      const ratingsData = result.rows[0];

      res.json(ratingsData);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


app.get('/api/reviewsSellerx', async (req, res) => {
  const { seller_name } = req.query; // Get seller_name from query params
  
  try {
    const result = await pool.query(
      'SELECT * FROM review WHERE seller = $1',
      [seller_name]
    );
    res.json(result.rows); // Return reviews as a JSON array
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching reviews');
  }
});

app.get('/api/reviewsSellerxx', async (req, res) => {
  const { seller_name } = req.query; // Get seller_name from query params

  try {

    const resultt = await pool.query(`
      SELECT p.id as product_id, p.product_name as product_name, 
             r.review_id, r.userr, r.comment, r.stars, r.datee, r.reply, r.verified
      FROM products p
      LEFT JOIN review r ON p.id = cast(r.product_id as integer)
      WHERE p.seller = $1
    `, [seller_name]);
    
    const products = {};
    resultt.rows.forEach ((row) =>  {
      const { product_id, product_name, ...review} = row;
      
      const sql = pool.query('SELECT * FROM ratingsCount($1)', [product_id]);
      const ratingsData = sql.rows[0];
      
      if (!products[product_id]) {
        products[product_id] = {
          name: product_name,
          description: description,
          reviews: [],
          average_rating: ratingsData.avg_stars || 0,
          total_reviews: ratingsData.total || 0
        };
      }

      if (review.review_id) {
        products[product_id].reviews.push(review);
      }
    });

    res.json(Object.values(products)); 

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching reviews');
  }
});
app.get('/api/reviewsSeller', async (req, res) => {
  const { seller_name } = req.query; // Get seller_name from query params

  try {
    // Get all products and reviews for the seller
    const resultt = await pool.query(`
      SELECT p.id as product_id, p.product_name as product_name, 
             r.review_id, r.userr, r.comment, r.stars, r.datee, r.reply, r.verified
      FROM products p
      LEFT JOIN review r ON p.id = cast(r.product_id as integer)
      WHERE p.seller = $1
    `, [seller_name]);

    const products = {};

    // Use for...of loop to handle async operations inside
    for (const row of resultt.rows) {
      const { product_id, product_name, description, ...review } = row;

      try {
        // Wait for the query to finish before continuing
        const sql = await pool.query('SELECT * FROM ratingsCount($1)', [product_id]);
        const ratingsData = sql.rows[0];

        // If product doesn't exist in products object, create a new entry
        if (!products[product_id]) {
          products[product_id] = {
            name: product_name,
            description: description,
            reviews: [],
            average_rating: ratingsData.avg_stars || 0,
            total_reviews: ratingsData.total || 0
          };
        }
//console.log(ratingsData.avg_stars);
        

        // Add the review to the corresponding product
        if (review.review_id) {
          products[product_id].reviews.push(review);
        }
      } catch (err) {
        console.error(`Error fetching ratings data for product_id ${product_id}:`, err);
      }
    }

    // Send the products and reviews data in the response
    res.json(Object.values(products));

  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching reviews');
  }
});

// API to add a reply to a review
app.post('/api/reply', async (req, res) => {
  const { review_id, reply } = req.body;
  
  try {
    await pool.query(
      'UPDATE review SET reply = $1 WHERE review_id = $2',
      [reply, review_id]
    );
    res.send('Reply added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating reply');
  }
});

// API to delete a review
app.delete('/api/reviewDlt', async (req, res) => {
  const { review_id } = req.query;

  try {
    await pool.query(
      'DELETE FROM review WHERE review_id = $1',
      [review_id]
    );
    res.send('Review deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting review');
  }
});

app.post('/api/updateVerify', async (req, res) => {
  const { review_id } = req.query;  // Get review_id from query parameters

  try {
    // Update the 'verified' field for the review
    await pool.query(
      'UPDATE review SET verified = true WHERE review_id = $1',
      [review_id]
    );
    res.send('Updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating the review');
  }
});

app.get('/api/rates/:product_id', async (req, res) => {
  const { product_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM ratingsCount($1)', [product_id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).send('Error fetching ratings');
  }
});
