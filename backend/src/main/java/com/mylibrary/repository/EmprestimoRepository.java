package com.mylibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mylibrary.entity.Emprestimo;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
  boolean existsByLivroIdAndDataDevolucaoEfetivaIsNull(Long livroId);

  long countByDataDevolucaoEfetivaIsNull();

  long countByDataDevolucaoEfetivaIsNullAndDataDevolucaoPrevistaBefore(LocalDate dataReferencia);

  List<Emprestimo> findByLivroIdOrderByDataEmprestimoDesc(Long livroId);

  List<Emprestimo> findByNomePessoaContainingIgnoreCase(String nomePessoa);

  List<Emprestimo> findByLivroId(Long livroId);

  List<Emprestimo> findByDataDevolucaoEfetivaIsNull();

  List<Emprestimo> findByDataDevolucaoEfetivaIsNullAndDataDevolucaoPrevistaBeforeOrderByDataDevolucaoPrevistaAsc(
      LocalDate dataReferencia);

  List<Emprestimo> findTop5ByOrderByDataEmprestimoDesc();
}
