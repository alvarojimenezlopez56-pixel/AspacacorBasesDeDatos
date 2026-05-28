package com.aspacacor.gestion_socios.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones")
@Data
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInscripcion;

    @ManyToOne
    @JoinColumn(name = "id_socio", nullable = false)
    @JsonIgnoreProperties("inscripciones")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Socio socio;

    @ManyToOne
    @JoinColumn(name = "id_actividad", nullable = false)
    @JsonIgnoreProperties("inscripciones")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Actividad actividad;

    private Boolean asistenciaConfirmada;
    private LocalDateTime fechaRegistro;
}
