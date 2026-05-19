package com.mylibrary.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(

    @NotBlank(message = "O nome da categoria é obrigatório") @Size(min = 3, max = 100, message = "O nome deve conter entre 3 e 100 caracteres") String nome,

    @Size(max = 500, message = "A descrição deve conter no máximo 500 caracteres") String descricao

) {
}