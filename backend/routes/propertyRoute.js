import express from "express";
import { adminOnly, isAuthenticated } from "../middlewares/auth.js";
import { singleUpload, multiUpload } from '../middlewares/multer.js'

import {
  getProperty,
  getLatestProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  likeProperty,
  getFilteredProperty,
  addPhoto,
  removePhoto,
  getTopCities,
  getAgents,
  getSingleAgent,
  getAgentProperty,
  getAdminProperties,
} from "../controllers/propertyController.js";

const app = express.Router();


// public routes
app.get("/latest", getLatestProperty);
app.get("/top-cities", getTopCities);
app.get("/agents", getAgents);
app.get("/agent/properties/:id", getAgentProperty)
app.get("/agent/:id", getSingleAgent);

app.post("/search", getFilteredProperty);
app.get("/get/:id", getProperty);


// authenticated routes
app.use(isAuthenticated)
app.post("/like/:pid/:uid", likeProperty);
app.post("/unlike/:pid/:uid", likeProperty);




// admin routes
app.use(adminOnly);
app.get("/query", getAdminProperties)
app.post("/add", multiUpload, addProperty);
app.delete('/deletephoto/:id', removePhoto);
app.post('/addphoto/:id', singleUpload, addPhoto);
app.put("/:id", updateProperty);
app.delete("/:id", deleteProperty);
app.get("/:id", getProperty);




export default app;
