/**
 * Proteção contra a tradução automática do navegador.
 *
 * O site é 100% em português e já pede para não ser traduzido
 * (`<html lang="pt-BR" translate="no">` + `<meta name="google" content="notranslate">`).
 * Mas, se o usuário forçar a tradução pelo menu do navegador, o Google Translate
 * substitui os textos da página por elementos próprios (`<font>`), e o React
 * passa a tentar remover/inserir nós que já não estão onde ele esperava.
 * O resultado é a tela quebrar com:
 *
 *   NotFoundError: Failed to execute 'removeChild' on 'Node'
 *
 * Abaixo a gente ignora apenas essas operações impossíveis, em vez de deixar
 * a página inteira cair. Nada muda no funcionamento normal (sem tradução).
 */

let applied = false;

export function applyTranslateSafety(): void {
  if (applied) return;
  if (typeof window === "undefined" || typeof Node === "undefined") return;
  applied = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      // Nó já foi movido/removido pelo tradutor: ignora em vez de quebrar.
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      // Ponto de referência movido pelo tradutor: insere no fim do elemento.
      return originalInsertBefore.call(this, newNode, null) as T;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
