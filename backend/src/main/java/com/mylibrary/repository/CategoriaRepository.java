package com.mylibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mylibrary.entity.Categoria;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

  boolean existsByNome(String nome);

  Optional<Categoria> findByNome(String nome);
}