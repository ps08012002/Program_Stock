import express from "express"
import db from "./database.js"
import cors from "cors"
const app = express()
const port = 3000

const corsOptions = {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    };
    app.use(cors(corsOptions));

app.use(express.json())


app.get('/kode', async (req, res) => { // Get All Data
  try {
    const test = await db.tb_kode.findMany()
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

app.delete("/warna", async(req, res) => { // Deleted Warna & Quantity by id
  try {
    const {id} = req.body 
    console.log("req.body", req.body);
    await db.tb_warna.delete({where: {id : id}}) 
    res.send ("Sukses")
  } catch (error) {
      console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.get('/warna/:id', async (req, res) => { // Get All Data
  try {
    const {id} = req.params
    const result = await db.tb_warna.findMany({where : {id_kode : parseInt(id) }})
    res.send({result:result})
  } catch (error) {
    res.status(500).send("internal server error")
  }
})

app.post("/minus", async(req, res) => { // minus stock by id and create report data
  try {
 const id = req.body.id;
  const qty = parseInt(req.body.qty); 

  const cari = await db.tb_warna.findFirst({
    where: { id: parseInt(id) },
    select: {
      id: true,
      warna: true,
      quantity: true
    }
  });

  if (!cari) {
    return res.status(404).send("Data tidak ditemukan");
  }

  if (cari.quantity !== 0 && cari.quantity >= qty) {
    const result = await db.tb_warna.update({
      where: { id: cari.id },
      data: {
        quantity: cari.quantity - qty
      }
    });

    await db.tb_report.create({
      data: {
        nama: req.body.nama,
        divisi: req.body.divisi, 
        kode_tinta: req.body.kode_tinta,
        warna: cari.warna,
        request: qty,
        sisa: result.quantity,
        date: Math.floor(Date.now() / 1000)
      }
    });

    res.send("sukses");
  } else {
    res.status(400).send("Stok tidak mencukupi atau kosong");
  }
  } catch (error) {
    console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

// app.get("/minus", async(req, res) => { // Minus Quantity by id
//   try {
//     const {id, qty} = req.query 
//     console.log("req", req.query);
//     const minus = await db.tb_warna.findFirst({where : {id : parseInt(id)}})
//     if (minus.quantity !== 0) {
//      const result = await db.tb_warna.update({where : {id : parseInt(id)}, data : {quantity : minus.quantity - parseInt(qty)}})
//      res.send ({result})
//     }
//   } catch (error) {
//       console.log("error", error);
    
//      res.status(500).send({"internal server error": error})
//   }
// })

app.get("/plus", async(req, res) => { // Plus Quantity by id
  try {
    const {id, qty} = req.query 
    console.log("req", req.query);
    const plus = await db.tb_warna.findFirst({where : {id : parseInt(id)}})
    const result = await db.tb_warna.update({where : {id : parseInt(id)}, data : {quantity : plus.quantity + parseInt(qty)}})
    res.send ({result})
  } catch (error) {
      console.log("error", error);
    
     res.status(500).send({"internal server error": error})
  }
})

app.get("/ink", async (req, res) => {
  try {
    const data = await db.tb_kode.findMany({
      include: {
        tb_warna: true
      }
    })
    res.send(data)
  } catch (error) {
    console.log("error", error)
    res.status(500).send({"internal server error": error})
  }
})

app.post("/warna/default/:id_kode", async (req, res) => { 
  try {
    const id_kode = parseInt(req.params.id_kode);
    const warnaCMYK = ["Cyan", "Magenta", "Yellow", "Black"];

    const dataWarna = warnaCMYK.map(warna => ({
      warna,
      quantity: 0,
      id_kode
    }));

    await db.tb_warna.createMany({ data: dataWarna });

    res.send("Warna default CMYK berhasil ditambahkan");
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ "internal server error": error });
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})