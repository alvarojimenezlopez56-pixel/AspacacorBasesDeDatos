package com.aspacacor.gestion_socios.controller;

import com.aspacacor.gestion_socios.models.Inscripcion;
import com.aspacacor.gestion_socios.models.Socio;
import com.aspacacor.gestion_socios.models.Actividad;
import com.aspacacor.gestion_socios.repositories.InscripcionRepository;
import com.aspacacor.gestion_socios.repositories.SocioRepository;
import com.aspacacor.gestion_socios.repositories.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private SocioRepository socioRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    @PostMapping
    public ResponseEntity<?> inscribirSocio(@RequestBody Inscripcion request) {
        if (request.getSocio() == null || request.getSocio().getIdSocio() == null ||
            request.getActividad() == null || request.getActividad().getIdActividad() == null) {
            return ResponseEntity.badRequest().body("Socio y Actividad son obligatorios.");
        }

        Socio socio = socioRepository.findById(request.getSocio().getIdSocio()).orElse(null);
        Actividad actividad = actividadRepository.findById(request.getActividad().getIdActividad()).orElse(null);

        if (socio == null) {
            return ResponseEntity.badRequest().body("El socio no existe.");
        }
        if (actividad == null) {
            return ResponseEntity.badRequest().body("La actividad no existe.");
        }

        // Comprobar plazas disponibles
        long inscritos = inscripcionRepository.findAll().stream()
                .filter(i -> i.getActividad().getIdActividad().equals(actividad.getIdActividad()))
                .count();
        
        if (actividad.getPlazasMaximas() != null && inscritos >= actividad.getPlazasMaximas()) {
            return ResponseEntity.badRequest().body("No hay plazas disponibles para esta actividad.");
        }

        // Comprobar si ya está inscrito
        boolean yaInscrito = inscripcionRepository.findAll().stream()
                .anyMatch(i -> i.getSocio().getIdSocio().equals(socio.getIdSocio()) && 
                               i.getActividad().getIdActividad().equals(actividad.getIdActividad()));
        if (yaInscrito) {
            return ResponseEntity.badRequest().body("El socio ya está inscrito en esta actividad.");
        }

        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setSocio(socio);
        inscripcion.setActividad(actividad);
        inscripcion.setAsistenciaConfirmada(request.getAsistenciaConfirmada() != null ? request.getAsistenciaConfirmada() : false);
        inscripcion.setFechaRegistro(request.getFechaRegistro() != null ? request.getFechaRegistro() : LocalDateTime.now());

        Inscripcion guardada = inscripcionRepository.save(inscripcion);
        return ResponseEntity.ok(guardada);
    }

    @GetMapping
    public List<Inscripcion> visualizarInscripciones() {
        return inscripcionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> obtenerInscripcion(@PathVariable("id") Long id) {
        return inscripcionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> modificarInscripcion(@PathVariable("id") Long id, @RequestBody Inscripcion detalles) {
        return inscripcionRepository.findById(id)
                .map(inscripcionExistente -> {
                    if (detalles.getAsistenciaConfirmada() != null) {
                        inscripcionExistente.setAsistenciaConfirmada(detalles.getAsistenciaConfirmada());
                    }
                    if (detalles.getFechaRegistro() != null) {
                        inscripcionExistente.setFechaRegistro(detalles.getFechaRegistro());
                    }
                    Inscripcion actualizada = inscripcionRepository.save(inscripcionExistente);
                    return ResponseEntity.ok(actualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInscripcion(@PathVariable("id") Long id) {
        if (inscripcionRepository.existsById(id)) {
            inscripcionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
