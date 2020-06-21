import {getFormData, isSomeDataEmpty, clearInputFields} from "../base.js";
import {postRequest} from "../requests/firebaseRequests.js";

const API_KEY = 'https://softunidemoproject.firebaseio.com/';
let success = true;

const getTreksBaseURL = () =>{

    return API_KEY + `treks.json?auth=${sessionStorage.getItem('token')}`;
};


const consoleError = (e) => {
    success = false;
    console.error(e);
};

export async function createTrek(formRef, inputNames) {

    const data = getFormData(formRef, inputNames);

    if (isSomeDataEmpty(data)){
        return false;
    }

    success = true;

    const {description, imageURL, dateTime, location} = data;
    const organizer = sessionStorage.getItem('username');

    const likes = 0;

    const trek = {
        description,
        imageURL,
        dateTime,
        location,
        likes,
        organizer,
    };

    await postRequest(getTreksBaseURL(), trek)
       .then(() => clearInputFields(formRef, inputNames))
        .catch(consoleError);

    return success;
}