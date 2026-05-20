import {LocalStorage} from "node-localstorage"
var localStorage = new LocalStorage('./scratch'); 


export function isLoggined (req,res,next){
    const usertoken=localStorage.getItem('user')
    console.log(usertoken,"middleware")
    if(usertoken){
        next()
    }
    else{
        res.redirect('/userlogin')}
}