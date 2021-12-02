export const state = () => ({
    authorized: false,
    currentUser: {
        userId: null,
        userEmail: null,
        userName: null,
        userType: null,
        createdOn: null,
        updatedOn: null,
    }
});

export const mutations = {
    setUser(state, userObject) {
        state.authorized = true;
        state.currentUser.userId = userObject.userId
        state.currentUser.userEmail = userObject.userEmail;
        state.currentUser.userName = userObject.userName;
        state.currentUser.userType = userObject.userType;
        state.currentUser.createdOn = userObject.createdOn;
        state.currentUser.updatedOn = userObject.updatedOn;
    },
    logOut(state) {
        state.authorized = false;
        state.currentUser.userId = null;
        state.currentUser.userEmail = null;
        state.currentUser.userName = null;
        state.currentUser.userType = null;
        state.currentUser.createdOn = null;
        state.currentUser.updatedOn = null;
    }
};