import axios from "axios";

const base_url = "http://localhost:4000";
const endPoint = base_url + "/books/"
export async function getBooks () {
    try {
        const response = await axios.get(endPoint);
        return response;
    } catch (error) {
        throw error;
    }
}