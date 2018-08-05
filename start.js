/*
* @Author: jinsong5@
* @Date:   2018-05-30 14:56:36
* @Last Modified by:   jinsong5@
* @Last Modified time: 2018-05-30 15:03:30
*/
require('babel-core/register')({
  'presets': [
    'stage-3',
    'latest-node'
  ]
})
require('babel-polyfill')
const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.listen(80, () => {
  console.log(`App listening at port 80`)
})

// require('./app')