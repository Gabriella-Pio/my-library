package com.mylibrary.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record EmprestimoRequestDTO(
    @NotNull(message = "O ID do livro é obrigatório") Long livroId,

    @NotBlank(message = "O nome da pessoa é obrigatório") @Size(max = 255, message = "O nome da pessoa não pode exceder 255 caracteres") String nomePessoa,

    @NotBlank(message = "O telefone é obrigatório") @Pattern(regexp = "^\\+?[0-9()\\-\\s]{10,20}$", message = "Telefone inválido") String telefone,

    @NotNull(message = "A data de devolução prevista é obrigatória") LocalDate dataDevolucaoPrevista) {
}
