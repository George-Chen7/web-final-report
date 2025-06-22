/**
 * 荔荔社区 - 首页JavaScript功能
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 首页加载时初始化预设用户
    initPresetUsers();
    
    // 初始化内容切换标签
    initContentTabs();
    
    // 初始化动态加载
    initPostsLoading();
    
    // 初始化动态交互
    initPostInteractions();
    
    // 自动加载全站动态内容
    loadPosts('all');
});

/**
 * 初始化内容切换标签
 */
function initContentTabs() {
    const tabs = document.querySelectorAll('.content-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            tabs.forEach(t => t.classList.remove('active'));
            
            // 添加当前标签的active类
            this.classList.add('active');
            
            // 获取标签类型
            const tabType = this.dataset.tab;
            
            // 加载对应类型的动态
            loadPosts(tabType);
        });
    });
}

/**
 * 加载动态内容
 * @param {string} type - 动态类型 (all, following, hot)
 * @param {boolean} append - 是否追加内容
 */
function loadPosts(type = 'all', append = false) {
    const postsContainer = document.querySelector('.posts-list');
    
    // 如果不是追加，则清空容器
    if (!append) {
        postsContainer.innerHTML = '<div class="loading">加载中...</div>';
    }
    
    // 模拟加载延迟
    setTimeout(() => {
        // 移除加载提示
        const loading = postsContainer.querySelector('.loading');
        if (loading) {
            postsContainer.removeChild(loading);
        }
        
        // 模拟获取动态数据
        const posts = getPostsData(type);
        
        // 如果没有数据
        if (posts.length === 0) {
            postsContainer.innerHTML = '<div class="no-content">暂无内容</div>';
            return;
        }
        
        // 渲染动态
        posts.forEach(post => {
            if (!append) {
                postsContainer.innerHTML += createPostHTML(post);
            } else {
                postsContainer.insertAdjacentHTML('beforeend', createPostHTML(post));
            }
        });
        
        // 重新绑定交互事件
        initPostInteractions();
    }, 500);
}

/**
 * 获取动态数据（从localStorage）
 * @param {string} type - 动态类型
 * @returns {Array} 动态数据数组
 */
function getPostsData(type) {
    let allPosts = JSON.parse(localStorage.getItem('postList'));
    if (!allPosts) {
        // 初始化默认动态
        allPosts = [
            {
                id: 1,
                user: {
                    id: 1750516625143,
                    name: 'study_master',
                    nickname: '学习达人',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '计算机学院'
                },
                content: '期末复习攻略分享！#期末复习 #学习方法\n1. 制定合理的复习计划，分配每天的学习任务\n2. 整理笔记和重点知识点，制作思维导图\n3. 多做习题，找出自己的薄弱环节\n4. 保持良好的作息，确保充足的睡眠',
                images: ['src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
                likes: 42,
                comments: [
                    {
                        id: 201,
                        user: {
                            id: 1750516625144,
                            name: 'photo_lover',
                            nickname: '摄影爱好者',
                            avatar: 'src/images/DefaultAvatar.png'
                        },
                        content: '非常实用的复习方法，谢谢分享！',
                        time: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1小时前
                        likes: 5
                    }
                ]
            },
            {
                id: 2,
                user: {
                    id: 1750516625144,
                    name: 'photo_lover',
                    nickname: '摄影爱好者',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '艺术学院'
                },
                content: '校园的春天真美！分享几张今天拍的照片 #校园风光 #摄影',
                images: ['src/images/DefaultAvatar.png', 'src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天
                likes: 78,
                comments: []
            },
            {
                id: 3,
                user: {
                    id: 1750516625145,
                    name: 'campus_singer',
                    nickname: '校园歌手',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '音乐学院'
                },
                content: '校园歌手大赛开始报名啦！欢迎所有热爱音乐的同学参加 #校园活动 #音乐\n时间：5月20日-6月10日\n地点：大学生活动中心\n报名方式：扫描下方二维码或到学生会办公室登记',
                images: ['src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3天前
                likes: 156,
                comments: []
            },
            {
                id: 4,
                user: {
                    id: 104,
                    name: '美食达人',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '食品学院'
                },
                content: '今天在食堂发现了一道超级好吃的菜！推荐给大家 #校园美食 #美食分享\n菜品：红烧肉\n价格：8元\n位置：第一食堂二楼\n评分：⭐⭐⭐⭐⭐',
                images: ['src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
                likes: 89,
                comments: []
            },
            {
                id: 5,
                user: {
                    id: 105,
                    name: '运动健将',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '体育学院'
                },
                content: '校运会即将开始，大家准备好了吗？ #校运会 #运动\n项目：100米、跳远、铅球、接力赛\n时间：下周三开始\n地点：校体育场\n欢迎大家来加油助威！',
                images: ['src/images/DefaultAvatar.png', 'src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
                likes: 203,
                comments: []
            },
            {
                id: 6,
                user: {
                    id: 106,
                    name: '考研学姐',
                    avatar: 'src/images/DefaultAvatar.png',
                    department: '理学院'
                },
                content: '考研经验分享帖 #考研经验 #学习分享\n1. 制定详细的复习计划，每天按计划执行\n2. 多做真题，熟悉考试题型\n3. 保持良好的心态，不要给自己太大压力\n4. 合理安排时间，注意劳逸结合\n希望这些经验对大家有帮助！',
                images: ['src/images/DefaultAvatar.png'],
                time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1天前
                likes: 267,
                comments: []
            }
        ];
        localStorage.setItem('postList', JSON.stringify(allPosts));
    }
    
    // 类型筛选
    switch (type) {
        case 'following':
            // 关注动态 - 暂时返回空数组，后续可以添加关注逻辑
            return [];
        case 'hot':
            // 热门推荐 - 按点赞数排序，返回前5条
            return [...allPosts].sort((a, b) => b.likes - a.likes).slice(0, 5);
        case 'all':
        default:
            // 全站动态 - 按时间排序
            return [...allPosts].sort((a, b) => new Date(b.time) - new Date(a.time));
    }
}

/**
 * 创建动态HTML
 * @param {Object} post - 动态数据
 * @returns {string} 动态HTML字符串
 */
function createPostHTML(post) {
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 判断是否显示关注按钮还是删除按钮
    let actionButtonHTML = '';
    if (currentUser && (currentUser.username === post.user.name || currentUser.id === post.user.id)) {
        // 如果是当前用户发布的动态，显示删除按钮
        actionButtonHTML = `<button class="btn-delete" data-post-id="${post.id}">删除</button>`;
    } else {
        // 如果不是当前用户发布的动态，显示关注按钮
        const isFollowing = currentUser && currentUser.following && currentUser.following.includes(post.user.id);
        const buttonText = isFollowing ? '已关注' : '关注';
        const buttonClass = isFollowing ? 'btn-follow following' : 'btn-follow';
        const buttonStyle = isFollowing ? 'style="background-color: #e0e0e0; color: #666;"' : '';
        actionButtonHTML = `<button class="${buttonClass}" data-user-id="${post.user.id}" ${buttonStyle}>${buttonText}</button>`;
    }
    
    // 处理图片展示
    let imagesHTML = '';
    if (post.images && post.images.length > 0) {
        if (post.images.length === 1) {
            imagesHTML = `
                <div class="post-images">
                    <img src="${post.images[0]}" alt="动态图片">
                </div>
            `;
        } else if (post.images.length === 2) {
            imagesHTML = `
                <div class="post-images grid-2">
                    <img src="${post.images[0]}" alt="动态图片">
                    <img src="${post.images[1]}" alt="动态图片">
                </div>
            `;
        } else if (post.images.length >= 3) {
            imagesHTML = `
                <div class="post-images grid-3">
                    <img src="${post.images[0]}" alt="动态图片">
                    <img src="${post.images[1]}" alt="动态图片">
                    <img src="${post.images[2]}" alt="动态图片">
                </div>
            `;
        }
    }
    
    // 处理评论展示
    let commentsHTML = '';
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            // 兼容两种数据结构
            const commentUser = comment.user || {
                name: comment.nickname || comment.username,
                avatar: comment.avatar
            };
            const commentTime = comment.time || comment.publishTime;
            
            commentsHTML += `
                <div class="comment-item">
                    <img src="${commentUser.avatar}" alt="用户头像">
                    <div class="comment-content">
                        <h4>${commentUser.name}</h4>
                        <p>${comment.content}</p>
                        <div class="comment-actions">
                            <span>${formatTime(commentTime)}</span>
                            <button class="btn-reply">回复</button>
                            <button class="btn-like-comment"><i class="bi bi-heart"></i> ${comment.likes || 0}</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // 格式化内容，处理换行和话题标签
    const formattedContent = post.content
        .replace(/\n/g, '</p><p>')
        .replace(/#(\S+)/g, '<a href="#" class="topic">#$1</a>');
    
    return `
        <article class="post-item" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${post.user.avatar}" alt="用户头像">
                <div class="post-info">
                    <h3>${post.user.nickname || post.user.name}</h3>
                    <p class="post-meta">${post.user.department} · ${formatTime(post.time)}</p>
                </div>
                ${actionButtonHTML}
            </div>
            <div class="post-content">
                <p>${formattedContent}</p>
                ${imagesHTML}
            </div>
            <div class="post-actions">
                <button class="btn-like"><i class="bi bi-heart"></i> 点赞 <span>${post.likes}</span></button>
                <button class="btn-comment"><i class="bi bi-chat"></i> 评论 <span>${post.comments.length}</span></button>
                <button class="btn-share"><i class="bi bi-share"></i> 分享</button>
                <button class="btn-bookmark"><i class="bi bi-bookmark"></i> 收藏</button>
            </div>
            <div class="post-comments"><!-- 默认不加show类，收起 --></div>
        </article>
    `;
}

/**
 * 初始化动态加载
 */
function initPostsLoading() {
    const loadMoreBtn = document.querySelector('.load-more button');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // 获取当前活动的标签类型
            const activeTab = document.querySelector('.content-tabs .tab.active');
            const tabType = activeTab ? activeTab.dataset.tab : 'all';
            
            // 加载更多动态
            loadPosts(tabType, true);
        });
    }
}

/**
 * 生成评论区HTML
 * @param {Object} post - 动态数据
 * @returns {string} 评论区HTML字符串
 */
function createCommentsHTML(post) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let commentsHTML = '';
    
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            // 兼容两种数据结构
            const commentUser = comment.user || {
                name: comment.nickname || comment.username,
                avatar: comment.avatar
            };
            const commentTime = comment.time || comment.publishTime;
            
            commentsHTML += `
                <div class="comment-item">
                    <img src="${commentUser.avatar}" alt="用户头像">
                    <div class="comment-content">
                        <h4>${commentUser.name}</h4>
                        <p>${comment.content}</p>
                        <div class="comment-actions">
                            <span>${formatTime(commentTime)}</span>
                            <button class="btn-reply">回复</button>
                            <button class="btn-like-comment"><i class="bi bi-heart"></i> ${comment.likes || 0}</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    // 评论输入区 - 根据用户状态设置初始状态
    const isLoggedIn = currentUser && currentUser.role !== 'guest';
    const inputDisabled = !isLoggedIn;
    const inputPlaceholder = isLoggedIn ? '添加评论...' : '请先登录后评论...';
    const btnDisabled = !isLoggedIn;
    
    commentsHTML += `
        <div class="comment-input">
            <img src="src/images/DefaultAvatar.png" alt="用户头像">
            <input type="text" placeholder="${inputPlaceholder}" ${inputDisabled ? 'disabled' : ''}>
            <button class="btn-send-comment" ${btnDisabled ? 'disabled' : ''}>发送</button>
        </div>
    `;
    return commentsHTML;
}

/**
 * 初始化动态交互
 */
function initPostInteractions() {
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 删除按钮
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            if (confirm('确定要删除这条动态吗？删除后无法恢复。')) {
                deletePost(postId);
            }
        });
    });
    
    // 关注按钮
    const followButtons = document.querySelectorAll('.btn-follow');
    followButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('请先登录后才能关注用户');
                return;
            }
            const userId = this.getAttribute('data-user-id');
            toggleFollow(userId, this);
        });
    });
    
    // 点赞按钮
    const likeButtons = document.querySelectorAll('.post-actions .btn-like');
    likeButtons.forEach(button => {
        // 先移除所有旧事件
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            if (currentUser && currentUser.role === 'guest') {
                e.preventDefault();
                alert('请先登录后才能点赞');
                return;
            }
            this.classList.toggle('active');
            const likeCount = this.querySelector('span');
            let count = parseInt(likeCount.textContent);
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                likeCount.textContent = count + 1;
                if (icon) {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                }
            } else {
                likeCount.textContent = count - 1;
                if (icon) {
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                }
            }
        });
    });
    
    // 评论按钮
    const commentButtons = document.querySelectorAll('.post-actions .btn-comment');
    commentButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            if (currentUser && currentUser.role === 'guest') {
                e.preventDefault();
                alert('请先登录后才能评论');
                return;
            }
            const postItem = this.closest('.post-item');
            const commentsSection = postItem.querySelector('.post-comments');
            // 获取动态id
            const postId = postItem.getAttribute('data-post-id');
            
            // 展开/收起逻辑
            if (!commentsSection.classList.contains('show')) {
                // 展开，渲染评论内容
                const posts = getPostsData();
                const post = posts.find(p => String(p.id) === String(postId));
                commentsSection.innerHTML = createCommentsHTML(post);
                commentsSection.classList.add('show');
                
                // 立即启用评论输入区（如果用户已登录）
                const input = commentsSection.querySelector('input');
                const btn = commentsSection.querySelector('.btn-send-comment');
                
                if (currentUser && currentUser.role !== 'guest') {
                    // 登录用户，启用输入框和发送按钮
                    if (input) {
                        input.disabled = false;
                        input.placeholder = '添加评论...';
                        input.focus(); // 自动聚焦到输入框
                    }
                    if (btn) {
                        btn.disabled = false;
                    }
                } else {
                    // 游客或未登录用户，保持禁用状态
                    if (input) {
                        input.disabled = true;
                        input.placeholder = '请先登录后评论...';
                    }
                    if (btn) {
                        btn.disabled = true;
                    }
                }
                
                // 绑定评论发送事件
                bindCommentEvents(postId);
            } else {
                // 收起，清空内容
                commentsSection.classList.remove('show');
                commentsSection.innerHTML = '';
            }
        });
    });
    
    // 分享按钮
    const shareButtons = document.querySelectorAll('.post-actions .btn-share');
    shareButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            if (currentUser && currentUser.role === 'guest') {
                e.preventDefault();
                alert('请先登录后才能分享');
                return;
            }
            // ... 这里可加分享逻辑 ...
        });
    });
    
    // 收藏按钮
    const bookmarkButtons = document.querySelectorAll('.post-actions .btn-bookmark');
    bookmarkButtons.forEach(button => {
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        newBtn.addEventListener('click', function(e) {
            if (currentUser && currentUser.role === 'guest') {
                e.preventDefault();
                alert('请先登录后才能收藏');
                return;
            }
            // ... 这里可加收藏逻辑 ...
        });
    });
}

/**
 * 绑定评论相关事件
 * @param {string} postId - 动态ID
 */
function bindCommentEvents(postId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 发送评论按钮
    const sendCommentBtn = document.querySelector(`[data-post-id="${postId}"] .btn-send-comment`);
    const commentInput = document.querySelector(`[data-post-id="${postId}"] .comment-input input`);
    
    if (sendCommentBtn && commentInput) {
        // 发送评论事件
        sendCommentBtn.addEventListener('click', function() {
            sendComment(postId, commentInput.value);
        });
        
        // 回车发送评论
        commentInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendComment(postId, this.value);
            }
        });
        
        // 输入时启用/禁用发送按钮
        commentInput.addEventListener('input', function() {
            sendCommentBtn.disabled = !this.value.trim();
        });
    }
    
    // 评论点赞按钮
    const commentLikeButtons = document.querySelectorAll(`[data-post-id="${postId}"] .btn-like-comment`);
    commentLikeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentUser && currentUser.role === 'guest') {
                alert('请先登录后才能点赞评论');
                return;
            }
            // 评论点赞逻辑
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            const likeText = this.textContent.trim();
            const likeCount = parseInt(likeText.match(/\d+/)[0]);
            
            if (this.classList.contains('active')) {
                this.innerHTML = `<i class="bi bi-heart-fill"></i> ${likeCount + 1}`;
            } else {
                this.innerHTML = `<i class="bi bi-heart"></i> ${likeCount - 1}`;
            }
        });
    });
    
    // 回复按钮
    const replyButtons = document.querySelectorAll(`[data-post-id="${postId}"] .btn-reply`);
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentUser && currentUser.role === 'guest') {
                alert('请先登录后才能回复评论');
                return;
            }
            // 回复功能可以后续扩展
            alert('回复功能开发中...');
        });
    });
}

/**
 * 发送评论
 * @param {string} postId - 动态ID
 * @param {string} content - 评论内容
 */
function sendComment(postId, content) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!content.trim()) {
        alert('请输入评论内容');
        return;
    }
    
    if (!currentUser || currentUser.role === 'guest') {
        alert('请先登录后才能发送评论');
        return;
    }
    
    // 创建新评论对象
    const newComment = {
        id: Date.now(), // 使用时间戳作为评论ID
        userId: currentUser.id,
        username: currentUser.username,
        nickname: currentUser.nickname || currentUser.username,
        avatar: currentUser.avatar || 'src/images/DefaultAvatar.png',
        content: content.trim(),
        publishTime: new Date().toISOString(),
        likes: 0
    };
    
    // 获取所有动态数据
    let posts = JSON.parse(localStorage.getItem('postList') || '[]');
    
    // 找到对应的动态
    const postIndex = posts.findIndex(post => String(post.id) === String(postId));
    
    if (postIndex !== -1) {
        // 确保comments数组存在
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }
        
        // 添加新评论
        posts[postIndex].comments.push(newComment);
        
        // 更新localStorage
        localStorage.setItem('postList', JSON.stringify(posts));
        
        // 更新页面显示
        updatePostComments(postId, posts[postIndex].comments);
        
        // 清空输入框
        const commentInput = document.querySelector(`[data-post-id="${postId}"] .comment-input input`);
        if (commentInput) {
            commentInput.value = '';
            commentInput.dispatchEvent(new Event('input')); // 触发input事件以更新发送按钮状态
        }
        
        // 更新评论数量
        const commentCountSpan = document.querySelector(`[data-post-id="${postId}"] .btn-comment span`);
        if (commentCountSpan) {
            commentCountSpan.textContent = posts[postIndex].comments.length;
        }
        
        alert('评论发送成功！');
    } else {
        alert('发送失败，动态不存在！');
    }
}

/**
 * 更新动态评论显示
 * @param {string} postId - 动态ID
 * @param {Array} comments - 评论数组
 */
function updatePostComments(postId, comments) {
    const commentsSection = document.querySelector(`[data-post-id="${postId}"] .post-comments`);
    if (commentsSection) {
        // 重新渲染评论区域
        const post = { comments: comments };
        commentsSection.innerHTML = createCommentsHTML(post);
        
        // 重新绑定评论事件
        bindCommentEvents(postId);
    }
}

/**
 * 删除动态
 * @param {string} postId - 动态ID
 */
function deletePost(postId) {
    // 获取所有动态数据
    let posts = JSON.parse(localStorage.getItem('postList') || '[]');
    
    // 找到要删除的动态
    const postIndex = posts.findIndex(post => String(post.id) === String(postId));
    
    if (postIndex !== -1) {
        // 从数组中删除该动态
        posts.splice(postIndex, 1);
        
        // 更新localStorage
        localStorage.setItem('postList', JSON.stringify(posts));
        
        // 从页面中移除该动态元素
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (postElement) {
            postElement.remove();
        }
        
        // 显示删除成功消息
        alert('动态删除成功！');
    } else {
        alert('删除失败，动态不存在！');
    }
}

/**
 * 切换关注状态
 * @param {string} userId - 用户ID
 * @param {HTMLElement} button - 关注按钮元素
 */
function toggleFollow(userId, button) {
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role === 'guest') {
        alert('请先登录后才能关注用户');
        return;
    }
    
    // 不能关注自己
    if (String(currentUser.id) === String(userId)) {
        alert('不能关注自己');
        return;
    }
    
    // 获取所有用户数据
    let userList = JSON.parse(localStorage.getItem('userList') || '[]');
    
    // 找到当前用户和目标用户
    const currentUserIndex = userList.findIndex(user => String(user.id) === String(currentUser.id));
    const targetUserIndex = userList.findIndex(user => String(user.id) === String(userId));
    
    if (currentUserIndex === -1) {
        alert('当前用户信息不存在');
        return;
    }
    
    if (targetUserIndex === -1) {
        alert('目标用户不存在');
        return;
    }
    
    const currentUserData = userList[currentUserIndex];
    const targetUserData = userList[targetUserIndex];
    
    // 确保关注列表和粉丝列表存在
    if (!currentUserData.following) currentUserData.following = [];
    if (!targetUserData.followers) targetUserData.followers = [];
    
    // 检查是否已经关注
    const isFollowing = currentUserData.following.includes(userId);
    
    if (isFollowing) {
        // 取消关注
        currentUserData.following = currentUserData.following.filter(id => id !== userId);
        targetUserData.followers = targetUserData.followers.filter(id => id !== currentUser.id);
        
        button.textContent = '关注';
        button.classList.remove('following');
        alert('已取消关注');
    } else {
        // 添加关注
        currentUserData.following.push(userId);
        targetUserData.followers.push(currentUser.id);
        
        button.textContent = '已关注';
        button.classList.add('following');
        alert('关注成功！');
    }
    
    // 更新用户列表
    localStorage.setItem('userList', JSON.stringify(userList));
    
    // 更新当前用户信息
    localStorage.setItem('currentUser', JSON.stringify(currentUserData));
    
    // 更新关注按钮状态
    updateFollowButtonState(userId, button, isFollowing);
    
    // 更新关注数量显示
    updateFollowCounts();
}

/**
 * 更新关注按钮状态
 * @param {string} userId - 用户ID
 * @param {HTMLElement} button - 关注按钮元素
 * @param {boolean} wasFollowing - 之前是否关注
 */
function updateFollowButtonState(userId, button, wasFollowing) {
    if (wasFollowing) {
        // 之前关注，现在取消关注
        button.textContent = '关注';
        button.classList.remove('following');
        button.style.backgroundColor = '';
        button.style.color = '';
    } else {
        // 之前未关注，现在关注
        button.textContent = '已关注';
        button.classList.add('following');
        button.style.backgroundColor = '#e0e0e0';
        button.style.color = '#666';
    }
}

/**
 * 更新关注数量显示
 */
function updateFollowCounts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // 更新个人主页的关注数量（如果存在）
    const followingCount = document.querySelector('.following-count');
    const followersCount = document.querySelector('.followers-count');
    
    if (followingCount) {
        followingCount.textContent = currentUser.following ? currentUser.following.length : 0;
    }
    
    if (followersCount) {
        // 计算粉丝数量
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        const followers = userList.filter(user => 
            user.followers && user.followers.includes(currentUser.id)
        ).length;
        followersCount.textContent = followers;
    }
}

/**
 * 获取关注列表
 * @param {string} username - 用户名
 * @returns {Array} 关注列表
 */
function getFollowingList(username) {
    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
    const user = userList.find(u => u.username === username);
    return user ? (user.following || []) : [];
}

/**
 * 获取粉丝列表
 * @param {string} username - 用户名
 * @returns {Array} 粉丝列表
 */
function getFollowersList(username) {
    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
    const user = userList.find(u => u.username === username);
    if (!user) return [];
    
    // 查找所有关注了该用户的用户
    return userList.filter(u => 
        u.followers && u.followers.includes(user.id)
    ).map(u => u.id);
}

/**
 * 检查是否关注了某个用户
 * @param {string} userId - 用户ID
 * @returns {boolean} 是否关注
 */
function isFollowingUser(userId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.following) return false;
    return currentUser.following.includes(userId);
}

/**
 * 格式化时间显示
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
        return '刚刚';
    } else if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else if (days < 7) {
        return `${days}天前`;
    } else {
        return new Date(date).toLocaleDateString();
    }
}