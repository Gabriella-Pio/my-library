package com.mylibrary.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LivroRequestDTO(
    @NotBlank(message = "O titulo do livro é obrigatório") @Size(max = 255, message = "O titulo deve conter no maximo 255 caracteres") String titulo,

    @NotBlank(message = "O autor do livro é obrigatorio") @Size(max = 255, message = "O autor deve conter no maximo 255 caracteres") String autor,

    @NotBlank(message = "O ISBN do livro é obrigatorio") @Pattern(regexp = "^[0-9\\-]{10,20}$", message = "O ISBN deve conter apenas numeros e hifen, com 10 a 20 caracteres") String isbn,

    @NotNull(message = "O ano do livro é obrigatorio") @Min(value = 1000, message = "O ano deve ser valido") @Max(value = 9999, message = "O ano deve ser valido") Integer ano,

    @NotNull(message = "A categoria do livro é obrigatoria") Long categoriaId
) {
}