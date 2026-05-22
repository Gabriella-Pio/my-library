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
    return this.emprestimo?.dataDevolucaoEfetiva ? 'Devolvido' : 'Ativo';
  }

  get statusClasse(): string {
    return this.emprestimo?.dataDevolucaoEfetiva ? 'badge-success' : 'badge-warning';
  }

  private exibirErro(mensagem: string): void {
    this.loading = false;
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
    });
    this.router.navigate(['/emprestimos']);
  }
}
