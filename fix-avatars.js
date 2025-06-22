/**
 * 修复用户头像脚本
 * 在浏览器控制台中运行此脚本来修复现有用户的头像问题
 */

(function fixUserAvatars() {
    console.log('开始检查和修复用户头像...');
    
    // 获取所有用户
    let users = JSON.parse(localStorage.getItem('userList')) || [];
    let hasChanges = false;
    
    // 检查并修复每个用户的头像
    users.forEach(user => {
        if (!user.avatar || user.avatar === '') {
            console.log(`修复用户 ${user.username} 的头像`);
            user.avatar = 'src/images/DefaultAvatar.png';
            hasChanges = true;
        }
    });
    
    // 如果有修改，保存回localStorage
    if (hasChanges) {
        localStorage.setItem('userList', JSON.stringify(users));
        console.log('用户头像修复完成！');
    } else {
        console.log('所有用户头像都是正确的，无需修复。');
    }
    
    // 检查当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && (!currentUser.avatar || currentUser.avatar === '')) {
        console.log('修复当前用户的头像');
        currentUser.avatar = 'src/images/DefaultAvatar.png';
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('当前用户头像修复完成！');
    }
    
    // 显示修复结果
    console.log('修复后的用户列表：');
    console.log(JSON.parse(localStorage.getItem('userList')));
    
    // 刷新页面以应用更改
    console.log('正在刷新页面以应用更改...');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
})(); 