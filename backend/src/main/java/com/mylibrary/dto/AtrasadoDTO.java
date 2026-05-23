package com.mylibrary.dto;

import java.time.LocalDate;

public record AtrasadoDTO(
    Long emprestimoId,
    Long livroId,
    String livroTitulo,
    String nomePessoa,
    String telefone,
    LocalDate dataEmprestimo,
    LocalDate dataDevolucaoPrevista,
    Integer diasAtraso) {
}