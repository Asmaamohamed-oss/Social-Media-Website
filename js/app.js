// https://tarmeezacademy.com/api/v1


function createProfileImg(userName){
    const firstLetter = [...userName][0].toUpperCase();
    const postElement = document.querySelector(".card-header")
}

const postsEle = document.querySelector("#posts")
async function getPosts(){
    try {
        let response = await fetch("https://tarmeezacademy.com/api/v1/posts")
        let data = await response.json();
        let posts = data.data;
        let tages =["html","cdsdss","jxcxcs"];
        console.log(posts);
        posts.forEach(post => {
            const author = post.author
            let postEle = `
            <div class="card shadow" id="post">
                <div class="card-header">
                    ${typeof author.profile_image === "string"? `<img src=${author.profile_image} class="rounded-circle">` : `<div class="first-letter">${author.username.charAt(0).toUpperCase()}</div>`}
                    <span class="user-name fw-bold ms-1">@${author.username}</span>
                </div>
                <div class="card-body">
                    <img src="${typeof post.image === "string"?post.image:""}" alt="post-img" class="img-fluid">
                    <p class="post-date text-black-50 fw-bold">${post.created_at}</p>
                    <h5 class="mt-2">${post.title!==null?post.title:''}</h5>
                    <p class="description">${post.body}</p>
                    <hr>
                    <div class="comments_tags">
                        <span> <i class="fa fa-pen pe-1"></i> (${post.comments_count}) Comments</span>
                            ${typeof tages === "object" ? tages.map((tag)=>{
                                return `<span class="tag">${tag}</span>`
                            }).join("") : "tags"}
                    </div>
                </div>
            </div>
            `
            postsEle.innerHTML += postEle
        });

    } catch (error) {
        console.log(error,"error");
    }
}
getPosts()




