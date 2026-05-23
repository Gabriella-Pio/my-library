package com.mylibrary.service;

import com.mylibrary.dto.DashboardResumoDTO;
import com.mylibrary.dto.EmprestimoResponseDTO;
import com.mylibrary.entity.Status;
import com.mylibrary.entity.Emprestimo;
import com.mylibrary.repository.CategoriaRepository;
import com.mylibrary.repository.EmprestimoRepository;
import com.mylibrary.repository.LivroRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardService {

  private final LivroRepository livroRepository;
  private final CategoriaRepository categoriaRepository;
  private final EmprestimoRepository emprestimoRepository;

  public DashboardService(
      LivroRepository livroRepository,
      CategoriaRepository categoriaRepository,
      EmprestimoRepository emprestimoRepository) {

    this.livroRepository = livroRepository;
    this.categoriaRepository = categoriaRepository;
    this.emprestimoRepository = emprestimoRepository;
  }

  @Transactional(readOnly = true)
  public DashboardResumoDTO obterResumo() {
    long totalLivros = livroRepository.count();
    long livrosDisponiveis = livroRepository.countByStatus(Status.DISPONIVEL);
    long livrosEmprestados = livroRepository.countByStatus(Status.EMPRESTADO);
    long totalCategorias = categoriaRepository.count();
    long emprestimosAtivos = emprestimoRepository.countByDataDevolucaoEfetivaIsNull();
    long emprestimosAtrasados = emprestimoRepository
        .countByDataDevolucaoEfetivaIsNullAndDataDevolucaoPrevistaBefore(LocalDate.now());

    return new DashboardResumoDTO(
        totalLivros,
        livrosDisponiveis,
        livrosEmprestados,
        totalCategorias,
        emprestimosAtivos,
        emprestimosAtrasados);
  }

  @Transactional(readOnly = true)
  public List<EmprestimoResponseDTO> obterUltimosEmprestimos() {
    return emprestimoRepository.findTop5ByOrderByDataEmprestimoDesc()
        .stream()
        .map(this::toResponseDTO)
        .toList();
  }

  private EmprestimoResponseDTO toResponseDTO(Emprestimo emprestimo) {
    return new EmprestimoResponseDTO(
        emprestimo.getId(),
        emprestimo.getLivro().getId(),
        emprestimo.getLivro().getTitulo(),
        emprestimo.getNomePessoa(),
        emprestimo.getTelefone(),
        emprestimo.getDataEmprestimo(),
        emprestimo.getDataDevolucaoPrevista(),
        emprestimo.getDataDevolucaoEfetiva());
  }

}