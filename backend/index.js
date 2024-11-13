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
  const seller_name = req.query.seller_name;

  try {
      const result = await pool.query('SELECT product_name, category, subcategory, price, img FROM products WHERE seller = $1', [seller_name]);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/all-products', async (req, res) => {
  try {
    const result = await pool.query('SELECT product_name, category, subcategory, price, img FROM products');
    res.status(200).json(result.rows);
    //console.log(result.rows);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
