/*!
* Start Bootstrap - Clean Blog v6.0.9 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function () {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})



const localhost = 'http://localhost:1337';
const servicePrefix = 'http://localhost:1337/api/';
const requestPostsService = servicePrefix + 'posts/';
const requestCommentsService = servicePrefix + 'comments/';

const contentEl = document.querySelector('.content .row .col-md-10');
const contentElHeader = document.querySelector('.masthead .container .row .col-md-10');
const headerImg = document.querySelector('.masthead');

window.addEventListener('hashchange', changeRoute);

function changeRoute() {
    const pageUrl = location.hash.substring(2);
    loadPage(pageUrl);
}

async function loadPage(url) {
    contentEl.innerHTML = 'Yükleniyor';
    if (url === '') {
        loadHomePage();
    } else {
        contentElHeader.innerHTML = 'Yükleniyor';
        loadSubPage(requestPostsService + url);
    }
}

async function loadSubPage(url) {
    const post = await fetch(url).then(r => r.json());
    const img = await fetch(url + '?populate=hero').then(x => x.json());
    const comments = await fetch(url + '?populate=comments').then(x => x.json());

    headerImg.style.backgroundImage = `url('${localhost}${img.data.attributes.hero.data.attributes.url}')`;

    contentElHeader.innerHTML = `
        <div class="site-heading">
            <h1>${post.data.attributes.title}</h1>
            <span class="subheading">${post.data.attributes.summary}</span>
        </div>
        `;

    contentEl.innerHTML = `
        <div class="post">
            <div class="content">
                ${post.data.attributes.content.replace(/\n/g, "<br />")}
            </div>
            <hr>
            <div class="postComments">

            </div>
        </div>
        `;

    const postComments = document.querySelector('.content .row .col-md-10 .post .postComments');
    for (const comment of comments.data.attributes.comments.data) {
        // Yorumun altına yorumu yapan kullanıcıyı ekleyin
        const userId = comment.id;
        const user = await fetch(requestCommentsService + `${userId}?populate=users`).then(x => x.json());

        postComments.innerHTML += `
                 <div class="comment">
                         ${comment.attributes.comment}
                         <div class="user">
                            user: ${user.data.attributes.users.data.attributes.username}
                        </div>
                 </div>
             `;
    }

}

async function loadHomePage() {
    const posts = await fetch(requestPostsService + '?populate=*').then(r => r.json());

    headerImg.style.backgroundImage = `url('assets/img/home-bg.jpg')`;

    contentElHeader.innerHTML = `
        <div class="site-heading">
            <h1>Clean Blog</h1>
            <span class="subheading">A Blog Theme by Start Bootstrap</span>
        </div>
        `;

    contentEl.innerHTML = '';

    for (const post of posts.data) {
        const date = post.attributes.updatedAt;
        contentEl.innerHTML += `
            <div class="post-preview">
                <a href="#/${post.id}"><h2 class="post-title">${post.attributes.title}</h2></a>
                <a href="#/${post.id}"><h3 class="post-subtitle">${post.attributes.summary}</h3></a>
                <p class="post-meta">
                    Posted by
                    <a href="#!">${post.attributes.users.data.attributes.username}</a>
                    on ${date.slice(0, 10)}
                </p>
            </div>
            <hr>
        `;
    }

}

changeRoute();

