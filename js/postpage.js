
/// Get Id from Params
const urlParams = new URLSearchParams(window.location.search)
const postId = urlParams.get('postId')
let singlePostEle = document.querySelector("#post-page");
function getPost(){
    const baseURL = "https://tarmeezacademy.com/api/v1";
    if(postId !== null){
        toggleLoader(true);
        axios.get(`${baseURL}/posts/${postId}`)
        .then(({data})=>{
            toggleLoader(false);
            const {author,body,comments,comments_count,created_at,image,title} = data.data;
            const {username,profile_image} = author

            ///// ShowComments function
            showComments(comments)
            /////Post Card details
            let postContent = `
                <h2 class="mb-3">${username} 's Post</h2>
                <div id="post-card" class="card shadow">
                    <div id="post-details">
                        <div class="card-header d-block">
                        ${
                          typeof profile_image == "string"
                            ? `<img src=${profile_image} class="rounded-circle user-img">`
                            : `<div class="first-letter">${username
                                .charAt(0)
                                .toUpperCase()}</div>`
                        }
                        <span class="user-name fw-bold ms-1">${username} 's Post</span>
                        </div>
                        <div class="card-body">
                            <div class="card-image">
                                <img 
                                src="${typeof image === "string" ? image : ""}" 
                                alt="post-img" class="img-fluid card-image">
                            </div>
                            <div class="card-details">
                                <p class="post-date text-black-50 fw-bold">${created_at}</p>
                                <h5 class="mt-2">${
                                    title !== null ? title : ""
                                } </h5>
                                <p class="description">${body}</p>
                            </div>
                            <hr>
                            <div class="comments_tags">
                                <span><i class="fa fa-pen pe-1"></i>${comments_count} Comments</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
           
            singlePostEle.innerHTML = postContent;
        }).catch((e)=>{
            console.log(e);
            const msg = e.response.data.message;
            showAlert(msg, "post-alert", "danger");
        })
    }
}
getPost();

function showComments(comments){
    const allCommentsEle = document.querySelector("#all-comments");
    allCommentsEle.innerHTML = ""
    comments.forEach((comment)=>{
        const {author,body} = comment
        let commentEle = `
            <div class="comment">
                <div>
                    ${
                        typeof author.profile_image == "string"
                        ? `<img src=${author.profile_image} class="rounded-circle user-img">`
                        : `<div class="first-letter">${author.username
                            .charAt(0)
                            .toUpperCase()}
                            </div>`
                    }
                    <b class="user-name fw-bold ms-1">@${
                        author.username
                    }</b>
                </div>
                <p>${body}</p>
            </div>
        `;
        allCommentsEle.innerHTML += commentEle;
    })

}

///////////////////////////////
//////Add new comment
const commentText = document.querySelector("#comment-content");
const commentForm = document.querySelector("#comment-form");

commentForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    // commentText.value
    console.log(commentText.value);
    // axios.post(`${baseUrl}/posts/${postId}/comments`)
    const token = localStorage.getItem("token");
    const params = {
        "body": commentText.value,
    };
    const headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    };
    axios
    .post(`${baseURL}/posts/${postId}/comments`, params,{
        headers: headers,
    })
    .then((response) => {
    console.log(response);
    showAlert("New Comment has been created, ", "craete-comment-alert");
    //refresh the page
    getPost()
    commentText.value = "";
    })
    .catch((err) => {
        console.log(err);
    const msg = err.response.data.message;
    showAlert(msg, "regect-alert", "danger");
    console.log(msg);
    });
})
