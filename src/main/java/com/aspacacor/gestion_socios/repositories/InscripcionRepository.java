package com.aspacacor.gestion_socios.repositories;

import com.aspacacor.gestion_socios.models.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    
}
