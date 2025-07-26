import express from "express";
import { create } from "../controller/userController.js";// ✅ Corrected path and extension
import { getAllUsers } from "../controller/userController.js";
import { getUserByEmail } from "../controller/userController.js";

const route = express.Router();


route.post("/user", create);
route.get("/users", getAllUsers);
route.post("/find-user", getUserByEmail);



export default route;
