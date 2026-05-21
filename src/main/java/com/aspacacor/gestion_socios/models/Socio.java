package com.aspacacor.gestion_socios.models;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "socios")
@Data // Esto de Lombok autogenera los getters, setters y el constructor automáticamente
@JsonPropertyOrder({ "idSocio", "dni", "nombre", "apellidos", "telefono" })
public class Socio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSocio;

    private String dni;
    private String nombre;
    private String apellidos;
    private String telefono;
}
