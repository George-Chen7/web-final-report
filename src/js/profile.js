/**
 * 个人资料页面脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // 未登录，跳转到登录页面
        window.location.href = 'login.html';
        return;
    }
    
    // 调用common.js中的登录状态检查函数，确保UI正确显示
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    
    // 更新页面标题
    document.title = `${currentUser.nickname || currentUser.name} 的个人资料 - 荔荔社区`;
    
    // 获取DOM元素
    const profileName = document.getElementById('profileName');
    const profileId = document.getElementById('profileId');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileCover = document.getElementById('profileCover');
    const userAvatar = document.getElementById('userAvatar');
    const postCount = document.getElementById('postCount');
    const followingCount = document.getElementById('followingCount');
    const followerCount = document.getElementById('followerCount');
    const userNickname = document.getElementById('userNickname');
    const userGender = document.getElementById('userGender');
    const userBirthday = document.getElementById('userBirthday');
    const userLocation = document.getElementById('userLocation');
    const userCollege = document.getElementById('userCollege');
    const userMajor = document.getElementById('userMajor');
    const userBio = document.getElementById('userBio');
    const userInterests = document.getElementById('userInterests');
    const userPostList = document.getElementById('userPostList');
    const userPhotoGrid = document.getElementById('userPhotoGrid');
    const userFriendsList = document.getElementById('userFriendsList');
    
    // 编辑资料相关元素
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const editNickname = document.getElementById('editNickname');
    const editGender = document.getElementById('editGender');
    const editBirthday = document.getElementById('editBirthday');
    const editLocation = document.getElementById('editLocation');
    const editCollege = document.getElementById('editCollege');
    const editMajor = document.getElementById('editMajor');
    const editBio = document.getElementById('editBio');
    const editInterestTags = document.getElementById('editInterestTags');
    
    // 头像和封面上传
    const editAvatarBtn = document.getElementById('editAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const editCoverBtn = document.getElementById('editCoverBtn');
    const coverInput = document.getElementById('coverInput');
    
    // 加载用户资料
    loadUserProfile();
    
    // 加载用户动态
    loadUserPosts();
    
    // 加载用户相册
    loadUserPhotos();
    
    // 加载用户好友
    loadUserFriends();
    
    // 加载关注和粉丝列表
    loadFollowLists();
    
    // 标签页切换
    const tabItems = document.querySelectorAll('.profile-tabs li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 移除所有标签页的活动状态
            tabItems.forEach(tab => tab.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 设置当前标签页为活动状态
            this.classList.add('active');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // 关注列表标签页切换
    const followTabs = document.querySelectorAll('.list-tabs .tab');
    const followLists = document.querySelectorAll('.user-list');
    
    followTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // 移除所有标签的活动状态
            followTabs.forEach(t => t.classList.remove('active'));
            followLists.forEach(list => list.classList.remove('active'));
            
            // 设置当前标签为活动状态
            this.classList.add('active');
            document.querySelector(`.${tabType}-list`).classList.add('active');
        });
    });
    
    // 编辑资料模态框
    editProfileBtn.addEventListener('click', function() {
        // 填充表单数据
        fillEditForm();
        // 显示模态框
        editProfileModal.classList.add('active');
    });
    
    closeModalBtn.addEventListener('click', function() {
        editProfileModal.classList.remove('active');
    });
    
    cancelEditBtn.addEventListener('click', function() {
        editProfileModal.classList.remove('active');
    });
    
    // 点击模态框外部关闭
    editProfileModal.addEventListener('click', function(e) {
        if (e.target === editProfileModal) {
            editProfileModal.classList.remove('active');
        }
    });
    
    // 兴趣标签选择
    const interestTags = editInterestTags.querySelectorAll('.interest-tag');
    let selectedTags = [];
    
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagValue = this.getAttribute('data-tag');
            
            if (this.classList.contains('selected')) {
                // 取消选择
                this.classList.remove('selected');
                selectedTags = selectedTags.filter(item => item !== tagValue);
            } else {
                // 选择标签
                if (selectedTags.length < 5) {
                    this.classList.add('selected');
                    selectedTags.push(tagValue);
                } else {
                    showMessage('最多只能选择5个兴趣标签', 'error');
                }
            }
        });
    });
    
    // 头像上传
    editAvatarBtn.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                userAvatar.src = e.target.result;
                
                // 更新用户头像
                const user = JSON.parse(localStorage.getItem('currentUser'));
                user.avatar = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showMessage('头像更新成功', 'success');
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // 封面上传
    editCoverBtn.addEventListener('click', function() {
        coverInput.click();
    });
    
    coverInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileCover.src = e.target.result;
                
                // 更新用户封面
                const user = JSON.parse(localStorage.getItem('currentUser'));
                user.cover = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                showMessage('封面更新成功', 'success');
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // 提交编辑表单
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            nickname: editNickname.value.trim(),
            gender: editGender.value,
            birthday: editBirthday.value,
            location: editLocation.value.trim(),
            college: editCollege.value.trim(),
            major: editMajor.value.trim(),
            bio: editBio.value.trim(),
            interestTags: selectedTags
        };
        
        // 更新用户资料
        updateUserProfile(formData);
        
        // 关闭模态框
        editProfileModal.classList.remove('active');
    });
    
    // 加载用户资料
    function loadUserProfile() {
        // 从本地存储获取用户资料
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        // 更新页面显示
        profileName.textContent = user.nickname || user.name;
        profileId.textContent = `学号：${user.studentId}`;
        
        if (user.avatar) {
            profileAvatar.src = user.avatar;
            userAvatar.src = user.avatar;
        }
        
        if (user.cover) {
            profileCover.src = user.cover;
        }
        
        // 更新统计数据（模拟数据）
        postCount.textContent = user.postCount || '0';
        followingCount.textContent = user.followingCount || '0';
        followerCount.textContent = user.followerCount || '0';
        
        // 更新个人信息
        userNickname.textContent = user.nickname || user.name;
        userGender.textContent = user.gender || '未设置';
        userBirthday.textContent = user.birthday || '未设置';
        userLocation.textContent = user.location || '未设置';
        userCollege.textContent = user.college || '未设置';
        userMajor.textContent = user.major || '未设置';
        userBio.textContent = user.bio || '这个人很懒，什么都没留下...';
        
        // 更新兴趣标签
        if (user.interestTags && user.interestTags.length > 0) {
            userInterests.innerHTML = '';
            user.interestTags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'interest-tag';
                tagElement.textContent = tag;
                userInterests.appendChild(tagElement);
            });
        }
    }
    
    // 填充编辑表单
    function fillEditForm() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        editNickname.value = user.nickname || user.name;
        editGender.value = user.gender || '保密';
        editBirthday.value = user.birthday || '';
        editLocation.value = user.location || '';
        editCollege.value = user.college || '';
        editMajor.value = user.major || '';
        editBio.value = user.bio || '';
        
        // 重置兴趣标签
        selectedTags = user.interestTags || [];
        const tagElements = editInterestTags.querySelectorAll('.interest-tag');
        
        tagElements.forEach(tag => {
            const tagValue = tag.getAttribute('data-tag');
            if (selectedTags.includes(tagValue)) {
                tag.classList.add('selected');
            } else {
                tag.classList.remove('selected');
            }
        });
    }
    
    // 更新用户资料
    function updateUserProfile(data) {
        // 获取当前用户数据
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        // 更新用户数据
        Object.assign(user, data);
        
        // 保存到本地存储
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 更新页面显示
        loadUserProfile();
        
        // 显示成功消息
        showMessage('个人资料更新成功', 'success');
    }
    
    // 加载用户动态
    function loadUserPosts() {
        // 获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // 从localStorage获取用户的动态数据，如果没有则初始化默认数据
        let userPosts = JSON.parse(localStorage.getItem(`userPosts_${currentUser.id}`));
        
        if (!userPosts) {
            // 初始化默认动态数据（JSON格式）
            userPosts = [
                {
                    "id": 1,
                    "userId": currentUser.id,
                    "username": currentUser.username,
                    "nickname": currentUser.nickname || currentUser.username,
                    "avatar": currentUser.avatar || "src/images/DefaultAvatar.png",
                    "content": "今天参加了校园歌手大赛，感觉很棒！#校园活动 #音乐",
                    "images": ["src/images/DefaultAvatar.png", "src/images/DefaultAvatar.png"],
                    "publishTime": "2023-11-15T14:30:00.000Z",
                    "likes": 42,
                    "comments": [
                        {
                            "id": 1,
                            "userId": 101,
                            "username": "李四",
                            "nickname": "李四",
                            "avatar": "src/images/DefaultAvatar.png",
                            "content": "太棒了！期待你的表演",
                            "publishTime": "2023-11-15T15:00:00.000Z",
                            "likes": 3
                        },
                        {
                            "id": 2,
                            "userId": 102,
                            "username": "王五",
                            "nickname": "王五",
                            "avatar": "src/images/DefaultAvatar.png",
                            "content": "加油！你一定可以的",
                            "publishTime": "2023-11-15T15:30:00.000Z",
                            "likes": 1
                        }
                    ],
                    "shares": 3,
                    "tags": ["校园活动", "音乐"]
                },
                {
                    "id": 2,
                    "userId": currentUser.id,
                    "username": currentUser.username,
                    "nickname": currentUser.nickname || currentUser.username,
                    "avatar": currentUser.avatar || "src/images/DefaultAvatar.png",
                    "content": "图书馆的学习氛围真好，期末复习加油！#学习 #期末",
                    "images": ["src/images/DefaultAvatar.png"],
                    "publishTime": "2023-11-10T09:15:00.000Z",
                    "likes": 18,
                    "comments": [
                        {
                            "id": 3,
                            "userId": 103,
                            "username": "赵六",
                            "nickname": "赵六",
                            "avatar": "src/images/DefaultAvatar.png",
                            "content": "一起加油！",
                            "publishTime": "2023-11-10T10:00:00.000Z",
                            "likes": 2
                        }
                    ],
                    "shares": 0,
                    "tags": ["学习", "期末"]
                },
                {
                    "id": 3,
                    "userId": currentUser.id,
                    "username": currentUser.username,
                    "nickname": currentUser.nickname || currentUser.username,
                    "avatar": currentUser.avatar || "src/images/DefaultAvatar.png",
                    "content": "和朋友一起参加了志愿者活动，帮助社区清理环境，感觉很有意义！#志愿者 #环保",
                    "images": [],
                    "publishTime": "2023-11-05T16:45:00.000Z",
                    "likes": 36,
                    "comments": [
                        {
                            "id": 4,
                            "userId": 104,
                            "username": "钱七",
                            "nickname": "钱七",
                            "avatar": "src/images/DefaultAvatar.png",
                            "content": "很有意义的活动，下次叫上我！",
                            "publishTime": "2023-11-05T17:00:00.000Z",
                            "likes": 5
                        },
                        {
                            "id": 5,
                            "userId": 105,
                            "username": "孙八",
                            "nickname": "孙八",
                            "avatar": "src/images/DefaultAvatar.png",
                            "content": "保护环境，人人有责",
                            "publishTime": "2023-11-05T17:15:00.000Z",
                            "likes": 3
                        }
                    ],
                    "shares": 7,
                    "tags": ["志愿者", "环保"]
                }
            ];
            
            // 保存到localStorage
            localStorage.setItem(`userPosts_${currentUser.id}`, JSON.stringify(userPosts));
        }
        
        // 渲染动态列表
        userPostList.innerHTML = '';
        
        if (userPosts.length === 0) {
            userPostList.innerHTML = '<div class="empty-state">暂无动态</div>';
            return;
        }
        
        // 按发布时间倒序排列（最新的在前）
        userPosts.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
        
        userPosts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.setAttribute('data-post-id', post.id);
            
            // 构建图片HTML
            let imagesHTML = '';
            if (post.images && post.images.length > 0) {
                imagesHTML = '<div class="post-images">';
                post.images.forEach(image => {
                    imagesHTML += `
                        <div class="post-image">
                            <img src="${image}" alt="动态图片">
                        </div>
                    `;
                });
                imagesHTML += '</div>';
            }
            
            // 构建评论HTML
            let commentsHTML = '';
            if (post.comments && post.comments.length > 0) {
                commentsHTML = '<div class="post-comments">';
                post.comments.forEach(comment => {
                    commentsHTML += `
                        <div class="comment-item">
                            <img src="${comment.avatar}" alt="头像" class="comment-avatar">
                            <div class="comment-content">
                                <div class="comment-author">${comment.nickname}</div>
                                <div class="comment-text">${comment.content}</div>
                                <div class="comment-time">${formatTime(comment.publishTime)}</div>
                            </div>
                        </div>
                    `;
                });
                commentsHTML += '</div>';
            }
            
            // 构建标签HTML
            let tagsHTML = '';
            if (post.tags && post.tags.length > 0) {
                tagsHTML = '<div class="post-tags">';
                post.tags.forEach(tag => {
                    tagsHTML += `<span class="post-tag">#${tag}</span>`;
                });
                tagsHTML += '</div>';
            }
            
            // 构建动态HTML
            postElement.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar">
                        <img src="${post.avatar}" alt="头像">
                    </div>
                    <div class="post-author">
                        <div class="post-author-name">${post.nickname}</div>
                        <div class="post-time">${formatTime(post.publishTime)}</div>
                    </div>
                    <div class="post-actions">
                        <button class="post-menu-btn" data-post-id="${post.id}">
                            <i class="bi bi-three-dots"></i>
                        </button>
                    </div>
                </div>
                <div class="post-content">
                    <div class="post-text">${formatContent(post.content)}</div>
                    ${tagsHTML}
                    ${imagesHTML}
                </div>
                <div class="post-footer">
                    <div class="post-stats">
                        <div class="post-stat" data-type="likes">
                            <i class="bi bi-heart"></i> 
                            <span class="like-count">${post.likes}</span>
                        </div>
                        <div class="post-stat" data-type="comments">
                            <i class="bi bi-chat"></i> 
                            <span class="comment-count">${post.comments.length}</span>
                        </div>
                        <div class="post-stat" data-type="shares">
                            <i class="bi bi-share"></i> 
                            <span class="share-count">${post.shares}</span>
                        </div>
                    </div>
                    <div class="post-interactions">
                        <div class="post-interaction" data-action="like" data-post-id="${post.id}">
                            <i class="bi bi-heart"></i> 点赞
                        </div>
                        <div class="post-interaction" data-action="comment" data-post-id="${post.id}">
                            <i class="bi bi-chat"></i> 评论
                        </div>
                        <div class="post-interaction" data-action="share" data-post-id="${post.id}">
                            <i class="bi bi-share"></i> 分享
                        </div>
                    </div>
                </div>
                ${commentsHTML}
            `;
            
            // 添加交互事件
            const likeBtn = postElement.querySelector('.post-interaction[data-action="like"]');
            likeBtn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                const likeCountElement = postElement.querySelector('.like-count');
                const currentLikes = parseInt(likeCountElement.textContent);
                
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    likeCountElement.textContent = currentLikes + 1;
                    this.innerHTML = `<i class="bi bi-heart-fill"></i> 已点赞`;
                    
                    // 更新localStorage中的数据
                    const postIndex = userPosts.findIndex(p => p.id == postId);
                    if (postIndex !== -1) {
                        userPosts[postIndex].likes += 1;
                        localStorage.setItem(`userPosts_${currentUser.id}`, JSON.stringify(userPosts));
                    }
                } else {
                    likeCountElement.textContent = currentLikes - 1;
                    this.innerHTML = `<i class="bi bi-heart"></i> 点赞`;
                    
                    // 更新localStorage中的数据
                    const postIndex = userPosts.findIndex(p => p.id == postId);
                    if (postIndex !== -1) {
                        userPosts[postIndex].likes -= 1;
                        localStorage.setItem(`userPosts_${currentUser.id}`, JSON.stringify(userPosts));
                    }
                }
            });
            
            // 评论按钮事件
            const commentBtn = postElement.querySelector('.post-interaction[data-action="comment"]');
            commentBtn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                // 这里可以添加评论功能
                alert('评论功能开发中...');
            });
            
            // 分享按钮事件
            const shareBtn = postElement.querySelector('.post-interaction[data-action="share"]');
            shareBtn.addEventListener('click', function() {
                const postId = this.getAttribute('data-post-id');
                // 这里可以添加分享功能
                alert('分享功能开发中...');
            });
            
            userPostList.appendChild(postElement);
        });
        
        // 更新动态数量统计
        postCount.textContent = userPosts.length;
    }
    
    // 加载用户相册
    function loadUserPhotos() {
        // 模拟相册数据
        const photos = [
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png',
            'src/images/DefaultAvatar.png'
        ];
        
        // 渲染相册
        userPhotoGrid.innerHTML = '';
        
        if (photos.length === 0) {
            userPhotoGrid.innerHTML = '<div class="empty-state">暂无照片</div>';
            return;
        }
        
        photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `<img src="${photo}" alt="照片">`;
            
            // 点击查看大图
            photoElement.addEventListener('click', function() {
                // 实现查看大图功能
                const modal = document.createElement('div');
                modal.className = 'photo-modal';
                modal.innerHTML = `
                    <div class="photo-modal-content">
                        <span class="close-modal">&times;</span>
                        <img src="${photo}" alt="照片大图">
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // 关闭大图
                const closeBtn = modal.querySelector('.close-modal');
                closeBtn.addEventListener('click', function() {
                    document.body.removeChild(modal);
                });
                
                // 点击模态框外部关闭
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            });
            
            userPhotoGrid.appendChild(photoElement);
        });
    }
    
    // 加载用户好友
    function loadUserFriends() {
        // 模拟好友数据
        const friends = [
            {
                id: 1,
                name: '李四',
                avatar: 'src/images/DefaultAvatar.png',
                college: '计算机学院'
            },
            {
                id: 2,
                name: '王五',
                avatar: 'src/images/DefaultAvatar.png',
                college: '经济管理学院'
            },
            {
                id: 3,
                name: '赵六',
                avatar: 'src/images/DefaultAvatar.png',
                college: '外国语学院'
            },
            {
                id: 4,
                name: '钱七',
                avatar: 'src/images/DefaultAvatar.png',
                college: '艺术学院'
            },
            {
                id: 5,
                name: '孙八',
                avatar: 'src/images/DefaultAvatar.png',
                college: '体育学院'
            }
        ];
        
        // 渲染好友列表
        userFriendsList.innerHTML = '';
        
        if (friends.length === 0) {
            userFriendsList.innerHTML = '<div class="empty-state">暂无好友</div>';
            return;
        }
        
        friends.forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.className = 'friend-item';
            friendElement.innerHTML = `
                <div class="friend-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-meta">${friend.college}</div>
                </div>
                <div class="friend-actions">
                    <button class="btn btn-sm btn-outline">发消息</button>
                </div>
            `;
            
            userFriendsList.appendChild(friendElement);
        });
    }
    
    // 加载关注和粉丝列表
    function loadFollowLists() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        // 获取所有用户数据
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        // 加载关注列表
        loadFollowingList(currentUser, userList);
        
        // 加载粉丝列表
        loadFollowersList(currentUser, userList);
        
        // 更新关注和粉丝数量
        updateFollowCounts(currentUser, userList);
    }
    
    // 加载关注列表
    function loadFollowingList(currentUser, userList) {
        const followingList = document.querySelector('.following-list');
        if (!followingList) return;
        
        const following = currentUser.following || [];
        
        if (following.length === 0) {
            followingList.innerHTML = '<div class="empty-state">还没有关注任何人</div>';
            return;
        }
        
        let followingHTML = '';
        following.forEach(userId => {
            const user = userList.find(u => String(u.id) === String(userId));
            if (user) {
                followingHTML += `
                    <div class="user-item">
                        <div class="user-avatar">
                            <img src="${user.avatar || 'src/images/DefaultAvatar.png'}" alt="${user.nickname || user.username}">
                        </div>
                        <div class="user-info">
                            <h4>${user.nickname || user.username}</h4>
                            <p>${user.studentId || ''}</p>
                        </div>
                        <div class="user-actions">
                            <button class="btn btn-outline btn-unfollow" data-user-id="${user.id}">取消关注</button>
                        </div>
                    </div>
                `;
            }
        });
        
        followingList.innerHTML = followingHTML;
        
        // 绑定取消关注事件
        bindUnfollowEvents();
    }
    
    // 加载粉丝列表
    function loadFollowersList(currentUser, userList) {
        const followersList = document.querySelector('.followers-list');
        if (!followersList) return;
        
        // 查找所有关注了当前用户的用户
        const followers = userList.filter(user => 
            user.followers && user.followers.includes(currentUser.id)
        );
        
        if (followers.length === 0) {
            followersList.innerHTML = '<div class="empty-state">还没有粉丝</div>';
            return;
        }
        
        let followersHTML = '';
        followers.forEach(user => {
            const isFollowing = currentUser.following && currentUser.following.includes(user.id);
            followersHTML += `
                <div class="user-item">
                    <div class="user-avatar">
                        <img src="${user.avatar || 'src/images/DefaultAvatar.png'}" alt="${user.nickname || user.username}">
                    </div>
                    <div class="user-info">
                        <h4>${user.nickname || user.username}</h4>
                        <p>${user.studentId || ''}</p>
                    </div>
                    <div class="user-actions">
                        ${isFollowing ? 
                            '<button class="btn btn-outline btn-unfollow" data-user-id="' + user.id + '">取消关注</button>' :
                            '<button class="btn btn-primary btn-follow" data-user-id="' + user.id + '">关注</button>'
                        }
                    </div>
                </div>
            `;
        });
        
        followersList.innerHTML = followersHTML;
        
        // 绑定关注/取消关注事件
        bindFollowEvents();
    }
    
    // 更新关注和粉丝数量
    function updateFollowCounts(currentUser, userList) {
        const followingCount = currentUser.following ? currentUser.following.length : 0;
        const followersCount = userList.filter(user => 
            user.followers && user.followers.includes(currentUser.id)
        ).length;
        
        // 更新页面上的数量显示
        const followingElements = document.querySelectorAll('.following-count');
        const followersElements = document.querySelectorAll('.followers-count');
        
        followingElements.forEach(el => el.textContent = followingCount);
        followersElements.forEach(el => el.textContent = followersCount);
    }
    
    // 绑定取消关注事件
    function bindUnfollowEvents() {
        const unfollowButtons = document.querySelectorAll('.btn-unfollow');
        unfollowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                unfollowUser(userId);
            });
        });
    }
    
    // 绑定关注事件
    function bindFollowEvents() {
        const followButtons = document.querySelectorAll('.btn-follow');
        followButtons.forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                followUser(userId);
            });
        });
    }
    
    // 取消关注用户
    function unfollowUser(userId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        let userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        // 找到当前用户和目标用户
        const currentUserIndex = userList.findIndex(user => String(user.id) === String(currentUser.id));
        const targetUserIndex = userList.findIndex(user => String(user.id) === String(userId));
        
        if (currentUserIndex === -1 || targetUserIndex === -1) {
            showMessage('用户信息不存在', 'error');
            return;
        }
        
        const currentUserData = userList[currentUserIndex];
        const targetUserData = userList[targetUserIndex];
        
        // 取消关注
        currentUserData.following = currentUserData.following.filter(id => id !== userId);
        targetUserData.followers = targetUserData.followers.filter(id => id !== currentUser.id);
        
        // 更新用户列表
        localStorage.setItem('userList', JSON.stringify(userList));
        
        // 更新当前用户信息
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
        
        // 重新加载关注列表
        loadFollowLists();
        
        showMessage('已取消关注', 'success');
    }
    
    // 关注用户
    function followUser(userId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        let userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        // 找到当前用户和目标用户
        const currentUserIndex = userList.findIndex(user => String(user.id) === String(currentUser.id));
        const targetUserIndex = userList.findIndex(user => String(user.id) === String(userId));
        
        if (currentUserIndex === -1 || targetUserIndex === -1) {
            showMessage('用户信息不存在', 'error');
            return;
        }
        
        const currentUserData = userList[currentUserIndex];
        const targetUserData = userList[targetUserIndex];
        
        // 确保关注列表和粉丝列表存在
        if (!currentUserData.following) currentUserData.following = [];
        if (!targetUserData.followers) targetUserData.followers = [];
        
        // 添加关注
        currentUserData.following.push(userId);
        targetUserData.followers.push(currentUser.id);
        
        // 更新用户列表
        localStorage.setItem('userList', JSON.stringify(userList));
        
        // 更新当前用户信息
        localStorage.setItem('currentUser', JSON.stringify(currentUserData));
        
        // 重新加载关注列表
        loadFollowLists();
        
        showMessage('关注成功', 'success');
    }
    
    // 格式化内容（处理话题标签等）
    function formatContent(content) {
        // 处理话题标签 #xxx
        return content.replace(/#([^\s#]+)/g, '<a href="topic.html?tag=$1" class="topic-tag">#$1</a>');
    }
    
    // 格式化时间
    function formatTime(timeStr) {
        const date = new Date(timeStr);
        const now = new Date();
        const diff = now - date;
        
        // 小于1分钟
        if (diff < 60 * 1000) {
            return '刚刚';
        }
        
        // 小于1小时
        if (diff < 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 1000))}分钟前`;
        }
        
        // 小于24小时
        if (diff < 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
        }
        
        // 小于30天
        if (diff < 30 * 24 * 60 * 60 * 1000) {
            return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
        }
        
        // 大于30天，显示具体日期
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
    
    // 显示消息提示
    function showMessage(message, type = 'info') {
        // 检查是否已存在消息元素
        let messageElement = document.querySelector('.message-container');
        
        if (!messageElement) {
            // 创建消息容器
            messageElement = document.createElement('div');
            messageElement.className = 'message-container';
            document.body.appendChild(messageElement);
        }
        
        // 创建消息元素
        const messageItem = document.createElement('div');
        messageItem.className = `message message-${type}`;
        messageItem.innerHTML = `
            <div class="message-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 添加到容器
        messageElement.appendChild(messageItem);
        
        // 显示动画
        setTimeout(() => {
            messageItem.classList.add('show');
        }, 10);
        
        // 自动移除
        setTimeout(() => {
            messageItem.classList.remove('show');
            messageItem.addEventListener('transitionend', function() {
                messageItem.remove();
                
                // 如果没有更多消息，移除容器
                if (messageElement.children.length === 0) {
                    messageElement.remove();
                }
            });
        }, 3000);
    }
});