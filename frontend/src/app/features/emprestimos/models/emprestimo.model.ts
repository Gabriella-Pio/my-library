export interface Emprestimo {
  id: number;
  livroId: number;
  livroTitulo: string;
  nomePessoa: string;
  telefone: string;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoEfetiva?: string;
}
