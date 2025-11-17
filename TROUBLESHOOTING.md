# Troubleshooting Guide

## Website Not Opening

### Step 1: Check if servers are running

The application requires TWO servers to run:
1. **Backend server** (port 3001) - Handles API requests
2. **Frontend server** (port 5000) - Serves the React app

### Step 2: Start the servers

Run this command in the project root:
```bash
npm run dev
```

This will start both servers simultaneously.

### Step 3: Access the website

Once both servers are running, open your browser and go to:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3001/api/health

### Step 4: If servers don't start

1. **Check if ports are already in use:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr ":5000 :3001"
   ```

2. **Kill processes using those ports:**
   ```bash
   # Find process ID (PID) from netstat output, then:
   taskkill /PID <PID> /F
   ```

3. **Check for errors:**
   - Look at the terminal output when running `npm run dev`
   - Check browser console (F12) for errors
   - Check server logs in the terminal

### Step 5: Common Issues

**Issue: "Port already in use"**
- Solution: Kill the process using the port or change the port in `vite.config.ts` and `server/main.py`

**Issue: "Module not found" (Python)**
- Solution: Run `pip install -r requirements.txt` to install Python dependencies
- Make sure Python 3.8+ is installed

**Issue: "Module not found" (Node.js/Frontend)**
- Solution: Run `npm install` to install frontend dependencies

**Issue: "API errors"**
- Solution: Make sure the backend server (port 3001) is running
- The frontend will still work with fallback images if API fails

**Issue: "Gemini API errors"**
- Solution: The app will use fallback local images if Gemini API fails
- Check that the API key is correct in your `.env` file or `server/main.py`

### Step 6: Manual Server Start

If `npm run dev` doesn't work, start servers separately:

**Terminal 1 (Backend - Python):**
```bash
python server/main.py
# Or: python3 server/main.py (on some systems)
```

**Terminal 2 (Frontend):**
```bash
npm run frontend
```

### Step 7: Build for Production

To build the app for production:
```bash
npm run build
```

Then serve the `dist` folder with a static file server.

