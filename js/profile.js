
////////////////////////////
function getCurrentUserId(){
    const urlParmas = new URLSearchParams(window.location.search)
    const userId = urlParmas.get("userId");
    return userId
}

showProfileDetails();
getPosts()

function showProfileDetails(){
    let id = getCurrentUserId()
    axios
      .get(`${baseURL}/users/${id}`)
      .then(({ data }) => {
        drawProfileHeader(data.data);
      })
      .catch((e) => {
        console.log(e);
      });
}

function drawProfileHeader(user){
    const profileHeader = document.querySelector(".profile")
    let profileHeaderContent = `
    <div class="card shadow my-5 profile-card">
        <div class="row profile-details p-3 p-md-4 m-0 bg-body-secondar">
            <div class="col-lg-3 col-5 user-main-img">
                ${
                  typeof user.profile_image == "string"
                    ? `<img src=${user.profile_image} class="rounded-circle">`
                    : `<div class="first-letter">${user.username
                        .charAt(0)
                        .toUpperCase()}
                        </div>`
                }
            </div>
            <!--UserName Name Email-->
            <div class="col-lg-3 col-6 p-0 user-main-info">
                <h6 class="user-name fw-bold">${user.username}</h6>
                <h6 class="user-name fw-bold">${user.name}</h6>
                <h6 class="user-name fw-bold">${
                  user.email ? user.email : ""
                }</h6>
            </div>
            <div class="col-lg-6  user-activites">
                <p>
                <span class="num">${user.posts_count}</span>
                <span>Posts</span>
                </p>
                <p>
                <span class="num">${user.comments_count}</span>
                <span>Comments</span>
                </p>
            </div>
        </div>
    </div>
    <h1>${user.username}'s posts</h1>
    `;
    profileHeader.innerHTML = profileHeaderContent;
}

function getPosts() {
  console.log("get posts");
    let id = getCurrentUserId();
    const userPosts = document.querySelector("#user_posts");
    userPosts.innerHTML = "";
      toggleLoader(true);
    axios
      .get(`${baseURL}/users/${id}/posts?sortBy=created_at`)
      .then((response) => {
        toggleLoader(false);
        let data = response.data;
        let posts = data.data;
        posts.forEach((post) => {
          const author = post.author;
          ///Edit and Delete Logic
          let user = getUser();
          let isMyPost = user != null && author.id == user.id;
          let postEle = `
            <div class="card shadow post"">
                <div class="card-header d-flex">
                    <div class="user-info-header">
                        ${
                          typeof author.profile_image == "string"
                            ? `<img src=${author.profile_image} class="rounded-circle user-img">`
                            : `<div class="first-letter">${author.username
                                .charAt(0)
                                .toUpperCase()}</div>`
                        }
                        <span class="user-name fw-bold ms-1">@${
                          author.username
                        }</span>
                    </div>
                    ${
                      isMyPost
                        ? `
                        <div>
                            <button type="button" class="group-list-icon btn" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis-vertical "></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                <button class="dropdown-item" 
                                onclick="editPostBtnClicked('${encodeURIComponent(
                                  JSON.stringify(post)
                                )}')">
                                <i class="fa-regular fa-pen-to-square"></i>
                                    Edit
                                </button>
                                </li>
                                <li>
                                <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#delete-post-modal"
                                id="delete-post-id"
                                data-post-id=${post.id}
                                >
                                    <i class="fa-regular fa-trash-can"></i>
                                    Delete
                                </button>
                                </li>
                            </ul>
                        </div>
                        `
                        : ""
                    }
                </div>
                <div class="card-body" onclick="getPostId(${post.id})">
                    <div class="card-image">
                        <img src="${
                          typeof post.image === "string" ? post.image : ""
                        }" alt="post-img" class="img-fluid card-image">
                    </div>
                    <div class="card-details">
                        <p class="post-date text-black-50 fw-bold">${
                          post.created_at
                        }</p>
                        <h5 class="mt-2">${
                          post.title !== null ? post.title : ""
                        }</h5>
                        <p class="description">${post.body}</p>
                    </div>
                    <hr>
                    <div class="comments_tags">
                        <span> <i class="fa fa-pen pe-1"></i> (${
                          post.comments_count
                        }) Comments</span>
                        <span id='post-tags-${post.id}' class="tags"></span>
                    </div>
                </div>
            </div>
        `;

          userPosts.innerHTML += postEle;
          /////////dealing with tags/////////////
          const currentPostTagsId = `post-tags-${post.id}`;
          document.getElementById(currentPostTagsId).innerHTML = "";
          post.tags.forEach((tag) => {
            let tagContent = `<button class="btn btn-sm rounded tag">
          ${tag.name}
          </button>`;
            document.getElementById(currentPostTagsId).innerHTML += tagContent;
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
}

