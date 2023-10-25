
////////////////////////Loader//////////////////////////////
function toggleLoader(show = true) {
  const loader = document.querySelector(".loader");
  if (show) {
    loader.classList.remove("d-none");
    loader.classList.add("d-block");
  } else {
    loader.classList.remove("d-block");
    loader.classList.add("d-none");
  }
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
const logoutBtn = document.querySelector("#logout-btn");
const baseURL = "https://tarmeezacademy.com/api/v1";
const token = localStorage.getItem("token");
const profileLink = document.querySelector(".nav-link-2");
setupUi();

////////////////////////////////////////////////////////////////////////
//////////Edit and Delete Logic
const addPost = document.querySelector("#cretae-post-btn");
if (addPost !== null) {
  addPost.addEventListener("click", createAndEditPost);
}

function createAndEditPost() {
  let postIdInput = document.querySelector("#post-input-id").value;
  let isCreated = postIdInput == null || postIdInput == "";
  let title = document.querySelector("#post-title");
  let body = document.querySelector("#post-body");
  let img = document.querySelector("#post-img");
  //////////////
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("body", body.value);
  formData.append("image", img.files[0]);

  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };

  let url = "";
  if (isCreated) {
    ///Create Post
    url = `${baseURL}/posts`;
  } else {
    ///Edit post
    ///this API is diffrent so you have to remove (put) method
    /// and replace it with (post) method
    formData.append("_method", "put");
    url = `${baseURL}/posts/${postIdInput}`;
  }

    toggleLoader(true);
  axios
    .post(url, formData, { headers: headers })
    .then((response) => {
      const modal = document.querySelector("#create-post-modal");
      // const modalInstance = bootstrap.modal.getInstance(modal)
      // modalInstance.hide()
      modal.classList.remove("show");
      modal.classList.add("hide");
      // Get the new Post without refreshing the page
      showAlert(
        isCreated ? "New Post is Created" : "Post Is Updated successfully",
        "craete-post-alert"
      );
      getPosts();
    })
    .catch((err) => {
      console.log(err);
      const msg = err.response.data.message;
      console.log(msg, "err msg");
      showAlert(msg, "regect-alert", "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function editPostBtnClicked(postObj) {
  console.log("updated");
  let post = JSON.parse(decodeURIComponent(postObj));
  // console.log(post);
  let postTitle = (document.querySelector("#post-title").value = post.title);
  let postBody = (document.querySelector("#post-body").value = post.body);
  let postModal = new bootstrap.Modal(
    document.querySelector("#create-post-modal")
  );
  let hiddenInput = (document.querySelector("#post-input-id").value = post.id);
  document.querySelector("#post-modal-title").innerHTML = "Edit Post";
  document.querySelector("#cretae-post-btn").innerHTML = "Update";
  postModal.toggle();
}

/////////////////////////////////////////////////////////////////////////////////////
////////Delete Post
const deletePostBtn = document.querySelector("#delete-post-btn");
if (deletePostBtn != null) {
  deletePostBtn.addEventListener("click", confirmPostDelete);
}

function confirmPostDelete() {
  let deleteBtn = document.querySelector("#delete-post-id");
  let postId = deleteBtn.dataset.postId;
  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
  // formData.append("_method", "delete");
  axios
    .delete(`${baseURL}/posts/${postId}`, { headers: headers })
    .then((data) => {
      console.log(data);
      const modal = document.querySelector("#delete-post-modal");
      modal.classList.remove("show");
      modal.classList.add("hide");
      setupUi();
      //Show Alert
      showAlert("The Post Has Been Deleted Successfully", "delete-post-alert");
      getPosts();
      showProfileDetails();
    })
    .catch((err) => {
      const msg = err.response.data.message;
      showAlert(msg, "regect-alert", "danger");
    });
}

////////////////////////////////////////////////////////////////////
//////////Register Inside Modal/////////////
const registerBtn = document.querySelector("#register-btn");
const regitserUserName = document.querySelector("#regitser-username-input");
const regitserName = document.querySelector("#regitser-name-input");
const regitserPassword = document.querySelector("#regitser-password-input");
const regitserImg = document.querySelector("#regitser-img-input");
const regitserEamil = document.querySelector("#regitser-email-input");

registerBtn.addEventListener("click", (e) => {
  let nameVal = regitserName.value;
  let usernameVal = regitserUserName.value;
  let passwordVal = regitserPassword.value;
  let emailVal = regitserEamil.value;
  let imgVal = regitserImg.files[0];
  registerUserFun(nameVal, usernameVal, passwordVal, emailVal,imgVal);
  regitserName.value = "";
  regitserUserName.value = "";
  regitserPassword.value = "";
  regitserEamil.value = "";
});

function registerUserFun(nameVal, usernameVal, passwordVal,emailVal, imgVal) {
  const formData = new FormData();

  formData.append("username", usernameVal);
  formData.append("password", passwordVal);
  formData.append("name", nameVal);
  formData.append("email", emailVal);
  formData.append("image", imgVal);
  toggleLoader(true);
  axios
  .post(`${baseURL}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then(({ data }) => {
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      ///Close The Modal
      const modal = document.querySelector("#register-modal");
      modal.classList.remove("show");
      modal.classList.add("hide");
      ///Show that User is Loged in
      setupUi();
      //Show Alert
      showAlert("New User Registered Successfully", "register-alert");
      // showUserNameAndImg();
    })
    .catch((e) => {
      console.log(e);
      const msg = e.response.data.message;
      showAlert(msg, "regect-alert", "danger");
    }).finally(()=>{
      toggleLoader(false);
    })
}

/////////////////////////////////////////////////////////////////////
//////////LOGIN Inside Modal/////////////
const loginBtn = document.querySelector("#login-btn");
const userName = document.querySelector("#username-input");
const userPassword = document.querySelector("#password-input");

loginBtn.addEventListener("click", function (e) {
  let nameVal = userName.value;
  let passwordVal = userPassword.value;
  loginUserFun(nameVal, passwordVal);
  userName.value = "";
  userPassword.value = "";
});

function loginUserFun(nameVal, passwordVal) {
  const params = {
    username: nameVal,
    password: passwordVal,
  };
  toggleLoader(true);
  axios
    .post(`${baseURL}/login`,params)
    .then(({ data }) => {
      console.log(data,'fff');
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      ///Close The Modal
      const modal = document.querySelector("#login-modal");
      modal.classList.remove("show");
      modal.classList.add("hide");
      ///Show that User is Loged in
      setupUi();
      //Show Alert
      showAlert("Nice, Your Are Loged In Now", "register-alert");
      getPosts();
    })
    .catch((e) => {
      console.log(e);
      const msg = e.response.data.message;
      showAlert(msg, "login-alert", "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

////////////////////////////////////////////////////////////////////////
//////////Alert Msg/////////////
function showAlert(msg, id, type = "success") {
  const container = document.querySelector("#alert-container");
  const alertPlaceholder = document.createElement("div");
  alertPlaceholder.id = id;
  alertPlaceholder.classList =
    "fade show position-fixed bottom-0 end-0 w-30 z-3 ";

  const alert = (msg, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${msg}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  container.append(alertPlaceholder);
  alert(msg, type);
  //Hide The Alert
  setTimeout(function () {
    const alert = bootstrap.Alert.getOrCreateInstance(`#${id}`);
    alert.close();
  }, 3000);
}

//////////////////////////////////////////////////////////////////////
/////////////setupUi/////////////////
function setupUi() {
  const loginNav = document.querySelector(".nav-loged-in");
  const registerNav = document.querySelector(".register-btn");
  const userInfo = document.querySelector("#user-info");
  const addPost = document.querySelector("#add-post");
  const commentForm_ = document.querySelector(".comments-section");
  const editBtn = document.querySelectorAll(".update-btn");
  const token = localStorage.getItem("token");
  if (token == null) {
    loginNav.classList.add("d-block");
    loginNav.classList.remove("d-none");
    ///
    registerNav.classList.add("d-block");
    registerNav.classList.remove("d-none");
    ///
    logoutBtn.classList.remove("d-block");
    logoutBtn.classList.add("d-none");
    ///
    userInfo.classList.add("d-none");
    userInfo.classList.remove("d-flex");
    if (commentForm_ !== null) {
      commentForm_.classList.add("d-none");
      commentForm_.classList.remove("d-flex");
    }
    ///
    if (addPost !== null) {
      addPost.classList.add("d-none");
      addPost.classList.remove("d-flex");
    }
    if (editBtn.length !== 0) {
      editBtn.forEach((btn) => {
        btn.classList.add("d-none");
      });
    }
    ////Profile-link
    profileLink.classList.remove("profile-link");
    profileLink.classList.add("logout-user");
  } else {
    /// For louged in user
    loginNav.classList.add("d-none");
    registerNav.classList.add("d-none");

    logoutBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-block");

    userInfo.classList.remove("d-none");
    userInfo.classList.add("d-flex");
    /////
    if (editBtn.length !== 0) {
      editBtn.forEach((btn) => {
        btn.classList.add("d-block");
      });
    }
    ///////////
    if (commentForm_ !== null) {
      commentForm_.classList.add("d-flex");
      commentForm_.classList.remove("d-none");
    }
    ///////
    /// show user name and img
    showUserInfo();
    ////
    if (addPost !== null) {
      addPost.classList.remove("d-none");
      addPost.classList.add("d-flex");
    }
    profileLink.classList.remove("logout-user");
    profileLink.classList.add("profile-link");
  }
}

function showUserInfo() {
  const token = localStorage.getItem("token");
  if (token != null) {
    const user = JSON.parse(localStorage.getItem("user"));
    const navUserInfo = document.querySelector("#user-info");
    const userInfoCard = document.querySelector("#user-info-modal");
    const userNameAndImage = `
        ${
          typeof user.profile_image == "string"
            ? `<img src=${user.profile_image} class="rounded-circle user-img">`
            : `<div class="first-letter">${user.username
                .charAt(0)
                .toUpperCase()}
            </div>
            `
        }
        `;
    navUserInfo.innerHTML = userNameAndImage;
    /////////
    const userModalContent = `
      <div class="card-header">
          ${
            typeof user.profile_image == "string"
              ? `<img src=${user.profile_image} class="user-info-card-img user-img" />`
              : `<span class="first-letter">${user.username
                  .charAt(0)
                  .toUpperCase()}
                  </span>`
          }
      </div>
      <div class="card-body">
          <h6>${user.username}</h6>
          <span>${user.email ? user.email : ""}</span>
      </div>
    `;

    userInfoCard.innerHTML = userModalContent;
    //////////////
    navUserInfo.addEventListener("click",(e)=>{
      e.stopPropagation();
      if (userInfoCard.classList.contains("d-none")){
        userInfoCard.classList.remove("d-none");
        userInfoCard.classList.add("d-block");
      }else if (userInfoCard.classList.contains("d-block")){
        userInfoCard.classList.remove("d-block");
        userInfoCard.classList.add("d-none");
      }
    })

    document.body.addEventListener("click",(e)=>{
        if (userInfoCard.classList.contains("d-block")) {
          userInfoCard.classList.remove("d-block");
          userInfoCard.classList.add("d-none");
        }
    })
  }
}

logoutBtn.addEventListener("click", function (e) {
  console.log("run");
  // const alertEle = document.querySelector("#logout-alert")
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUi();

  // window.location.href = "index.html";
  // window.location.href ="index.html";
  showAlert("Logout,Successfuly", "logout-alert");
});

function getUser() {
  let user = null;
  let logedin_User = localStorage.getItem("user");
  if (logedin_User != null) {
    user = JSON.parse(logedin_User);
  }
  return user;
}
//////////////////////////////////
////active class todo
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  if (link.href == window.location.href) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

//////////////////////////////////////////
function getPostId(id) {
  window.location = `postpage.html?postId=${id}`;
}

//////////////////////////////////
/////Go to profile page

// const profileLink = document.querySelector(".nav-link-2");
profileLink.addEventListener("click", (e) => {
  if (getUser() != null) {
    let userId = getUser().id;
    window.location.href = `profile.html?userId=${userId}`;
  }
});
