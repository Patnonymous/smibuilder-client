/**
 * Redirect a user if they're already logged in.
 */
export default async function ({ app, store, redirect, $axios, $config, $notify }) {
    if (store.state.user.authorized) {
        return redirect("/builds/search");
    };
};