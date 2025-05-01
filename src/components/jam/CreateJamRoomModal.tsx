
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Music, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateJamRoomModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  bpm: z.coerce.number().min(40).max(240),
  key: z.string().min(1, "Please specify a key"),
  isPublic: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJamRoomModal: React.FC<CreateJamRoomModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      bpm: 120,
      key: "C",
      isPublic: true,
    },
  });

  const createJamRoom = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user || !profile) {
        throw new Error("You must be logged in to create a jam room");
      }

      const { data, error } = await supabase
        .from("jam_rooms")
        .insert({
          title: values.title,
          bpm: values.bpm,
          key: values.key,
          is_public: values.isPublic,
          host_id: user.id,
          host_name: profile.username,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success("Jam room created!");
      form.reset();
      onOpenChange(false);
      navigate(`/jam/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating jam room:", error);
      toast.error("Failed to create jam room");
    },
  });

  const onSubmit = (values: FormValues) => {
    createJamRoom.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-soundboard-purple" />
            Create New Jam Room
          </DialogTitle>
          <DialogDescription>
            Set up your jam session and invite musicians to collaborate.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Late Night Jazz Session" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BPM</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={40}
                        max={240}
                        placeholder="120"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Cm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Public Room</FormLabel>
                    <FormDescription>
                      Allow anyone to join this jam session
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={createJamRoom.isPending}
                className="gap-2"
              >
                {createJamRoom.isPending ? "Creating..." : "Create Jam Room"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJamRoomModal;
