// Import required modules
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Configure the MySQL connection using the credentials in the .env file
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Question 3: Filter patients by first name
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query;
    // Check if a first name is provided
    let query;
    let queryParams = [];
    if (first_name) {
        // If a first name is provided, filter by that name
        query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE LOWER(first_name) = LOWER(?)';
        queryParams.push(first_name);
    } else {
        // If no first name is provided, retrieve all patients
        query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    }

    // Execute the query
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: err.message });
        }
    });
}); 



// Question 4: Retrieve all providers by specialty
app.get('/providers/specialty', (req, res) => {
  const { specialty } = req.query; // Assuming the specialty is passed as a query parameter
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  db.query(query, [specialty], (err, results) => {
    if (err) {
    return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
