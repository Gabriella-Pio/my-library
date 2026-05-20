package com.mylibrary.service;

import com.mylibrary.dto.LivroRequestDTO;
import com.mylibrary.dto.LivroResponseDTO;
import com.mylibrary.entity.Categoria;
import com.mylibrary.entity.Livro;
import com.mylibrary.entity.Status;
import com.mylibrary.repository.CategoriaRepository;
import com.mylibrary.repository.LivroRepository;
import com.mylibrary.exception.BusinessException;
import com.mylibrary.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LivroService {

  private final LivroRepository livroRepository;
  private final CategoriaRepository categoriaRepository;

  public LivroService(
      LivroRepository livroRepository,
      CategoriaRepository categoriaRepository) {

    this.livroRepository = livroRepository;
    this.categoriaRepository = categoriaRepository;
  }

  @Transactional(readOnly = true)
  public List<LivroResponseDTO> listarLivros() {

    List<Livro> livros = livroRepository.findAll();

    return livros.stream()
        .map(this::converterParaDTO)
        .toList();
  }

  @Transactional(readOnly = true)
  public LivroResponseDTO buscarLivroDTO(Long id) {
    Livro livro = buscarLivroPorId(id);
    return converterParaDTO(livro);
  }

  @Transactional
  public LivroResponseDTO criarLivro(LivroRequestDTO dto) {
    validarIsbnDuplicado(dto.isbn());

    Categoria categoria = buscarCategoriaPorId(dto.categoriaId());

    Livro livro = new Livro();
    livro.setTitulo(dto.titulo());
    livro.setAutor(dto.autor());
    livro.setIsbn(dto.isbn());
    livro.setAno(dto.ano());
    livro.setCategoria(categoria);
    // livro.setStatus(dto.status() != null ? dto.status() : Status.DISPONIVEL);

    Livro livroSalvo = livroRepository.save(livro);

    return converterParaDTO(livroSalvo);
  }

  @Transactional
  public LivroResponseDTO atualizarLivro(
      Long id,
      LivroRequestDTO dto) {

    Livro livro = buscarLivroPorId(id);

    if (dto.isbn() != null &&
        !dto.isbn().equals(livro.getIsbn())) {
      validarIsbnDuplicado(dto.isbn());
    }

    Categoria categoria = buscarCategoriaPorId(dto.categoriaId());

    livro.setTitulo(dto.titulo());
    livro.setAutor(dto.autor());
    livro.setIsbn(dto.isbn());
    livro.setAno(dto.ano());
    livro.setCategoria(categoria);
    // livro.setStatus(dto.status() != null ? dto.status() : livro.getStatus());

    Livro livroAtualizado = livroRepository.save(livro);

    return converterParaDTO(livroAtualizado);
  }

  @Transactional
  public void deletarLivro(Long id) {
    Livro livro = buscarLivroPorId(id);
    if (livro.getStatus() != Status.DISPONIVEL) {
      throw new BusinessException("Livro que não esteja disponivel não pode ser excluido");
    }

    livroRepository.delete(livro);
  }

  @Transactional(readOnly = true)
  public List<LivroResponseDTO> listarLivrosPorFiltros(
      Long categoriaId,
      Status status,
      String termo) {

    if (categoriaId != null && status != null) {
      Categoria categoria = buscarCategoriaPorId(categoriaId);

      return livroRepository.findByCategoriaAndStatus(categoria, status)
          .stream()
          .map(this::converterParaDTO)
          .toList();
    }

    if (categoriaId != null) {
      Categoria categoria = buscarCategoriaPorId(categoriaId);

      return livroRepository.findByCategoria(categoria)
          .stream()
          .map(this::converterParaDTO)
          .toList();
    }

    if (status != null) {
      return livroRepository.findByStatus(status)
          .stream()
          .map(this::converterParaDTO)
          .toList();
    }

    if (termo != null && !termo.isBlank()) {
      return livroRepository
          .findByTituloContainingIgnoreCaseOrAutorContainingIgnoreCase(termo, termo)
          .stream()
          .map(this::converterParaDTO)
          .toList();
    }

    return listarLivros();
  }

  private LivroResponseDTO converterParaDTO(Livro livro) {
    return new LivroResponseDTO(
        livro.getId(),
        livro.getTitulo(),
        livro.getAutor(),
        livro.getIsbn(),
        livro.getAno(),
        livro.getStatus(),
        livro.getCategoria().getId(),
        livro.getCategoria().getNome());
  }

  private Livro buscarLivroPorId(Long id) {
    return livroRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Livro nao encontrado"));
  }

  private Categoria buscarCategoriaPorId(Long id) {
    return categoriaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Categoria nao encontrada"));
  }

  private void validarIsbnDuplicado(String isbn) {
    if (livroRepository.existsByIsbn(isbn)) {
      throw new BusinessException("Ja existe um livro cadastrado com esse ISBN");
    }
  }
}
