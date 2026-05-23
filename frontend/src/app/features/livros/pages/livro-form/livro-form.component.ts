import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { LivroService } from '../../services/livro.service';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { Status } from '../../models/status.enum';
import { Categoria } from '../../../categorias/models/categoria.model';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './livro-form.component.html',
  styleUrl: './livro-form.component.css',
})
export class LivroFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  salvando = false;
  modoEdicao = false;
  livroId!: number;
  categorias: Categoria[] = [];
  carregandoCategorias = true;

  Status = Status;
  statusOptions = Object.values(Status);

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarCategorias();
    this.verificarModoEdicao();

    this.isbnMaskSubscription = this.form
      .get('isbn')
      ?.valueChanges.subscribe((val) => {
        if (typeof val === 'string') {
          const formatted = this.formatIsbn(val);
          if (formatted !== val) {
            this.form.get('isbn')?.setValue(formatted, { emitEvent: false });
          }
        }
      });
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: Categoria[]) => {
        this.categorias = dados;
        this.carregandoCategorias = false;
      },
      error: (erro: unknown) => {
        console.error('Erro ao carregar categorias', erro);
        this.snackBar.open('Erro ao carregar categorias.', 'Fechar', {
          duration: 3000,
        });
        this.carregandoCategorias = false;
      },
    });
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      titulo: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      autor: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
        ],
      ],
      isbn: ['', [Validators.required, Validators.pattern(/^[0-9\-]{10,20}$/)]],
      ano: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(9999)],
      ],
      categoriaId: ['', Validators.required],
      status: [
        { value: Status.DISPONIVEL, disabled: true },
        Validators.required,
      ],
    });
  }

  verificarModoEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.modoEdicao = true;
    this.livroId = Number(id);

    this.carregarLivro();
  }

  carregarLivro(): void {
    this.loading = true;

    this.livroService.buscarPorId(this.livroId).subscribe({
      next: (livro) => {
        this.form.patchValue({
          titulo: livro.titulo,
          autor: livro.autor,
          isbn: livro.isbn,
          ano: livro.ano,
          categoriaId: livro.categoriaId,
          status: Status.DISPONIVEL,
        });
        this.loading = false;
      },

      error: (erro: any) => {
        console.error('Erro ao carregar livro', erro);
        this.snackBar.open('Erro ao carregar livro.', 'Fechar', {
          duration: 3000,
        });
        this.loading = false;
        this.router.navigate(['/livros']);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando = true;
    const payload = {
      ...this.form.getRawValue(),
      ano: Number(this.form.get('ano')?.value),
      categoriaId: Number(this.form.get('categoriaId')?.value),
      status: Status.DISPONIVEL,
    };

    if (this.modoEdicao) {
      this.atualizarLivro(payload);
      return;
    }
    this.criarLivro(payload);
  }

  criarLivro(payload: any): void {
    this.livroService.criar(payload).subscribe({
      next: () => {
        this.snackBar.open('Livro criado com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        this.router.navigate(['/livros']);
      },

      error: (erro: any) => {
        console.error('Erro ao criar livro', erro);
        this.snackBar.open(
          erro?.error?.message || 'Erro ao criar livro.',
          'Fechar',
          {
            duration: 5000,
          },
        );
        this.salvando = false;
      },
    });
  }

  atualizarLivro(payload: any): void {
    this.livroService.atualizar(this.livroId, payload).subscribe({
      next: () => {
        this.snackBar.open('Livro atualizado com sucesso.', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/livros']);
      },

      error: (erro: any) => {
        console.error('Erro ao atualizar livro', erro);
        this.snackBar.open(
          erro?.error?.message || 'Erro ao atualizar livro.',
          'Fechar',
          {
            duration: 5000,
          },
        );
        this.salvando = false;
      },
    });
  }

  get titulo() {
    return this.form.get('titulo');
  }

  get autor() {
    return this.form.get('autor');
  }

  get isbn() {
    return this.form.get('isbn');
  }

  get ano() {
    return this.form.get('ano');
  }

  get categoriaId() {
    return this.form.get('categoriaId');
  }

  get status() {
    return this.form.get('status');
  }

  isbnMaskSubscription: any;
  isbnMaxLength = 17;

  formatIsbn(value: string): string {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 13);
    const groups: string[] = [];
    let i = 0;
    while (i < digits.length) {
      groups.push(digits.slice(i, i + 3));
      i += 3;
    }
    return groups.join('-');
  }

  tituloLength(): number {
    return (this.titulo?.value || '').length;
  }

  autorLength(): number {
    return (this.autor?.value || '').length;
  }

  isbnLength(): number {
    return (this.isbn?.value || '').length;
  }

  ngOnDestroy(): void {
    this.isbnMaskSubscription?.unsubscribe?.();
  }
}
