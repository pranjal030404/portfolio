export function initApp() {
    const app = document.getElementById('app');
    if (!app)
        return;
    app.innerHTML = `
    ${createParticlesLayer()}
    ${createNavbar()}
    ${createHero()}
    ${createAbout()}
    ${createExperience()}
    ${createEducation()}
    ${createSkills()}
    ${createProjects()}
    ${createContact()}
    ${createFooter()}
  `;
    // Initialize all interactive features
    initThemeToggle();
    initTypingAnimation();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initParticles();
}
function createParticlesLayer() {
    return '<div class="particles" id="particles" aria-hidden="true"></div>';
}
const PROFILE_IMAGE_URL = new URL('../sp.jpeg', import.meta.url).href;
const PROFILE_IMAGE_ALT = 'Pranjal Tiwari profile picture';
const EXPERIENCE_DATES = {
    zebraffeStart: 'Dec 2024',
    atrivisStart: 'Sep 2024',
    atrivisEnd: 'Nov 2024'
};
function createNavbar() {
    return `
    <nav class="navbar" id="navbar">
      <div class="nav-container">
        <h1 class="logo">PT</h1>
        <ul class="nav-links" id="navLinks">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="theme-toggle" id="themeToggle">
          <i class="fas fa-sun"></i>
        </button>
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  `;
}
function createHero() {
    return `
    <section id="home" class="hero">
      <div class="hero-layout">
        <div class="hero-content">
          <h1 class="hero-title">
            Hi, I'm <span class="highlight">Pranjal Tiwari</span>
          </h1>
          <h2 class="hero-subtitle">
            <span id="typingText"></span><span class="cursor">|</span>
          </h2>
          <p class="hero-description">
            MERN Stack Developer | GPS Tracking Systems Specialist | Open Source Contributor
            <br>
            Building production-grade IoT solutions and scalable web applications
          </p>

          <div class="social-links">
            <a href="https://github.com/pranjal030404" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/prajal030404" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="mailto:pranjaltiwari69058@gmail.com" target="_blank" rel="noopener noreferrer">
              <i class="fas fa-envelope"></i>
            </a>
          </div>

          <a href="#experience" class="cta-button">View My Experience</a>
        </div>

        <div class="hero-image fade-in">
          <div class="profile-image-container">
            <div class="image-border"></div>
            <img class="profile-image" src="${PROFILE_IMAGE_URL}" alt="${PROFILE_IMAGE_ALT}">
          </div>
        </div>
      </div>
    </section>
  `;
}
function createAbout() {
    return `
    <section id="about" class="about section-padding">
      <div class="container">
        <h2 class="section-title">About Me</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="fade-in">
              I'm a highly motivated Computer Science student at Babu Banarsi Das Institute of Technology (BBDIT) 
              with a strong foundation in software development, problem-solving, and algorithms. Currently pursuing 
              my BTech in CSE with a CGPA of 8.17, I'm passionate about creating innovative software solutions.
            </p>
            <p class="fade-in">
              I completed a 3-month internship at Atrivis Technologies and now work as a Junior Developer at 
              Zebraffe Technologies Limited. I have hands-on experience building production-grade vehicle and GPS 
              tracking platforms, including real-time data streaming, microservices architecture, and advanced 
              dashboards for live monitoring and analytics.
            </p>
            <p class="fade-in">
              I'm an active open-source contributor, working with organizations like DOOCS and TheAlgorithms 
              to improve their platforms. Proficient in Python, Java, C, and the complete MERN stack, I'm eager 
              to contribute to innovative projects and continue growing my skills in the tech industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
function createExperience() {
    const zebraffeDuration = `${EXPERIENCE_DATES.zebraffeStart} - Present`;
    const atrivisDuration = `${EXPERIENCE_DATES.atrivisStart} - ${EXPERIENCE_DATES.atrivisEnd} (3 Months Internship)`;
    return `
    <section id="experience" class="experience section-padding">
      <div class="container">
        <h2 class="section-title">Professional Experience</h2>

        <div class="experience-list">
        <div class="experience-card fade-in">
          <div class="experience-header">
            <div class="experience-left">
              <div class="company-logo">
                <i class="fas fa-building"></i>
              </div>
              <div class="company-info">
                <h3>Junior Developer</h3>
                <h4>Zebraffe Technologies Limited</h4>
                <p class="location"><i class="fas fa-map-marker-alt"></i> India</p>
              </div>
            </div>
            <div class="experience-right">
              <span class="duration-badge">
                <i class="fas fa-calendar"></i> ${zebraffeDuration}
              </span>
            </div>
          </div>

          <div class="experience-body">
            <div class="project-highlight">
              <h4><i class="fas fa-car"></i> Vehicle Fitness Platform</h4>
              <p class="project-desc">
                Worked on the Vehicle Fitness project to build and improve platform features for fitness workflows,
                tracking operations, and production reliability.
              </p>
              <p class="project-desc">
                <a href="https://stg.vehiclefitness.gocarriage.com/" target="_blank" rel="noopener noreferrer">https://stg.vehiclefitness.gocarriage.com/</a>
              </p>
            </div>

            <div class="project-highlight">
              <h4><i class="fas fa-store"></i> Franchise Platform</h4>
              <p class="project-desc">
                Worked on the Zebraffe franchise project to support live business workflows, site updates, and
                production stability for the company portal.
              </p>
              <p class="project-desc">
                <a href="https://in.zebraffe.net/" target="_blank" rel="noopener noreferrer">https://in.zebraffe.net/</a>
              </p>
            </div>

            <div class="tech-stack">
              <h5><i class="fas fa-code"></i> Technologies Used</h5>
              <div class="tech-badges">
                <span class="tech-badge">React</span>
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">Express.js</span>
                <span class="tech-badge">MongoDB</span>
                <span class="tech-badge">REST APIs</span>
              </div>
            </div>
          </div>
        </div>

        <div class="experience-card fade-in">
          <div class="experience-header">
            <div class="experience-left">
              <div class="company-logo">
                <i class="fas fa-building"></i>
              </div>
              <div class="company-info">
                <h3>MERN Stack Developer Intern</h3>
                <h4>Atrivis Technologies Pvt. Ltd.</h4>
                <p class="location"><i class="fas fa-map-marker-alt"></i> Noida Sector 63</p>
              </div>
            </div>
            <div class="experience-right">
              <span class="duration-badge">
                <i class="fas fa-calendar"></i> ${atrivisDuration}
              </span>
            </div>
          </div>

          <div class="experience-body">
            <div class="project-highlight">
              <h4><i class="fas fa-rocket"></i> GPS Tracking & IoT Management System</h4>
              <p class="project-desc">
                Architected and developed a production-grade real-time GPS tracking platform 
                with microservices architecture, handling live vehicle monitoring and analytics.
              </p>
              <p class="project-desc">
                <a href="http://139.59.13.130:5173/login" target="_blank" rel="noopener noreferrer">http://139.59.13.130:5173/login</a>
              </p>
            </div>

            <div class="work-highlights">
              <div class="highlight-row">
                <div class="highlight-card">
                  <i class="fas fa-microchip"></i>
                  <h5>Protocol Development</h5>
                  <p>Built GT06/Concox/Prithivi GPS device protocol parser with TCP server for real-time data streaming</p>
                </div>
                <div class="highlight-card">
                  <i class="fas fa-project-diagram"></i>
                  <h5>Microservices Architecture</h5>
                  <p>Designed scalable system using Redis Streams for message queuing and service isolation</p>
                </div>
              </div>

              <div class="highlight-row">
                <div class="highlight-card">
                  <i class="fas fa-server"></i>
                  <h5>Backend Development</h5>
                  <p>Built RESTful APIs with Node.js/Express, MongoDB schemas, and Socket.io integration</p>
                </div>
                <div class="highlight-card">
                  <i class="fas fa-map-marked-alt"></i>
                  <h5>Real-time Dashboard</h5>
                  <p>Created React dashboard with live tracking, route history, and analytics visualization</p>
                </div>
              </div>
            </div>

            <div class="key-achievements">
              <h5><i class="fas fa-trophy"></i> Key Achievements</h5>
              <ul>
                <li>Implemented real-time vehicle tracking with live map visualization</li>
                <li>Built historical route playback with speed and distance analytics</li>
                <li>Developed geofencing alerts and notification system</li>
                <li>Created advanced fleet management dashboard with filtering capabilities</li>
              </ul>
            </div>

            <div class="tech-stack">
              <h5><i class="fas fa-code"></i> Technologies Used</h5>
              <div class="tech-badges">
                <span class="tech-badge">Node.js</span>
                <span class="tech-badge">React</span>
                <span class="tech-badge">MongoDB</span>
                <span class="tech-badge">Redis</span>
                <span class="tech-badge">Socket.io</span>
                <span class="tech-badge">Express.js</span>
                <span class="tech-badge">TCP/IP</span>
                <span class="tech-badge">Prithivi Protocol</span>
                <span class="tech-badge">Microservices</span>
                <span class="tech-badge">Leaflet.js</span>
                <span class="tech-badge">Docker</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  `;
}
function createEducation() {
    return `
    <section id="education" class="education section-padding">
      <div class="container">
        <h2 class="section-title">Education</h2>
        <div class="education-grid">
          <div class="education-card fade-in">
            <div class="education-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <h3>BTech in Computer Science Engineering</h3>
            <h4>Babu Banarsi Das Institute of Technology (BBDIT), AKTU</h4>
            <p class="education-year">2022 - 2026</p>
            <p class="education-grade">CGPA: 8.17</p>
          </div>

          <div class="education-card fade-in">
            <div class="education-icon">
              <i class="fas fa-school"></i>
            </div>
            <h3>12th Grade (PCM)</h3>
            <h4>Rampus, CBSE</h4>
            <p class="education-year">2021</p>
          </div>

          <div class="education-card fade-in">
            <div class="education-icon">
              <i class="fas fa-book"></i>
            </div>
            <h3>10th Grade</h3>
            <h4>Rampus, CBSE</h4>
            <p class="education-year">2019</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
function createSkills() {
    const skillCategories = [
        {
            category: 'Programming Languages',
            skills: [
                { name: 'JavaScript/Node.js', level: 90 },
                { name: 'Python', level: 85 },
                { name: 'Java', level: 80 },
                { name: 'C', level: 75 }
            ]
        },
        {
            category: 'Web Development (MERN Stack)',
            skills: [
                { name: 'React', level: 85 },
                { name: 'Node.js & Express', level: 90 },
                { name: 'MongoDB', level: 85 },
                { name: 'REST APIs', level: 85 }
            ]
        },
        {
            category: 'DevOps & Cloud',
            skills: [
                { name: 'Docker', level: 75 },
                { name: 'Kubernetes', level: 70 },
                { name: 'Linux Administration', level: 80 },
                { name: 'Git/GitHub', level: 85 }
            ]
        },
        {
            category: 'Database & Caching',
            skills: [
                { name: 'MongoDB', level: 85 },
                { name: 'Redis', level: 80 },
                { name: 'MySQL', level: 80 }
            ]
        },
        {
            category: 'IoT & Real-time Systems',
            skills: [
                { name: 'TCP/IP Protocols', level: 85 },
                { name: 'Socket.io/WebSockets', level: 85 },
                { name: 'GPS Device Integration', level: 90 },
                { name: 'Microservices', level: 80 }
            ]
        }
    ];
    const skillsHTML = skillCategories.map(category => `
    <div class="skill-category">
      <h3 class="skill-category-title">${category.category}</h3>
      ${category.skills.map(skill => `
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">${skill.name}</span>
            <span class="skill-percentage">${skill.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" data-progress="${skill.level}"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
    return `
    <section id="skills" class="skills section-padding">
      <div class="container">
        <h2 class="section-title">Skills & Technologies</h2>
        <div class="skills-grid">
          ${skillsHTML}
        </div>
      </div>
    </section>
  `;
}
function createProjects() {
    const projects = [
    {
      icon: 'fa-store',
      title: 'Zebraffe Franchise Platform',
      description: 'Live franchise portal worked on for Zebraffe Technologies Limited, covering business workflows, updates, and production support.',
      tech: ['React', 'Node.js', 'Express.js', 'Production Support'],
      github: '#',
      demo: 'https://in.zebraffe.net/'
    },
    {
      icon: 'fa-car',
      title: 'Vehicle Fitness Platform',
      description: 'Production vehicle fitness platform built and maintained at Zebraffe Technologies Limited for fitness workflows and operational tracking.',
      tech: ['React', 'Node.js', 'Express.js', 'MongoDB'],
      github: '#',
      demo: 'https://stg.vehiclefitness.gocarriage.com/'
    },
    {
      icon: 'fa-rocket',
      title: 'GPS Tracking & IoT Management System',
      description: 'Real-time GPS tracking platform developed during the Atrivis internship with live monitoring, analytics, and IoT workflows.',
      tech: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Prithivi Protocol'],
      github: '#',
      demo: 'http://139.59.13.130:5173/login'
    },
    {
      icon: 'fa-users',
      title: 'CRM Frontend (EMS Portal)',
      description: 'Frontend CRM/EMS portal for employee management workflows including authentication and dashboard-based operations.',
      tech: ['CRM', 'Employee Management System', 'Frontend'],
      github: '#',
      demo: 'https://crm-frontend-omega-eight.vercel.app'
    },
        {
            icon: 'fa-code-branch',
            title: 'DOOCS LeetCode Website',
            description: 'Open source contribution as website developer for DOOCS organization. Managing website orientation, providing LeetCode solutions, and optimizing database loading speed for better performance.',
            tech: ['Web Development', 'Database Optimization', 'Open Source'],
            github: 'https://github.com/doocs',
            demo: 'https://github.com/doocs/leetcode'
        },
        {
            icon: 'fa-laptop-code',
            title: 'TheAlgorithms Website Maintainer',
            description: 'Part of website_maintainers and algorithms-explanation_maintainers team. Improvising the website and implementing Docker containerization for cross-platform compatibility.',
            tech: ['Docker', 'Web Development', 'DevOps', 'Open Source'],
            github: 'https://github.com/TheAlgorithms',
            demo: 'https://the-algorithms.com'
        },
        {
            icon: 'fa-book',
            title: 'Library Management System',
            description: 'Full-stack GUI application with Tkinter and MySQL. Complete frontend and backend integration for managing library data with easy update and upgrade capabilities.',
            tech: ['Python', 'Tkinter', 'MySQL', 'GUI Development'],
            github: 'https://github.com/pranjal030404',
            demo: '#'
        },
        {
            icon: 'fa-youtube',
            title: 'YouTube Clone',
            description: 'GUI-based YouTube clone using Tailwind CSS with YouTube API integration. Features working like/dislike functionality and complete backend integration.',
            tech: ['Tailwind CSS', 'API Integration', 'JavaScript', 'Backend'],
            github: 'https://github.com/pranjal030404',
            demo: '#'
        },
        {
            icon: 'fa-gamepad',
            title: 'Snake Game',
            description: 'Classic snake game built with Python using Tkinter library. Custom GUI with dynamic snake movement and food collection mechanics.',
            tech: ['Python', 'Tkinter', 'Game Development'],
            github: 'https://github.com/pranjal030404',
            demo: '#'
        }
    ];
    const projectsHTML = projects.map(project => {
        const projectLinks = [
            project.github && project.github !== '#'
                ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i> Source Code
        </a>`
                : '',
            project.demo && project.demo !== '#'
                ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-arrow-up-right-from-square"></i> Live Site
        </a>`
                : ''
        ].filter(Boolean).join('');

        return `
    <div class="project-card">
      <div class="project-icon">
        <i class="fas ${project.icon}"></i>
      </div>
      <h3>${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <div class="tech-stack">
        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
      <div class="project-links">
        ${projectLinks}
      </div>
    </div>
  `;
    }).join('');
    return `
    <section id="projects" class="projects section-padding">
      <div class="container">
        <h2 class="section-title">Projects</h2>
        <div class="projects-grid">
          ${projectsHTML}
        </div>
      </div>
    </section>
  `;
}
function createContact() {
    return `
    <section id="contact" class="contact section-padding">
      <div class="container">
        <h2 class="section-title">Get In Touch</h2>
        <div class="contact-container">
          <div class="contact-info">
            <h3>Let's Work Together</h3>
            <p>
              I'm eager to contribute to innovative software solutions and always open to 
              discussing new projects, internship opportunities, or full-time positions in 
              software development and IoT systems.
            </p>

            <div class="contact-details">
              <div class="contact-item">
                <i class="fas fa-envelope"></i>
                <span>pranjaltiwari69058@gmail.com</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone"></i>
                <span>+91 7607501687 / 8400095088</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>C-23, Noida Sector 52</span>
              </div>
              <div class="contact-item">
                <i class="fab fa-linkedin"></i>
                <a href="https://www.linkedin.com/in/prajal030404" target="_blank">LinkedIn Profile</a>
              </div>
              <div class="contact-item">
                <i class="fab fa-github"></i>
                <a href="https://github.com/pranjal030404" target="_blank">GitHub Profile</a>
              </div>
            </div>
          </div>

          <form class="contact-form" id="contactForm">
            <div class="form-group">
              <input type="text" name="name" placeholder="Your Name" required>
            </div>

            <div class="form-group">
              <input type="email" name="email" placeholder="Your Email" required>
            </div>

            <div class="form-group">
              <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
            </div>

            <button type="submit" class="submit-button">Send on WhatsApp</button>

            <p class="success-message" id="successMessage">Opening WhatsApp...</p>
          </form>
        </div>
      </div>
    </section>
  `;
}
function createFooter() {
    return `
    <footer class="footer">
      <p>&copy; 2025 Pranjal Tiwari. All rights reserved.</p>
      <div class="footer-links">
        <a href="https://github.com/pranjal030404" target="_blank"><i class="fab fa-github"></i></a>
        <a href="https://www.linkedin.com/in/prajal030404" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="mailto:pranjaltiwari69058@gmail.com" target="_blank"><i class="fas fa-envelope"></i></a>
      </div>
    </footer>
  `;
}
// Interactive Functions
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    body.classList.add('dark-mode');
    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = body.classList.contains('dark-mode')
                ? 'fas fa-sun'
                : 'fas fa-moon';
        }
    });
}
function initTypingAnimation() {
    const typingText = document.getElementById('typingText');
    const textToType = 'Full Stack Developer & IoT Specialist';
    let charIndex = 0;
    function typeText() {
        if (typingText && charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }
    setTimeout(typeText, 500);
}
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-item')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    const progress = progressBar?.getAttribute('data-progress');
                    if (progressBar && progress) {
                        setTimeout(() => {
                            progressBar.style.width = progress + '%';
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in, .skill-item, .project-card, .education-card, .experience-item').forEach(el => {
        observer.observe(el);
    });
}
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const whatsappNumber = '918400095088';
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim() || 'there';
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();
        const whatsappText = [
            `Hi, I'm ${name}.`,
            email ? `Email: ${email}` : '',
            message
        ].filter(Boolean).join('\n');
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        successMessage?.classList.add('show');
        contactForm.reset();
        setTimeout(() => {
            successMessage?.classList.remove('show');
        }, 3000);
    });
}
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');
            const target = href ? document.querySelector(href) : null;
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer?.appendChild(particle);
    }
}
