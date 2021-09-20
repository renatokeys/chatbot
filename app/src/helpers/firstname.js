'use strict';

const firstName = (userName) => {
    var fname = userName;
    if (/\s/.test(fname)) {
        fname = userName.split(" ")[0];
    }
    fname = fname.toLowerCase()
    fname = fname.charAt(0).toUpperCase() + fname.slice(1);
    return fname;
};


module.exports = firstName