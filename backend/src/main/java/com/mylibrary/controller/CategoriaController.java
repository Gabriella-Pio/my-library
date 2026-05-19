package com.mylibrary.controller;

import com.mylibrary.dto.CategoriaRequestDTO;
import com.mylibrary.dto.CategoriaResponseDTO;
import com.mylibrary.service.CategoriaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin("*")
public class CategoriaController {

  private final CategoriaService categoriaService;

  public CategoriaController(CategoriaService categoriaService) {
    this.categoriaService = categoriaService;
  }

  @GetMapping
  public ResponseEntity<List<CategoriaResponseDTO>> listarCategorias() {

    List<CategoriaResponseDTO> categorias = categoriaService.listarCategorias();

    return ResponseEntity.ok(categorias);
  }

  @PostMapping
  public ResponseEntity<CategoriaResponseDTO> criarCategoria(
      @Valid @RequestBody CategoriaRequestDTO dto) {

    CategoriaResponseDTO categoriaCriada = categoriaService.criarCategoria(dto);

    return ResponseEntity
        .status(HttpStatus.CREATED)
        .body(categoriaCriada);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletarCategoria(
      @PathVariable Long id) {

    categoriaService.deletarCategoria(id);

    return ResponseEntity.noContent().build();
  }
}