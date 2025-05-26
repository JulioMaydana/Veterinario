document.addEventListener('DOMContentLoaded', function() {
    // Almacenamiento de usuarios
    const storedUsers = localStorage.getItem('vetUsers');
    let registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Función para mostrar/ocultar contraseña
    const setupPasswordToggles = () => {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });
    };
    
    setupPasswordToggles();

    // Validación de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const passwordInput = document.getElementById('password');
        const requirements = {
            length: document.querySelector('.req-length'),
            uppercase: document.querySelector('.req-uppercase'),
            number: document.querySelector('.req-number'),
            special: document.querySelector('.req-special')
        };

        passwordInput.addEventListener('input', function() {
            const value = this.value;
            
            // Validar cada requisito
            const checks = {
                length: value.length === 8,
                uppercase: /[A-Z]/.test(value),
                number: /\d/.test(value),
                special: /[!@#$%^&*]/.test(value)
            };
            
            // Actualizar visualización de requisitos
            Object.keys(checks).forEach(key => {
                const isValid = checks[key];
                requirements[key].className = isValid ? 'req-valid' : 'req-invalid';
                const icon = requirements[key].querySelector('i');
                icon.className = isValid ? 'fas fa-check-circle' : 'fas fa-times-circle';
            });
        });

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = passwordInput.value;
            
            // Validar contraseña
            const isValid = password.length === 8 && 
                          /[A-Z]/.test(password) && 
                          /\d/.test(password) && 
                          /[!@#$%^&*]/.test(password);
            
            if (!isValid) {
                passwordInput.classList.add('is-invalid');
                return;
            }
            
            // Verificar si el usuario ya existe
            const userExists = registeredUsers.some(user => 
                user.email === email || user.username === username
            );
            
            if (userExists) {
                alert('El usuario o correo electrónico ya está registrado');
                return;
            }
            
            // Registrar nuevo usuario
            const newUser = { username, email, password };
            registeredUsers.push(newUser);
            localStorage.setItem('vetUsers', JSON.stringify(registeredUsers));
            
            // Iniciar sesión automáticamente
            sessionStorage.setItem('currentVetUser', JSON.stringify(newUser));
            window.location.href = 'cita-medica.html';
        });
    }

    // Validación de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const credential = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!credential || !password) {
                if (!credential) {
                    document.getElementById('loginEmail').classList.add('is-invalid');
                }
                if (!password) {
                    document.getElementById('loginPassword').classList.add('is-invalid');
                }
                return;
            }
            
            // Buscar usuario
            const user = registeredUsers.find(user => 
                (user.email === credential || user.username === credential) && 
                user.password === password
            );
            
            if (user) {
                sessionStorage.setItem('currentVetUser', JSON.stringify(user));
                window.location.href = 'cita-medica.html';
            } else {
                alert('Credenciales incorrectas. Por favor verifica tus datos.');
                document.getElementById('loginPassword').classList.add('is-invalid');
            }
        });
        
        // Remover validación al escribir
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    }

    // Verificar sesión en páginas protegidas
    const protectedPages = ['cita-medica.html', 'reportes.html', 'mis-datos.html'];
    if (protectedPages.some(page => window.location.pathname.endsWith(page))) {
        const currentUser = sessionStorage.getItem('currentVetUser');
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }

    // Cerrar sesión
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            sessionStorage.removeItem('currentVetUser');
            window.location.href = 'index.html';
        });
    });
});