import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
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

const roleLabel: Record<string, string> = {
  RENTER: "Renter",
  OWNER: "Owner",
  BOTH: "Renter & owner",
  ADMIN: "Admin",
};

export function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const personalForm = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    values: user
      ? {
          name: user.name,
          phone: user.phone ?? "",
        }
      : undefined,
  });

  const publicForm = useForm<PublicValues>({
    resolver: zodResolver(publicSchema),
    values: user
      ? {
          bio: user.bio ?? "",
          location: user.location ?? "",
        }
      : undefined,
  });

  async function onPersonalSubmit(values: PersonalValues) {
    try {
      const updated = await userService.updateProfile({
        name: values.name,
        phone: values.phone || undefined,
      });
      setUser(updated);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not update profile");
    }
  }

  async function onPublicSubmit(values: PublicValues) {
    try {
      const updated = await userService.updateProfile({
        bio: values.bio ?? "",
        location: values.location?.trim() || undefined,
      });
      setUser(updated);
      toast.success("Public page updated");
    } catch {
      toast.error("Could not update public page");
    }
  }

  if (!user) {
    return null;
  }

  const isOwner = user.role === "OWNER" || user.role === "BOTH";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-900">Profile</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your account and how others see you on RentMarket.
          </p>
        </div>
        <Link
          to={`/users/${user.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View public page
          <ExternalLink className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <Tabs defaultValue="personal" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-stone-100 p-1">
          <TabsTrigger value="personal" className="rounded-lg text-xs sm:text-sm">
            Personal
          </TabsTrigger>
          <TabsTrigger value="public" className="rounded-lg text-xs sm:text-sm" disabled={!isOwner}>
            Public page
          </TabsTrigger>
          <TabsTrigger value="kyc" className="rounded-lg text-xs sm:text-sm">
            KYC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-8 space-y-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <AvatarUploader
              currentUrl={user.image}
              name={user.name}
              onUpload={async (url) => {
                const updated = await userService.updateProfile({ image: url });
                setUser(updated);
              }}
            />
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-stone-900">{user.name}</h3>
              <p className="mt-1 text-sm text-stone-500">
                Tap the photo or camera to change your picture.
              </p>
            </div>
          </div>

          <Form {...personalForm}>
            <form
              onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
              className="space-y-5"
            >
              <FormField
                control={personalForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input className="input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={personalForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <input className="input" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  value={user.email}
                  disabled
                  readOnly
                  className="bg-stone-100 text-stone-500"
                />
              </div>
              <div className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3 text-sm">
                <span className="text-stone-500">Role: </span>
                <span className="font-medium text-stone-800">
                  {roleLabel[user.role] ?? user.role}
                </span>
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="public" className="mt-8 space-y-8">
          {!isOwner ? (
            <p className="text-sm text-stone-500">
              Become an owner to customize your public host page.
            </p>
          ) : (
            <>
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Cover image
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Wide banner shown at the top of your public profile. Recommended 1200×400px or
                  larger.
                </p>
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
                <form
                  onSubmit={publicForm.handleSubmit(onPublicSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={publicForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Tell renters about your experience, equipment, and service area…"
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-stone-400">
                          {(field.value?.length ?? 0)}/600 characters
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
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <input
                            className="input"
                            placeholder="e.g. Tunis, Sfax"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button type="submit" className="btn btn-primary">
                    Save public page
                  </button>
                </form>
              </Form>
            </>
          )}
        </TabsContent>

        <TabsContent value="kyc" className="mt-8">
          <KycUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
