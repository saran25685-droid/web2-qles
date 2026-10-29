# QLES — Hospital Queue & Appointment System

QLES is a front-end student project prototype for hospital queue tracking and doctor appointment management.

## Features
- Browse and filter doctors by department
- Book an appointment with date and consultation slot
- Simulated demo payment (no money is charged)
- View appointments and cancel a booking
- Queue number and estimated waiting time tracker
- Patient rating and feedback interaction
- Responsive layout for desktop and mobile
- Appointment demo records saved in the browser using `localStorage`

## Run the project
1. Extract `QLES.zip`.
2. Open the `QLES` folder.
3. Double-click `index.html`, or open it with VS Code and use the Live Server extension.

No npm installation or backend is required for this front-end demo.

## Important limitations
This is a front-end demonstration only. It does not connect to a real hospital, live doctor schedules, a database, SMS notifications, or a payment gateway. Appointment data stays in the current browser. Do not enter real patient or payment information.

## Main files
- `index.html` — page structure and booking dialog
- `style.css` — responsive styling
- `script.js` — doctor data, booking/cancellation, queue simulation, demo payment and ratings
