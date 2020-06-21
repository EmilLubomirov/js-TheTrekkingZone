import * as handlers from "./handlers/routeHandlers.js";
import PATHS from "./paths.js";

(() => {

    function setup(){

        this.use('Handlebars', 'hbs');

        Handlebars.registerHelper('_id', function (obj) {

            return obj.data.key;
        });
    }


    var app = Sammy('#main', function() {

        setup.call(this);

        this.get(PATHS.INITIAL, handlers.homeViewHandler);
        this.get(PATHS.HOME, handlers.homeViewHandler);
        this.post(PATHS.HOME, () => false);
        this.get(PATHS.ABOUT, handlers.aboutViewHandler);
        this.get(PATHS.LOGIN, handlers.loginViewHandler);
        this.post(PATHS.LOGIN, () => false);
        this.get(PATHS.REGISTER, handlers.registerViewHandler);
        this.post(PATHS.REGISTER, () => false);
        this.get(PATHS.LOGOUT, handlers.logoutHandler);
        this.get(PATHS.CREATE, handlers.createViewHandler);
        this.post(PATHS.CREATE, () => false);
        this.get(PATHS.CERTAIN_TREK_PATH, handlers.trekDetailsViewHandler);
        this.get(PATHS.EDIT_TREK_PATH, handlers.editTrekHandler);
        this.get(PATHS.DELETE_TREK_PATH, handlers.deleteTrekHandler);
        this.get(PATHS.LIKE_TREK_PATH, handlers.likeTrekHandler);
        this.get(PATHS.PROFILE, handlers.profileViewHandler);
    });

    app.run(PATHS.INITIAL);

})();