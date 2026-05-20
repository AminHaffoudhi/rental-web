import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarUploader } from "@/components/shared/AvatarUploader";
import { KycUploadForm } from "@/components/user/KycUploadForm";
import * as userService from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const roleLabel: Record<string, string> = {
  RENTER: "Renter",
  OWNER: "Owner",
  BOTH: "Renter & owner",
  ADMIN: "Admin",
};

export function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: user
      ? {
          name: user.name,
          phone: user.phone ?? "",
        }
      : undefined,
  });

  async function onSubmit(values: FormValues) {
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

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-stone-900">Profile</h1>

      <Tabs defaultValue="personal" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-stone-100 p-1">
          <TabsTrigger value="personal" className="rounded-lg">
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="kyc" className="rounded-lg">
            KYC Verification
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
              <p className="mt-1 text-sm text-stone-500">Tap the photo or camera to change your picture.</p>
              <p className="mt-2 text-xs text-stone-400">JPG or PNG, square photos look best · max 5MB in uploader.</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
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
                control={form.control}
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

        <TabsContent value="kyc" className="mt-8">
          <KycUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
