package com.mylibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mylibrary.entity.Categoria;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

  boolean existsByIsbn(String isbn);

  List<Livro> findByCategoria(Categoria categoria);

  List<Livro> findByStatus(Status status);

  List<Livro> findByCategoriaAndStatus(Categoria categoria, Status status);

  List<Livro> findByTituloContainingIgnoreCase(String titulo);

  List<Livro> findByAutorContainingIgnoreCase(String autor);

  List<Livro> findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(String titulo, String autor);
}