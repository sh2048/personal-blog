/*
 * 此脚本负责管理文章发布和评论功能。它使用 localStorage 来持久化文章和评论。
 * 每篇文章包括一个唯一 ID、标题、内容和评论数组。评论只包含文本字段。
 */

// 从 localStorage 加载文章数组
function loadPosts() {
  const stored = localStorage.getItem('posts');
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('无法解析存储的文章数据:', e);
    return [];
  }
}

// 将文章数组保存到 localStorage
function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// 渲染所有文章到页面上
function renderPosts() {
  const postsContainer = document.getElementById('post-list');
  postsContainer.innerHTML = '';
  const posts = loadPosts();

  posts.forEach((post, index) => {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    // 标题
    const titleEl = document.createElement('h3');
    titleEl.textContent = post.title;
    postDiv.appendChild(titleEl);
    // 内容
    const contentEl = document.createElement('p');
    contentEl.textContent = post.content;
    postDiv.appendChild(contentEl);
    // 评论列表
    const commentList = document.createElement('ul');
    commentList.classList.add('comment-list');
    post.comments.forEach(comment => {
      const li = document.createElement('li');
      li.textContent = comment;
      commentList.appendChild(li);
    });
    postDiv.appendChild(commentList);
    // 新评论表单
    const commentForm = document.createElement('form');
    commentForm.classList.add('comment-form');
    commentForm.dataset.index = index;
    const textarea = document.createElement('textarea');
    textarea.placeholder = '写下你的评论...';
    textarea.required = true;
    const commentBtn = document.createElement('button');
    commentBtn.type = 'submit';
    commentBtn.textContent = '发表评论';
    commentForm.appendChild(textarea);
    commentForm.appendChild(commentBtn);
    postDiv.appendChild(commentForm);
    postsContainer.appendChild(postDiv);
  });
}

// 初始化新文章发布表单
function initNewPostForm() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return;
    const posts = loadPosts();
    posts.unshift({
      id: Date.now(),
      title: title,
      content: content,
      comments: []
    });
    savePosts(posts);
    // 清空表单
    titleInput.value = '';
    contentInput.value = '';
    renderPosts();
  });
}

// 初始化评论表单的事件委托
function initCommentDelegation() {
  const postsContainer = document.getElementById('post-list');
  postsContainer.addEventListener('submit', function (e) {
    if (e.target.classList.contains('comment-form')) {
      e.preventDefault();
      const form = e.target;
      const index = parseInt(form.dataset.index, 10);
      const textarea = form.querySelector('textarea');
      const text = textarea.value.trim();
      if (!text) return;
      const posts = loadPosts();
      if (posts[index]) {
        posts[index].comments.push(text);
        savePosts(posts);
        renderPosts();
      }
    }
  });
}

// 页面加载完成时初始化
document.addEventListener('DOMContentLoaded', function () {
  renderPosts();
  initNewPostForm();
  initCommentDelegation();
});
