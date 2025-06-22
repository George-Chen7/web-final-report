/**
 * 荔荔社区 - 通用JavaScript功能
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 初始化下拉菜单
    initDropdowns();
    
    // 检查用户登录状态
    checkLoginStatus();

    // 头像下拉菜单优化：移入头像或菜单显示，移出延迟隐藏
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        const avatar = userInfo.querySelector('.avatar');
        const dropdownMenu = userInfo.querySelector('.dropdown-menu');
        let hideTimer = null;
        if (avatar && dropdownMenu) {
            function showMenu() {
                clearTimeout(hideTimer);
                dropdownMenu.style.display = 'block';
            }
            function hideMenu() {
                hideTimer = setTimeout(() => {
                    dropdownMenu.style.display = 'none';
                }, 300);
            }
            avatar.addEventListener('mouseenter', showMenu);
            avatar.addEventListener('mouseleave', hideMenu);
            dropdownMenu.addEventListener('mouseenter', showMenu);
            dropdownMenu.addEventListener('mouseleave', hideMenu);
        }
    }

    // 游客操作限制：发布、关注、发送评论
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.role === 'guest') {
        // 发布动态按钮
        const publishBtn = document.querySelector('.btn-publish');
        if (publishBtn) {
            publishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('请先登录后才能发布动态');
            });
        }
        // 关注按钮
        document.querySelectorAll('.btn-follow').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('请先登录后才能关注');
            });
        });
        // 发送评论按钮（评论输入区的发送按钮）
        document.querySelectorAll('.btn-comment').forEach(btn => {
            // 只为评论输入区的发送按钮绑定（排除动态区的评论按钮）
            if (btn.closest('.comment-input')) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('请先登录后才能评论');
                });
            }
        });
    }
});

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 初始化下拉菜单
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const menu = this.nextElementSibling;
            menu.classList.toggle('show');
        });
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.nextElementSibling;
            if (!dropdown.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });
    });
}

/**
 * 检查用户登录状态
 */
function checkLoginStatus() {
    // 模拟从localStorage获取用户信息
    let userInfo = localStorage.getItem('currentUser');
    let user = null;
    
    if (userInfo) {
        user = JSON.parse(userInfo);
        // 判断管理员
        if (user.username === 'admin') {
            user.role = 'admin';
        } else if (user.username) {
            // 有用户名的用户
            user.role = 'user';
        } else {
            // 没有用户名的用户（可能是游客），清除localStorage
            localStorage.removeItem('currentUser');
            user = { role: 'guest' };
        }
    } else {
        // 未登录，设置为游客（不保存到localStorage）
        user = { role: 'guest' };
    }
    
    if (user.role === 'guest') {
        updateUIForGuest();
    } else {
        updateUIForLoggedInUser(user);
    }
}

/**
 * 更新已登录用户的UI
 * @param {Object} user - 用户信息
 */
function updateUIForLoggedInUser(user) {
    // 隐藏登录/注册按钮
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) authButtons.style.display = 'none';
    
    // 显示用户信息
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement) {
        userInfoElement.style.display = 'block';
        
        // 更新头像
        const avatarImg = userInfoElement.querySelector('.avatar img');
        if (avatarImg && user.avatar) {
            avatarImg.src = user.avatar;
        }
    }
    
    // 显示发布动态区域
    const createPost = document.querySelector('.create-post');
    if (createPost) createPost.style.display = 'block';
    
    // 启用评论输入
    const commentInputs = document.querySelectorAll('.comment-input input');
    const commentButtons = document.querySelectorAll('.btn-comment');
    if (user.role === 'user' || user.role === 'admin') {
        commentInputs.forEach(input => {
            input.disabled = false;
            input.placeholder = '添加评论...';
        });
        commentButtons.forEach(button => {
            button.disabled = false;
        });
    } else {
        commentInputs.forEach(input => {
            input.disabled = true;
            input.placeholder = '登录后才能评论';
        });
        commentButtons.forEach(button => {
            button.disabled = true;
        });
    }
    
    // 更新关注按钮状态
    updateFollowButtonsState(user);
}

/**
 * 更新游客的UI
 */
function updateUIForGuest() {
    // 显示登录/注册按钮
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) authButtons.style.display = 'flex';
    
    // 隐藏用户信息
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement) userInfoElement.style.display = 'none';
    
    // 隐藏发布动态区域
    const createPost = document.querySelector('.create-post');
    if (createPost) createPost.style.display = 'none';
    
    // 禁用评论输入
    const commentInputs = document.querySelectorAll('.comment-input input');
    const commentButtons = document.querySelectorAll('.btn-comment');
    commentInputs.forEach(input => {
        input.disabled = true;
        input.placeholder = '登录后才能评论';
    });
    commentButtons.forEach(button => {
        button.disabled = true;
    });
}

/**
 * 更新关注按钮状态
 * @param {Object} user - 用户信息
 */
function updateFollowButtonsState(user) {
    // 模拟用户关注列表
    const followingIds = user.following || [];
    
    // 更新所有关注按钮状态
    const followButtons = document.querySelectorAll('.btn-follow');
    
    followButtons.forEach(button => {
        const userId = button.dataset.userId;
        
        if (followingIds.includes(userId)) {
            button.classList.add('following');
            button.textContent = '已关注';
        } else {
            button.classList.remove('following');
            button.textContent = '关注';
        }
    });
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, warning)
 */
function showToast(message, type = 'success') {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * 格式化时间
 * @param {string|Date} date - 日期对象或日期字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = now - targetDate;
    
    // 计算时间差
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    // 根据时间差返回不同格式
    if (seconds < 60) {
        return '刚刚';
    } else if (minutes < 60) {
        return `${minutes}分钟前`;
    } else if (hours < 24) {
        return `${hours}小时前`;
    } else if (days < 30) {
        return `${days}天前`;
    } else {
        // 超过30天显示具体日期
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const day = targetDate.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    }
}

/**
 * 退出登录
 */
function logout() {
    // 清除localStorage中的用户信息
    localStorage.removeItem('currentUser');
    // 更新UI为游客状态
    updateUIForGuest();
    // 可选：跳转到首页或刷新页面
    // window.location.href = 'index.html';
}

// 绑定退出登录事件
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
}