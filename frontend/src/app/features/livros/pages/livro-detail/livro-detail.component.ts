import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { Livro } from '../../models/livro.model';
import { Emprestimo } from '../../../emprestimos/models/emprestimo.model';
import { LivroService } from '../../services/livro.service';
import { EmprestimoService } from '../../../emprestimos/services/emprestimo.service';

@Component({
  selector: 'app-livro-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './livro-detail.component.html',
  styleUrls: ['./livro-detail.component.css'],
})
export class LivroDetailComponent implements OnInit {
  livro?: Livro;
  historicoEmprestimos: Emprestimo[] = [];
  loading = true;
  erroMensagem = '';

  constructor(
    private route: ActivatedRoute,
    private livroService: LivroService,
    private emprestimoService: EmprestimoService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.erroMensagem = 'Livro inválido.';
      this.loading = false;
      return;
    }

    this.carregarDados(id);
  }

  carregarDados(id: number): void {
    this.loading = true;
    this.erroMensagem = '';

    forkJoin({
      livro: this.livroService.buscarPorId(id),
      historico: this.emprestimoService.obterHistoricoPorLivro(id),
    }).subscribe({
      next: ({ livro, historico }) => {
        this.livro = livro;
        this.historicoEmprestimos = historico;
        this.loading = false;
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar histórico do livro', erro);
        this.erroMensagem =
          'Não foi possível carregar o histórico deste livro.';
        this.loading = false;
      },
    });
  }

  get totalEmprestimos(): number {
    return this.historicoEmprestimos.length;
  }

  get emprestimosAtivos(): number {
    return this.historicoEmprestimos.filter(
      (emprestimo) => !emprestimo.dataDevolucaoEfetiva,
    ).length;
  }

  get emprestimosDevolvidos(): number {
    return this.historicoEmprestimos.filter(
      (emprestimo) => !!emprestimo.dataDevolucaoEfetiva,
    ).length;
  }

  get emprestimosAtrasados(): number {
    return this.historicoEmprestimos.filter(
      (emprestimo) =>
        this.estaEmAtraso(emprestimo) || this.foiDevolvidoComAtraso(emprestimo),
    ).length;
  }

  statusTexto(emprestimo: Emprestimo): string {
    if (emprestimo.dataDevolucaoEfetiva) {
      return this.foiDevolvidoComAtraso(emprestimo)
        ? 'Devolvido com atraso'
        : 'Devolvido';
    }

    return this.estaEmAtraso(emprestimo) ? 'Ativo e atrasado' : 'Ativo';
  }

  statusClasse(emprestimo: Emprestimo): string {
    if (emprestimo.dataDevolucaoEfetiva) {
      return this.foiDevolvidoComAtraso(emprestimo)
        ? 'badge-danger'
        : 'badge-success';
    }

    return this.estaEmAtraso(emprestimo) ? 'badge-danger' : 'badge-warning';
  }

  atrasoTexto(emprestimo: Emprestimo): string | null {
    if (emprestimo.dataDevolucaoEfetiva) {
      if (!this.foiDevolvidoComAtraso(emprestimo)) {
        return null;
      }

      const dias = this.diasAtraso(emprestimo, emprestimo.dataDevolucaoEfetiva);
      return dias === 1
        ? 'Devolvido com 1 dia de atraso'
        : `Devolvido com ${dias} dias de atraso`;
    }

    if (!this.estaEmAtraso(emprestimo)) {
      return null;
    }

    const dias = this.diasAtraso(emprestimo, new Date());
    return dias === 1 ? '1 dia em atraso' : `${dias} dias em atraso`;
  }

  private estaEmAtraso(emprestimo: Emprestimo): boolean {
    return (
      !emprestimo.dataDevolucaoEfetiva &&
      this.diasAtraso(emprestimo, new Date()) > 0
    );
  }

  private foiDevolvidoComAtraso(emprestimo: Emprestimo): boolean {
    if (!emprestimo.dataDevolucaoEfetiva) {
      return false;
    }

    return this.diasAtraso(emprestimo, emprestimo.dataDevolucaoEfetiva) > 0;
  }

  private diasAtraso(
    emprestimo: Emprestimo,
    dataReferencia: Date | string,
  ): number {
    const prevista = this.converterParaDataLocal(
      emprestimo.dataDevolucaoPrevista,
    );
    const referencia =
      typeof dataReferencia === 'string'
        ? this.converterParaDataLocal(dataReferencia)
        : new Date(
            dataReferencia.getFullYear(),
            dataReferencia.getMonth(),
            dataReferencia.getDate(),
          );

    const diferencaMs = referencia.getTime() - prevista.getTime();

    return Math.max(0, Math.floor(diferencaMs / (1000 * 60 * 60 * 24)));
  }

  private converterParaDataLocal(data: string): Date {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }
}
