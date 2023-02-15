// const path = require('path');
// const csv=require('csvtojson');
// const cookieParser = require('cookie-parser');



function layout_variables(req) {

    const variables = {
        nav_list: [{
                text: 'Home Page',
                route: '/home'
                },{
                text: 'Trending',
                route: '/trending'
                },{
                text: 'Events',
                route: '/events'
                },{
                text: 'Fresh',
                route: '/fresh'
                }],
        aside_list: [{
                text: 'Login',
                route: '/login'
                },{
                text: 'Signup',
                route: '/signup'
                }],
        footer_list: [{
                text: 'Help',
                route: '/help'
                },{
                text: 'Contact Us',
                route: '/contact'
                },{
                text: 'About',
                route: '/about'
                }]
    }

    let username = req.cookies.name
    if(req.cookies.name) {
        variables.aside_list = [{
            text: username,
            route: '/user/'+username
        },{
            text: 'Notifications',
            route: '/notifications'
        },{
            text: 'Settings',
            route: '/settings'
        },{
            text: 'Logout',
            route: '/logout'
        }]
    }   
    return variables;
}

module.exports = {layout_variables};
