/**
 * Verify current user using their token.
 * If there is no token, or it fails to verify redirect to login.
 * If it verifies, authorized them.
 * @returns Redirection or nothing.
 */
export default function ({ store, redirect, $axios, $config, $notify }) {
    const TAG = "\nmiddleware - authenticated(), ";
    console.log(TAG + "Outputting user state: ");
    console.log(store.state.user);
    console.log("Outputting localstorage auth: ");
    console.log(localStorage.getItem("auth"));

    // DEBUG
    //localStorage.removeItem("auth")
    //console.log(localStorage.getItem("auth"));


    if (localStorage.getItem("auth") === null) { // no token
        console.log(TAG + "User has no token.");
        return redirect("/login");
    } else {
        console.log(TAG + "User has token.")
        const token = localStorage.getItem("auth");
        $axios.post(`${$config.serverUrl}/users/verify`, { token: token }).then(res => {
            console.log(TAG + "res data: ");
            console.dir(res.data);

            if (res.data.status === "Failure") { // Failure to verify the token, redirect to login.
                console.log(TAG + "Verify status == Failure");
                $notify({
                    title: "Authentication Error",
                    text: `An error has occurred: '${res.data.resData}'`,
                    duration: 6000,
                    type: "success",
                });
                return redirect("/login");
            } else if (res.data.status === "Success") { // Successful verification, commit authorization.
                console.log(TAG + "Verify status == Success");
                store.commit("user/setUser", res.data.resData);
            };


        }).catch(error => {
            console.log(TAG + "Error catched on verify: ");
            console.log(error.message);
            console.log(error);
            return redirect("/login");
        });
    };
};