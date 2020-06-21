import {logout} from "../helpers/auth/logoutHelper.js";
import {isUserOrganizer, userHasNotLiked, getUserUsername} from "../helpers/user/userHelper.js";
import {getTrek, deleteTrek, updateTrek, getTreksByUserUsername, getAllTreksSorted} from "../helpers/treks/treksHelper.js";
import {loginHandler, registerUserHandler, createHandler, submitChanges} from "./eventHandlers.js";
import PATHS from "../paths.js";
import {showMessage} from "../helpers/base.js";

const redirect = (url) =>{

    location.href = url;
};

async function loadCommon() {

    return {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    };
}

function getState() {

    return {
        loggedIn: sessionStorage.getItem('hasLoggedIn'),
        username: sessionStorage.getItem('username'),
    }
}

const STORAGE = {
    GET_ITEM: (item) => sessionStorage.getItem(item),
    REMOVE_ITEM: (item) => sessionStorage.removeItem(item),
    SET_ITEM: (item, val) => sessionStorage.setItem(item, val)
};



export async function homeViewHandler() {

    this.partials = await loadCommon.call(this);
    const state = getState();

    if (state.loggedIn){

        state.treks = await getAllTreksSorted();
        this.partials.trek = await this.load('./templates/trek/trek.hbs');
        this.partials.treks = await this.load('./templates/trek/treks.hbs');
    }

    await this.partial('./templates/home/home.hbs', state);

    const TIMEOUT = 3000;

    if (STORAGE.GET_ITEM('isLoggingIn')){

        showMessage('Successfully logged user!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('isLoggingIn');
    }

    else if (STORAGE.GET_ITEM('isClosingTrek')){

        showMessage('Trek closed successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('isClosingTrek');
    }

    else if (STORAGE.GET_ITEM('edited')){

        showMessage('Trek edited successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('edited');
    }

    else if (STORAGE.GET_ITEM('trekCreated')){

        showMessage('Trek created successfully!', 'success', TIMEOUT);
        STORAGE.REMOVE_ITEM('trekCreated');
    }

}

export async function aboutViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partial('./templates/about/about.hbs', getState())
}

export async function loginViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.loginForm = await this.load('./templates/login/loginForm.hbs');
    await this.partial('./templates/login/loginPage.hbs', getState());

    const loginBtn = document.querySelector('form#login button');
    loginBtn.addEventListener('click', loginHandler);

    if (STORAGE.GET_ITEM('loggingOut')){

        showMessage('Logout successfully!', 'success', 3000);
        STORAGE.REMOVE_ITEM('loggingOut');
    }

    if (STORAGE.GET_ITEM('isRegisteredLately')){

        showMessage('Registered successfully!', 'success', 3000);
        STORAGE.REMOVE_ITEM('isRegisteredLately');
    }
}

export async function registerViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.registerForm = await this.load('./templates/register/registerForm.hbs');
    await this.partial('./templates/register/registerPage.hbs', getState());

    const registerBtn = document.querySelector('form button');
    registerBtn.addEventListener('click', registerUserHandler);
}

export async function logoutHandler() {

    await logout();
    STORAGE.SET_ITEM('loggingOut', 'true');
    redirect(PATHS.LOGIN);
}

export async function createViewHandler() {

    this.partials = await loadCommon.call(this);
    this.partials.createForm = await this.load('./templates/create/createForm.hbs');

    await this.partial('./templates/create/createPage.hbs', getState());

    const form = document.querySelector('form#create');
    const createBtn = form.querySelector('button');

    createBtn.addEventListener('click', await createHandler(form));
}

export async function trekDetailsViewHandler() {

    if (STORAGE.GET_ITEM('likeBtnPressed')){

        STORAGE.REMOVE_ITEM('likeBtnPressed');
    }

    else {
        showMessage('Loading....', 'loading', 1000);
    }

    this.partials = await loadCommon.call(this);

    const trekId = location.hash.split(':')[1];
    const trek = await getTrek(trekId);

    const {imageURL, description, dateTime, likes, organizer} = trek;

    const isOrganizer = isUserOrganizer(trek);
    const trekLocation = trek.location;
    const hasNotLiked = userHasNotLiked(trek);

    const specificData = {location: trekLocation, imageURL, description, dateTime,
                            likes, organizer, isOrganizer, trekId, hasNotLiked};

    const state = Object.assign(getState(), specificData);

    this.partial('./templates/trek/trekDetails.hbs', state);
}

export async function editTrekHandler() {


    this.partials = await loadCommon.call(this);
    this.partials.editForm = await this.load('./templates/edit/editForm.hbs');

    const trekId = location.hash.split(':')[1];

    const trek = await getTrek(trekId);
    const {imageURL, description, dateTime, organizer, likes} = trek;
    const trekLocation = trek.location;

    const specificData = {

        location: trekLocation,
        imageURL,
        description,
        dateTime,
        organizer,
        likes
    };

    const state = Object.assign(specificData, getState());

    await this.partial('./templates/edit/editPage.hbs', state);

    document.querySelector('form#edit')
                    .addEventListener('submit', await submitChanges(trekId));
}

export async function deleteTrekHandler() {

    const trekId = location.hash.split(':')[1];

    await deleteTrek(trekId);

    STORAGE.SET_ITEM('isClosingTrek', 'true');
    redirect('#/home');
}

export async function likeTrekHandler() {

    const trekId = location.hash.split(':')[1];
    const trek = await getTrek(trekId);
    const username = getUserUsername();

    let peopleWhoLikedIt = trek.peopleWhoLikedIt;

    if (trek.likes === '0' || trek.likes === 0){

        peopleWhoLikedIt = [];
    }

    else if (peopleWhoLikedIt.includes(username)) {
        return;
    }

    trek.likes++;
    peopleWhoLikedIt.push(username);
    trek.peopleWhoLikedIt = peopleWhoLikedIt;

    await updateTrek(trekId, trek);
    STORAGE.SET_ITEM('likeBtnPressed', 'true');
    redirect(`#/treks/:${trekId}`);
}

export async function profileViewHandler() {

   this.partials = await loadCommon.call(this);
   this.partials.treksLocation = await this.load('./templates/trek/treksLocation.hbs');

   const username = getUserUsername();

   const treks = await getTreksByUserUsername(username);

    const specificData = {

        username,
        count: treks.length,
        anyTreks: treks.length > 0,
        treks
    };

   const state = Object.assign(specificData, getState());

   this.partial('./templates/profile/profile.hbs', state);
}