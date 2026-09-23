/**
 * Traduz erros de escrita no Firestore/Storage para mensagens em português,
 * com foco em permissão de administrador e imagens muito grandes.
 */
export function mapAdminWriteError(err: unknown, entityLabel: string): string {
  const code = (err as { code?: string })?.code || "";
  const message = err instanceof Error ? err.message : String(err);

  if (code === "permission-denied" || message.includes("permission-denied")) {
    return (
      `Sem permissão para salvar ${entityLabel} no Firestore. ` +
      `Entre com a conta administradora para continuar.`
    );
  }
  if (code === "unauthenticated" || message.includes("unauthenticated")) {
    return `Você precisa estar logado como administrador para salvar ${entityLabel}.`;
  }
  if (
    code === "resource-exhausted" ||
    code === "invalid-argument" ||
    message.includes("PAYLOAD_TOO_LARGE") ||
    message.includes("maximum allowed size")
  ) {
    return (
      `Não foi possível salvar ${entityLabel}: dados muito grandes. ` +
      `Use fotos menores (o upload vai para o Cloudinary automaticamente ao salvar).`
    );
  }
  if (code === "unavailable" || message.includes("offline")) {
    return `Sem conexão com o Firestore. Verifique sua internet e tente salvar ${entityLabel} novamente.`;
  }
  // Erros lançados localmente (validação de tamanho antes do setDoc)
  if (message.startsWith("IMAGENS_MUITO_GRANDES")) {
    return (
      `Não foi possível salvar ${entityLabel}: as imagens estão muito grandes para o banco. ` +
      `Selecione fotos menores — elas são enviadas ao Storage ao salvar.`
    );
  }
  return `Erro ao salvar ${entityLabel} no Firestore. Tente novamente.`;
}
