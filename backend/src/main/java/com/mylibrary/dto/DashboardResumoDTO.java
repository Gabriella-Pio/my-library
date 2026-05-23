package com.mylibrary.dto;

public record DashboardResumoDTO(
    Long totalLivros,
    Long livrosDisponiveis,
    Long livrosEmprestados,
    Long totalCategorias,
    Long emprestimosAtivos,
    Long emprestimosAtrasados) {
}