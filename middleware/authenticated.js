/**
 * Verify current user using their token.
 * If there is no token, or it fails to verify redirect to login.
 * If it verifies, authorized them.
 * @returns Redirection or nothing.
 */
export default async function ({ app, store, redirect, $axios, $config, $notify }) {

    if (app.$cookies.get("auth") == null) { // no token
        return redirect("/login");
    } else {
        const token = app.$cookies.get("auth");

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
                app.$cookies.remove("auth", { path: "/" });
                this.$store.commit("user/logOut");
                return redirect("/login");
            } else if (data.status === "Success") {
                store.commit("user/setUser", data.resData);
            }
        } catch (error) {
            return redirect("/login");
        }
    };
};