const User = require('../models/User');

const saveNewUser = (userDoc) => {
    return new Promise((resolve, reject) => {
        let user = new User(userDoc);

        user.save((err, doc) => {
            if (err) {
                reject (err);
            } else {
                resolve(doc);
            }
        });
        
    });
};

module.exports = {
    saveNewUser
}