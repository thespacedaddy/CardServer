const chalk = require('chalk');
const dF = require('dateformat');

const pink = (str) => {
  return chalk.ansi256(217)(str);
}

const dimGray = (str) => {
  return chalk.dim.gray(str)
}

const Sblue = (str) => {
  return chalk.ansi256(75)(str)
}

const bold = (str) => {
  return chalk.bold(str)
}


const dateStamp = () => {
  let dateString = dF(Date().now, "'['yyyy-mm-dd HH:MM']'")
  return dateString;
}

exports.serverStart = () => {
  let dateString = dF(Date().now, "ddd mmm d, yyyy")

  console.log(chalk.bold(dateString))
  console.log(Sblue('Server is Online.'))
}

//This will be pink
exports.join = (player) => {
  let msg = `Player ${bold(player)} joined the server.`
  console.log(`${dimGray(dateStamp())} ${pink(msg)}`)

}

exports.leave = (msg) => {

}

exports.game = (msg) => {

}

exports.room = (msg) => {

}

exports.error = (msg) => {

}

exports.warn = (msg) => {

}