package com.aspacacor.gestion_socios.repositories;

import com.aspacacor.gestion_socios.models.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocioRepository extends JpaRepository<Socio, Long> {
    
}
