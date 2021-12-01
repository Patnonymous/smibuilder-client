export default async function ({ app, store, redirect, $axios, $config, }) {
    const TAG = "\nmiddleware - relogin(), ";
    console.log(TAG + "Outputting user state: ");
    console.log(store.state.user);

    if (app.$cookies.get("auth") == null) { // no token
        console.log("User has no token.");
    } else {
        console.log("User has token.")
        const token = app.$cookies.get("auth");
        try {
            console.log("Getting verifyResponse");
            let verifyResponse = await $axios.post(`${process.env.SERVER_URL}/users/verify`, { token: token });
            let data = verifyResponse.data;
            if (data.status === "Failure") {
                console.log("Not verified. Cant relogin.");
            } else if (data.status === "Success") {
                console.log("Verified. Will relogin.");
                store.commit("user/setUser", data.resData);
            }
        } catch (error) {
            console.log(TAG + "Error catched on verify: ");
            console.error(error);
        }
    };
};