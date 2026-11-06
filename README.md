# Lab Attendance Portal

Full-stack CRUD app: vanilla HTML/CSS/JS frontend + Vercel serverless API + MongoDB Atlas (`LabAttendanceDB`).

## Structure
- `public/index.html` – frontend
- `api/attendance.js` – GET (read), POST (create)
- `api/attendance/[id].js` – PUT/PATCH (update), DELETE
- `api/_db.js` – cached DB connection + validation

## Environment variables (set in Vercel > Settings > Environment Variables)
| Name | Value |
|---|---|
| MONGODB_URI | your Atlas connection string |
| DB_NAME | LabAttendanceDB |
| COLLECTION_NAME | your collection name (e.g. attendance) |
