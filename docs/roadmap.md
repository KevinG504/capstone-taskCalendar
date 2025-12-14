# Roadmap

## Sprint 1 - Setup and Planning

**Goal:** Set up the repo and determine what is needed to complete the project.

**Deliverables:**
* Repo has proper structure with src/, public/, docs/, data/
* Server boots with npm start on port 3000
* MVP Chosen: the basics needed for the bare minimum app to run
* Roadmap includes the MVP list, full list, and risks

---

## MVP (Sprint 2)

* **Goal 1:** Set up Express server with all middleware (sessions, error handler, JSON parser)
* **Goal 2:** Build file-backed database with atomic writes and persistence
* **Goal 3:** Create REST API with full CRUD endpoints for tasks
* **Goal 4:** Build service layer with validation and business logic
* **Goal 5:** Create thin client HTML/CSS/JS that calls the API
* **Goal 6:** Add basic filtering (All, Active, Completed)

---

## Full Version (Sprint 3)

* Added High Priority filter button
* Added loading indicators during API calls
* Added success/error messages throughout UI
* Polished CSS with gradients, transitions, and hover effects
* Added form validation with helpful error messages
* Completed all documentation (README, API docs, architecture)

---

## Risks and Mitigations

* **Risk:** Session management could be complex  
  **Mitigation:** Used simple cookie-based sessions
  
* **Risk:** File database could corrupt with writes  
  **Mitigation:** Implemented atomic writes to prevent corruption
  