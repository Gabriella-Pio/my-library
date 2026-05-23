# Changelog

Todas as mudanças notáveis neste projeto serão documentadas aqui.
Formato: https://keepachangelog.com

## [1.0.0] - 2026-05-23

### Added

- RF01: CRUD Categorias com validação de exclusão (#2)
- RF02: CRUD Livros com filtros e status (#3)
- RF03: Sistema de empréstimos (emprestar/devolver) (#4)
- RF04: Buscas e filtros (#5)
- RF05: Dashboard (#6)
- RF06: Atrasados (#7)
- Pipeline CI: build backend (Maven) e frontend (Angular)
- Status automático: DISPONIVEL ↔ EMPRESTADO

### Technical

- 3 Entidades: Categoria, Livro, Emprestimo
- Service Layer com lógica emprestar/devolver
- Branch protection configurado no main

## [0.1.0] - 2026-05-19

### Added

- Configuração inicial do repositório (monorepo)
- Estrutura /backend e /frontend
- README.md e CHANGELOG.md iniciais
- Branch develop configurado
