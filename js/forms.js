document.addEventListener('DOMContentLoaded', function() {
    // Contador de caracteres para síntomas
    const setupSymptomsCounter = () => {
        const symptomsTextarea = document.getElementById('symptoms');
        const charCount = document.getElementById('charCount');
        
        if (symptomsTextarea && charCount) {
            symptomsTextarea.addEventListener('input', function() {
                const remaining = 500 - this.value.length;
                charCount.textContent = this.value.length;
                
                if (remaining < 50) {
                    charCount.classList.add('text-warning');
                    if (remaining < 0) {
                        charCount.classList.remove('text-warning');
                        charCount.classList.add('text-danger');
                        this.value = this.value.substring(0, 500);
                        charCount.textContent = 500;
                    }
                } else {
                    charCount.classList.remove('text-warning', 'text-danger');
                }
            });
        }
    };
    
    setupSymptomsCounter();

    // Validación de formulario de cita
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        // Validar fecha no sea anterior a hoy
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            dateInput.min = new Date().toISOString().split('T')[0];
            
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    this.classList.add('is-invalid');
                    this.nextElementSibling.textContent = 'No puedes seleccionar una fecha pasada';
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }

        // Validar hora laboral (9:00 - 18:00)
        const timeInput = document.getElementById('appointmentTime');
        if (timeInput) {
            timeInput.addEventListener('change', function() {
                const hours = parseInt(this.value.split(':')[0]);
                if (hours < 9 || hours >= 18) {
                    this.classList.add('is-invalid');
                    this.nextElementSibling.textContent = 'Horario laboral: 9:00 - 18:00';
                } else {
                    this.classList.remove('is-invalid');
                }
            });
        }

        
 // En la función que maneja el envío del formulario de cita
appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const requiredFields = this.querySelectorAll('[required]');
    
    // Validar campos obligatorios
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    if (!isValid) return;
    
    // Generar número de ficha aleatorio
    const ticketNumber = 'VET-' + new Date().getFullYear() + '-' + 
                      Math.floor(1000 + Math.random() * 9000);
    
    // Crear contenido de confirmación (AGREGAR RAZA AL RESUMEN)
    const confirmationContent = `
        <div class="confirmation-text fade-in">
            <h4 class="mb-4 text-center">Resumen de la Cita</h4>
            <p><strong>Número de Ficha:</strong> ${ticketNumber}</p>
            <p><strong>Dueño:</strong> ${document.getElementById('ownerName').value}</p>
            <p><strong>Mascota:</strong> ${document.getElementById('petName').value}</p>
            <p><strong>Especie/Raza:</strong> ${document.getElementById('petSpecies').value} / ${document.getElementById('petBreed').value}</p>
            <p><strong>Edad:</strong> ${document.getElementById('petAge').value || 'No especificada'} años</p>
            <p><strong>Fecha y Hora:</strong> ${document.getElementById('appointmentDate').value} a las ${document.getElementById('appointmentTime').value}</p>
            <p><strong>Veterinario:</strong> ${document.getElementById('veterinarian').value}</p>
            <p><strong>Síntomas:</strong><br>${document.getElementById('symptoms').value}</p>
            <hr>
            <div class="alert alert-success mt-4">
                <i class="fas fa-envelope me-2"></i>
                Cita confirmada. Su número de ficha es: <strong>${ticketNumber}</strong>, 
                el día <strong>${document.getElementById('appointmentDate').value}</strong> 
                a las <strong>${document.getElementById('appointmentTime').value}</strong>.
            </div>
        </div>
    `;
    
    // Mostrar modal de confirmación
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    document.getElementById('confirmationContent').innerHTML = confirmationContent;
    confirmationModal.show();
});
    }



    

    // Formulario de datos de usuario
    const userDataForm = document.getElementById('userDataForm');
    if (userDataForm) {
        const cancelButton = document.getElementById('cancelChanges');
        
        // Guardar valores originales
        const originalValues = {};
        userDataForm.querySelectorAll('input').forEach(input => {
            originalValues[input.id] = input.value;
        });
        
        // Botón cancelar
        if (cancelButton) {
            cancelButton.addEventListener('click', function() {
                userDataForm.querySelectorAll('input').forEach(input => {
                    input.value = originalValues[input.id];
                    input.classList.remove('is-invalid');
                });
            });
        }
        
        userDataForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Validar email
            const emailField = document.getElementById('userEmail');
            if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
                emailField.classList.add('is-invalid');
                emailField.nextElementSibling.textContent = 'Por favor ingresa un correo electrónico válido';
                isValid = false;
            }
            
            if (isValid) {
                alert('Datos actualizados correctamente');
                // Actualizar valores originales
                userDataForm.querySelectorAll('input').forEach(input => {
                    originalValues[input.id] = input.value;
                });
            }
        });
    }

    // Remover mensajes de error al escribir
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
    });
});