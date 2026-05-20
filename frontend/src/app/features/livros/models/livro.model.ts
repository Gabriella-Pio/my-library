import { Status } from './status.enum';

export interface Livro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  ano: number;
  status: Status;
  categoriaId: number;
  categoriaNome: string;
}
