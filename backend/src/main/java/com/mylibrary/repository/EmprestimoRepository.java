package com.mylibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mylibrary.entity.Emprestimo;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
  boolean existsByLivroIdAndDataDevolucaoEfetivaIsNull(Long livroId);

  List<Emprestimo> findByNomePessoaContainingIgnoreCase(String nomePessoa);

  List<Emprestimo> findByLivroId(Long livroId);

  List<Emprestimo> findByDataDevolucaoEfetivaIsNull();
}
