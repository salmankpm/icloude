import { cartModel } from "../model/cartSchema.js"
import { prodectModel } from "../model/prodectSchema.js"
import { registerModel } from "../model/userschema.js"
import { LocalStorage } from "node-localstorage"
import bcrypt from 'bcryptjs';
import { categoryModel } from "../model/categoryschema.js";
var localStorage = new LocalStorage('/tmp/scratch');

export const getindex = async (req, res) => {



    const prodect = await prodectModel.find({ isDeleted: false })
    res.render('index', { prodects: prodect })

}


export const adminlogin = (req, res) => {
    res.render('adminlogin')
}

export const postadmin = async (req, res) => {

    try {
        const { id, username, password } = req.body
        console.log(id, username, password)



        if (password.length == 0 || username.length == 0 || id.length == 0) {
            res.send('All fields are required');
        } else {
            const prodects = await prodectModel.find({});
            console.log(' added successfully');
            res.redirect('/dashboard')
        }

    } catch (error) {
        console.log('Error ', error)
    }
}


export const usersignup = (req, res) => {

    res.render('usersignup')

}



export const Adduser = async (req, res) => {

    try {
        const { username, password, confirmPassword } = req.body
        console.log(username, password, confirmPassword)



        if (password.length == 0 || username.length == 0 || confirmPassword.length == 0) {
            res.send('All fields are required');
        }
        else if (password !== confirmPassword) {
            res.send('password do not match');
        }
        else {

            const salt = await bcrypt.genSalt(10)
            const encriptpassword = await bcrypt.hash(password, salt)

            registerModel.insertOne({
                username: username,
                password: encriptpassword

            }).then(() => {
                console.log("user added Successful");
                // res.send("user added Successful");
            }).catch((err) => {
                console.error(" Error adding user:", err);
                // res.send(" Error adding user:", err)
            })
            console.log('user added successfully');
            res.redirect('index',)
        }

    } catch (error) {
        console.log('Error ', error)
    }
}



export const userlogin = (req, res) => {
    res.render('userlogin')
}


export const getuser = async (req, res) => {

    try {
        const { username, password } = req.body
        console.log(username, password)



        if (password.length == 0 || username.length == 0) {
            res.send('All fields are required');
        } else {




            const prodects = await registerModel.findOne({
                username: username,
                // password: password
            });
            const salt = await bcrypt.genSalt(10)
            const encriptpassword = await bcrypt.compare(password, prodects.password)
            console.log(prodects._id, 'user added successfully');
            const userId = prodects._id

            if (!encriptpassword) {
                console.log("invalid")
            }

            localStorage.setItem("user", prodects._id);
            const token = localStorage.getItem("user");
            console.log(token, "----------");
            res.redirect('/index')
        }

    } catch (error) {
        console.log('Error ', error)
    }
}




export const getdashboard = async (req, res) => {
    try {

        const prodects = await prodectModel.find({ isDeleted: false });
        const prodectCount = await prodectModel.countDocuments({ isDeleted: false });
        const totalUsers = await registerModel.countDocuments();

        // GET ALL CATEGORIES
        const categories = await categoryModel.find({});

        res.render('dashboard', {
            prodects: prodects,
            prodectCount: prodectCount,
            totalUsers: totalUsers,
            categories: categories
        });

    } catch (error) {
        console.log("Dashboard error:", error);
        res.send("Server Error");
    }
};




export const addProdect = async (req, res) => {

    try {

        const categories = await categoryModel.find({})

        res.render('addProdects', {
            categories: categories
        })

    } catch (error) {

        console.log("Error loading add product page", error)

    }

}


// ADD PRODUCT
export const prodectAdd = async (req, res) => {

    try {

        const { name, price, category } = req.body
        const file = req.file

        if (!name || !price || !category) {
            return res.send("All fields are required")
        }

        await prodectModel.insertOne({

            name: name,
            price: price,
            category: category,
            image: file.filename

        })

        console.log("Product added successfully")

        res.redirect('/addProdect')

    } catch (error) {

        console.log('Error found in add product', error)

    }

}

export const addCategory = async (req, res) => {
    try {

        const { category } = req.body

        await categoryModel.create({
            name: category
        })

        res.redirect("/dashboard")

    } catch (err) {
        console.log(err)
    }
}
export const deleteCategory = async (req, res) => {
    try {

        const { id } = req.query

        await categoryModel.deleteOne({
            _id: id
        })

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)
    }
}


export const deleteProdect = (req, res) => {
    try {
        const { prodectId } = req.query
        console.log(prodectId)
        prodectModel.updateOne({
            _id: prodectId
        }, {

            $set: { isDeleted: true }
        }).then((result) => {
            console.log(result)
            res.redirect('/dashboard');
        }).catch((error) => {
            console.log("error deleting prodect;", error);
            res.send("error deleting prodect");
        })
    } catch (error) {
        console.log("error deleting prodect;", error);
    }
}


export const restoreProdect = async (req, res) => {
    try {
        const deleteProdect = await prodectModel.find({
            isDeleted: true
        })
        res.render('deleted', {
            prodects: deleteProdect
        })

    } catch (error) {
        console.log("error deleting prodect;", error);
        res.render("restore",);

    }
}




export const revertProdect = (req, res) => {
    try {
        const { prodectId } = req.query
        console.log(prodectId)
        prodectModel.updateOne({
            _id: prodectId
        }, {

            $set: { isDeleted: false }
        }).then((result) => {
            console.log(result)
            res.redirect('/dashboard');
        }).catch((error) => {
            console.log("error deleting prodect;", error);
            res.send("error deleting prodect");
        })
    } catch (error) {
        console.log("error deleting prodect;", error);
    }
}


export const getedit = async (req, res) => {
    try {
        const { prodectId } = req.query
        console.log(prodectId);
        const prodectDetails = await prodectModel.findOne({ _id: prodectId })
        res.render('edit', { file: prodectDetails.image, prodectDetails: prodectDetails })
    } catch (error) {
        console.log('error editing prodect:', error)
    }
}
export const postedit = async (req, res) => {
    try {
        const { name, price, category } = req.body
        const { prodectId } = req.query

        let updateData = {
            name,
            price,
            category
        };


        if (req.file) {
            updateData.image = req.file.filename;
        }

        await prodectModel.updateOne(
            { _id: prodectId },
            { $set: updateData }
        );

        res.redirect('/dashboard')

    } catch (error) {
        console.log('error editing prodect:', error)
        res.send("Edit failed");
    }
}



export const getaddcart = async (req, res) => {
    try {
        const { prodectId } = req.query
        console.log(prodectId);
        const prodectDetails = await prodectModel.findOne({ _id: prodectId })
        if (prodectId) {
            await cartModel.insertOne({
                name: prodectDetails.name,
                price: prodectDetails.price,
                category: prodectDetails.category,
                image: prodectDetails.image,
                userId: prodectId
            })

            const cartprduct = await cartModel.find({})
            console.log(cartprduct, "kkkkk")
            const storedUsername = localStorage.getItem('user');

            console.log(storedUsername, "hvcgcydctyfugkjbkjn")
            res.redirect('/getmaincart')
        } else {
            res.redirect('/getmaincart')
        }


    } catch (error) {
        console.log('errorgjjhhhhhhhhhhhhhhhhhhhhhhhhh prodect:', error)
    }

}

export const deletecart = (req, res) => {
    try {
        const { prodectId } = req.query
        console.log(prodectId, "ffffffffffffff")
        cartModel.deleteOne({
            _id: prodectId

        }).then((result) => {
            console.log(result, "jj")
            res.redirect('/getmaincart')
        }).catch((error) => {
            console.log("error deleting prodect;", error);
            res.send("error deleting prodect");
        })
    } catch (error) {
        console.log("error deletinggggggg prodect;", error);
    }
}

export const getmaincart = async (req, res) => {
    const prodectDetails = await cartModel.find({})
    console.log(prodectDetails)
    res.render('cartpage', { prodectDetails: prodectDetails })
}
export const logoutuser = async (req, res) => {
    localStorage.removeItem('user')
    res.redirect('/index')
}




export const getUserBlock = async (req, res) => {

    try {

        const users = await registerModel.find();

        res.render("userblock", { users });

    } catch (error) {

        console.log("Error getting users", error);

    }

}
// get all users
export const getUsers = async (req, res) => {
    try {

        const users = await registerModel.find();

        res.render("blockedusers", { users });

    } catch (error) {

        console.log("Error getting users:", error);

    }
};


// block user
export const blockUser = async (req, res) => {

    try {

        const { userId } = req.query;

        await registerModel.updateOne(
            { _id: userId },
            { $set: { isBlocked: true } }
        );

        res.redirect("/blockedusers");

    } catch (error) {

        console.log("Block error:", error);

    }

};


// unblock user
export const unblockUser = async (req, res) => {

    try {

        const { userId } = req.query;

        await registerModel.updateOne(
            { _id: userId },
            { $set: { isBlocked: false } }
        );

        res.redirect("/blockedusers");

    } catch (error) {

        console.log("Unblock error:", error);

    }

};