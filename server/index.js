const express = require('express')
const app = express()
const port = 3030

// middleware
app.use(express.static(__dirname + '/../client/dist'));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})