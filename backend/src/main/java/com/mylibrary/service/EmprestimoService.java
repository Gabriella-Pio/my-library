package com.mylibrary.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mylibrary.dto.EmprestimoRequestDTO;
import com.mylibrary.dto.EmprestimoResponseDTO;
import com.mylibrary.entity.Emprestimo;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import com.mylibrary.repository.EmprestimoRepository;
import com.mylibrary.repository.LivroRepository;

@Service
public class EmprestimoService {

  private final EmprestimoRepository emprestimoRepository;
  private final LivroRepository livroRepository;

  public EmprestimoService(
      EmprestimoRepository emprestimoRepository,
      LivroRepository livroRepository) {

    this.emprestimoRepository = emprestimoRepository;
    this.livroRepository = livroRepository;
  }

  @Transactional
  public EmprestimoResponseDTO realizarEmprestimo(EmprestimoRequestDTO dto) {

    Livro livro = livroRepository.findById(dto.livroId())
        .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

    if (livro.getStatus() != Status.DISPONIVEL) {
      throw new RuntimeException("Livro não está disponível para empréstimo");
    }

    boolean possuiEmprestimoAtivo = emprestimoRepository.existsByLivroIdAndDataDevolucaoEfetivaIsNull(
        dto.livroId());

    if (possuiEmprestimoAtivo) {
      throw new RuntimeException("Livro já possui empréstimo ativo");
    }

    if (dto.dataDevolucaoPrevista().isBefore(LocalDate.now())) {
      throw new RuntimeException(
          "A data de devolução prevista não pode ser anterior à data atual");
    }

    Emprestimo emprestimo = new Emprestimo();

    emprestimo.setLivro(livro);
    emprestimo.setNomePessoa(dto.nomePessoa());
    emprestimo.setTelefone(dto.telefone());
    emprestimo.setDataEmprestimo(LocalDate.now());
    emprestimo.setDataDevolucaoPrevista(
        dto.dataDevolucaoPrevista());

    livro.setStatus(Status.EMPRESTADO);

    livroRepository.save(livro);

    Emprestimo emprestimoSalvo = emprestimoRepository.save(emprestimo);

    return toResponseDTO(emprestimoSalvo);
  }

  @Transactional
  public EmprestimoResponseDTO devolverLivro(Long emprestimoId) {

    Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
        .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

    if (emprestimo.getDataDevolucaoEfetiva() != null) {
      throw new RuntimeException("Este empréstimo já foi finalizado");
    }

    Livro livro = emprestimo.getLivro();

    if (livro.getStatus() == Status.DISPONIVEL) {
      throw new RuntimeException("Livro já está disponível");
    }

    emprestimo.setDataDevolucaoEfetiva(LocalDate.now());

    livro.setStatus(Status.DISPONIVEL);

    livroRepository.save(livro);

    Emprestimo emprestimoAtualizado = emprestimoRepository.save(emprestimo);

    return toResponseDTO(emprestimoAtualizado);
  }

  @Transactional(readOnly = true)
  public List<EmprestimoResponseDTO> listar() {

    return emprestimoRepository.findAll()
        .stream()
        .map(this::toResponseDTO)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<EmprestimoResponseDTO> listarEmprestimosAtivos() {
    return emprestimoRepository.findByDataDevolucaoEfetivaIsNull()
        .stream()
        .map(this::toResponseDTO)
        .toList();
  }

  @Transactional(readOnly = true)
  public EmprestimoResponseDTO buscarPorId(Long id) {

    Emprestimo emprestimo = emprestimoRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

    return toResponseDTO(emprestimo);
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