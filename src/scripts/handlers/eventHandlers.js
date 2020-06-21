import {signIn} from "../helpers/auth/loginHelper.js";
import registerUser from "../helpers/auth/registerHelper.js";
import {createTrek} from "../helpers/createTrek/createHandler.js";
import PATHS from "../paths.js";
import {getFormData, isSomeDataEmpty, showMessage} from "../helpers/base.js";
import {updateTrek} from "../helpers/treks/treksHelper.js";

export async function loginHandler() {

    const form = document.querySelector('form#login');
    const success = await signIn(form, ['username', 'password']);

    if (success){

        sessionStorage.setItem('isLoggingIn', 'true');
        location.href = PATHS.HOME;
        return;
    }

    const TIMEOUT = 4000;

    showMessage('Invalid credentials. Please, retry your request with correct credentials.',
                    'error', TIMEOUT);
}

export async function registerUserHandler() {

    const registerForm = document.querySelector('form#register');
    const inputFieldNames = ['username', 'password', 'rePassword'];

    const success = await registerUser(registerForm, inputFieldNames);

    if (success){

        sessionStorage.setItem('isRegisteredLately', 'true');
        location.href = PATHS.LOGIN;
    }

    else{
        showMessage('Registration failed! Try using other credentials!', 'error', 4000);
    }
}

export async function createHandler(form) {

    return async function () {

        const inputFieldNames = ['location', 'dateTime', 'description', 'imageURL'];
        const success =  await createTrek(form, inputFieldNames);

        if (success){

            sessionStorage.setItem('trekCreated', 'true');
            location.href = PATHS.HOME;
            return;
        }

        showMessage('Unable to create trek with such data!', 'error', 4000);
    };
}

export async function submitChanges(trekId) {

    return async function (e) {

        const data = getFormData(e.target,
                ['location', 'imageURL', 'description', 'dateTime', 'likes', 'organizer']);

        if (isSomeDataEmpty(data)){
            return;
        }

        await updateTrek(trekId, data);

        sessionStorage.setItem('edited', 'true');
        location.href = `#/home`;
    };
}