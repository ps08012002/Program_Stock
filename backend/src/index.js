import express from "express"
import db from "./database.js"
const app = express()
const port = 3000

app.use(express.json())

app.get('/', async (req, res) => {
  try {
    const test = await db.tb_kode.findMany()
    res.send({"data": test})
  } catch (error) {
    res.status(500).send("internal server error")
  }
})

app.post("/kode", async(req, res) => {
  try {
  console.log("req.body", req.body);
  
await db.tb_kode.create({data:{kode_tinta:req.body.kode_tinta}})
res.send("sukses insert kode")
  } catch (error) {
    console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})