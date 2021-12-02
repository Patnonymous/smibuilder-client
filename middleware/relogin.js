export default async function ({ app, store, $axios, }) {
    if (app.$cookies.get("auth") == null) { // no token
        // No token.
    } else {
        const token = app.$cookies.get("auth");
        try {
            let verifyResponse = await $axios.post(`${process.env.SERVER_URL}/users/verify`, { token: token });
            let data = verifyResponse.data;
            if (data.status === "Failure") {
                // Not verified, do not relogin.
            } else if (data.status === "Success") {
                // Do relogin.
                store.commit("user/setUser", data.resData);
            }
        } catch (error) {

        }
    };
};