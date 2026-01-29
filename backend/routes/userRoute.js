import express from 'express';
import { adminOnly, isAuthenticated } from '../middlewares/auth.js'
import { singleUpload } from '../middlewares/multer.js';
import { 
     addPhoto, changeUserRole, deleteUser, 
     getAdminUser, 
     getFilteredUsers, getUser, loggedInUser, 
     updateUser 
    } from '../controllers/userController.js';



const app = express.Router();

// this routes are managed by admin and logged user both
app.use(isAuthenticated);

app.post('/me', loggedInUser)
app.put('/addphoto/:id', singleUpload, addPhoto)
app.put('/manage/:id', updateUser)


// These routes only access and manage by admin
app.use(adminOnly);

app.get('/search',getFilteredUsers)
app.post('/new-role/:id',changeUserRole)
app.get('/query',getAdminUser)
app.route('/:id')
.get(getUser)
.delete(deleteUser)
.put(updateUser)

export default app; 