package com.aspacacor.gestion_socios.controller;

import com.aspacacor.gestion_socios.models.Actividad;
import com.aspacacor.gestion_socios.repositories.ActividadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @PostMapping
    public ResponseEntity<Actividad> darAltaActividad(@RequestBody Actividad actividad) {
        Actividad nuevaActividad = actividadRepository.save(actividad);
        return ResponseEntity.ok(nuevaActividad);
    }

    @GetMapping
    public List<Actividad> visualizarActividades() {
        return actividadRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Actividad> obtenerActividad(@PathVariable("id") Long id) {
        return actividadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Actividad> modificarActividad(@PathVariable("id") Long id, @RequestBody Actividad detalles) {
        return actividadRepository.findById(id)
                .map(actividadExistente -> {
                    actividadExistente.setTitulo(detalles.getTitulo());
                    actividadExistente.setFechaHora(detalles.getFechaHora());
                    actividadExistente.setLugar(detalles.getLugar());
                    actividadExistente.setPlazasMaximas(detalles.getPlazasMaximas());
                    Actividad actualizada = actividadRepository.save(actividadExistente);
                    return ResponseEntity.ok(actualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarActividad(@PathVariable("id") Long id) {
        if (actividadRepository.existsById(id)) {
            actividadRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
