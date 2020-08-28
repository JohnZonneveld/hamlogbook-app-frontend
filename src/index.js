// main box where data is displayed
const containerBox = document.getElementById('container-box')

const usersUrl = "http://localhost:3000/users/"
const loginUrl = "http://localhost:3000/login"
const contactsUrl = "http://localhost:3000/contacts/"

// set switch statement to start on login page
let state = {page: "login", user: null }

// html for login form
let loginForm = `
  <br>
  <div id="loginDiv">
    <form id="login-form" class="form" action="" method="post">
      <h3 class="text-center text-info">Login</h3>
      <div class="form-group">
        <label for="callsign" class="text-info">Callsign:</label><br>
        <input type="text" name="callsign" id="callsign" class="form-control">
      </div>
      <div class="form-group">
        <label for="password" class="text-info">Password:</label><br>
        <input type="password" name="password" id="password" class="form-control">
      </div>
      <div class="form-group text-left">
        <input type="submit" name="login" class="btn btn-info btn-md" value="Login">
        <input type="submit" name="register" class="btn btn-info btn-md" value="Register">
      </div>
    </form>
  </div>
  `

//creates page content based on uder interaction
function renderPage(){
    switch (state.page){
      // first page people see to log in
      case 'login':
        containerBox.innerHTML = loginForm
        // buttons for login and register page
        const buttons = document.getElementsByClassName("btn btn-info btn-md")
        const registerMenu = buttons.register
        const loginButton = buttons.login
        // event listeners for those buttons
        loginButton.addEventListener("click", (e) => loginFormHandler(e))
        registerMenu.addEventListener("click", (e) => registerFormAdder(e))
      break; 
      case 'register':
        // sets html to registration page
        containerBox.innerHTML = registerPage
      break;
      case 'profile':
        // calls profile page function to set profile html
        // does this so we can get the user object
        menuBar()
        profilePage()
        editButton = document.getElementById("edit-link")
        editButton.addEventListener("click", function(e){
          e.preventDefault()
          state.page = 'edit'
          renderPage()
        })
        
        // logout button and event listener for the button
        logoutButton = document.getElementById('logout')
        logoutButton.addEventListener("click", function (){
          sessionStorage.clear()
          state.page = "login" 
          state.user = null
          renderPage()
        })
      break;
      // search page
      case 'search':
        fetchRandomUser()
      break;
      case 'edit':
        editpage()
        const saveButton = document.getElementById("saveEdit")
        saveButton.addEventListener("click", (e) => editFormHandler(e))
      break;
    }
  }

  // gets values of login form
function loginFormHandler(e) {
    e.preventDefault()
  const callsignInput = document.querySelector("#callsign").value
  const pwInput = document.querySelector("#password").value
  loginFetch(callsignInput, pwInput)
}

// logs in via back end
function loginFetch(callsign, password){
  const bodyData = {user: {
        callsign: callsign,
        password: password
      }
  }
  fetch(loginUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(bodyData)
  })
  .then(response => response.json())
  .then(json => {
    if (json.id){
      //similar to a session ID
      sessionStorage.currentUserId = json.id
      // console.log(json)
      state.page = "profile"
      state.user = json 
      renderPage()
      logoutButton = document.getElementById('logout')
      logoutButton.addEventListener("click", function (){
        sessionStorage.clear()
        state.page = "login" 
        state.user = null
        renderPage()
      })
    }
  })
}



  // initial call to render page
renderPage()

// html for register page
let registerPage =`
  <br>
  <form id="register-form" class="form" action="" method="post">
    <h3 class="text-center text-info">Register</h3>
    <div class="form-group">
      <label for="callsign" class="text-info">Callsign:</label><br>
      <input type="callsign" name="callsign" id="callsign" class="form-control">
    </div>
    <div class="form-group">
      <label for="password" class="text-info">Password:</label><br>
      <input type="password" name="password" id="password" class="form-control">
    </div>
    <div class="form-group">
      <label for="name" class="text-info">Name:</label><br>
      <input type="text" name="name" id="name" class="form-control">
    </div>
    <div class="form-group">
      <label for="email" class="text-info">Email:</label><br>
      <input type="text" name="email" id="email" class="form-control">
    </div>
    <div class="form-group">
      <label for="my_qth" class="text-info">QTH:</label><br>
      <input type="text" name="my_qth" id="my_qth" class="form-control">
    </div>
    <div class="form-group text-left">
      <input id="register2" type="submit" name="register2" class="btn btn-info btn-md" value="Register">
    </div>
    <div class="form-group text-left">
      <input id="login" type="submit" name="login" class="btn btn-info btn-md" value="Back to Login">
    </div>
  </form>


`

// html for user profile
function profilePage(){
  fetch(`http://localhost:3000/users/${sessionStorage.currentUserId}`)
  .then(response => response.json())
  .then(json => {
    state.user = json
  })
  containerBox.innerHTML = `
  <div class="display-card" id="display-card">
  </div>
  <div class="profile-card" id="profile-card">
    <br>
    <h1> Your Profile </h1>
    <div class="card-body">
      <h5 class="card-title">Callsign: ${state.user.callsign}</h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item rounded">Name: ${state.user.name}</li>
      <li class="list-group-item rounded">Email: ${state.user.email}</li>
      <li class="list-group-item rounded">Grid Square: ${state.user.my_qth}</li>
    </ul>
    <div class="card-body">
      <a href="#" class="card-link" id="edit-link">Edit Profile</a>
    </div>
  </div>
  <br>
  <div class="form-group text-left">
  <input id="logout" type="submit" name="logout" class="btn btn-info btn-md" value="Log Out">
  </div>
`
}

//optional top menu bar
function menuBar(){
  containerBox.innerHTML = `
  <div class="display-card" id="display-card">
  </div>
  `
}

// edit page
function editpage(){
  menu = document.getElementById("menu-bar")
  displayCard = document.getElementById('display-card')
  displayCard.innerHTML=`
  <br>
  <h3 class="text-center text-info">Edit</h3>
  <br>
  <form id="edit-form" class="form" action="" method="PUT">
    <div class="form-group">
      <label for="callsign" class="text-info">Callsign:</label><br>
      <input type="text" name="callsign" id="callsign" class="form-control" value="${state.user.callsign}" >
    </div>
    <div class="form-group">
      <label for="name" class="text-info">Name:</label><br>
      <input type="text" name="name" id="name" class="form-control" value="${state.user.name}">
    </div>
    <div class="form-group">
      <label for="age" class="text-info">Email:</label><br>
      <input type="text" name="email" id="email" class="form-control" value="${state.user.email}">
    </div>
    <div class="form-group">
      <label for="abour" class="text-info">My QTH:</label><br>
      <input type="text" name="my_qth" class="form-control" id="my_qth" value="${state.user.my_qth}">
    </div>
    <div class="form-group text-left">
      <input id="saveEdit" type="submit" name="edit" class="btn btn-info btn-md" value="Save">
    </div>
  </form>
  `
  // searchButton2 = searchButton
  // searchButton2.addEventListener("click", function(e){
  //   e.preventDefault
  //   state.page = 'search'
  //   render()
  // })
}

// edit form handler
function editFormHandler(e){
  e.preventDefault()
  const callsignInputEdit = document.querySelector("#callsign").value
  const nameInputEdit = document.querySelector("#name").value
  const emailInputEdit = document.querySelector("#email").value
  const my_qthInputEdit = document.querySelector("#my_qth").value
  editFetch(callsignInputEdit, nameInputEdit, emailInputEdit, my_qthInputEdit)
}
// edits user info
function editFetch(callsign, name, email, my_qth){
  userDataEdit= {
    id: state.user.id,
    callsign: callsign,
    name: name,
    email: email,
    my_qth: my_qth
  }

  fetch(("http://localhost:3000/users/" + state.user.id),{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(userDataEdit)
  })
  .then(resp => resp.json())
  .then(json => {
    state.user = userDataEdit
    state.page = "profile"
    renderPage();
  })
}

// creating new users
//listens for register button to be clicked to render register form
function registerFormAdder(e) {
  e.preventDefault()
state.page = 'register'
renderPage()
const registerButton = document.getElementById("register2")
return registerButton.addEventListener("click", (e) => registerFormHandler(e))
}
// gets values of the register forms
function registerFormHandler(e){
  e.preventDefault()
  const emailInput = document.querySelector("#email").value
  const pwInput = document.querySelector("#password").value
  const callsignInput = document.querySelector("#callsign").value
  const nameInput = document.querySelector("#name").value
  const my_qthInput = document.querySelector("#my_qth").value
  registerFetch(callsignInput, pwInput, nameInput, emailInput, my_qthInput)
}
// sends new user to backend
function registerFetch(callsign, password, name, email, my_qth){
  const userData = {user: {
    callsign: callsign,
    password: password,
    name: name,
    email: email,
    my_qth: my_qth
    }
  }
  // create user in backend
  fetch(usersUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(userData)})
  .then(response => response.json())
  .then(json => {
      sessionStorage.currentUserId = json.id
      state.page = "profile"
      state.user = json
      renderPage()
  })
}