import express from "express"
import db from "./database.js"
const app = express()
const port = 3000

app.use(express.json())

app.get('/kode', async (req, res) => { // Get All Data
  try {
    const test = await (await db.tb_kode.findMany())
    res.send({"data": test})
  } catch (error) {
    res.status(500).send("internal server error")
  }
})

app.post("/kode", async(req, res) => { // Create Kode Tinta
  try {
  console.log("req.body", req.body);
  
await db.tb_kode.create({data:{kode_tinta:req.body.kode_tinta}})
res.send("sukses insert kode")
  } catch (error) {
    console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.put("/kode", async(req, res) => { // Update Kode Tinta
  try {
  const {id ,kode_tinta} = req.body 
  console.log("req.body", req.body);
  await db.tb_kode.update({data:{kode_tinta:req.body.kode_tinta},where: {id : id}})
  res.send("sukses update kode")
  } catch (error) {
    console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.post("/warna", async(req, res) => { // Create Warna Dan Quantity Default By id_kode
  try {
    const {warna, id_kode} = req.body
    console.log("req.body", req.body );
    await db.tb_warna.create({data : {warna, id_kode}})
    res.send ("Sukses")

  } catch (error) {
        console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.put("/warna", async(req, res) => { // Update Quantity by id
  try {
    const {quantity ,id} = req.body 
    console.log("req.body", req.body);
    await db.tb_warna.update({data:{quantity},where: {id : id}}) 
    res.send ("Sukses")
  } catch (error) {
      console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})