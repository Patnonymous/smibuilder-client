export default async function ({ route, $axios, store }) {
    try {
        let statLogResponse = await $axios.post(`${process.env.SERVER_URL}/stats`, { routeData: route, userData: store.state.user.currentUser });

    } catch (error) {

    }
}