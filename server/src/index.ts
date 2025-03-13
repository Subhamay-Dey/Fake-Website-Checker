import express, {Application, Request, Response} from "express";
import "dotenv/config";

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req:any, res:any) => {
    return res.send("Hey It's working.... 🙌")
})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))