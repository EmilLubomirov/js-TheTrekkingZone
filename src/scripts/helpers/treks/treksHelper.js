import {doFetch, putRequest, deleteRequest} from "../requests/firebaseRequests.js";

const API_KEY = 'https://softunidemoproject.firebaseio.com/';

const getTreksBaseURL = () =>{
    return API_KEY + `treks.json?auth=${sessionStorage.getItem('token')}`;
};

const getTreksFullURL = () =>{

    return API_KEY + `treks/{id}.json?auth=${sessionStorage.getItem('token')}`;
};


export async function getAllTreks() {

    let treks;

    await doFetch(getTreksBaseURL())
        .then(response => response.json())
        .then(data =>{

            treks = data;
        });

    return treks;
}

export async function getAllTreksSorted() {

    const treks = await getAllTreks();

    if (!treks){
        return;
    }

    const sorted = {};

    Object.entries(treks).sort((e1, e2) =>{

        return e2[1].likes - e1[1].likes;

    }).forEach(arr =>{

        const key = arr[0];
        sorted[key] = arr[1];
    });

    return sorted;
}

export async function getTrek(id) {

    const currentURL = getTreksFullURL().replace('{id}', id);
    let trek;

    await doFetch(currentURL)
        .then(r => r.json())
        .then(data =>{

            trek = data;
        });

    return trek;
}

export async function updateTrek(trekId, data) {

    const EDIT_URL = getTreksFullURL().replace('{id}', trekId);
    await putRequest(EDIT_URL, data).catch(e => console.error(e));
}

export async function deleteTrek(trekId) {

    const DELETE_URL = getTreksFullURL().replace('{id}', trekId);
    await deleteRequest(DELETE_URL).catch(e => console.error(e));
}

export async function getTreksByUserUsername(username) {

    const allTreks = await getAllTreks();
    let usernameTreks = [];

    Object.values(allTreks)
        .forEach(t => {

            if (t.organizer === username){

                usernameTreks.push(t);
            }
        });

    return usernameTreks;
}