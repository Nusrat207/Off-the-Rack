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
    password: 'Ummnny947',
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
  const { email, username, phone, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    const client = await pool.connect();

    const queryText1 = 'SELECT * FROM user_info WHERE email = $1';
    const values1 = [email];

    const result = await client.query(queryText1, values1);

    if (result.rows.length === 1) {
      client.release();
      return res.status(400).json({ success: false, message:"acc with this mail exists" });
    }

    const queryText = 'INSERT INTO user_info (email, username, phone, password) VALUES ($1, $2, $3, $4)';
    const values = [email, username, phone, hashedPassword ];
    await client.query(queryText, values);

    client.release();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});


app.post('/api/googleSignup', async (req, res) => {
  const { name, email} = req.body;
  try {
    
    const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });

    const client = await pool.connect();

    const queryText1 = 'SELECT * FROM user_info WHERE email = $1';
      const values1 = [email];
  
      const result = await client.query(queryText1, values1);
  
      if (result.rows.length === 1) {
        client.release();
        return res.status(200).json({ success: true, message:"user already exists. signed in" });
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
    const { email, username, phone, password} = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = jwt.sign({ email }, 'your_jwt_secret_key', { expiresIn: '1h' });
  
      const client = await pool.connect();
  
      const queryText1 = 'SELECT * FROM seller_info WHERE email = $1';
      const values1 = [email];
  
      const result = await client.query(queryText1, values1);
  
      if (result.rows.length === 1) {
        client.release();
        return res.status(400).json({ success: false, message:"acc with this mail exists" });
      }
  
      const queryText = 'INSERT INTO seller_info (email, shop_name, phone, password) VALUES ($1, $2, $3, $4)';
      const values = [email, username, phone, hashedPassword ];
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

      res.status(201).json({success: true, message: 'Product added successfully' });
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
    const result = await pool.query('SELECT product_name, category, subcategory, base_price, img FROM products');
    res.status(200).json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/addproductz', async (req, res) => {
  const { product_name, category, subcategory, base_price, img, seller, descrip, color, sizee, quantity, brand, bagJewelryQuantity } = req.body;

  const productQuery = 'INSERT INTO products (product_name, category, subcategory, base_price, img, seller, code, descrip, color, brand) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id';
  
  try {
    const seller_email = req.body.seller;
    const sellerResult = await pool.query('SELECT shop_name FROM seller_info WHERE email = $1', [seller_email]);

    if (sellerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const seller = sellerResult.rows[0].shop_name;
    const productCode = uuidv4();

    const productResult = await pool.query(productQuery, [
      product_name, category, subcategory, base_price, img, seller, productCode, descrip, color, brand
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
  const { category, subcategory } = req.query;

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
    WHERE p.category ILIKE $1 AND p.subcategory ILIKE $2
    GROUP BY p.id;
  `;

  try {
   // console.log("Received category:", category);
   // console.log("Received subcategory:", subcategory);

    const { rows } = await pool.query(query, [category, subcategory]);

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
  const { sizes , discount } = req.body;

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

  // Validate ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product.rows[0]);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});