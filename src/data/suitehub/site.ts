export const SITE = {
  brand: "Suite Hub",
  tagline: "Showroom digital de sites",
  whatsappNumber: "5511999999999",
  whatsappDisplay: "(11) 99999-9999",
  whatsappDefaultMessage:
    "Olá! Vi uma demonstração na vitrine da Suite Hub e quero um site assim para minha empresa.",
  instagram: "https://instagram.com/suitehub",
  instagramLabel: "@suitehub",
  email: "contato@suitehub.com.br",
  // Monta link de CTA contextual: "Quero um site assim (Restaurante — Modelo 01)"
  waLink: (context?: string) => {
    const msg = context
      ? `Olá! Vi a demonstração "${context}" na vitrine da Suite Hub e quero uma experiência assim para minha empresa.`
      : "Olá! Vi as demonstrações na vitrine da Suite Hub e quero um site para minha empresa.";
    return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  },
};
