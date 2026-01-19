# Job Card Media Upload Fix

## Tasks
- [x] Fix multer config to use req.params.id instead of jobCardId
- [x] Update controller to set correct fileUrl with subdirectory
- [x] Add multer middleware to the POST route in jobCardMediaRoutes.js
- [x] Remove duplicate media routes from jobCardRoutes.js to avoid conflicts

## Files to Edit
- backend/src/config/multer.js
- backend/src/controllers/jobCardMediaController.js
- backend/src/routes/jobCardMediaRoutes.js
- backend/src/routes/jobCardRoutes.js
