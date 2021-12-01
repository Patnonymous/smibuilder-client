export default function ({ store, redirect }) {
    const TAG = "\nMIDDLEWARE - redirectIfLoggedIn(), ";
    console.log(TAG, "Running. User: ");
    console.log(store.state.user);
    if (store.state.user.authorized) {
        return redirect("/builds/search");
    }
}