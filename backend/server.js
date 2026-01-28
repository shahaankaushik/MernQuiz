import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connectDB } from './config/db.js';
import profileRoutes from './routes/profileRoutes.js';
import resultRouter from './routes/resultRoutes.js';
import userRoute from './routes/userRouter.js';

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

console.log("ENV CHECK:", process.env.MONGO_URL);
// midleware...
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// db..
connectDB();
// routeesss//
app.get('/', (req, res)=>{
    res.send("api working...")
})

// auth route
app.use('/api/auth', userRoute)
// result routee
app.use('/api/results', resultRouter);

app.use("/api/profile", profileRoutes);

app.use('/', (req, res)=>{
    res.send("server running")
})


app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`);

})