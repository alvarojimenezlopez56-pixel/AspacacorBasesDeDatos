package com.aspacacor.gestion_socios.repositories;

import com.aspacacor.gestion_socios.models.ContactoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Long> {
    
}
