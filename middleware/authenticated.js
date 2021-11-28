/**
 * Verify current user using their token.
 * If there is no token, or it fails to verify redirect to login.
 * If it verifies, authorized them.
 * @returns Redirection or nothing.
 */
export default async function ({ store, redirect, $axios, $config, $notify }) {
    const TAG = "\nmiddleware - authenticated(), ";
    console.log(TAG + "Outputting user state: ");
    console.log(store.state.user);

    if (localStorage.getItem("auth") === null) { // no token
        console.log("User has no token.");
        return redirect("/login");
    } else {
        console.log("User has token.")
        const token = localStorage.getItem("auth");

        try {
            let verifyResponse = await $axios.post(`${$config.serverUrl}/users/verify`, { token: token });
            let data = verifyResponse.data;

            // Failure to verify the token, redirect to login.
            if (data.status === "Failure") {
                $notify({
                    title: "Authentication Error",
                    text: `An error has occurred: '${res.data.resData}'`,
                    duration: 6000,
                    type: "success",
                });
                localStorage.removeItem("auth");
                this.$store.commit("user/logOut");
                return redirect("/login");
            } else if (data.status === "Success") {
                store.commit("user/setUser", data.resData);
            }
        } catch (error) {
            console.log("ERROR: ");
            console.log(error.message);
            return redirect("/login");
        }
    };
};