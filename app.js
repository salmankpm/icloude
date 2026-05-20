 const express = require('express');

const { getindex, adminlogin, usersignup, Adduser, userlogin, getuser, getdashboard, addProdect, prodectAdd, postadmin, deleteProdect, updateProdect, restoreProdect, revertProdect, getedit, postedit, getaddcart, postcart, deletecart, getmaincart, logoutuser, addCategory, deleteCategory, getUserBlock, getUsers, blockUser, unblockUser, decreasecart, increasecart } = require('./controller/controller');

const dotenv=require('dotenv');
const mongoose = require("mongoose");
const multer = require('multer');
const { isLoggined } = require('./middlewares/isLoggined');


 const app = express(); 

dotenv.config()


const dburl= process.env.DBurl;
mongoose.connect(dburl)
.then(() => console.log("mongoDB Connection Successful"))
.catch((err) => console.error("Connection Error:", err));


const storage = multer.diskStorage({
     destination: function (req, file, cb) {
          cb(null, '/tmp')
    },
   filename: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now())
   }
});


const upload = multer({ storage: storage });


app. use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));



const path = require('path');
app.set ('views', path.join(__dirname, 'view'));
app.set("view engine", "ejs");

app.get('/', (req, res) => { res.redirect('/index'); });
app.get('/index',getindex)

app.get('/admin/login', adminlogin)
app.post('/admin/login',postadmin)
app.get('/usersignup',usersignup)
app.post('/usersignup',Adduser)
app.get('/userlogin',userlogin)
app.post('/userlogin',getuser)
app.get('/logoutuser',logoutuser)


app.get('/dashboard',getdashboard)
app.get('/addProdect',addProdect)
app.post('/addProdect',upload.single('image'),prodectAdd)

app.get("/blockedusers", getUserBlock)
app.get("/admin/users", getUsers);
app.get("/admin/block-user", blockUser);
app.get("/admin/unblock-user", unblockUser);

app.post('/addCategory', addCategory)
app.get('/deleteCategory', deleteCategory)

app.get('/deleteProduct',deleteProdect)
app.get('/restoreProdect',restoreProdect)
app.get('/revertProdect',revertProdect)
app.get('/getedit',getedit)
app.post('/postedit',upload.single('image'),postedit)

app.get('/add-to-cart',isLoggined,getaddcart)



app.get('/deletecart',deletecart)

app.get('/getmaincart',getmaincart)


 const PORT = process.env.PORT || 3000;

 if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT,console.log(
   'Server started on port ' + PORT));
 }

 module.exports = app;