package com.mylibrary.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.mylibrary.dto.EmprestimoRequestDTO;
import com.mylibrary.dto.EmprestimoResponseDTO;
import com.mylibrary.service.EmprestimoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/emprestimos")
@Validated
public class EmprestimoController {

  private final EmprestimoService emprestimoService;

  public EmprestimoController(EmprestimoService emprestimoService) {
    this.emprestimoService = emprestimoService;
  }

  @GetMapping
  public ResponseEntity<List<EmprestimoResponseDTO>> listarEmprestimos() {

    List<EmprestimoResponseDTO> emprestimos = emprestimoService.listar();

    return ResponseEntity.ok(emprestimos);
  }

  @GetMapping("/{id}")
  public ResponseEntity<EmprestimoResponseDTO> buscarEmprestimoPorId(
      @PathVariable Long id) {

    EmprestimoResponseDTO emprestimo = emprestimoService.buscarPorId(id);

    return ResponseEntity.ok(emprestimo);
  }

  @GetMapping("/ativos")
  public ResponseEntity<List<EmprestimoResponseDTO>> listarEmprestimosAtivos() {

    List<EmprestimoResponseDTO> emprestimosAtivos = emprestimoService.listarEmprestimosAtivos();

    return ResponseEntity.ok(emprestimosAtivos);
  }

  @PostMapping
  public ResponseEntity<EmprestimoResponseDTO> realizarEmprestimo(
      @Valid @RequestBody EmprestimoRequestDTO dto) {

    EmprestimoResponseDTO emprestimoCriado = emprestimoService.realizarEmprestimo(dto);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(emprestimoCriado);
  }

  @PatchMapping("/{id}/devolucao")
  public ResponseEntity<EmprestimoResponseDTO> devolverLivro(
      @PathVariable Long id) {

    EmprestimoResponseDTO emprestimoAtualizado = emprestimoService.devolverLivro(id);

    return ResponseEntity.ok(emprestimoAtualizado);
  }
}