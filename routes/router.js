const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");

//get product data api
router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        //console.log("Console the data" + productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});

// get individual data
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const individuadata = await Products.findOne({ id: id });

        //console.log(individuadata + "individual data");

        res.status(201).json(individuadata);

    } catch (error) {
        res.status(400).json(individuadata);
        console.log("error" + error.message);
    }
});

//register data
router.post("/register", async (req, res) => {
    //console.log(req.body);

    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "filll the all details" });
        console.log("not data available");
    };

    try {

        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            res.status(422).json({ error: "This user is already present" })
        } else if (password !== cpassword) {
            res.status(422).json({ error: "password and cpassword are not matching" })
        } else {

            const finalUser = new USER({
                fname, email, mobile, password, cpassword
            });

            // yaha pe hasing krenge

            const storedata = await finalUser.save();
            console.log(storedata);

            res.status(201).json(storedata);
        }

    } catch (error) {

    }
});

// login user api
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    };

    try {
        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin + "user value");

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            console.log(isMatch +"pass Match");

            //token genrate
            const token = await userlogin.generateAuthtokenn();
            //console.log(token);

            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            })

            if (!isMatch) {
                res.status(400).json({ error: "invalid details" })
            } else {
                res.status(201).json(userlogin)
            }

        } else {
            res.status(400).json({ error: "invalid details" })
        }
    } catch (error) {
        res.status(400).json({ error: "invalid details" });
    }
});

// adding the data into cart

router.post("/addcart/:id", authenicate, async (req, res) => {

    try {
        //console.log("perfect 6");
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const Usercontact = await USER.findOne({ _id: req.userID });
        console.log(Usercontact);

        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);

            await Usercontact.save();
            console.log(cartData + " thse save wait kr");
            console.log(Usercontact);
            res.status(201).json(Usercontact);
        }else{
            res.status(401).json({error:"invalid user"});
        }

    } catch (error) {
        res.status(401).json({error:"invalid user"});
    }
});

//get cart details
router.get("/cartdetails", authenicate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log(error + "error");
    }
});

//get valid user
router.get("/validuser", authenicate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        res.status(201).json(validuserone);
    } catch (error) {
        console.log(error + "error");
    }
});


//remove item from cart

router.delete("/remove/:id", authenicate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
            return cruval.id != id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("iteam remove");

    } catch (error) {
        console.log(error + "error");
        res.status(400).json(req.rootUser);
    }
});

// for user logout

router.get("/logout", authenicate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");
    } catch (error) {
        console.log("error");
    }
});

module.exports = router;