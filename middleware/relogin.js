export default async function ({ store, redirect, $axios, $config, $notify }) {
    const TAG = "\nmiddleware - relogin(), ";
    console.log(TAG + "Outputting user state: ");
    console.log(store.state.user);

    if (localStorage.getItem("auth") === null) { // no token
        console.log("User has no token.");
    } else {
        console.log("User has token.")
        const token = localStorage.getItem("auth");
        try {
            let verifyResponse = await $axios.post(`${$config.serverUrl}/users/verify`, { token: token });
            let data = verifyResponse.data;
            if (data.status === "Failure") {
                console.log("Not verified. Cant relogin.");
            } else if (data.status === "Success") {
                console.log("Verified. Will relogin.");
                store.commit("user/setUser", data.resData);
            }
        } catch (error) {
            console.log(TAG + "Error catched on verify: ");
            console.log(error.message);
        }
    };
};