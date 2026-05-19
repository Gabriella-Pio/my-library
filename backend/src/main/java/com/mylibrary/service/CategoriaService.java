package com.mylibrary.service;

import com.mylibrary.dto.CategoriaRequestDTO;
import com.mylibrary.dto.CategoriaResponseDTO;
import com.mylibrary.entity.Categoria;
import com.mylibrary.exception.BusinessException;
import com.mylibrary.exception.ResourceNotFoundException;
import com.mylibrary.repository.CategoriaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaService {

  private final CategoriaRepository categoriaRepository;

  public CategoriaService(CategoriaRepository categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  @Transactional(readOnly = true)
  public List<CategoriaResponseDTO> listarCategorias() {

    List<Categoria> categorias = categoriaRepository.findAll();

    return categorias.stream()
        .map(categoria -> new CategoriaResponseDTO(
            categoria.getId(),
            categoria.getNome(),
            categoria.getDescricao(),
            (long) categoria.getLivros().size()))
        .toList();
  }

  @Transactional
  public CategoriaResponseDTO criarCategoria(CategoriaRequestDTO dto) {

    validarNomeDuplicado(dto.nome());

    Categoria categoria = new Categoria();
    categoria.setNome(dto.nome());
    categoria.setDescricao(dto.descricao());

    Categoria categoriaSalva = categoriaRepository.save(categoria);

    return new CategoriaResponseDTO(
        categoriaSalva.getId(),
        categoriaSalva.getNome(),
        categoriaSalva.getDescricao(),
        0L);
  }

  @Transactional
  public void deletarCategoria(Long id) {

    Categoria categoria = buscarCategoriaPorId(id);

    if (!categoria.getLivros().isEmpty()) {
      throw new BusinessException(
          "Não é permitido excluir categoria com livros vinculados");
    }

    categoriaRepository.delete(categoria);
  }

  private void validarNomeDuplicado(String nome) {

    if (categoriaRepository.existsByNome(nome)) {
      throw new BusinessException(
          "Já existe uma categoria cadastrada com esse nome");
    }
  }

  private Categoria buscarCategoriaPorId(Long id) {

    return categoriaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Categoria não encontrada"));
  }
}