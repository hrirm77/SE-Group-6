# SE Group 6 - Meal Planner App

This project is a meal planner web application built using JavaScript

### Technologies Used
- JavaScript Language
- React Frontend
- Node.js + Express Backend
- MongoDB Database
- Jest Testing Framework

### Important Use Cases
- UC5: Login 
- UC9: Logout
- UC3: Opening Calendar
- UC10: Add meal to calendar 
- UC27: Set nutrition goals
- UC7: Reset password
- UC12: Remove meal from calendar
- UC11: Edit Scheduled Meal
- UC23: Generate grocery list
- UC24: Edit grocery list
- UC25: Export grocery list
- UC26: Delete list

# Environment Setup
MongoDB Community Server should be installed locally and run as a Windows service.
- https://www.mongodb.com/try/download/community-kubernetes-operator

MongoDB Compass GUI is optional.

### Backend `.env` File

```powershell
cd SE-Group-6-main\app\meal_planner-api
```
Create a `.env` file with:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mealplanner
JWT_SECRET=secret123
```

### Frontend `.env` File

```powershell
cd SE-Group-6-main\app
```

Create a `.env` file with:
```env
REACT_APP_API_URL=http://localhost:5000
```

# Run Backend

```powershell
cd SE-Group-6-main\app\meal_planner-api
npm install
npm start
```

# Run Frontend
In a seperate terminal
```powershell
cd SE-Group-6-main\app
npm install
npm pkg set proxy=http://localhost:5000
npm start
```

The app will open in the default browser at 
```text
http://localhost:3000
```

# Run Test Cases
```powershell
cd SE-Group-6-main
npm install
npm test
```
