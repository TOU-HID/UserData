//userStorage
const userStorage = window.localStorage.getItem('users')
var users = userStorage ? JSON.parse(userStorage) : []
console.log(typeof userStorage)
console.log(users)

const amountStorage = window.localStorage.getItem('userAmount')
var userAmount = amountStorage ? JSON.parse(amountStorage) : []
console.log(typeof userAmount)
console.log(userAmount)

var loggedInUsername = undefined

//signUp function=======================================================================================================
function signUp () {
  let firstname = document.getElementById('firstname').value
  let lastname = document.getElementById('lastname').value
  let username = document.getElementById('signup-username').value
  let dateofbirth = document.getElementById('dateofbirth').value
  let password = document.getElementById('signup-password').value
  let mobileNo = document.getElementById('mobileNo').value
  let email = document.getElementById('email').value
  let zipcode = document.getElementById('zipcode').value
  let country = document.getElementById('country').value

  var foundUser = users.find(function (user) {
    return username === user.username
  })
  if (foundUser) {
    document.getElementById('notallowed').innerHTML = 'Value is exist'
  } else {
    document.getElementById('notallowed').innerHTML = ''
    users.push({
      firstname,
      lastname,
      username,
      dateofbirth,
      password,
      mobileNo,
      email,
      zipcode,
      country
    })
    window.localStorage.setItem('users', JSON.stringify(users))
  }

  console.log(users)
}

//login funtion==========================================================================================================
function login () {
  let username = document.getElementById('login-username').value
  let password = document.getElementById('login-password').value
  let loginResponse = loginFunction(username, password)
  console.log(loginResponse)
}
function loginFunction (username, password) {
  var loginUser = users.find(function (user) {
    return username === user.username && password === user.password
  })
  if (loggedInUsername !== undefined) {
    return {
      success: false,
      message: 'You are already logged in'
    }
  } else {
    if (loginUser) {
      var loggedInUserIndex = users.indexOf(loginUser)
      loggedInUsername = users[loggedInUserIndex].username
      console.log(loggedInUsername)
      return {
        success: true,
        message: 'Login successful'
      }
    } else if (loginUser === undefined) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }
  }
}

//logout function========================================================================================================
function logout () {
  if (loggedInUsername === undefined) {
    return
  } else {
    loggedInUsername = undefined
    console.log({
      success: true,
      message: 'You are successfully logged out'
    })
  }
}

//sendAmount function====================================================================================================
function sendAmount () {
  let username = document.getElementById('transaction-username').value
  let amount = parseInt(document.getElementById('amount').value)
  var res = transaction(amount, username)
  console.log(res)
}

//Transaction function
function transaction (amount, receiver) {
  var date = new Date()
  foundUser = users.find(function (user) {
    return receiver === user.username
  })
  if (receiver === loggedInUsername) {
    return {
      success: false,
      message: 'You are not allowed to transact money to your own account'
    }
  } else {
    if (foundUser && loggedInUsername) {
      userAmount.push({
        username: loggedInUsername,
        amount: amount * -1,
        date: date.toUTCString()
      })
      userAmount.push({
        username: receiver,
        amount,
        date: date.toUTCString()
      })
      window.localStorage.setItem('userAmount', JSON.stringify(userAmount))
      console.log(userAmount)
      return {
        success: true,
        message: 'sent to receiver'
      }
    } else if (foundUser === undefined || foundUser) {
      if (loggedInUsername === undefined) {
        return {
          success: false,
          message: 'Please login first'
        }
      } else {
        return {
          success: false,
          message: 'Receiver not found'
        }
      }
    }
  }
}

//Balance function=======================================================================================================
function balance () {
  balanceUser = userAmount.filter(function (user) {
    return loggedInUsername === user.username
  })
  if (loggedInUsername) {
    let sum = balanceUser.reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      0
    )
    console.log({
      success: true,
      sum
    })
  } else {
    console.log({
      success: false,
      message: 'Please login first'
    })
  }
}

//Deposit function=====================================================================================================
function deposit () {
  let username = document.getElementById('depositor').value
  let amount = parseInt(document.getElementById('depositamount').value)
  var date = new Date()
  foundUser = users.find(function (user) {
    return username === user.username
  })
  if (foundUser) {
    userAmount.push({
      username,
      amount,
      date: date.toUTCString()
    })
    window.localStorage.setItem('userAmount', JSON.stringify(userAmount))
    console.log(userAmount)
    return {
      success: true,
      message: 'sent to receiver'
    }
  } else {
    console.log({
      success: false,
      message: 'Receiver not found'
    })
  }

}
