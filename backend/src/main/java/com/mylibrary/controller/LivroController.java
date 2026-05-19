package com.mylibrary.controller;

import com.mylibrary.dto.LivroRequestDTO;
import com.mylibrary.dto.LivroResponseDTO;
import com.mylibrary.entity.Status;
import com.mylibrary.service.LivroService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

  private final LivroService livroService;

  public LivroController(LivroService livroService) {
    this.livroService = livroService;
  }

  @GetMapping
  public ResponseEntity<List<LivroResponseDTO>> listarLivros(
      @RequestParam(required = false) Long categoriaId,
      @RequestParam(required = false) Status status,
      @RequestParam(required = false) String termo) {

    List<LivroResponseDTO> livros = livroService.listarLivrosPorFiltros(categoriaId, status, termo);

    return ResponseEntity.ok(livros);
  }

  @PostMapping
  public ResponseEntity<LivroResponseDTO> criarLivro(
      @Valid @RequestBody LivroRequestDTO dto) {

    LivroResponseDTO livroCriado = livroService.criarLivro(dto);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(livroCriado);
  }

  @GetMapping("/{id}")
  public ResponseEntity<LivroResponseDTO> buscarLivroPorId(
      @PathVariable Long id) {

    LivroResponseDTO livro = livroService.buscarLivroDTO(id);

    return ResponseEntity.ok(livro);
  }

  @PutMapping("/{id}")
  public ResponseEntity<LivroResponseDTO> atualizarLivro(
      @PathVariable Long id,
      @Valid @RequestBody LivroRequestDTO dto) {

    LivroResponseDTO livroAtualizado = livroService.atualizarLivro(id, dto);

    return ResponseEntity.ok(livroAtualizado);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletarLivro(
      @PathVariable Long id) {

    livroService.deletarLivro(id);

    return ResponseEntity.noContent().build();
  }
}