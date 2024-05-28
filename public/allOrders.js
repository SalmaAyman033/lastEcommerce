let ordersItems;
let users;
let allorders;
// Function to fetch the orderItems data from the API.
let get_ordersItems_from_api = async () => {
    try {
        let res = await fetch("/api/v1/order", {
            method: "GET",
        });
        let data = await res.json();
        ordersItems = data;
        return data;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};
// Function to fetch the users data from the API.
let get_users_from_api = async () => {
    try {
        let res = await fetch("/api/v1/user", {
            method: "GET",
        });
        let data = await res.json();
        users = data;
        return data;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};

// Function to fetch the users data from the API.
let get_allorders_from_api = async () => {
    try {
        let res = await fetch("/api/v1/order/a", {
            method: "GET",
        });
        let data = await res.json();
        allorders= data;
        return data;
    } catch (error) {
        console.error("Error fetching orders items data:", error);
    }
};

get_ordersItems_from_api()
.then(() => get_users_from_api())  //cash
.then(() => {
    let result = ordersItems.find(userOrder => userOrder.email === localStorage.getItem("email"))
    let idd = result._id;
    let orderdata = result.orderItems // loop in it to get details
    let usersresult = users.find(user => user.email === localStorage.getItem("email"))
    data = {
        "orderItems":idd,
        "shippingAddress1":usersresult.city,
        "shippingAddress2": usersresult.street,
        "city": usersresult.city,
        "zip": usersresult.zip,
        "country": usersresult.country,
        "phone": usersresult.phone,
        "totalPrice": 50,
        "user":usersresult._id
    };
    // posting data to api.
    const post_data_to_api = async () => {
        try {
            let res = await fetch("/api/v1/order", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }

            const result = await res.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

})
