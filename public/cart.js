let products; //All the products in the database.
let ordersItems;  //All the orderItems in the database.  
let users; //All users in the database.
let data;
let pre;
let total=0;
let result; // the orderItem of the user
let productsNumber = document.querySelector(".products-number");
let cartNumber = document.querySelector("#cart");
// Function to send the products to the API
const updateOrderData = async (myData) => {
    try { 
        let res = await fetch(`/api/v1/order/orderitem/${result._id.replace(/'/g, "\\'")}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderItems: myData })
        });
        
        if (!res.ok) {
            throw new Error('Network response was not ok ' + res.statusText);
        }

        const myres = await res.json();
        console.log('Success:', myres);
    } catch (error) {
        console.error('Error:', error);
    }
};

function minus(itemId){
    const item = result.orderItems[itemId];
    if (item) {
        console.log(document.querySelectorAll(".card-body article").length)
        if (item.quantity == 1) {
            if((document.querySelectorAll("#cart-body article").length)==1){
                del(result._id)
            }
            else{
                delete result.orderItems[itemId];
            }
        }
        else{
            item.quantity -= 1;
        }
        

        updateOrderData(result.orderItems);
    }
}
function plus(itemId){
    const item = result.orderItems[itemId];
    if (item) {
        item.quantity += 1;
        updateOrderData(result.orderItems);
    }
}
function trash(itemId){
    const item = result.orderItems[itemId];
    if (item) {
        // if((document.querySelectorAll("#cart-body article").length)==1){
        //     del(result._id)
        // }
        if (Object.keys(result.orderItems).length == 1) {
            del(result._id);
        }
        else{
            delete result.orderItems[itemId];
        }
        updateOrderData(result.orderItems);
    }
}

// Function to getting all the products in the database ans save it in the products.
let get_data_from_api = async () => {
    try {
        let res = await fetch("/api/v1/products/s", {
            method: "GET",
        });
        let data0 = await res.json();
        products = data0;
        return data0;
    } catch (error) {
        console.error("Error fetching products data:", error);
    }
};



// Function to getting orderItems from the database and save it in orderItems.
let get_ordersItems_from_api = async () => {
    try {
        let res = await fetch("/api/v1/order", {
            method: "GET",
        });
        let data1 = await res.json();
        ordersItems = data1;
        return data1;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};



// fuction to getting users data from the backend and save it in the users.
let get_users_from_api = async () => {
    try {
        let res = await fetch("/api/v1/user", {
            method: "GET",
        });
        let data2 = await res.json();
        users = data2;
        return data2;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};


    // fuction to delete orderItems.
    let del = async (idd) => {
        try {
            let res = await fetch(`/api/v1/order/${idd}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("Error fetching orders items data:", error);
        }
    };
    


// Function to post data to api
let post_data_to_api = async (data) => {
    try {
        let res = await fetch("/api/v1/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
    
        let responseData = await res.json();
        console.log(responseData);
        del(result._id)
        productsNumber=0
        //console.log(result._id)
    } catch (error) {
        console.error('There was an error!', error);
    }
};

// Fetch orders items data first, then products data.
get_ordersItems_from_api()  //Getting orderItems data from the database.
    .then(() => get_data_from_api())  //Getting products data from the database.
    .then(()=>get_users_from_api())   // Getting All users data from the database.
    .then(() => {
        result = ordersItems.find(userOrder => userOrder.email === localStorage.getItem("email")) //TO get the order of the user.
        if(result){
            function displayOrderItems(){
                let orderupdate = Object.keys(result.orderItems).forEach(item => {
                    let pName;
                    let pImg;
                    (products.products).map((product)=>{
                        //console.log(product)
                        if (product.id === item) {
                            pName = product.name;
                            pImg = product.image;
                            return 0
                        }
                        //console.log(pName)

                    })
                    //console.log(pName)
                    let img =pImg;
                    //console.log(minus(result.orderItems[item]['quantity']))
                    pre= `
                    <article>
                    <!--salma-->
                    <!-- Single item -->
                    <div class="row">
                        <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                            <!-- Image -->
                            <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                                <img src="${img}"
                                class="w-100" alt="Blue Jeans Jacket" />
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                            <!-- Data -->
                            <p><strong>${pName}</strong></p>
                            <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-sm me-1 mb-2" data-mdb-tooltip-init"
                            title="Remove item" onclick="trash('${item.replace(/'/g, "\\'")}')">
                                <i class="fas fa-trash"></i>
                            </button>
                            <!-- Data -->
                        </div>
                        <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                            <!-- Quantity -->
                            <div class="d-flex mb-4" style="max-width: 300px">
                                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary px-3 me-2"
                                onclick="minus('${item.replace(/'/g, "\\'")}')">
                                <i class="fas fa-minus"></i>
                                </button>

                                <div data-mdb-input-init class="form-outline">
                                    <p>${result.orderItems[item]['quantity']}</p>
                                    <label class="form-label" for="form1">Quantity</label>
                                </div>

                                <button data-mdb-button-init data-mdb-ripple-init class="btn btn-primary px-3 ms-2"
                                onclick="plus('${item.replace(/'/g, "\\'")}')").stepUp()">
                                <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <!-- Quantity -->

                            <!-- Price -->
                            <p class="text-start text-md-center">
                            <strong>$ ${(result.orderItems[item]['price'])*(result.orderItems[item]['quantity'])}</}</strong>
                            </p>
                            <!-- Price -->
                        </div>
                    </div>

                    <!-- Single item -->
                    <hr class="my-4" />
                    <!--salma-->
                    <article>
                        `
                //let pre=`<p>${result.orderItems[item]['quantity']}</p>`
                document.querySelector("#cart-body").innerHTML += pre;
                    

                })
                
            }
            displayOrderItems();
        
        }
        else{
            pre=`<p>You Dont Have Any Orders In the cart</p>`
            document.querySelector("#cart-body").innerHTML = pre;
        }
    })
    .then(()=>{
        let usersresult = users.find(user => user.email === localStorage.getItem("email"))
        let result = ordersItems.find(userOrder => userOrder.email === localStorage.getItem("email"))
        //console.log(usersresult)
        //console.log(result)
        let ls = [];
        let ls2 = [];
        let ls3 = [];
        //result.orderItems[item]['quantity']
        console.log(result)
        Object.keys(result.orderItems).forEach(item => {
            ls=[...ls,item]
        })
        Object.keys(result.orderItems).forEach(item => {
            ls2=[...ls2,result.orderItems[item]['quantity']]
        })
        Object.keys(result.orderItems).forEach(item => {
            ls3=[...ls3,result.orderItems[item]['price']]
        })
        Object.keys(result.orderItems).forEach(item => {
            total+=(result.orderItems[item]['quantity'])*(result.orderItems[item]['price'])
            //total+=(result.ordersItems[item]['price']*result.ordersItems[item]['quantity'])
        })
        console.log(total)

        data = {
            "orderItems":ls,
            "orderItemsQ":ls2,
            "orderItemsP":ls3,
            "shippingAddress1":usersresult.city,
            "shippingAddress2": usersresult.street,
            "city": usersresult.city,
            "zip": usersresult.zip,
            "country": usersresult.country,
            "phone": usersresult.phone,
            "totalPrice": total,
            "user":usersresult._id
        };  
        

        return data;
    })
    .then(()=>{let cash= `
    <div class="card-header py-3">
    <h5 class="mb-0">Summary</h5>
</div>
<div class="card-body">
    <ul class="list-group list-group-flush">
        <li
            class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
            Products
            <span>$${total}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
            Shipping
            <span>$60</span>
        </li>
        <li
            class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
            <div>
                <strong>Total amount</strong>
                <strong>
                    <p class="mb-0"></p>
                </strong>
            </div>
            <span><strong>$${total+60}</strong></span>
        </li>
    </ul>

    <button onclick="post_data_to_api(data)" type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block">
        Go to checkout
</button>
        `
//let pre=`<p>${result.orderItems[item]['quantity']}</p>`
document.querySelector("#summ").innerHTML = cash;
    })//data =>{return post_data_to_api(data)})
    .catch(error => {console.error("Error in the data fetching process:", error);
})