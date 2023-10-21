////////////////////////Loader//////////////////////////////
// toggleLoader();


//////////////////////pagenation/////////////////////////////////
///infinite scrolling
let currentPage = 1;
let lastPage = 1;
function handelScroll() {
  const endOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    getPosts(currentPage, false);
  }
}

window.addEventListener("scroll", handelScroll);

///////////////GET POSTS/////////////////////
const postsEle = document.querySelector("#posts");

function getPosts(page = 1, reload = true) {
  ///Execute Loader
  toggleLoader(true);
  axios.get(`${baseURL}/posts?limit=6&page=${page}`)
  .then((response) => {
      ///Stop  Loader
      toggleLoader(false);
      let data = response.data;
      console.log(data,"posts");
      localStorage.setItem("posts",data.meta.total)
      let posts = data.data;
      lastPage = data.meta.last_page;

      if (reload) {
        postsEle.innerHTML = "";
      }
      posts.forEach((post) => {
        const author = post.author;
        ///Edit and Delete Logic
        let user = getUser();
        let isMyPost = user != null && author.id == user.id ;
        let postEle = `
          <div class="card shadow post" id=${post.id} ">
            <div class="card-header">
              <span class="user-info-header" onclick="userClicked(${author.id})">
                  ${
                    typeof author.profile_image == "string"
                      ? `<img src=${author.profile_image} class="rounded-circle user-img">`
                      : `<span class="first-letter">${author.username
                          .charAt(0)
                          .toUpperCase()}</span>`
                  }
                    <span class="user-name fw-bold ms-1">@${
                      author.username
                    }</span>
              </span>
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
              <p class="post-date text-black-50 fw-bold">${post.created_at}</p>
              <h5 class="mt-2">${post.title !== null ? post.title : ""}</h5>
              <p class="description">${post.body}</p>
              </div>
                <hr>
                <div class="comments_tags">
                  <span> <i class="fa fa-pen pe-1"></i> (${
                    post.comments_count
                  }) Comments</span>
                  <span id='post-tags-${post.id}'></span>
                </div>
              </div>
          </div>
        `;

        postsEle.innerHTML += postEle;
        /////////dealing with tags/////////////
        const currentPostTagsId = `post-tags-${post.id}`;
        document.getElementById(currentPostTagsId).innerHTML = "";
        post.tags.forEach((tag) => {
          let tagContent = `<button class="btn-sm rounded tag">
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
if (postsEle !== null) {
  getPosts(currentPage);
}

//////////////////////////////////////////////////////////////
//////////////Add new Post


///////////////////////////////////////////////////////////////////////////////
///////////get post ID and navigate me to post page///////////////////

//////////////////get post ID and navigate me to user profile page////////////////////
function userClicked(id){
  console.log(id);
  window.location = `profile.html?userId=${id}`;
}

/////////////////////////////////////////////////////////////////////////////////
const addNewPostBtn = document.querySelector("#add-post");
addNewPostBtn.addEventListener("click", addPostBtnClicked);

function addPostBtnClicked() {
  let postTitle = (document.querySelector("#post-title").value = "");
  let postBody = (document.querySelector("#post-body").value = "");
  let postModal = new bootstrap.Modal(
    document.querySelector("#create-post-modal")
  );
  let hiddenInput = (document.querySelector("#post-input-id").value = "");
  document.querySelector("#post-modal-title").innerHTML = "Add Post";
  document.querySelector("#cretae-post-btn").innerHTML = "Create";
  postModal.toggle();
} 

