var  express = require("express")
var app = express();

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(bodyParser.json());


var admin = require("firebase-admin");
var serviceAccount = require("./servicesAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://servertest-31e01.firebaseio.com"
})

var firestore = admin.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

app.post("/sendNotification", async function(req,res){
    var title = req.body.title;
    var message = req.body.message;
    var userID = req.body.userID;
    var projectID = req.body.projectID;
    var taskID = req.body.taskID;

    var notification = {
        'title':title,
        'message':message,
        'created': new Date(),
        'projectID':projectID,
        'taskID':taskID
    }
    console.log(notification)
    try{
        var userRef = firestore.collection(userID);
        var result = await userRef.add(notification);
        console.log(result);
        res.end("success");
    }catch(error){
        console.log(error);
        res.end('error')
    }
})

app.use("/",function(req,res){
    res.end("Something went wrong !!! This is a default route");
});

var server = app.listen(process.env.PORT || 3000,function(){

});