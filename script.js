// Portfolio & Certification Platform - JavaScript
class PortfolioPlatform {
    constructor() {
        this.currentUser = {
            id: 1,
            name: '사용자 이름',
            title: '직업/직책',
            bio: '자기소개를 입력해주세요.',
            contact: '연락처 정보',
            reputation: 0,
            positiveReviews: 0,
            negativeReviews: 0
        };
        
        this.portfolios = [];
        this.certificates = [];
        this.users = [];
        this.reviews = [];
        this.currentSection = 'home';
        this.selectedRating = null;
        this.currentPresentationIndex = 0;
        this.currentPresentation = null;
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.loadSampleData();
        this.updateStats();
        this.renderPortfolios();
        this.renderCertificates();
        this.renderUsers();
        this.updateProfile();
        this.updateReputation();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.id.replace('Btn', '');
                this.showSection(section);
            });
        });

        // Portfolio Management
        document.getElementById('addPortfolioBtn').addEventListener('click', () => this.showPortfolioModal());
        document.getElementById('portfolioForm').addEventListener('submit', (e) => this.handlePortfolioSubmit(e));
        document.getElementById('closePortfolioModal').addEventListener('click', () => this.closeModal('portfolioModal'));
        document.getElementById('cancelPortfolio').addEventListener('click', () => this.closeModal('portfolioModal'));

        // Profile Management
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showProfileModal());
        document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileSubmit(e));
        document.getElementById('closeProfileModal').addEventListener('click', () => this.closeModal('profileModal'));
        document.getElementById('cancelProfile').addEventListener('click', () => this.closeModal('profileModal'));

        // Certificate Management
        document.getElementById('addCertBtn').addEventListener('click', () => this.showCertificateModal());
        document.getElementById('certificateForm').addEventListener('submit', (e) => this.handleCertificateSubmit(e));
        document.getElementById('closeCertificateModal').addEventListener('click', () => this.closeModal('certificateModal'));
        document.getElementById('cancelCertificate').addEventListener('click', () => this.closeModal('certificateModal'));

        // Review System
        document.getElementById('closeReviewModal').addEventListener('click', () => this.closeModal('reviewModal'));
        document.getElementById('cancelReview').addEventListener('click', () => this.closeModal('reviewModal'));
        document.getElementById('reviewForm').addEventListener('submit', (e) => this.handleReviewSubmit(e));

        // Rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedRating = e.target.dataset.rating;
            });
        });

        // Presentation Controls
        document.getElementById('closePresentationModal').addEventListener('click', () => this.closeModal('presentationModal'));
        document.getElementById('prevSlide').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextSlide').addEventListener('click', () => this.nextSlide());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());

        // Search and Filter
        document.getElementById('userSearch').addEventListener('input', (e) => this.searchUsers(e.target.value));
        document.getElementById('sortFilter').addEventListener('change', (e) => this.sortUsers(e.target.value));

        // Modal close on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    loadSampleData() {
        // Sample portfolios
        this.portfolios = [
            {
                id: 1,
                title: '웹 개발 프로젝트',
                description: '현대적인 반응형 웹사이트 개발',
                category: 'web',
                tags: ['React', 'JavaScript', 'CSS'],
                author: '사용자 이름',
                date: '2024-01-15'
            }
        ];

        // Sample certificates
        this.certificates = [
            {
                id: 1,
                name: '웹디자인기능사',
                issuer: '한국산업인력공단',
                date: '2023-12-15',
                number: 'WD-2023-1234',
                status: 'verified'
            }
        ];

        // Sample users
        this.users = [
            {
                id: 1,
                name: '김철수',
                title: '웹 개발자',
                reputation: 85,
                certificates: 3,
                portfolios: 5
            },
            {
                id: 2,
                name: '이영희',
                title: 'UI/UX 디자이너',
                reputation: 92,
                certificates: 2,
                portfolios: 8
            }
        ];

        // Sample reviews
        this.reviews = [
            {
                id: 1,
                userId: 2,
                userName: '이영희',
                rating: 'positive',
                comment: '전문적이고 신뢰할 수 있는 작업을 해주셨습니다.',
                date: '2024-01-10'
            }
        ];
    }

    showSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(sectionName + 'Btn').classList.add('active');

        // Show section
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionName + 'Section').classList.add('active');

        this.currentSection = sectionName;
        
        // Update data when switching to sections
        if (sectionName === 'home') {
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('totalUsers').textContent = this.users.length + 1; // +1 for current user
        document.getElementById('totalPortfolios').textContent = this.portfolios.length;
        document.getElementById('totalCertificates').textContent = this.certificates.filter(c => c.status === 'verified').length;
    }

    // Portfolio Management
    showPortfolioModal(portfolio = null) {
        const modal = document.getElementById('portfolioModal');
        const form = document.getElementById('portfolioForm');
        
        if (portfolio) {
            document.getElementById('portfolioModalTitle').textContent = '포트폴리오 수정';
            document.getElementById('portfolioTitle').value = portfolio.title;
            document.getElementById('portfolioDescription').value = portfolio.description;
            document.getElementById('portfolioCategory').value = portfolio.category;
            document.getElementById('portfolioTags').value = portfolio.tags.join(', ');
            form.dataset.editId = portfolio.id;
        } else {
            document.getElementById('portfolioModalTitle').textContent = '포트폴리오 추가';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.style.display = 'block';
    }

    handlePortfolioSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const portfolio = {
            id: form.dataset.editId ? parseInt(form.dataset.editId) : Date.now(),
            title: document.getElementById('portfolioTitle').value,
            description: document.getElementById('portfolioDescription').value,
            category: document.getElementById('portfolioCategory').value,
            tags: document.getElementById('portfolioTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            author: this.currentUser.name,
            date: new Date().toISOString().split('T')[0]
        };

        if (form.dataset.editId) {
            const index = this.portfolios.findIndex(p => p.id === parseInt(form.dataset.editId));
            this.portfolios[index] = portfolio;
        } else {
            this.portfolios.push(portfolio);
        }

        this.renderPortfolios();
        this.updateStats();
        this.closeModal('portfolioModal');
        this.showAlert('포트폴리오가 성공적으로 저장되었습니다.', 'success');
    }

    renderPortfolios() {
        const container = document.getElementById('portfolioList');
        
        if (this.portfolios.length === 0) {
            container.innerHTML = '<p class="text-center">등록된 포트폴리오가 없습니다.</p>';
            return;
        }

        container.innerHTML = this.portfolios.map(portfolio => `
            <div class="portfolio-card fade-in">
                <div class="portfolio-header">
                    <h3 class="portfolio-title">${portfolio.title}</h3>
                    <span class="portfolio-category">${this.getCategoryName(portfolio.category)}</span>
                </div>
                <div class="portfolio-content">
                    <p class="portfolio-description">${portfolio.description}</p>
                    <div class="portfolio-tags">
                        ${portfolio.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="portfolio-actions">
                        <button class="btn-primary btn-small" onclick="platform.startPresentation(${portfolio.id})">
                            프레젠테이션
                        </button>
                        <button class="btn-secondary btn-small" onclick="platform.editPortfolio(${portfolio.id})">
                            수정
                        </button>
                        <button class="btn-secondary btn-small" onclick="platform.deletePortfolio(${portfolio.id})">
                            삭제
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCategoryName(category) {
        const categories = {
            'web': '웹 개발',
            'mobile': '모바일 앱',
            'design': '디자인',
            'marketing': '마케팅',
            'other': '기타'
        };
        return categories[category] || category;
    }

    editPortfolio(id) {
        const portfolio = this.portfolios.find(p => p.id === id);
        if (portfolio) {
            this.showPortfolioModal(portfolio);
        }
    }

    deletePortfolio(id) {
        if (confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
            this.portfolios = this.portfolios.filter(p => p.id !== id);
            this.renderPortfolios();
            this.updateStats();
            this.showAlert('포트폴리오가 삭제되었습니다.', 'success');
        }
    }

    // Presentation System
    startPresentation(portfolioId) {
        const portfolio = this.portfolios.find(p => p.id === portfolioId);
        if (!portfolio) return;

        this.currentPresentation = {
            id: portfolioId,
            title: portfolio.title,
            slides: [
                {
                    title: portfolio.title,
                    content: `<h2>${portfolio.title}</h2><p class="lead">${portfolio.description}</p>`
                },
                {
                    title: '프로젝트 개요',
                    content: `
                        <h3>프로젝트 개요</h3>
                        <p><strong>카테고리:</strong> ${this.getCategoryName(portfolio.category)}</p>
                        <p><strong>작성자:</strong> ${portfolio.author}</p>
                        <p><strong>작성일:</strong> ${portfolio.date}</p>
                    `
                },
                {
                    title: '사용 기술',
                    content: `
                        <h3>사용 기술</h3>
                        <div class="tech-stack">
                            ${portfolio.tags.map(tag => `<span class="tag" style="font-size: 16px; padding: 8px 16px;">${tag}</span>`).join('')}
                        </div>
                    `
                },
                {
                    title: '프로젝트 설명',
                    content: `
                        <h3>프로젝트 상세 설명</h3>
                        <p style="font-size: 18px; line-height: 1.6;">${portfolio.description}</p>
                    `
                }
            ]
        };

        this.currentPresentationIndex = 0;
        this.showPresentationModal();
    }

    showPresentationModal() {
        const modal = document.getElementById('presentationModal');
        document.getElementById('presentationTitle').textContent = this.currentPresentation.title;
        this.renderCurrentSlide();
        modal.style.display = 'block';
    }

    renderCurrentSlide() {
        const content = document.getElementById('presentationContent');
        const slides = this.currentPresentation.slides;
        const currentSlide = slides[this.currentPresentationIndex];
        
        content.innerHTML = `
            <div class="presentation-slide active">
                ${currentSlide.content}
            </div>
        `;

        // Update slide counter
        document.getElementById('slideCounter').textContent = 
            `${this.currentPresentationIndex + 1} / ${slides.length}`;

        // Update navigation buttons
        document.getElementById('prevSlide').disabled = this.currentPresentationIndex === 0;
        document.getElementById('nextSlide').disabled = this.currentPresentationIndex === slides.length - 1;
    }

    previousSlide() {
        if (this.currentPresentationIndex > 0) {
            this.currentPresentationIndex--;
            this.renderCurrentSlide();
        }
    }

    nextSlide() {
        if (this.currentPresentationIndex < this.currentPresentation.slides.length - 1) {
            this.currentPresentationIndex++;
            this.renderCurrentSlide();
        }
    }

    toggleFullscreen() {
        const modal = document.getElementById('presentationModal');
        if (!document.fullscreenElement) {
            modal.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Profile Management
    showProfileModal() {
        const modal = document.getElementById('profileModal');
        document.getElementById('editName').value = this.currentUser.name;
        document.getElementById('editTitle').value = this.currentUser.title;
        document.getElementById('editBio').value = this.currentUser.bio;
        document.getElementById('editContact').value = this.currentUser.contact;
        modal.style.display = 'block';
    }

    handleProfileSubmit(e) {
        e.preventDefault();
        
        this.currentUser.name = document.getElementById('editName').value;
        this.currentUser.title = document.getElementById('editTitle').value;
        this.currentUser.bio = document.getElementById('editBio').value;
        this.currentUser.contact = document.getElementById('editContact').value;

        this.updateProfile();
        this.closeModal('profileModal');
        this.showAlert('프로필이 성공적으로 업데이트되었습니다.', 'success');
    }

    updateProfile() {
        document.getElementById('profileName').textContent = this.currentUser.name;
        document.getElementById('profileTitle').textContent = this.currentUser.title;
        document.getElementById('profileBio').textContent = this.currentUser.bio;
        document.getElementById('profileContact').textContent = this.currentUser.contact;
        
        this.renderCertifiedList();
    }

    renderCertifiedList() {
        const container = document.getElementById('certifiedList');
        const verifiedCerts = this.certificates.filter(c => c.status === 'verified');
        
        if (verifiedCerts.length === 0) {
            container.innerHTML = '<p>인증된 자격증이 없습니다.</p>';
            return;
        }

        container.innerHTML = verifiedCerts.map(cert => 
            `<span class="cert-badge verified">${cert.name}</span>`
        ).join('');
    }

    // Certificate Management
    showCertificateModal() {
        const modal = document.getElementById('certificateModal');
        document.getElementById('certificateForm').reset();
        modal.style.display = 'block';
    }

    handleCertificateSubmit(e) {
        e.preventDefault();
        
        const certificate = {
            id: Date.now(),
            name: document.getElementById('certName').value,
            issuer: document.getElementById('certIssuer').value,
            date: document.getElementById('certDate').value,
            number: document.getElementById('certNumber').value,
            status: 'pending' // Start with pending status
        };

        this.certificates.push(certificate);
        
        // Simulate verification process
        setTimeout(() => {
            certificate.status = 'verified';
            this.renderCertificates();
            this.renderCertifiedList();
            this.updateStats();
            this.showAlert('자격증이 성공적으로 인증되었습니다!', 'success');
        }, 3000);

        this.renderCertificates();
        this.closeModal('certificateModal');
        this.showAlert('자격증 인증 요청이 제출되었습니다. 검토 중입니다...', 'warning');
    }

    renderCertificates() {
        const container = document.getElementById('certificateList');
        
        if (this.certificates.length === 0) {
            container.innerHTML = '<p class="text-center">등록된 자격증이 없습니다.</p>';
            return;
        }

        container.innerHTML = this.certificates.map(cert => `
            <div class="cert-card ${cert.status} fade-in">
                <div class="cert-status ${cert.status}">
                    ${cert.status === 'verified' ? '인증완료' : '검토중'}
                </div>
                <h4>${cert.name}</h4>
                <p><strong>발급기관:</strong> ${cert.issuer}</p>
                <p><strong>취득일자:</strong> ${cert.date}</p>
                <p><strong>자격증 번호:</strong> ${cert.number}</p>
                ${cert.status === 'verified' ? 
                    '<button class="btn-secondary btn-small" onclick="platform.deleteCertificate(' + cert.id + ')">삭제</button>' : 
                    '<p class="text-muted">인증 처리 중입니다...</p>'
                }
            </div>
        `).join('');
    }

    deleteCertificate(id) {
        if (confirm('정말로 이 자격증을 삭제하시겠습니까?')) {
            this.certificates = this.certificates.filter(c => c.id !== id);
            this.renderCertificates();
            this.renderCertifiedList();
            this.updateStats();
            this.showAlert('자격증이 삭제되었습니다.', 'success');
        }
    }

    // User and Reputation System
    renderUsers() {
        const container = document.getElementById('usersList');
        
        container.innerHTML = this.users.map(user => `
            <div class="user-card fade-in">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='35' fill='%23e0e0e0'/%3E%3Ccircle cx='40' cy='32' r='12' fill='%23999'/%3E%3Cellipse cx='40' cy='60' rx='16' ry='12' fill='%23999'/%3E%3C/svg%3E" 
                     alt="${user.name}" class="user-avatar">
                <h4 class="user-name">${user.name}</h4>
                <p class="user-title">${user.title}</p>
                <div class="user-reputation">평판: ${user.reputation}점</div>
                <p>자격증 ${user.certificates}개 | 포트폴리오 ${user.portfolios}개</p>
                <button class="btn-secondary btn-small" onclick="platform.showReviewModal(${user.id})">
                    평판 남기기
                </button>
            </div>
        `).join('');
    }

    searchUsers(query) {
        const filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.title.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredUsers(filteredUsers);
    }

    sortUsers(criteria) {
        let sortedUsers = [...this.users];
        
        switch(criteria) {
            case 'name':
                sortedUsers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'reputation':
                sortedUsers.sort((a, b) => b.reputation - a.reputation);
                break;
            case 'certificates':
                sortedUsers.sort((a, b) => b.certificates - a.certificates);
                break;
        }
        
        this.renderFilteredUsers(sortedUsers);
    }

    renderFilteredUsers(users) {
        const container = document.getElementById('usersList');
        
        container.innerHTML = users.map(user => `
            <div class="user-card fade-in">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='35' fill='%23e0e0e0'/%3E%3Ccircle cx='40' cy='32' r='12' fill='%23999'/%3E%3Cellipse cx='40' cy='60' rx='16' ry='12' fill='%23999'/%3E%3C/svg%3E" 
                     alt="${user.name}" class="user-avatar">
                <h4 class="user-name">${user.name}</h4>
                <p class="user-title">${user.title}</p>
                <div class="user-reputation">평판: ${user.reputation}점</div>
                <p>자격증 ${user.certificates}개 | 포트폴리오 ${user.portfolios}개</p>
                <button class="btn-secondary btn-small" onclick="platform.showReviewModal(${user.id})">
                    평판 남기기
                </button>
            </div>
        `).join('');
    }

    showReviewModal(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const modal = document.getElementById('reviewModal');
        document.getElementById('reviewForm').reset();
        document.getElementById('reviewForm').dataset.userId = userId;
        
        // Reset rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
        this.selectedRating = null;
        
        modal.style.display = 'block';
    }

    handleReviewSubmit(e) {
        e.preventDefault();
        
        if (!this.selectedRating) {
            alert('평가를 선택해주세요.');
            return;
        }

        const userId = parseInt(document.getElementById('reviewForm').dataset.userId);
        const comment = document.getElementById('reviewComment').value;
        
        const review = {
            id: Date.now(),
            userId: userId,
            userName: this.users.find(u => u.id === userId).name,
            rating: this.selectedRating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
        };

        this.reviews.push(review);
        
        // Update current user's reputation
        if (this.selectedRating === 'positive') {
            this.currentUser.positiveReviews++;
            this.currentUser.reputation += 5;
        } else {
            this.currentUser.negativeReviews++;
            this.currentUser.reputation = Math.max(0, this.currentUser.reputation - 3);
        }

        this.updateReputation();
        this.closeModal('reviewModal');
        this.showAlert('평판이 성공적으로 등록되었습니다.', 'success');
    }

    updateReputation() {
        document.getElementById('reputationScore').textContent = this.currentUser.reputation;
        document.getElementById('positiveCount').textContent = this.currentUser.positiveReviews;
        document.getElementById('negativeCount').textContent = this.currentUser.negativeReviews;
        
        this.renderReputationList();
    }

    renderReputationList() {
        const container = document.getElementById('reputationList');
        const userReviews = this.reviews.filter(r => r.userId === this.currentUser.id);
        
        if (userReviews.length === 0) {
            container.innerHTML = '<p>아직 평판이 없습니다.</p>';
            return;
        }

        container.innerHTML = userReviews.map(review => `
            <div class="reputation-item ${review.rating} fade-in">
                <div class="review-header">
                    <strong>${review.userName}</strong>
                    <span class="review-date">${review.date}</span>
                </div>
                <p>${review.comment}</p>
                <span class="review-type ${review.rating}">
                    ${review.rating === 'positive' ? '긍정적 평가' : '부정적 평가'}
                </span>
            </div>
        `).join('');
    }

    // Utility Functions
    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showAlert(message, type) {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Add to the current section
        const currentSection = document.querySelector('.section.active');
        if (currentSection) {
            currentSection.insertBefore(alert, currentSection.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 5000);
        }
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.platform = new PortfolioPlatform();
    console.log('Portfolio Platform initialized successfully');
});

// Real-time updates simulation
setInterval(() => {
    if (window.platform) {
        // Simulate real-time reputation score updates
        const scoreElement = document.getElementById('reputationScore');
        if (scoreElement && Math.random() < 0.1) { // 10% chance every interval
            // Small random fluctuation for demonstration
            const currentScore = parseInt(scoreElement.textContent);
            const change = Math.random() < 0.7 ? 1 : -1; // 70% chance of positive change
            const newScore = Math.max(0, currentScore + change);
            scoreElement.textContent = newScore;
            platform.currentUser.reputation = newScore;
        }
    }
}, 10000); // Update every 10 seconds

// KCA Integration Functions
function checkCertificationRequirements(certType) {
    // This would integrate with the KCA API in a real implementation
    const requirements = {
        'web-design': {
            education: '고등학교 졸업 이상',
            experience: '관련 분야 6개월 이상',
            courses: ['웹디자인 기초', 'HTML/CSS', 'JavaScript'],
            examFee: '50,000원'
        },
        'network': {
            education: '전문대 졸업 이상',
            experience: '관련 분야 1년 이상',
            courses: ['네트워크 기초', '라우팅/스위칭', '보안'],
            examFee: '80,000원'
        },
        'database': {
            education: '대학교 졸업 이상',
            experience: '관련 분야 2년 이상',
            courses: ['데이터베이스 설계', 'SQL', '데이터 모델링'],
            examFee: '100,000원'
        }
    };

    return requirements[certType] || {
        education: '관련 학력',
        experience: '관련 경험',
        courses: ['전공 과목 수강'],
        examFee: '문의'
    };
}

// Cache control for Replit environment
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
        // Service worker registered successfully
        console.log('ServiceWorker registration successful');
    }).catch(function(err) {
        // Service worker registration failed
        console.log('ServiceWorker registration failed');
    });
}

// Prevent caching during development
if (location.hostname === 'localhost' || location.hostname.includes('replit')) {
    // Disable cache
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
}