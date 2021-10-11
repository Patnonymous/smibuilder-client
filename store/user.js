export const state = () => ({
    authorized: false,
    currentUser: {
        userEmail: null,
        userName: null,
        userType: null,
        createdOn: null,
        updatedOn: null,
    }
});

export const mutations = {
    setUser(state, userObject) {
        const TAG = "STORE user.js - setUser(), ";
        state.authorized = true;
        state.currentUser.userEmail = userObject.userEmail;
        state.currentUser.userName = userObject.userName;
        state.currentUser.userType = userObject.userType;
        state.currentUser.createdOn = userObject.createdOn;
        state.currentUser.updatedOn = userObject.updatedOn;
        console.log(TAG + "Set the user state. Outputting below.");
        console.log(state.authorized);
        console.log(state.currentUser);
    }
}