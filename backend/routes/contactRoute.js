import express from 'express';
import { adminOnly, isAuthenticated } from '../middlewares/auth.js';
import { deleteContactUs, getFilteredContactUs, newContactUs, updateContact } from '../controllers/contactController.js';



const app = express.Router();

// this routes are managed by admin and logged user both

app.use(isAuthenticated);

app.post('/new', newContactUs)

app.use(adminOnly)
// get all contact with filtertion
app.get('/all', getFilteredContactUs)
app.put('/:id', updateContact)
app.delete('/:id', deleteContactUs )


export default app; 