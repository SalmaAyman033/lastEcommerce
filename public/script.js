//const { response } = require("express");
//const Product = require("../models/product");

const form = document.querySelector('form');
form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const email = form.email.value;
    const passwordHash = form.passwordHash.value;

    try{
        const res = await fetch('/api/v1/user/login',{
            method:'POST',
            body:JSON.stringify({email,passwordHash}),
            headers:{'content-Type':'application/json'},
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        if(data.errors){
            console.log("errorr");
        }
        if(data.user){
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", email);
            location.assign('/api/v1/products')
            
        }
    }
    catch(err){
        console.log(err);
    }
});




