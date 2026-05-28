package com.aspacacor.gestion_socios.controller;

import com.aspacacor.gestion_socios.models.Socio;
import com.aspacacor.gestion_socios.models.ContactoEmergencia;
import com.aspacacor.gestion_socios.repositories.SocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/socios")
public class SocioController {

    @Autowired
    private SocioRepository socioRepository;

    // PASO 4: Alta de registros (Insertar un nuevo socio)
    @PostMapping
    public ResponseEntity<Socio> darAltaSocio(@RequestBody Socio socio) {
        if (socio.getContactosEmergencia() != null) {
            for (ContactoEmergencia c : socio.getContactosEmergencia()) {
                c.setSocio(socio);
            }
        }
        Socio nuevoSocio = socioRepository.save(socio);
        return ResponseEntity.ok(nuevoSocio);
    }

    // PASO 5: Visualización de datos (Consultar todos los socios)
    @GetMapping
    public List<Socio> visualizarSocios() {
        return socioRepository.findAll();
    }

    // Consultar un socio por ID
    @GetMapping("/{id}")
    public ResponseEntity<Socio> obtenerSocio(@PathVariable("id") Long id) {
        return socioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PASO 6: Modificar un registro existente (Actualizar datos por ID)
    @PutMapping("/{id}")
    public ResponseEntity<Socio> modificarSocio(@PathVariable("id") Long id, @RequestBody Socio socioDetalles) {
        return socioRepository.findById(id)
                .map(socioExistente -> {
                    socioExistente.setDni(socioDetalles.getDni());
                    socioExistente.setNombre(socioDetalles.getNombre());
                    socioExistente.setApellidos(socioDetalles.getApellidos());
                    socioExistente.setTelefono(socioDetalles.getTelefono());
                    socioExistente.setFechaNacimiento(socioDetalles.getFechaNacimiento());
                    socioExistente.setNecesitaAsistencia(socioDetalles.getNecesitaAsistencia());

                    // Limpiar y re-agregar los contactos de emergencia para cascada correcta
                    socioExistente.getContactosEmergencia().clear();
                    if (socioDetalles.getContactosEmergencia() != null) {
                        for (ContactoEmergencia c : socioDetalles.getContactosEmergencia()) {
                            c.setSocio(socioExistente);
                            socioExistente.getContactosEmergencia().add(c);
                        }
                    }

                    Socio socioActualizado = socioRepository.save(socioExistente);
                    return ResponseEntity.ok(socioActualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PASO 6: Eliminar un registro (Borrar por ID)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSocio(@PathVariable("id") Long id) {
        if (socioRepository.existsById(id)) {
            socioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}