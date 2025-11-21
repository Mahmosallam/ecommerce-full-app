import express from "express"
import http from "http"; 
import { Server } from "socket.io";
import cors from "cors"
import connectDB from './config/db.js'
import productroutes from "./routes/productRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import dotenv from 'dotenv'
dotenv.config();

const app = express();

app.use(morgan("dev")); 

app.use(cors());

app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
  
app.use('/api/products', productroutes)
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/cart", cartRoutes)
app.use(errorHandler);
 


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server with Socket.io running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database Connection Failed", error);
  process.exit(1);
});


