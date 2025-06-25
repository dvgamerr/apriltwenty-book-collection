import axios from "axios";

const base_url = "http://loaclhost:4000";
const endPoint = base_url + "/auth/register";

export async function register(clientData) {
    try {
        const response = await axios.post(endPoint, clientData.body);
        return response;    
    } catch (error) {
        throw error;
    }

}