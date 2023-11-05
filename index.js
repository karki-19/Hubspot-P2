import express, { urlencoded } from "express";
import { join, resolve } from "path";
import {
  addContactToHubspot,
  sendEmail,
  checkByEmail,
  getAllContacts,
  editContact,
  deleteContact,
} from "./hubspotAPI.js";
import { sendMessageToSlack } from "./slack.js";

const app = express();

app.use(express.static(join(resolve(), "public"))); //using this middleware to serve the static files present inside public folder. ex: 'localhost:5000/index.html'
app.use(urlencoded({ extended: true })); //with this middleware we will be able to access 'form data' on method post
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const data = await getAllContacts(10);
  const dataArray = data.results.map((element) => element.properties);
  res.render("home", { hostUrl: `${process.env.HOST_URL}/contact`, dataArray });
});

app.get("/contact", (req, res) => {
  res.render("contactForm");
});

const arr = [];
app.post("/contacts", async (req, res) => {
  let flag = true;
  let addContact;
  const isEmailExist = await checkByEmail(req.body.email);
  //   console.log(isEmailExist);
  //   console.log(await addContactToHubspot(req.body))
  if (isEmailExist?.results?.length > 0) {
    flag = false;
  } else {
    // console.log(addContact)
    addContact = await addContactToHubspot(req.body);
    arr.push (addContact.properties);
    if (addContact?.id) {
      const emailSend = await sendEmail(req.body.email);
      //   console.log(emailSend)
      if (emailSend.success) {
        await sendMessageToSlack(req.body.firstname);
      }
    }
  }
  if (flag) {
    res.render("success", {
      hostUrl: `${process.env.HOST_URL}`,
      firstname:req.body.firstname,
      arr
    });
  } else {
    res.render("error", {
      email: req.body.email,
      hostUrl: `${process.env.HOST_URL}`,
    });
  }
});

app.patch("/editContact/:id",async(req,res)=>{
    await editContact(req.params.id,req.body.properties)
    res.json({success:true})
})

app.delete("/deleteContact/:id",async(req,res)=>{
    // console.log("deleteMethod")
    await deleteContact(req.params.id)
    res.json({success:true})
})

app.listen(9000, () => {
  console.log("Server is running on 9000");
});
