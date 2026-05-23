package com.mylibrary.dto;

import java.time.LocalDate;

public record EmprestimoResponseDTO(
    Long id,
    Long livroId,
    String livroTitulo,
    String nomePessoa,
    String telefone,
    LocalDate dataEmprestimo,
    LocalDate dataDevolucaoPrevista,
    LocalDate dataDevolucaoEfetiva) {
}