# task-calendar-app
By Kevin Galvez

A simple task management web application using Express.js (Node.js), implementing features such as REST API, session management, and file-based persistence.

## Project Structure

```
task-calendar-app/
├── docs/
│   ├── pitch.md
│   ├── roadmap.md
│   ├── architecture_sketch.md
│   ├── dod-sprint1.md
│   ├── dod-sprint2.md
│   ├── dod-sprint3.md
│   └── media/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── api/
│   │   └── tasks.js
│   ├── services/
│   │   └── taskService.js
│   ├── db/
│   │   └── database.js
│   └── middleware/
│       ├── sessionMiddleware.js
│       └── errorHandler.js
├── data/
│   └── tasks.json
├── package-lock.json
├── package.json
├── server.js
└── README.md
```

## How To Run

1. Navigate to the root directory of this project
2. Run the following commands:

```bash
npm install     # installs all dependencies
npm start       # runs the server 
```

3. In a modern web browser, navigate to the link provided in the terminal. By default, it is `http://localhost:3000`.

## Features

- Create tasks with title, description, due date, and priority
- View all tasks sorted by due date
- Filter tasks by status (All, Active, Completed) and priority (High)
- Mark tasks as complete/incomplete
- Delete tasks
- Data persists across server restarts

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** File-based JSON storage with atomic writes
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Session Management:** Cookie-based sessions