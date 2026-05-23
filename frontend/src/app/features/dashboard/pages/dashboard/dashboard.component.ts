import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { DashboardResumo } from '../../models/dashboard-resumo.model';
import { DashboardService } from '../../services/dashboard.service';
import { EmprestimoService } from '../../../emprestimos/services/emprestimo.service';

interface AtrasadoPreview {
  emprestimoId: number;
  livroId: number;
  livroTitulo: string;
  nomePessoa: string;
  telefone: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  diasAtraso: number;
}

interface UltimoEmprestimoPreview {
  id: number;
  livroId: number;
  livroTitulo: string;
  nomePessoa: string;
  telefone: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoEfetiva?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  resumo: DashboardResumo | null = null;
  atrasados: AtrasadoPreview[] = [];
  ultimosEmprestimos: UltimoEmprestimoPreview[] = [];
  loading = true;
  erroMensagem = '';

  constructor(
    private dashboardService: DashboardService,
    private emprestimoService: EmprestimoService,
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.erroMensagem = '';

    forkJoin({
      resumo: this.dashboardService.obterResumo(),
      atrasados: this.emprestimoService.listarAtrasados(),
      ultimosEmprestimos: this.dashboardService.obterUltimosEmprestimos(),
    }).subscribe({
      next: ({ resumo, atrasados, ultimosEmprestimos }) => {
        this.resumo = resumo;
        this.atrasados = atrasados;
        this.ultimosEmprestimos = ultimosEmprestimos;
        this.loading = false;
      },
      error: (erro: unknown) => {
        console.error(erro);
        this.erroMensagem = 'Erro ao carregar o dashboard.';
        this.loading = false;
      },
    });
  }
}
