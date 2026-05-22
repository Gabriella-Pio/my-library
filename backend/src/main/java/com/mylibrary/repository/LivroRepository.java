package com.mylibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mylibrary.entity.Categoria;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import java.util.List;
import java.util.Optional;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

  boolean existsByIsbn(String isbn);

  Optional<Livro> findByIsbn(String isbn);

  /*
   * Filtro por categoria (dropdown)
   * Retorna todos os livros de uma categoria específica
   */
  List<Livro> findByCategoria(Categoria categoria);

  /*
   * Filtro por status (DISPONIVEL/EMPRESTADO/TODOS)
   * Retorna todos os livros com um status específico
   */
  List<Livro> findByStatus(Status status);

  /*
   * Aplicar filtros simultaneamente
   * Retorna livros filtrando por categoria E status ao mesmo tempo
   */
  List<Livro> findByCategoriaAndStatus(Categoria categoria, Status status);

  /*
   * Busca por título (texto livre)
   * Case-insensitive search
   */
  List<Livro> findByTituloContainingIgnoreCase(String titulo);

  /*
   * Busca por autor (texto livre)
   * Case-insensitive search
   */
  List<Livro> findByAutorContainingIgnoreCase(String autor);

  /*
   * Busca combinada por título ou autor
   * Permite buscar por ambos os campos simultaneamente
   */
  List<Livro> findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(String titulo, String autor);
}