
class Auth {
 
static isUser = async () =>{
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    let response = await fetch("/user/is/loggedin", requestOptions);
    switch (response.status){
        case 200:
            let value = await response.text();
            value = value === "true" ? true:false;
            // console.log("returning true ==== userloggedin",value)
            return value;
        default:
            return false;
    }
}
isOwner = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    fetch("/user/is/owner", requestOptions)
        .then(async response => {
            switch(response.status){
                case 200:
                    let value = await response.text();
                    value = value === "true" ? true : false;
                    return value;
                default:
                    return false;  
            }
        });
}
isManager = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    fetch("/user/is/manager", requestOptions)
        .then(async response => {
            switch(response.status){
                case 200:
                    let value = await response.text();
                    value = value === "true" ? true : false;
                    return value;
                default:
                    return false;
            }
        });
}
isAdmin = () => {
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
                    'Cookie': document.cookie},
    };
    fetch("/user/is/admin", requestOptions)
        .then(async response => {
            switch(response.status){
                case 200:
                    let value = await response.text();
                    value = value === "true" ? true : false;
                    return value;
                default:
                    return false;
            }
        });
}
static checker = (isUser,isOwner,isManager,isAdmin) =>{
    console.log("user>>>>>",this.isUser())
    // if(isUser && this.isUser() == false)
    //     return false;
    // if(isManager && !this.isManager())
    //     return false;
    // if(isOwner && !this.isOwner())
    //     return false;
    // if(isAdmin && !this.isAdmin())
    //     return false;    
    return true;
}
}
export default Auth;