package com.aspacacor.gestion_socios.models;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "socios")
@Data // Esto de Lombok autogenera los getters, setters y el constructor automáticamente
@JsonPropertyOrder({ "idSocio", "dni", "nombre", "apellidos", "telefono", "fechaNacimiento", "necesitaAsistencia" })
public class Socio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSocio;

    private String dni;
    private String nombre;
    private String apellidos;
    private String telefono;
    private LocalDate fechaNacimiento;
    private Boolean necesitaAsistencia;

    @OneToMany(mappedBy = "socio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<ContactoEmergencia> contactosEmergencia = new ArrayList<>();

    @OneToMany(mappedBy = "socio", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("socio")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Inscripcion> inscripciones = new ArrayList<>();
}
