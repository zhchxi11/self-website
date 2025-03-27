document.addEventListener('DOMContentLoaded', function() {
    // 初始化轮播图
    const swiper = new Swiper('.swiper-container', {
        // 基本配置
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        // 添加轮播指示器
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // 添加导航按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // 支持键盘控制
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        // 支持触摸滑动
        grabCursor: true,
        effect: 'fade', // 淡入淡出效果
        fadeEffect: {
            crossFade: true
        },
    });

    // 导航栏滚动效果
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // 点击菜单项后关闭菜单
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // 滚动到部分内容时高亮对应的导航项
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // AI助手相关功能
    const aiAssistant = document.getElementById('ai-assistant');
    const floatingAssistant = document.getElementById('floating-assistant');
    const aiAssistantBtn = document.getElementById('ai-assistant-btn');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const clearChat = document.getElementById('clear-chat');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessage = document.getElementById('send-message');
    
    // DeepSeek API 配置
    const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY'; // 请在.env文件中配置你的API密钥
    const PROXY_API_URL = 'http://localhost:3003/api/chat';
    
    // 用于存储对话历史
    let conversationHistory = [
        { role: "system", content: "你是呈祥的AI助手，你的任务是帮助回答用户关于呈祥的问题。呈祥是一名前端开发者和UI设计师，同时也是一名摄影爱好者。他擅长HTML5、CSS3、JavaScript、UI设计和响应式设计等技术。用户可以通过网站底部的电子邮箱或电话联系呈祥。请保持友好、专业的态度，并用简明的语言回答用户问题。" }
    ];

    // 打开助手对话框
    function openAssistant() {
        aiAssistant.style.display = 'flex';
        setTimeout(() => {
            aiAssistant.style.opacity = '1';
            aiAssistant.style.transform = 'translateY(0)';
        }, 50);
    }

    // 关闭助手对话框
    function closeAssistant() {
        aiAssistant.style.opacity = '0';
        aiAssistant.style.transform = 'translateY(20px)';
        setTimeout(() => {
            aiAssistant.style.display = 'none';
        }, 300);
    }

    // 点击悬浮助手图标打开对话框
    floatingAssistant.addEventListener('click', openAssistant);
    
    // 点击导航栏助手按钮打开对话框
    aiAssistantBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAssistant();
    });
    
    // 关闭对话框
    closeChat.addEventListener('click', closeAssistant);
    
    // 最小化对话框
    minimizeChat.addEventListener('click', closeAssistant);
    
    // 清空对话
    clearChat.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        conversationHistory = [
            { role: "system", content: "你是呈祥的AI助手，你的任务是帮助回答用户关于呈祥的问题。呈祥是一名前端开发者和UI设计师，同时也是一名摄影爱好者。他擅长HTML5、CSS3、JavaScript、UI设计和响应式设计等技术。用户可以通过网站底部的电子邮箱或电话联系呈祥。请保持友好、专业的态度，并用简明的语言回答用户问题。" }
        ];
        // 添加欢迎消息
        addMessage('你好！我是呈祥的AI助手，有什么可以帮助你的吗？', 'ai');
    });

    // 添加消息到对话框
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        const content = document.createElement('div');
        content.classList.add('message-content');
        
        // 如果是AI消息，使用打字机效果
        if (sender === 'ai') {
            // 先添加加载动画
            const loading = document.createElement('div');
            loading.classList.add('loading');
            loading.innerHTML = '<span></span><span></span><span></span>';
            messageElement.appendChild(loading);
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // 模拟加载时间
            setTimeout(() => {
                // 删除加载动画
                messageElement.removeChild(loading);
                
                // 创建内容区域
                content.innerHTML = '';
                messageElement.appendChild(content);
                
                // 格式化消息（支持markdown和代码块）
                const formattedMessage = formatMessage(message);
                
                // 使用打字机效果
                let i = 0;
                content.classList.add('typing');
                const interval = setInterval(() => {
                    if (i < formattedMessage.length) {
                        // 如果遇到HTML标签，直接添加整个标签
                        if (formattedMessage.substring(i).startsWith('<') && formattedMessage.substring(i).includes('>')) {
                            const tagEnd = formattedMessage.substring(i).indexOf('>') + i + 1;
                            content.innerHTML += formattedMessage.substring(i, tagEnd);
                            i = tagEnd;
                        } else {
                            content.innerHTML += formattedMessage[i];
                            i++;
                        }
                    } else {
                        clearInterval(interval);
                        content.classList.remove('typing');
                        
                        // 添加时间
                        const timeElement = document.createElement('div');
                        timeElement.classList.add('message-time');
                        timeElement.textContent = getCurrentTime();
                        messageElement.appendChild(timeElement);
                    }
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 30);
                
            }, 600);
        } else {
            // 用户消息，直接显示
            content.textContent = message;
            messageElement.appendChild(content);
            
            const timeElement = document.createElement('div');
            timeElement.classList.add('message-time');
            timeElement.textContent = getCurrentTime();
            messageElement.appendChild(timeElement);
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // 获取当前时间
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // 使用DeepSeek API获取回复（通过代理服务器）
    async function getDeepSeekResponse(message) {
        // 添加用户消息到对话历史
        conversationHistory.push({ role: "user", content: message });
        
        try {
            const response = await fetch(PROXY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: conversationHistory,
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('DeepSeek API 错误:', errorData);
                throw new Error('API请求失败');
            }
            
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // 添加AI回复到对话历史
            conversationHistory.push({ role: "assistant", content: aiResponse });
            
            return aiResponse;
        } catch (error) {
            console.error('调用DeepSeek API时出错:', error);
            return '抱歉，我遇到了一些技术问题。请稍后再试或者直接联系呈祥。';
        }
    }
    
    // 处理发送消息
    async function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            messageInput.value = '';
            
            // 显示加载指示器
            const loadingElement = document.createElement('div');
            loadingElement.classList.add('message', 'ai');
            
            const loading = document.createElement('div');
            loading.classList.add('loading');
            loading.innerHTML = '<span></span><span></span><span></span>';
            
            loadingElement.appendChild(loading);
            chatMessages.appendChild(loadingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            try {
                // 获取DeepSeek AI回复
                const aiResponse = await getDeepSeekResponse(message);
                
                // 移除加载指示器
                chatMessages.removeChild(loadingElement);
                
                // 显示AI回复
                addMessage(aiResponse, 'ai');
            } catch (error) {
                // 移除加载指示器
                chatMessages.removeChild(loadingElement);
                
                // 显示错误消息
                addMessage('抱歉，我遇到了一些技术问题。请稍后再试或者直接联系呈祥。', 'ai');
                console.error('发送消息时出错:', error);
            }
        }
    }
    
    // 发送按钮点击事件
    sendMessage.addEventListener('click', handleSendMessage);
    
    // 输入框回车键发送消息
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // 在对话框首次打开时显示欢迎消息
    addMessage('你好！我是呈祥的AI助手，有什么可以帮助你的吗？', 'ai');
    
    // 支持代码块和markdown简单处理函数
    function formatMessage(message) {
        // 处理代码块
        message = message.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        // 处理粗体
        message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // 处理斜体
        message = message.replace(/\*(.*?)\*/g, '<em>$1</em>');
        return message;
    }
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 