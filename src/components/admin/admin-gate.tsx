import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert, LogIn, Copy, Check, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCurrentUser,
  useIsAdmin,
  loginUser,
  loginWithGoogle,
  logoutUser,
} from "@/data/user-auth";
import { toast } from "sonner";

interface AdminGateProps {
  children: ReactNode;
}

/**
 * Portão do painel administrativo:
 * - deslogado -> tela de login (e-mail/senha ou Google);
 * - logado sem permissão -> tela de bloqueio com UID para liberação;
 * - admin -> libera o conteúdo.
 */
export function AdminGate({ children }: AdminGateProps) {
  const { user, isLoggedIn, isLoadingAuth } = useCurrentUser();
  const { isAdmin, isLoadingAdmin } = useIsAdmin();

  if (isLoadingAuth || (isLoggedIn && isLoadingAdmin)) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f7f8fa]">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#0066d6]" />
          Verificando acesso ao painel...
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return <AdminLoginScreen />;
  }

  if (!isAdmin) {
    return <AdminBlockedScreen email={user.email} uid={user.id} />;
  }

  return <>{children}</>;
}

function AdminLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (!password) {
      setError("Informe sua senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (!res.success) {
        setError(res.error || "Não foi possível entrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success && res.error) {
        setError(res.error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f8fa] px-4 font-sans">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="bg-[#0066d6] px-6 py-5 text-white">
          <img src="/logoprojeto.png" alt="Projeto Viva com Saúde" className="h-9 w-auto" />
          <h1 className="mt-3 text-lg font-bold">Painel do Administrador</h1>
          <p className="text-xs text-white/80">Entre com sua conta de administrador para continuar.</p>
        </div>
        <div className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold text-gray-700">
                E-mail
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="h-11 text-sm"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs font-semibold text-gray-700">
                Senha
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="h-11 text-sm"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-[#0066d6] text-sm font-bold hover:bg-[#0052ad]"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Entrando..." : "Entrar no painel"}
            </Button>
          </form>
          <Button
            type="button"
            variant="outline"
            disabled={googleLoading}
            onClick={handleGoogle}
            className="h-11 w-full text-xs font-semibold"
          >
            {googleLoading ? "Conectando..." : "Entrar com Google"}
          </Button>
          <p className="text-center text-xs text-gray-500">
            <Link to="/" className="font-semibold text-[#0066d6] hover:underline">
              ← Voltar à loja
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminBlockedScreen({ email, uid }: { email: string; uid: string }) {
  const [copied, setCopied] = useState(false);

  const copyUid = async () => {
    try {
      await navigator.clipboard.writeText(uid);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = uid;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success("UID copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f8fa] px-4 font-sans">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-600">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Acesso restrito</h1>
        <p className="mt-2 text-sm text-gray-600">
          Você entrou como <strong>{email}</strong>, mas essa conta não tem permissão de
          administradora. Por isso o Firestore recusa salvar produtos e clientes.
        </p>
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Para liberar seu acesso
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-xs text-gray-700">
            <li>
              Entre com o e-mail raiz <strong>rickyjorgecastro@gmail.com</strong>, ou peça a quem
              tem acesso a ele.
            </li>
            <li>
              No Firestore, abra a coleção <strong>admins</strong> e crie um documento com ID igual
              ao seu UID abaixo e campos{" "}
              <code className="rounded bg-gray-200 px-1">email</code> e{" "}
              <code className="rounded bg-gray-200 px-1">role: "admin"</code>.
            </li>
            <li>Recarregue esta página.</li>
          </ol>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-2">
            <code className="w-full truncate px-1 font-mono text-xs text-gray-800">{uid}</code>
            <button
              type="button"
              onClick={copyUid}
              className="flex shrink-0 items-center gap-1 rounded bg-[#0066d6] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0052ad]"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copiado!" : "Copiar UID"}
            </button>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              logoutUser();
              toast.info("Conta desconectada. Entre com a conta administradora.");
            }}
            className="gap-1.5 text-xs text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sair e trocar de conta
          </Button>
          <Link to="/" className="text-xs font-semibold text-[#0066d6] hover:underline">
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  );
}
