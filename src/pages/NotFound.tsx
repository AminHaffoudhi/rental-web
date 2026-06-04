import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-canvas px-4">
      <h1 className="font-display text-2xl font-semibold text-stone-900">{t("notFound.title")}</h1>
      <p className="text-center text-sm text-stone-500">{t("notFound.body")}</p>
      <Link to="/" className="btn btn-primary">
        {t("notFound.home")}
      </Link>
    </div>
  );
}
