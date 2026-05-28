package com.aspacacor.gestion_socios.repositories;

import com.aspacacor.gestion_socios.models.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    
}
