const express = require("express")
const bodyParser = require("body-parser")
const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/toDoListDB",{family: 4}).then(()=>console.log("Connected")).catch(err=>console.log(`Unable to Connect : ${err}`));
const ToDo = mongoose.model("ToDo", {
    task: String
});
const Work=mongoose.model("Work",{
    task: String
});
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
// making list of items
var items = [];
var works = [];
app.get("/",async function (req, res) {
    // res.send("Hi");
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var date = new Date();
    var day = date.toLocaleDateString("en-us", options);
    items=await ToDo.find();
    res.render('home', { today: day, items: items });
})


app.post("/", function (req, res) {
    console.log(req.body.list);
    if (req.body.list == "Works") {
        var item = req.body.choice;
        const newWork=new Work({
            task: item
        });
        newWork.save();
        res.redirect("/work");
    }


    // saving to database inside Todo table if title!=works
    var item = req.body.choice;
    const newTask=new ToDo({
        task: item
    });
    newTask.save();
    // items.push(item);
    res.redirect("/");
})

app.get("/work",async function (req, res) {
    works=await Work.find();
    res.render('home', { today: "Works", items: works });
})


app.post("/checked",async function (req,res) {
    let str=req.body.checkbox;
    let ind=str.indexOf(" ");
    let id=str.substring(0,ind);
    
    // await Person.deleteOne({ _id: '6415b04ff9f6836880109f0b' }); 
    if(str.substring(ind+1)!="Works"){
        await ToDo.deleteOne({_id: id});
        res.redirect("/");
    }
    else{
        console.log("one"+str.substring(ind+1)+" "+id);
        await Work.deleteOne({_id: id});
        res.redirect("/work");
    }
});
app.listen(3000);