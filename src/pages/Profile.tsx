import { zodResolver } from "@hookform/resolvers/zod";
import { PLATFORM_NAME } from "@/config/brand";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { z } from "zod";
import { CoverUploader } from "@/components/shared/CoverUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarUploader } from "@/components/shared/AvatarUploader";
import { KycUploadForm } from "@/components/user/KycUploadForm";
import * as userService from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { isOwnerRole } from "@/lib/roles";

const personalSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
});

const publicSchema = z.object({
  bio: z.string().max(600).optional(),
  location: z.string().max(120).optional(),
});

type PersonalValues = z.infer<typeof personalSchema>;
type PublicValues = z.infer<typeof publicSchema>;

function roleLabelKey(role: string): string {
  const map: Record<string, string> = {
    RENTER: "profile.roleRenter",
    OWNER: "profile.roleOwner",
    BOTH: "profile.roleBoth",
    ADMIN: "profile.roleAdmin",
  };
  return map[role] ?? role;
}

function PersonalInfoForm({
  user,
  onUpdated,
}: {
  user: NonNullable<ReturnType<typeof useAuthStore.getState>["user"]>;
  onUpdated: (u: typeof user) => void;
}) {
  const { t } = useTranslation();
  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    values: {
      name: user.name,
      phone: user.phone ?? "",
    },
  });

  async function onSubmit(values: PersonalValues) {
    try {
      const updated = await userService.updateProfile({
        name: values.name,
        phone: values.phone || undefined,
      });
      onUpdated(updated);
      toast.success(t("profile.saveSuccess"));
    } catch {
      toast.error(t("profile.updateError"));
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <AvatarUploader
          currentUrl={user.image}
          name={user.name}
          onUpload={async (url) => {
            const updated = await userService.updateProfile({ image: url });
            onUpdated(updated);
          }}
        />
        <div className="text-center sm:text-start">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">{user.name}</h3>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t("profile.photoHint")}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.name")}</FormLabel>
                <FormControl>
                  <input className="input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.phone")}</FormLabel>
                <FormControl>
                  <input className="input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="profile-email">{t("auth.email")}</Label>
            <Input
              id="profile-email"
              value={user.email}
              disabled
              readOnly
              className="bg-stone-100 text-stone-500 dark:bg-stone-800/60"
            />
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-100/80 px-4 py-3 text-sm dark:border-stone-700 dark:bg-stone-800/40">
            <span className="text-stone-500">{t("profile.role")}: </span>
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {t(roleLabelKey(user.role))}
            </span>
          </div>
          <button type="submit" className="btn btn-primary">
            {t("profile.saveChanges")}
          </button>
        </form>
      </Form>
    </>
  );
}

export function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const publicForm = useForm<PublicValues>({
    resolver: zodResolver(publicSchema),
    values: user
      ? {
          bio: user.bio ?? "",
          location: user.location ?? "",
        }
      : undefined,
  });

  async function onPublicSubmit(values: PublicValues) {
    try {
      const updated = await userService.updateProfile({
        bio: values.bio ?? "",
        location: values.location?.trim() || undefined,
      });
      setUser(updated);
      toast.success(t("profile.publicUpdated"));
    } catch {
      toast.error(t("profile.publicUpdateError"));
    }
  }

  if (!user) {
    return null;
  }

  const isOwner = isOwnerRole(user.role);

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-3xl">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 dark:text-stone-100">
            {t("profile.accountSettings")}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {t("profile.renterSubtitle")}
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-stone-200 bg-canvas-card p-6 shadow-sm dark:border-stone-800 sm:p-8">
          <PersonalInfoForm user={user} onUpdated={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900 dark:text-stone-100">
            {t("profile.title")}
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {t("profile.ownerSubtitle", { name: PLATFORM_NAME })}
          </p>
        </div>
        <Link
          to={`/users/${user.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 rtl:flex-row-reverse"
        >
          {t("profile.viewPublicPage")}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <Tabs defaultValue="personal" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-stone-700 dark:bg-stone-800/60">
          <TabsTrigger value="personal" className="rounded-lg text-xs sm:text-sm">
            {t("profile.personal")}
          </TabsTrigger>
          <TabsTrigger value="public" className="rounded-lg text-xs sm:text-sm">
            {t("profile.publicPage")}
          </TabsTrigger>
          <TabsTrigger value="kyc" className="rounded-lg text-xs sm:text-sm">
            {t("profile.kyc")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-8">
          <PersonalInfoForm user={user} onUpdated={setUser} />
        </TabsContent>

        <TabsContent value="public" className="mt-8 space-y-8">
          <div>
            <h3 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-100">
              {t("profile.coverImage")}
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t("profile.coverHint")}</p>
            <div className="mt-4">
              <CoverUploader
                currentUrl={user.coverImage}
                name={user.name}
                onUpload={async (url) => {
                  const updated = await userService.updateProfile({ coverImage: url });
                  setUser(updated);
                }}
              />
            </div>
          </div>

          <Form {...publicForm}>
            <form onSubmit={publicForm.handleSubmit(onPublicSubmit)} className="space-y-5">
              <FormField
                control={publicForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profile.bio")}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder={t("profile.bioPlaceholder")}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-stone-400">
                      {t("profile.charactersCount", { count: field.value?.length ?? 0 })}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={publicForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profile.location")}</FormLabel>
                    <FormControl>
                      <input
                        className="input"
                        placeholder={t("profile.locationPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit" className="btn btn-primary">
                {t("profile.savePublicPage")}
              </button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="kyc" className="mt-8">
          <KycUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
