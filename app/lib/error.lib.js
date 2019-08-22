async function redirect303(res,err) {
    console.log(err.stck)
    res.redirect(303, '/error' );
}

function error_note(message) {
    return { "error": true,
        "message": message}
}

module.exports.redirect303 = redirect303
module.exports.error_note = error_note