import axios from "axios";



export async function getBankDetail(city) {
	return axios.get('https://vast-shore-74260.herokuapp.com/banks?city='+city)
    .then((response) => {
        return response;
    })
    .catch((error) => {
        return error;
    });
}
