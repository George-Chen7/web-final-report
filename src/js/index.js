/**
 * 荔荔社区 - 首页JavaScript功能
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化内容切换标签
    initContentTabs();
    
    // 初始化动态加载
    initPostsLoading();
    
    // 初始化动态交互
    initPostInteractions();
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
                    id: 101,
                    name: '学习达人',
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
                            id: 102,
                            name: '摄影爱好者',
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
                    id: 102,
                    name: '摄影爱好者',
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
                    id: 103,
                    name: '校园歌手',
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
            commentsHTML += `
                <div class="comment-item">
                    <img src="${comment.user.avatar}" alt="用户头像">
                    <div class="comment-content">
                        <h4>${comment.user.name}</h4>
                        <p>${comment.content}</p>
                        <div class="comment-actions">
                            <span>${formatTime(comment.time)}</span>
                            <button>回复</button>
                            <button><i class="bi bi-heart"></i> ${comment.likes}</button>
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
                    <h3>${post.user.name}</h3>
                    <p class="post-meta">${post.user.department} · ${formatTime(post.time)}</p>
                </div>
                <button class="btn-follow" data-user-id="${post.user.id}">关注</button>
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
    let commentsHTML = '';
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            commentsHTML += `
                <div class="comment-item">
                    <img src="${comment.user.avatar}" alt="用户头像">
                    <div class="comment-content">
                        <h4>${comment.user.name}</h4>
                        <p>${comment.content}</p>
                        <div class="comment-actions">
                            <span>${formatTime(comment.time)}</span>
                            <button>回复</button>
                            <button><i class="bi bi-heart"></i> ${comment.likes}</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    // 评论输入区
    commentsHTML += `
        <div class="comment-input">
            <img src="src/images/DefaultAvatar.png" alt="用户头像">
            <input type="text" placeholder="添加评论..." disabled>
            <button class="btn-comment" disabled>发送</button>
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
                // 评论输入区可用性根据用户权限调整
                if (currentUser && (currentUser.role === 'user' || currentUser.role === 'admin')) {
                    const input = commentsSection.querySelector('input');
                    const btn = commentsSection.querySelector('.btn-comment');
                    if (input) {
                        input.disabled = false;
                        input.placeholder = '添加评论...';
                    }
                    if (btn) btn.disabled = false;
                }
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