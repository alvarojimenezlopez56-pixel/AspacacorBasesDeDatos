// --- APLICACIÓN GESTIÓN DE SOCIOS ASPACACOR ---

const API_BASE = '/api';

const app = {
    // Estado local
    socios: [],
    actividades: [],
    inscripciones: [],

    // Inicialización al cargar la página
    init() {
        this.bindEvents();
        this.loadAllData();
    },

    // Enlace de eventos de navegación
    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    },

    // Cambiar de pestaña
    switchTab(tabId) {
        // Actualizar menú activo
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Mostrar sección de contenido correspondiente
        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Actualizar título
        const titles = {
            dashboard: 'Panel de Control',
            socios: 'Gestión de Socios',
            actividades: 'Gestión de Actividades',
            inscripciones: 'Inscripciones a Actividades'
        };
        document.getElementById('current-tab-title').textContent = titles[tabId];

        // Recargar datos específicos al cambiar
        this.loadAllData();
    },

    // Cargar todos los datos de la API
    async loadAllData() {
        try {
            await Promise.all([
                this.fetchSocios(),
                this.fetchActividades(),
                this.fetchInscripciones()
            ]);
            this.renderStats();
            this.renderRecentInscriptions();
            this.renderSociosTable();
            this.renderActividadesGrid();
            this.renderInscripcionesTable();
        } catch (error) {
            console.error('Error cargando datos de la base de datos:', error);
        }
    },

    // --- FETCH API ---
    async fetchSocios() {
        const response = await fetch(`${API_BASE}/socios`);
        this.socios = await response.json();
    },

    async fetchActividades() {
        const response = await fetch(`${API_BASE}/actividades`);
        this.actividades = await response.json();
    },

    async fetchInscripciones() {
        const response = await fetch(`${API_BASE}/inscripciones`);
        this.inscripciones = await response.json();
    },

    // --- RENDERIZAR PANEL DE CONTROL (DASHBOARD) ---
    renderStats() {
        document.getElementById('stat-total-socios').textContent = this.socios.length;
        document.getElementById('stat-total-actividades').textContent = this.actividades.length;
        document.getElementById('stat-total-inscripciones').textContent = this.inscripciones.length;
        
        const sociosAsistencia = this.socios.filter(s => s.necesitaAsistencia).length;
        document.getElementById('stat-asistencia-requerida').textContent = sociosAsistencia;
    },

    renderRecentInscriptions() {
        const tbody = document.getElementById('recent-inscriptions-body') || document.querySelector('#dashboard-tab tbody');
        if (!tbody) return;

        // Ordenar por fecha o ID descendente, tomar las últimas 5
        const recientes = [...this.inscripciones]
            .sort((a, b) => b.idInscripcion - a.idInscripcion)
            .slice(0, 5);

        if (recientes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="text-muted text-center py-4">No hay inscripciones registradas.</td></tr>`;
            return;
        }

        tbody.innerHTML = recientes.map(insc => {
            const socioNombre = insc.socio ? `${insc.socio.nombre} ${insc.socio.apellidos}` : 'N/A';
            const actividadTitulo = insc.actividad ? insc.actividad.titulo : 'N/A';
            const fecha = insc.fechaRegistro ? new Date(insc.fechaRegistro).toLocaleString('es-ES') : 'N/A';
            const badgeClass = insc.asistenciaConfirmada ? 'badge-success' : 'badge-warning';
            const badgeText = insc.asistenciaConfirmada ? 'Confirmada' : 'Pendiente';

            return `
                <tr>
                    <td><strong>${socioNombre}</strong></td>
                    <td>${actividadTitulo}</td>
                    <td>${fecha}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
                </tr>
            `;
        }).join('');
    },

    // --- SECCIÓN: SOCIOS ---
    renderSociosTable(list = this.socios) {
        const tbody = document.getElementById('socios-table-body');
        if (!tbody) return;

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-muted text-center py-4">No se encontraron socios.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(socio => {
            const asistenciaText = socio.necesitaAsistencia 
                ? '<span class="badge badge-warning">Sí (Asistencia Requerida)</span>' 
                : '<span class="badge badge-outline">No</span>';
            
            const fechaNac = socio.fechaNacimiento 
                ? new Date(socio.fechaNacimiento).toLocaleDateString('es-ES') 
                : 'N/A';

            // Resumen de contactos
            let contactosHtml = '<span class="text-muted">Ninguno</span>';
            if (socio.contactosEmergencia && socio.contactosEmergencia.length > 0) {
                const tooltipText = socio.contactosEmergencia.map(c => `${c.nombreCompleto} (${c.parentesco}): ${c.telefono}`).join('\n');
                contactosHtml = `<span class="badge badge-info" title="${tooltipText}" style="cursor:help;">
                    ${socio.contactosEmergencia.length} Contacto(s)
                </span>`;
            }

            return `
                <tr>
                    <td><code>${socio.dni}</code></td>
                    <td><strong>${socio.nombre} ${socio.apellidos}</strong></td>
                    <td>${socio.telefono || 'N/A'}</td>
                    <td>${fechaNac}</td>
                    <td>${asistenciaText}</td>
                    <td>${contactosHtml}</td>
                    <td class="text-right">
                        <button class="action-btn edit" onclick="app.openEditSocioModal(${socio.idSocio})" title="Editar Socio">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn delete" onclick="app.deleteSocio(${socio.idSocio})" title="Dar de Baja / Eliminar">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    filterSocios() {
        const query = document.getElementById('socio-search').value.toLowerCase().trim();
        if (!query) {
            this.renderSociosTable(this.socios);
            return;
        }

        const filtered = this.socios.filter(s => {
            const nombreCompleto = `${s.nombre} ${s.apellidos}`.toLowerCase();
            return s.dni.toLowerCase().includes(query) || 
                   nombreCompleto.includes(query) ||
                   (s.telefono && s.telefono.includes(query));
        });
        this.renderSociosTable(filtered);
    },

    // --- SECCIÓN: ACTIVIDADES ---
    renderActividadesGrid() {
        const container = document.getElementById('actividades-container');
        if (!container) return;

        if (this.actividades.length === 0) {
            container.innerHTML = `<div class="text-muted text-center py-4 w-100">No hay actividades registradas en el sistema.</div>`;
            return;
        }

        container.innerHTML = this.actividades.map(act => {
            const fechaHora = act.fechaHora ? new Date(act.fechaHora).toLocaleString('es-ES', {
                dateStyle: 'short',
                timeStyle: 'short'
            }) : 'N/A';

            // Contar plazas ocupadas
            const inscritos = this.inscripciones.filter(i => i.actividad && i.actividad.idActividad === act.idActividad).length;
            const plazasMax = act.plazasMaximas || 0;
            const libres = Math.max(0, plazasMax - inscritos);
            const porcentajeOcupacion = plazasMax > 0 ? Math.min(100, Math.round((inscritos / plazasMax) * 100)) : 0;
            
            const isFull = libres === 0;
            const progressClass = isFull ? 'progress-bar-fill full' : 'progress-bar-fill';

            return `
                <div class="actividad-card">
                    <div class="actividad-card-header">
                        <h4>${act.titulo}</h4>
                    </div>
                    <div class="actividad-card-body">
                        <div class="actividad-info-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>${fechaHora}</span>
                        </div>
                        <div class="actividad-info-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>${act.lugar}</span>
                        </div>
                        
                        <div class="actividad-occupancy">
                            <div class="occupancy-text">
                                <span>Ocupación</span>
                                <span>${inscritos} / ${plazasMax} plazas</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="${progressClass}" style="width: ${porcentajeOcupacion}%"></div>
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between;">
                                <span>${libres} plazas disponibles</span>
                                <span>${porcentajeOcupacion}% lleno</span>
                            </div>
                        </div>
                    </div>
                    <div class="actividad-card-footer">
                        <button class="action-btn edit" onclick="app.openEditActividadModal(${act.idActividad})" title="Editar Actividad">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="action-btn delete" onclick="app.deleteActividad(${act.idActividad})" title="Eliminar Actividad">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    // --- SECCIÓN: INSCRIPCIONES ---
    renderInscripcionesTable() {
        const tbody = document.getElementById('inscripciones-table-body');
        if (!tbody) return;

        if (this.inscripciones.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-muted text-center py-4">No hay registros de inscripciones.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.inscripciones.map(insc => {
            const socioNombre = insc.socio ? `${insc.socio.nombre} ${insc.socio.apellidos}` : '<span class="text-danger">Socio Eliminado</span>';
            const actividadTitulo = insc.actividad ? insc.actividad.titulo : '<span class="text-danger">Actividad Eliminada</span>';
            const fecha = insc.fechaRegistro ? new Date(insc.fechaRegistro).toLocaleString('es-ES') : 'N/A';
            const checkChecked = insc.asistenciaConfirmada ? 'checked' : '';

            return `
                <tr>
                    <td><code>#${insc.idInscripcion}</code></td>
                    <td><strong>${socioNombre}</strong></td>
                    <td>${actividadTitulo}</td>
                    <td>${fecha}</td>
                    <td>
                        <label class="switch-container">
                            <input type="checkbox" ${checkChecked} onchange="app.toggleAsistencia(${insc.idInscripcion}, this.checked)">
                            <span class="slider"></span>
                        </label>
                    </td>
                    <td class="text-right">
                        <button class="action-btn delete" onclick="app.deleteInscripcion(${insc.idInscripcion})" title="Cancelar Inscripción">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    async toggleAsistencia(idInscripcion, asistenciaConfirmada) {
        try {
            const response = await fetch(`${API_BASE}/inscripciones/${idInscripcion}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asistenciaConfirmada })
            });
            if (response.ok) {
                this.loadAllData();
            } else {
                alert('No se pudo actualizar la asistencia.');
            }
        } catch (error) {
            console.error('Error al actualizar asistencia:', error);
        }
    },

    // --- GESTIÓN DE MODALES - SOCIOS ---
    openNewSocioModal() {
        document.getElementById('socio-modal-title').textContent = 'Dar de Alta Socio';
        document.getElementById('socio-form').reset();
        document.getElementById('socio-id').value = '';
        document.getElementById('emergency-contacts-container').innerHTML = '';
        document.getElementById('socio-modal').classList.add('open');
    },

    openEditSocioModal(id) {
        const socio = this.socios.find(s => s.idSocio === id);
        if (!socio) return;

        document.getElementById('socio-modal-title').textContent = 'Modificar Socio';
        document.getElementById('socio-id').value = socio.idSocio;
        document.getElementById('socio-nombre').value = socio.nombre;
        document.getElementById('socio-apellidos').value = socio.apellidos;
        document.getElementById('socio-dni').value = socio.dni;
        document.getElementById('socio-telefono').value = socio.telefono || '';
        document.getElementById('socio-fecha-nacimiento').value = socio.fechaNacimiento || '';
        document.getElementById('socio-asistencia').checked = socio.necesitaAsistencia || false;

        // Cargar contactos de emergencia
        const container = document.getElementById('emergency-contacts-container');
        container.innerHTML = '';
        if (socio.contactosEmergencia && socio.contactosEmergencia.length > 0) {
            socio.contactosEmergencia.forEach(c => {
                this.addEmergencyContactRow(c.nombreCompleto, c.telefono, c.parentesco);
            });
        }

        document.getElementById('socio-modal').classList.add('open');
    },

    closeSocioModal() {
        document.getElementById('socio-modal').classList.remove('open');
    },

    addEmergencyContactRow(nombre = '', tel = '', parentesco = '') {
        const container = document.getElementById('emergency-contacts-container');
        const row = document.createElement('div');
        row.className = 'emergency-row';
        row.innerHTML = `
            <input type="text" class="contact-name" placeholder="Nombre completo" required value="${nombre}">
            <input type="tel" class="contact-phone" placeholder="Teléfono" required value="${tel}">
            <input type="text" class="contact-relation" placeholder="Parentesco (Ej. Hijo)" required value="${parentesco}">
            <button type="button" class="action-btn delete" onclick="this.parentElement.remove()" title="Eliminar Contacto">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;
        container.appendChild(row);
    },

    async saveSocio(e) {
        e.preventDefault();
        const id = document.getElementById('socio-id').value;
        
        // Recoger contactos de emergencia del formulario
        const contactos = [];
        document.querySelectorAll('.emergency-row').forEach(row => {
            const name = row.querySelector('.contact-name').value.trim();
            const phone = row.querySelector('.contact-phone').value.trim();
            const relation = row.querySelector('.contact-relation').value.trim();
            if (name && phone && relation) {
                contactos.push({
                    nombreCompleto: name,
                    telefono: phone,
                    parentesco: relation
                });
            }
        });

        const data = {
            nombre: document.getElementById('socio-nombre').value.trim(),
            apellidos: document.getElementById('socio-apellidos').value.trim(),
            dni: document.getElementById('socio-dni').value.trim(),
            telefono: document.getElementById('socio-telefono').value.trim() || null,
            fechaNacimiento: document.getElementById('socio-fecha-nacimiento').value || null,
            necesitaAsistencia: document.getElementById('socio-asistencia').checked,
            contactosEmergencia: contactos
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/socios/${id}` : `${API_BASE}/socios`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.closeSocioModal();
                this.loadAllData();
            } else {
                alert('Ocurrió un error al guardar el socio. Por favor verifique los datos.');
            }
        } catch (error) {
            console.error('Error al guardar socio:', error);
        }
    },

    async deleteSocio(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar este socio? Se cancelarán también todas sus inscripciones.')) return;
        try {
            const response = await fetch(`${API_BASE}/socios/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.loadAllData();
            } else {
                alert('No se pudo eliminar el socio.');
            }
        } catch (error) {
            console.error('Error al eliminar socio:', error);
        }
    },

    // --- GESTIÓN DE MODALES - ACTIVIDADES ---
    openNewActividadModal() {
        document.getElementById('actividad-modal-title').textContent = 'Crear Actividad';
        document.getElementById('actividad-form').reset();
        document.getElementById('actividad-id').value = '';
        document.getElementById('actividad-modal').classList.add('open');
    },

    openEditActividadModal(id) {
        const act = this.actividades.find(a => a.idActividad === id);
        if (!act) return;

        document.getElementById('actividad-modal-title').textContent = 'Modificar Actividad';
        document.getElementById('actividad-id').value = act.idActividad;
        document.getElementById('actividad-titulo').value = act.titulo;
        document.getElementById('actividad-lugar').value = act.lugar;
        document.getElementById('actividad-plazas').value = act.plazasMaximas;
        
        // Formatear fecha para datetime-local
        if (act.fechaHora) {
            const dt = new Date(act.fechaHora);
            const offset = dt.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(dt - offset)).toISOString().slice(0, 16);
            document.getElementById('actividad-fecha-hora').value = localISOTime;
        }

        document.getElementById('actividad-modal').classList.add('open');
    },

    closeActividadModal() {
        document.getElementById('actividad-modal').classList.remove('open');
    },

    async saveActividad(e) {
        e.preventDefault();
        const id = document.getElementById('actividad-id').value;
        const data = {
            titulo: document.getElementById('actividad-titulo').value.trim(),
            fechaHora: document.getElementById('actividad-fecha-hora').value,
            plazasMaximas: parseInt(document.getElementById('actividad-plazas').value),
            lugar: document.getElementById('actividad-lugar').value.trim()
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_BASE}/actividades/${id}` : `${API_BASE}/actividades`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.closeActividadModal();
                this.loadAllData();
            } else {
                alert('No se pudo guardar la actividad.');
            }
        } catch (error) {
            console.error('Error al guardar actividad:', error);
        }
    },

    async deleteActividad(id) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta actividad? Se cancelarán también todas sus inscripciones.')) return;
        try {
            const response = await fetch(`${API_BASE}/actividades/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.loadAllData();
            } else {
                alert('No se pudo eliminar la actividad.');
            }
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
        }
    },

    // --- GESTIÓN DE MODALES - INSCRIPCIONES ---
    openNewInscripcionModal() {
        const socioSelect = document.getElementById('inscripcion-socio');
        const actividadSelect = document.getElementById('inscripcion-actividad');
        const errorBanner = document.getElementById('inscripcion-error');
        
        errorBanner.style.display = 'none';
        errorBanner.textContent = '';

        // Cargar Socios en el select
        if (this.socios.length === 0) {
            socioSelect.innerHTML = '<option value="">No hay socios registrados</option>';
        } else {
            socioSelect.innerHTML = '<option value="">-- Seleccionar Socio --</option>' + 
                this.socios.map(s => `<option value="${s.idSocio}">${s.nombre} ${s.apellidos} (${s.dni})</option>`).join('');
        }

        // Cargar Actividades en el select (filtrar las que tengan plazas libres)
        if (this.actividades.length === 0) {
            actividadSelect.innerHTML = '<option value="">No hay actividades creadas</option>';
        } else {
            actividadSelect.innerHTML = '<option value="">-- Seleccionar Actividad --</option>' + 
                this.actividades.map(act => {
                    const inscritos = this.inscripciones.filter(i => i.actividad && i.actividad.idActividad === act.idActividad).length;
                    const plazasMax = act.plazasMaximas || 0;
                    const libres = Math.max(0, plazasMax - inscritos);
                    const disabled = libres === 0 ? 'disabled style="color:var(--text-muted);"' : '';
                    const label = libres === 0 ? `${act.titulo} (COMPLETA)` : `${act.titulo} (${libres} libres)`;
                    return `<option value="${act.idActividad}" ${disabled}>${label}</option>`;
                }).join('');
        }

        document.getElementById('inscripcion-form').reset();
        document.getElementById('inscripcion-modal').classList.add('open');
    },

    closeInscripcionModal() {
        document.getElementById('inscripcion-modal').classList.remove('open');
    },

    async saveInscripcion(e) {
        e.preventDefault();
        const socioId = document.getElementById('inscripcion-socio').value;
        const actividadId = document.getElementById('inscripcion-actividad').value;
        const asistencia = document.getElementById('inscripcion-asistencia').checked;
        const errorBanner = document.getElementById('inscripcion-error');

        errorBanner.style.display = 'none';

        if (!socioId || !actividadId) {
            errorBanner.textContent = 'Debe seleccionar un socio y una actividad.';
            errorBanner.style.display = 'block';
            return;
        }

        const data = {
            socio: { idSocio: parseInt(socioId) },
            actividad: { idActividad: parseInt(actividadId) },
            asistenciaConfirmada: asistencia,
            fechaRegistro: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_BASE}/inscripciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.closeInscripcionModal();
                this.loadAllData();
            } else {
                const text = await response.text();
                errorBanner.textContent = text || 'Error al procesar la inscripción.';
                errorBanner.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al realizar inscripción:', error);
            errorBanner.textContent = 'Error de conexión con el servidor.';
            errorBanner.style.display = 'block';
        }
    },

    async deleteInscripcion(id) {
        if (!confirm('¿Estás seguro de que deseas cancelar esta inscripción?')) return;
        try {
            const response = await fetch(`${API_BASE}/inscripciones/${id}`, { method: 'DELETE' });
            if (response.ok) {
                this.loadAllData();
            } else {
                alert('No se pudo cancelar la inscripción.');
            }
        } catch (error) {
            console.error('Error al cancelar inscripción:', error);
        }
    }
};

// Arrancar la app al cargar el DOM
document.addEventListener('DOMContentLoaded', () => app.init());
