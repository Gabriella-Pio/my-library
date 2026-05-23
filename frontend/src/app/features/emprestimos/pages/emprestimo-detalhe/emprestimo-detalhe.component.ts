import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Emprestimo } from '../../models/emprestimo.model';
import { EmprestimoService } from '../../services/emprestimo.service';

@Component({
  selector: 'app-emprestimo-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatSnackBarModule],
  templateUrl: './emprestimo-detalhe.component.html',
  styleUrls: ['./emprestimo-detalhe.component.css'],
})
export class EmprestimoDetalheComponent implements OnInit {
  loading = true;
  emprestimo?: Emprestimo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emprestimoService: EmprestimoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.exibirErro('Empréstimo inválido.');
      return;
    }

    this.carregarEmprestimo(id);
  }

  carregarEmprestimo(id: number): void {
    this.loading = true;

    this.emprestimoService.buscarPorId(id).subscribe({
      next: (emprestimo) => {
        this.emprestimo = emprestimo;
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar empréstimo', erro);
        this.exibirErro('Erro ao carregar detalhes do empréstimo.');
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/emprestimos']);
  }

  get statusTexto(): string {
    if (!this.emprestimo) {
      return 'Ativo';
    }

    if (this.emprestimo.dataDevolucaoEfetiva) {
      return 'Devolvido';
    }

    return this.estaEmAtraso() ? 'Ativo' : 'Ativo';
  }

  get statusClasse(): string {
    if (!this.emprestimo) {
      return 'badge-warning';
    }

    if (this.emprestimo.dataDevolucaoEfetiva) {
      return 'badge-success';
    }

    return this.estaEmAtraso() ? 'badge-warning' : 'badge-warning';
  }

  get atrasoAtualTexto(): string | null {
    if (!this.emprestimo || this.emprestimo.dataDevolucaoEfetiva) {
      return null;
    }

    const dias = this.diasDeAtraso();

    if (dias <= 0) {
      return null;
    }

    return dias === 1
      ? '1 dia em atraso'
      : `${dias} dias em atraso`;
  }

  get atrasoNaDevolucaoTexto(): string | null {
    if (!this.emprestimo || !this.emprestimo.dataDevolucaoEfetiva) {
      return null;
    }

    const dias = this.calcularDiasEntreDatas(
      this.emprestimo.dataDevolucaoPrevista,
      this.emprestimo.dataDevolucaoEfetiva,
    );

    if (dias <= 0) {
      return null;
    }

    return dias === 1
      ? 'Devolvido com 1 dia de atraso'
      : `Devolvido com ${dias} dias de atraso`;
  }

  private estaEmAtraso(): boolean {
    return (
      !!this.emprestimo &&
      !this.emprestimo.dataDevolucaoEfetiva &&
      this.diasDeAtraso() > 0
    );
  }

  private diasDeAtraso(): number {
    if (!this.emprestimo) {
      return 0;
    }

    return this.calcularDiasEntreDatas(
      this.emprestimo.dataDevolucaoPrevista,
      new Date(),
    );
  }

  private calcularDiasEntreDatas(
    dataInicial: string,
    dataFinal: Date | string,
  ): number {
    const inicio = this.converterParaDataLocal(dataInicial);
    const fim =
      typeof dataFinal === 'string'
        ? this.converterParaDataLocal(dataFinal)
        : dataFinal;

    fim.setHours(0, 0, 0, 0);

    const diferencaMs = fim.getTime() - inicio.getTime();

    return Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
  }

  private converterParaDataLocal(data: string): Date {
    const [ano, mes, dia] = data.split('-').map(Number);

    return new Date(ano, mes - 1, dia);
  }

  private exibirErro(mensagem: string): void {
    this.loading = false;
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
    });
    this.router.navigate(['/emprestimos']);
  }
}
