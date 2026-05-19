import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css',
})
export class CategoriaFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  salvando = false;
  modoEdicao = false;
  categoriaId!: number;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarModoEdicao();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(60),
        ],
      ],

      descricao: ['', [Validators.maxLength(255)]],
    });
  }

  verificarModoEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.modoEdicao = true;
    this.categoriaId = Number(id);

    this.carregarCategoria();
  }

  carregarCategoria(): void {
    this.loading = true;

    this.categoriaService.buscarPorId(this.categoriaId).subscribe({
      next: (categoria) => {
        this.form.patchValue({
          nome: categoria.nome,
          descricao: categoria.descricao,
        });
        this.loading = false;
      },

      error: (erro) => {
        console.error('Erro ao carregar categoria', erro);
        this.snackBar.open('Erro ao carregar categoria.', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
        this.router.navigate(['/categorias']);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const payload = this.form.value;

    if (this.modoEdicao) {
      this.atualizarCategoria(payload);
      return;
    }
    this.criarCategoria(payload);
  }

  criarCategoria(payload: { nome: string; descricao: string }): void {
    this.categoriaService.criar(payload).subscribe({
      next: () => {
        this.snackBar.open('Categoria criada com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        this.router.navigate(['/categorias']);
      },

      error: (erro) => {
        console.error('Erro ao criar categoria', erro);
        this.snackBar.open(
          erro?.error?.message || 'Erro ao criar categoria.',
          'Fechar',
          {
            duration: 5000,
          },
        );
        this.salvando = false;
      },
    });
  }

  atualizarCategoria(payload: { nome: string; descricao: string }): void {
    this.categoriaService.atualizar(this.categoriaId, payload).subscribe({
      next: () => {
        this.snackBar.open('Categoria atualizada com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/categorias']);
      },

      error: (erro) => {
        console.error('Erro ao atualizar categoria', erro);
        this.snackBar.open(
          erro?.error?.message || 'Erro ao atualizar categoria.',
          'Fechar',
          {
            duration: 5000,
          },
        );
        this.salvando = false;
      },
    });
  }

  get nome() {
    return this.form.get('nome');
  }

  get descricao() {
    return this.form.get('descricao');
  }
}
