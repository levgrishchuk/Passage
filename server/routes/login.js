module.export = (app) => {
    
    var generateRandomString = function(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible[Math.floor(Math.random() * possible.length)]
        }
    }
    
    app.get('/login', (req, res) => {

    })
}
