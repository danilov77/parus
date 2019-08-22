
function router (app) {
  app.post('/registration', (req, res) => {
    res.render('./registration/registration', {
      email: req.body.email
    })
  })
}

module.exports = router
