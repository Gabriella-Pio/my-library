package com.mylibrary.controller;

import com.mylibrary.dto.DashboardResumoDTO;
import com.mylibrary.dto.EmprestimoResponseDTO;
import com.mylibrary.service.DashboardService;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping
  public ResponseEntity<DashboardResumoDTO> obterResumo() {
    return ResponseEntity.ok(dashboardService.obterResumo());
  }

  @GetMapping("/ultimos-emprestimos")
  public ResponseEntity<List<EmprestimoResponseDTO>> obterUltimosEmprestimos() {
    return ResponseEntity.ok(dashboardService.obterUltimosEmprestimos());
  }
}