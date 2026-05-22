import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LivroService } from '../../../livros/services/livro.service';
import { EmprestimoService } from '../../services/emprestimo.service';

import { Livro } from '../../../livros/models/livro.model';
import { Status } from '../../../livros/models/status.enum';

import { EmprestimoRequest } from '../../models/emprestimo-request.model';

@Component({
  selector: 'app-emprestimo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './emprestimo-form.component.html',
  styleUrls: ['./emprestimo-form.component.css'],
})
export class EmprestimoFormComponent implements OnInit {
  livrosDisponiveis: Livro[] = [];

  loading = false;
  tentouSalvar = false;

  dataEmprestimoHoje = new Date().toISOString().split('T')[0];

  formData: EmprestimoRequest = {
    livroId: 0,
    nomePessoa: '',
    telefone: '',
    dataDevolucaoPrevista: '',
  };

  constructor(
    private livroService: LivroService,
    private emprestimoService: EmprestimoService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.carregarLivrosDisponiveis();
  }

  carregarLivrosDisponiveis(): void {
    this.livroService.listar().subscribe({
      next: (livros) => {
        this.livrosDisponiveis = livros.filter(
          (livro) => livro.status === Status.DISPONIVEL,
        );
      },

      error: (erro) => {
        console.error('Erro ao carregar livros disponíveis', erro);
      },
    });
  }

  salvar(form: NgForm): void {
    this.tentouSalvar = true;

    if (!this.formularioValido()) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.emprestimoService.criar(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.tentouSalvar = false;

        this.router.navigate(['/emprestimos']);
      },

      error: (erro) => {
        console.error('Erro ao realizar empréstimo', erro);

        this.snackBar.open(
          erro?.error?.message || 'Erro ao realizar empréstimo.',
          'Fechar',
          {
            duration: 5000,
          },
        );

        this.loading = false;
      },
    });
  }

  formularioValido(): boolean {
    return !!(
      this.formData.livroId &&
      this.formData.nomePessoa.trim() &&
      this.formData.telefone.trim() &&
      this.formData.dataDevolucaoPrevista
    );
  }

  cancelar(): void {
    this.router.navigate(['/emprestimos']);
  }

  formatarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;

    let valor = input.value.replace(/\D/g, '');

    valor = valor.substring(0, 11);

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    } else {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    }

    this.formData.telefone = valor;
  }
}
