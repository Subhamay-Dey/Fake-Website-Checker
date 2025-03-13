import express, {Application, Request, Response} from "express";
import "dotenv/config";
import router from "./routes/index.js";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req:any, res:any) => {
    return res.send("Hey It's working.... 🙌")
});

app.use(cors({ origin: "http://localhost:3000" }))

app.use("/api", router)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))