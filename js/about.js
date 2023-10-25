
///////Get All Posts//////////
const postsNumber = document.querySelector(".posts-num");
const allPosts = localStorage.getItem("posts");
postsNumber.innerHTML = allPosts;

//////////////////////pagenation/////////////////////////////////
///infinite scrolling
let currentPage = 1;
let lastPage = 1;
function handelScroll() {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    getUsers(currentPage, false);
  }
}
window.addEventListener("scroll", handelScroll);

///////////////////////////////
///////Get All Users//////////
const usersNumber = document.querySelector(".users-num");
const usersEle = document.querySelector(".users");
function getUsers(page = 1, reload = true) {
      ///Execute Loader
        toggleLoader(true);
    axios
      .get(`${baseURL}/users?limit=20&page=${page}`)
      .then((response) => {
        console.log(response);
        ///Stop  Loader
        toggleLoader(false);
        let data = response.data;
        let totalUsers = data.meta.total;
        let users = data.data;
        usersNumber.innerHTML = totalUsers;
        console.log(data, "users");
        /////////////////
        console.log(filterUsers(users, "Asmaa"));
        ///////////
        lastPage = data.meta.last_page;

        if (reload) {
          usersEle.innerHTML = "";
        }
        users.forEach((user) => {
          const {
            name,
            username,
            email,
            id,
            profile_image,
            posts_count,
            comments_count,
          } = user;
          let userEle = `
            <div class="card user">
                <div class="card-user-info d-flex align-items-center">
                    <img src=${profile_image} class="rounded-circle user-img">
                    <div>
                        <h5>${username}</h5>
                        <h6>${name}</h6>
                        <h6>${email !== null ? email : ""}</h6>
                    </div>
                    </div>
                    <div class="card-user-content" onclick="goToProfile(${id})">
                        <p>
                        <span class="num">${posts_count}</span>
                        <span>Posts</span>
                        </p>
                        <p>
                        <span class="num">${comments_count}</span>
                        <span>Comments</span>
                        </p>
                        <button class="btn view">View Profile</button>
                </div>
            </div>
        `;
          usersEle.innerHTML += userEle;
        });
      })
      .catch((e) => {
        console.log(e);
      });
}
getUsers(currentPage);

function goToProfile(id){
    console.log(id);
    window.location = `profile.html?userId=${id}`;
}