import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv"; 
const app = express();
const port = 3000;
env.config();
const db = new pg.Client({
  user:process.env.PG_USER,
  host:process.env.PG_HOST,
  database:process.env.PG_DATABASE,
  password:process.env.PG_PASSWORD,
  port:process.env.PG_PORT
 });
 db.connect();
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
 // can replace this with database
  // { id: 1, title: "Buy milk" },
  // { id: 2, title: "Finish homework" },

app.get("/", async(req, res) => {
 try{
  const result = await db.query("select * from items order by id ASC");
  items=result.rows;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const d = new Date("2024-05-20");
  const da = d.toLocaleDateString();
  let day = days[d.getDay()];
  res.render("index.ejs", {
    
    listTitle1: da,
    listTitle2:day,
    listItems: items,
  });
}
catch(err){
  console.log(err);
}
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
    res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});


app.post("/edit", async(req, res) => {
  const item=req.body.updatedItemTitle;
    const id=req.body.updatedItemId;
  
  try{
    await db.query("UPDATE items SET (title)=$1 WHERE id=($2)",[item,id]);
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
    const id=req.body.deleteItemId;
    try{
      await db.query("DELETE from items where id= ($1)",[id]);
      res.redirect("/");
    }
    catch(err){ 
      console.log(err);
    }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
