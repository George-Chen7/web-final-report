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
            if (userAvatar) {
                userAvatar.src = user.avatar;
            }
        }
        
        if (user.cover) {
            profileCover.src = user.cover;
        }
        
        // 更新统计数据（动态数量由loadUserPosts更新，关注和粉丝数由loadFollowLists更新）
        postCount.textContent = user.postCount || '0';
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
        // 获取所有动态
        const allPosts = JSON.parse(localStorage.getItem('postList') || '[]');
        // 只筛选当前用户发布的动态
        const userPosts = allPosts.filter(post => post.user && (post.user.id === currentUser.id || post.user.name === currentUser.username));
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
                postElement.innerHTML = `
                    <div class="post-header">
                        <div class="post-avatar">
                            <img src="${post.user.avatar}" alt="头像">
                        </div>
                        <div class="post-author">
                            <div class="post-author-name">${post.user.nickname || post.user.name}</div>
                            <div class="post-time">${formatTime(post.time)}</div>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="post-text">${post.content}</div>
                    </div>
                `;
                userPostList.appendChild(postElement);
            });
        }
        // 同步动态数量
        postCount.textContent = userPosts.length;
    }
    
    // 加载关注和粉丝列表
    function loadFollowLists() {
        // 重新获取当前用户信息，确保数据是最新的
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userList = JSON.parse(localStorage.getItem('userList') || '[]');
        
        if (!currentUser) return;
        
        // 关注数：从当前用户的following数组获取长度
        const followingArr = currentUser.following || [];
        followingCount.textContent = followingArr.length;
        
        // 粉丝数：遍历所有用户，统计following数组中包含当前用户ID的用户数量
        // 确保数据类型一致，转换为字符串进行比较
        const currentUserId = String(currentUser.id);
        const followersArr = userList.filter(u => {
            if (!u.following || !Array.isArray(u.following)) return false;
            return u.following.some(id => String(id) === currentUserId);
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
});