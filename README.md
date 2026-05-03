# SE Group 6 - Meal Planner App

This project is a meal planner web application built using JavaScript, React, Node.js, Express, Jest, and MongoDB.

JavaScript Language
React Frontend
Node.js + Express Backend
MongoDB Database
JEST Testing Framework

# Environment Setup
MongoDB Community Server should be installed locally and run as a Windows service.
  MongoDB Compass GUI is optional.

cd SE-Group-6-main\app\meal_planner-api
create .env file 
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/mealplanner
  JWT_SECRET=secret123
cd SE-Group-6-main\app
create .env file
  REACT_APP_API_URL=http://localhost:5000

# Run Backend

cd SE-Group-6-main\app\meal_planner-api
npm install
npm start

# Run Frontend
cd SE-Group-6-main\app
npm install
npm pkg set proxy=http://localhost:5000
npm start

The app will open in the default browser at http://localhost:3000

# Run Test Cases
cd SE-Group-6-main
npm install
npm test
