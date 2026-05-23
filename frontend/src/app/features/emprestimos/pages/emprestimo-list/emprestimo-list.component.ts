import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { EmprestimoService } from '../../services/emprestimo.service';
import { Emprestimo } from '../../models/emprestimo.model';

@Component({
  selector: 'app-emprestimo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './emprestimo-list.component.html',
  styleUrls: ['./emprestimo-list.component.css'],
})
export class EmprestimoListComponent implements OnInit {
  emprestimos: Emprestimo[] = [];
  emprestimosFiltrados: Emprestimo[] = [];

  termoBusca = '';

  loading = true;

  constructor(private emprestimoService: EmprestimoService) {}

  ngOnInit(): void {
    this.carregarEmprestimos();
  }

  carregarEmprestimos(): void {
    this.loading = true;

    this.emprestimoService.listar().subscribe({
      next: (emprestimos) => {
        this.emprestimos = emprestimos;
        this.emprestimosFiltrados = emprestimos;
        this.loading = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar empréstimos', erro);
        this.loading = false;
      },
    });
  }

  filtrarEmprestimos(): void {
    const termo = this.termoBusca.toLowerCase().trim();

    if (!termo) {
      this.emprestimosFiltrados = this.emprestimos;
      return;
    }

    this.emprestimosFiltrados = this.emprestimos.filter(
      (emprestimo) =>
        emprestimo.nomePessoa.toLowerCase().includes(termo) ||
        emprestimo.livroTitulo.toLowerCase().includes(termo),
    );
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.emprestimosFiltrados = this.emprestimos;
  }

  estaEmAtraso(emprestimo: Emprestimo): boolean {
    return !emprestimo.dataDevolucaoEfetiva && this.diasDeAtraso(emprestimo) > 0;
  }

  diasDeAtraso(emprestimo: Emprestimo): number {
    if (!emprestimo.dataDevolucaoPrevista) {
      return 0;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return this.calcularDiasEntreDatas(emprestimo.dataDevolucaoPrevista, hoje);
  }

  statusTexto(emprestimo: Emprestimo): string {
    if (emprestimo.dataDevolucaoEfetiva) {
      return 'Devolvido';
    }

    return this.estaEmAtraso(emprestimo) ? 'Ativo' : 'Ativo';
  }

  statusClasse(emprestimo: Emprestimo): string {
    if (emprestimo.dataDevolucaoEfetiva) {
      return 'badge-success';
    }

    return this.estaEmAtraso(emprestimo) ? 'badge-warning' : 'badge-warning';
  }

  atrasoTexto(emprestimo: Emprestimo): string | null {
    if (!this.estaEmAtraso(emprestimo)) {
      return null;
    }

    const dias = this.diasDeAtraso(emprestimo);

    return dias === 1 ? '1 dia em atraso' : `${dias} dias em atraso`;
  }

  atrasoNaDevolucaoTexto(emprestimo: Emprestimo): string | null {
    if (!emprestimo.dataDevolucaoEfetiva) {
      return null;
    }

    const dias = this.calcularDiasEntreDatas(
      emprestimo.dataDevolucaoPrevista,
      emprestimo.dataDevolucaoEfetiva,
    );

    if (dias <= 0) {
      return null;
    }

    return dias === 1 ? 'Devolvido com 1 dia de atraso' : `Devolvido com ${dias} dias de atraso`;
  }

  private calcularDiasEntreDatas(dataInicial: string, dataFinal: Date | string): number {
    const inicio = this.converterParaDataLocal(dataInicial);
    const fim = typeof dataFinal === 'string' ? this.converterParaDataLocal(dataFinal) : dataFinal;

    const diferencaMs = fim.getTime() - inicio.getTime();

    return Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
  }

  private converterParaDataLocal(data: string): Date {
    const [ano, mes, dia] = data.split('-').map(Number);

    return new Date(ano, mes - 1, dia);
  }

  devolverLivro(id: number): void {
    const confirmar = confirm('Deseja realmente devolver este livro?');

    if (!confirmar) {
      return;
    }

    this.emprestimoService.devolver(id).subscribe({
      next: () => {
        this.carregarEmprestimos();
      },

      error: (erro) => {
        console.error('Erro ao devolver livro', erro);
      },
    });
  }
}
