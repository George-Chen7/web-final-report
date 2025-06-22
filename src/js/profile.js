/**
 * 个人资料页面脚本
 */

// 全局取消关注函数
function unfollowUser(userId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
    
    if (!currentUser) {
        alert('请先登录');
        return;
    }
    
    // 找到目标用户
    const targetUser = userList.find(u => String(u.id) === String(userId));
    if (!targetUser) {
        alert('用户不存在');
        return;
    }
    
    // 确认取消关注
    if (!confirm(`确定要取消关注 ${targetUser.nickname || targetUser.username} 吗？`)) {
        return;
    }
    
    // 从当前用户的following数组中移除
    const currentUserIndex = userList.findIndex(u => String(u.id) === String(currentUser.id));
    if (currentUserIndex !== -1) {
        const currentUserData = userList[currentUserIndex];
        if (currentUserData.following) {
            // 移除用户ID和用户名
            currentUserData.following = currentUserData.following.filter(id => 
                String(id) !== String(userId) && String(id) !== targetUser.username
            );
            
            // 更新用户列表
            localStorage.setItem('userList', JSON.stringify(userList));
            
            // 更新当前用户信息
            localStorage.setItem('currentUser', JSON.stringify(currentUserData));
            
            // 重新加载关注列表和统计数据
            if (typeof loadFollowingList === 'function') {
                loadFollowingList();
            }
            if (typeof loadFollowLists === 'function') {
                loadFollowLists();
            }
            
            alert('已取消关注');
        }
    }
}

// 全局访问用户主页函数
function visitUserProfile(userId) {
    // 跳转到用户主页，传递用户ID参数
    window.location.href = `profile.html?userId=${userId}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // 检查用户登录状态
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // 未登录，跳转到登录页面
        window.location.href = 'login.html';
        return;
    }
    
    // 获取clickUser（从URL参数或localStorage）
    let clickUser = null;
    const urlParams = new URLSearchParams(window.location.search);
    const clickUserId = urlParams.get('userId');
    
    if (clickUserId) {
        // 从URL参数获取用户ID，从userList中查找用户信息
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        clickUser = userList.find(user => String(user.id) === String(clickUserId));
        
        if (!clickUser) {
            alert('用户不存在');
            window.location.href = 'index.html';
            return;
        }
    } else {
        // 没有URL参数，说明访问的是自己的主页
        clickUser = currentUser;
    }
    
    // 判断是否访问自己的主页
    const isOwnProfile = String(currentUser.id) === String(clickUser.id);
    
    // 调用common.js中的登录状态检查函数，确保UI正确显示
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    
    // 更新页面标题
    document.title = `${clickUser.nickname || clickUser.name} 的个人资料 - 荔荔社区`;
    
    // 获取DOM元素
    const profileName = document.getElementById('profileName');
    const profileId = document.getElementById('profileId');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileCover = document.getElementById('profileCover');
    const userAvatar = document.querySelector('.user-info .avatar img');
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
    
    // 标签切换相关元素
    const profileTabs = document.querySelectorAll('.profile-tabs li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const followingList = document.getElementById('followingList');
    
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
    // 加载关注和粉丝列表
    loadFollowLists();
    
    // 初始化标签切换
    initProfileTabs();
    
    // 监听localStorage变化，实时更新关注和粉丝数
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser' || e.key === 'userList') {
            // 当用户数据或用户列表发生变化时，重新加载关注和粉丝数
            loadFollowLists();
        }
    });
    
    // 页面可见性变化时也重新加载数据（用户从其他页面返回时）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            loadFollowLists();
        }
    });
    
    // 检查编辑按钮是否存在
    console.log('编辑按钮元素:', editProfileBtn);
    console.log('模态框元素:', editProfileModal);
    
    // 编辑资料模态框
    editProfileBtn.addEventListener('click', function() {
        // 只有访问自己的主页时才能编辑
        if (!isOwnProfile) {
            alert('只能编辑自己的资料');
            return;
        }
        
        console.log('编辑按钮被点击');
        // 填充表单数据
        fillEditForm();
        // 显示模态框
        editProfileModal.classList.add('active');
        console.log('模态框应该已显示');
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
        // 只有访问自己的主页时才能上传头像
        if (!isOwnProfile) {
            alert('只能编辑自己的头像');
            return;
        }
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profileAvatar.src = e.target.result;
                if (userAvatar) {
                    userAvatar.src = e.target.result;
                }
                
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
        // 只有访问自己的主页时才能上传封面
        if (!isOwnProfile) {
            alert('只能编辑自己的封面');
            return;
        }
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
        
        // 只有访问自己的主页时才能提交编辑
        if (!isOwnProfile) {
            alert('只能编辑自己的资料');
            return;
        }
        
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
        if (!clickUser) return;
        
        // 更新页面标题
        document.title = `${clickUser.nickname || clickUser.username} 的个人资料 - 荔荔社区`;
        
        // 更新个人资料信息
        profileName.textContent = clickUser.nickname || clickUser.username;
        profileId.textContent = `学号：${clickUser.studentId || '未知'}`;
        
        // 更新头像
        if (clickUser.avatar) {
            profileAvatar.src = clickUser.avatar;
            if (userAvatar) {
                userAvatar.src = clickUser.avatar;
            }
        } else {
            profileAvatar.src = 'src/images/DefaultAvatar.png';
            if (userAvatar) {
                userAvatar.src = 'src/images/DefaultAvatar.png';
            }
        }
        
        // 更新封面图（如果有的话）
        if (clickUser.coverImage) {
            profileCover.src = clickUser.coverImage;
        } else {
            profileCover.src = 'src/images/DefaultAvatar.png';
        }
        
        // 根据是否访问自己的主页来更新标签文本
        const postsTab = document.querySelector('.profile-tabs li[data-tab="posts"]');
        if (postsTab) {
            if (isOwnProfile) {
                postsTab.textContent = '我的动态';
            } else {
                postsTab.textContent = 'TA的动态';
            }
        }
        
        // 根据是否访问自己的主页来控制编辑按钮的显示
        if (editProfileBtn) {
            if (isOwnProfile) {
                editProfileBtn.style.display = 'block';
            } else {
                editProfileBtn.style.display = 'none';
            }
        }
        
        // 根据是否访问自己的主页来控制头像和封面的编辑按钮
        if (editAvatarBtn) {
            editAvatarBtn.style.display = isOwnProfile ? 'flex' : 'none';
        }
        if (editCoverBtn) {
            editCoverBtn.style.display = isOwnProfile ? 'block' : 'none';
        }
        
        // 更新统计数据（动态数量由loadUserPosts更新，关注和粉丝数由loadFollowLists更新）
        postCount.textContent = clickUser.postCount || '0';
        
        // 更新关注和粉丝数
        loadFollowLists();
    }
    
    // 填充编辑表单
    function fillEditForm() {
        const user = clickUser;
        
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
        // 只有访问自己的主页时才能更新资料
        if (!isOwnProfile) {
            alert('只能编辑自己的资料');
            return;
        }
        
        // 获取当前用户数据
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        // 更新用户数据
        Object.assign(user, data);
        
        // 保存到本地存储
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // 更新clickUser数据
        clickUser = user;
        
        // 更新页面显示
        loadUserProfile();
        
        // 显示成功消息
        showMessage('个人资料更新成功', 'success');
    }
    
    // 加载用户动态
    function loadUserPosts() {
        // 获取所有动态
        const allPosts = JSON.parse(localStorage.getItem('postList') || '[]');
        
        // 获取当前用户信息
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { role: 'guest' };
        
        // 只筛选clickUser发布的动态
        let userPosts = allPosts.filter(post => post.user && (post.user.id === clickUser.id || post.user.name === clickUser.username));
        
        // 根据可见性过滤动态
        userPosts = userPosts.filter(post => {
            // 如果是访问自己的主页，显示所有动态
            if (isOwnProfile) {
                return true;
            }
            
            // 如果是游客，只能看到公开的动态
            if (currentUser.role === 'guest') {
                return post.visibility === 'public';
            }
            
            // 根据可见性判断
            switch (post.visibility) {
                case 'public':
                    return true; // 公开动态所有人都能看到
                case 'followers':
                    // 粉丝可见：检查当前用户是否是clickUser的粉丝
                    // 通过检查其他用户的following数组中是否包含clickUser的ID，且该用户是currentUser
                    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
                    const clickUserId = String(clickUser.id);
                    const isFollower = userList.some(user => {
                        // 检查是否是currentUser
                        if (String(user.id) !== String(currentUser.id) && user.username !== currentUser.username) {
                            return false;
                        }
                        // 检查该用户的following数组是否包含clickUser
                        return user.following && user.following.some(id => String(id) === clickUserId);
                    });
                    return isFollower;
                case 'private':
                    return false; // 私密动态只有作者能看到
                default:
                    return true; // 默认公开
            }
        });
        
        // 渲染动态列表
        userPostList.innerHTML = '';
        if (userPosts.length === 0) {
            userPostList.innerHTML = '<div class="empty-state">暂无动态</div>';
        } else {
            // 按时间倒序
            userPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
            userPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-item';
                postElement.setAttribute('data-post-id', post.id);
                
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
                
                // 格式化内容，处理换行和话题标签
                const formattedContent = post.content
                    .replace(/\n/g, '</p><p>')
                    .replace(/#(\S+)/g, '<a href="#" class="topic-tag">#$1</a>');
                
                // 可见性标识
                let visibilityIcon = '';
                let visibilityText = '';
                switch (post.visibility) {
                    case 'public':
                        visibilityIcon = '<i class="bi bi-globe"></i>';
                        visibilityText = '公开';
                        break;
                    case 'followers':
                        visibilityIcon = '<i class="bi bi-people"></i>';
                        visibilityText = '粉丝可见';
                        break;
                    case 'private':
                        visibilityIcon = '<i class="bi bi-lock"></i>';
                        visibilityText = '私密';
                        break;
                    default:
                        visibilityIcon = '<i class="bi bi-globe"></i>';
                        visibilityText = '公开';
                }
                
                // 删除按钮 - 只在访问自己的主页时显示
                const deleteButton = isOwnProfile ? 
                    `<button class="btn-delete-post" data-post-id="${post.id}" title="删除动态">
                        <i class="bi bi-trash"></i>
                    </button>` : '';
                
                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-avatar">
                            <img src="${post.user.avatar || 'src/images/DefaultAvatar.png'}" alt="头像">
                        </div>
                        <div class="post-author">
                            <div class="post-author-name">${post.user.nickname || post.user.name}</div>
                            <div class="post-time">
                                ${formatTime(post.time)}
                                <span class="visibility-badge" title="${visibilityText}">
                                    ${visibilityIcon} ${visibilityText}
                                </span>
                            </div>
                        </div>
                        ${deleteButton}
                    </div>
                    <div class="post-content">
                        <div class="post-text">${formattedContent}</div>
                        ${imagesHTML}
                    </div>
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="post-stat"><i class="bi bi-heart"></i> ${post.likes || 0}</span>
                            <span class="post-stat post-comment-btn" style="cursor: pointer;"><i class="bi bi-chat"></i> ${post.comments ? post.comments.length : 0}</span>
                        </div>
                    </div>
                    <div class="post-comments"><!-- 默认收起，点击评论按钮后展开 --></div>
                `;
                userPostList.appendChild(postElement);
            });
        }
        
        // 同步动态数量
        postCount.textContent = userPosts.length;
        
        // 初始化评论交互
        initProfilePostInteractions();
    }
    
    // 加载关注和粉丝列表
    function loadFollowLists() {
        // 重新获取用户信息，确保数据是最新的
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        // 更新clickUser的最新信息
        const updatedClickUser = userList.find(u => String(u.id) === String(clickUser.id));
        if (updatedClickUser) {
            clickUser = updatedClickUser;
        }
        
        if (!clickUser) return;
        
        // 关注数：从clickUser的following数组获取长度
        const followingArr = clickUser.following || [];
        followingCount.textContent = followingArr.length;
        
        // 粉丝数：遍历所有用户，统计following数组中包含clickUser ID的用户数量
        // 确保数据类型一致，转换为字符串进行比较
        const clickUserId = String(clickUser.id);
        const followersArr = userList.filter(u => {
            if (!u.following || !Array.isArray(u.following)) return false;
            return u.following.some(id => String(id) === clickUserId);
        });
        followerCount.textContent = followersArr.length;
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
    
    // 初始化标签切换
    function initProfileTabs() {
        profileTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // 移除所有活动状态
                profileTabs.forEach(t => t.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // 添加当前标签的活动状态
                this.classList.add('active');
                
                // 显示对应的内容
                const targetPane = document.getElementById(tabName + 'Tab');
                if (targetPane) {
                    targetPane.classList.add('active');
                    
                    // 如果切换到关注列表，加载关注数据
                    if (tabName === 'following') {
                        loadFollowingList();
                    }
                }
            });
        });
    }
    
    // 加载关注列表
    function loadFollowingList() {
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        // 更新clickUser的最新信息
        const updatedClickUser = userList.find(u => String(u.id) === String(clickUser.id));
        if (updatedClickUser) {
            clickUser = updatedClickUser;
        }
        
        if (!clickUser || !followingList) return;
        
        const followingArr = clickUser.following || [];
        
        if (followingArr.length === 0) {
            // 显示空状态
            followingList.innerHTML = `
                <div class="following-empty">
                    <i class="bi bi-people"></i>
                    <h3>还没有关注任何人</h3>
                    <p>去发现更多有趣的人吧！</p>
                </div>
            `;
            return;
        }
        
        // 清空列表
        followingList.innerHTML = '';
        
        // 获取关注用户的详细信息
        const followingUsers = [];
        followingArr.forEach(followingId => {
            // 跳过用户名（只处理用户ID）
            if (typeof followingId === 'number' || !isNaN(Number(followingId))) {
                const user = userList.find(u => String(u.id) === String(followingId));
                if (user) {
                    followingUsers.push(user);
                }
            }
        });
        
        // 渲染关注列表
        followingUsers.forEach(user => {
            const followingItem = document.createElement('div');
            followingItem.className = 'following-item';
            
            // 根据是否访问自己的主页来决定按钮显示和样式
            let actionButton = '';
            if (isOwnProfile) {
                // 访问自己的主页，显示取消关注按钮
                actionButton = `<button class="btn btn-outline btn-sm unfollow-btn" onclick="event.stopPropagation(); unfollowUser('${user.id}')">取消关注</button>`;
            } else {
                // 访问他人的主页，添加clickable类显示点击提示
                followingItem.classList.add('clickable');
                actionButton = '';
            }
            
            followingItem.innerHTML = `
                <div class="following-avatar">
                    <img src="${user.avatar || 'src/images/DefaultAvatar.png'}" alt="${user.nickname || user.username}">
                </div>
                <div class="following-info">
                    <div class="following-name">${user.nickname || user.username}</div>
                    <div class="following-username">@${user.username}</div>
                </div>
                <div class="following-actions">
                    ${actionButton}
                </div>
            `;
            
            // 添加点击事件，让整个卡片可以点击进入用户主页
            followingItem.addEventListener('click', function(e) {
                // 如果点击的是取消关注按钮，不执行跳转
                if (e.target.classList.contains('unfollow-btn')) {
                    return;
                }
                // 跳转到用户主页
                visitUserProfile(user.id);
            });
            
            followingList.appendChild(followingItem);
        });
    }
    
    // 初始化个人主页动态交互
    function initProfilePostInteractions() {
        // 获取当前用户
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // 删除按钮点击事件
        const deleteButtons = document.querySelectorAll('.btn-delete-post');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const postId = this.getAttribute('data-post-id');
                if (confirm('确定要删除这条动态吗？删除后无法恢复。')) {
                    deleteProfilePost(postId);
                }
            });
        });
        
        // 评论按钮点击事件
        const commentButtons = document.querySelectorAll('.post-comment-btn');
        commentButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (currentUser && currentUser.role === 'guest') {
                    e.preventDefault();
                    alert('请先登录后才能评论');
                    return;
                }
                
                const postItem = this.closest('.post-item');
                const commentsSection = postItem.querySelector('.post-comments');
                const postId = postItem.getAttribute('data-post-id');
                
                // 展开/收起逻辑
                if (!commentsSection.classList.contains('show')) {
                    // 展开，渲染评论内容
                    const allPosts = JSON.parse(localStorage.getItem('postList') || '[]');
                    const post = allPosts.find(p => String(p.id) === String(postId));
                    
                    if (post) {
                        commentsSection.innerHTML = createProfileCommentsHTML(post);
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
                        bindProfileCommentEvents(postId);
                    }
                } else {
                    // 收起，清空内容
                    commentsSection.classList.remove('show');
                    commentsSection.innerHTML = '';
                }
            });
        });
    }
    
    // 生成个人主页评论HTML
    function createProfileCommentsHTML(post) {
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
                        <div class="comment-avatar">
                            <img src="${commentUser.avatar || 'src/images/DefaultAvatar.png'}" alt="用户头像">
                        </div>
                        <div class="comment-content">
                            <div class="comment-author">${commentUser.name}</div>
                            <div class="comment-text">${comment.content}</div>
                            <div class="comment-time">${formatTime(commentTime)}</div>
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
                <img src="${currentUser && currentUser.avatar ? currentUser.avatar : 'src/images/DefaultAvatar.png'}" alt="用户头像">
                <input type="text" placeholder="${inputPlaceholder}" ${inputDisabled ? 'disabled' : ''}>
                <button class="btn-send-comment" ${btnDisabled ? 'disabled' : ''}>发送</button>
            </div>
        `;
        return commentsHTML;
    }
    
    // 绑定个人主页评论事件
    function bindProfileCommentEvents(postId) {
        const commentsSection = document.querySelector(`[data-post-id="${postId}"] .post-comments`);
        const input = commentsSection.querySelector('input');
        const btn = commentsSection.querySelector('.btn-send-comment');
        
        // 发送按钮点击事件
        btn.addEventListener('click', function() {
            const content = input.value.trim();
            if (content) {
                sendProfileComment(postId, content);
                input.value = '';
            }
        });
        
        // 回车发送
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const content = input.value.trim();
                if (content) {
                    sendProfileComment(postId, content);
                    input.value = '';
                }
            }
        });
        
        // 输入时启用/禁用发送按钮
        input.addEventListener('input', function() {
            btn.disabled = !input.value.trim();
        });
    }
    
    // 发送个人主页评论
    function sendProfileComment(postId, content) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role === 'guest') {
            alert('请先登录后才能评论');
            return;
        }
        
        // 获取所有动态
        const allPosts = JSON.parse(localStorage.getItem('postList') || '[]');
        const postIndex = allPosts.findIndex(p => String(p.id) === String(postId));
        
        if (postIndex === -1) {
            alert('动态不存在');
            return;
        }
        
        // 创建新评论
        const newComment = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            nickname: currentUser.nickname || currentUser.username,
            avatar: currentUser.avatar || 'src/images/DefaultAvatar.png',
            content: content,
            publishTime: new Date().toISOString(),
            likes: 0
        };
        
        // 添加到动态的评论数组
        if (!allPosts[postIndex].comments) {
            allPosts[postIndex].comments = [];
        }
        allPosts[postIndex].comments.push(newComment);
        
        // 保存到localStorage
        localStorage.setItem('postList', JSON.stringify(allPosts));
        
        // 更新评论数量显示
        const postItem = document.querySelector(`[data-post-id="${postId}"]`);
        const commentBtn = postItem.querySelector('.post-comment-btn');
        const currentCount = allPosts[postIndex].comments.length;
        commentBtn.innerHTML = `<i class="bi bi-chat"></i> ${currentCount}`;
        
        // 重新渲染评论区域
        const commentsSection = postItem.querySelector('.post-comments');
        commentsSection.innerHTML = createProfileCommentsHTML(allPosts[postIndex]);
        
        // 重新绑定事件
        bindProfileCommentEvents(postId);
        
        // 显示成功消息
        showMessage('评论发送成功', 'success');
    }
    
    // 删除个人主页动态
    function deleteProfilePost(postId) {
        // 获取所有动态
        const allPosts = JSON.parse(localStorage.getItem('postList') || '[]');
        const postIndex = allPosts.findIndex(p => String(p.id) === String(postId));
        
        if (postIndex === -1) {
            alert('动态不存在');
            return;
        }
        
        // 检查是否是当前用户的动态
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const post = allPosts[postIndex];
        
        if (!currentUser || (String(post.user.id) !== String(currentUser.id) && post.user.name !== currentUser.username)) {
            alert('只能删除自己的动态');
            return;
        }
        
        // 从数组中删除动态
        allPosts.splice(postIndex, 1);
        
        // 保存到localStorage
        localStorage.setItem('postList', JSON.stringify(allPosts));
        
        // 从页面中移除动态元素
        const postElement = document.querySelector(`[data-post-id="${postId}"]`);
        if (postElement) {
            postElement.remove();
        }
        
        // 更新动态数量
        const currentCount = parseInt(postCount.textContent) - 1;
        postCount.textContent = currentCount;
        
        // 显示成功消息
        showMessage('动态删除成功', 'success');
    }
});